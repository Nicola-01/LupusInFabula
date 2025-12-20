package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.ActionTarget;
import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import it.unipd.dei.webapp.lupus.utils.PossibleGameActions;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/gameWS/{room}", configurator = GetHttpSessionConfigurator.class)
public class GameWebSocket {

    private static class WebSocketLog {
        private final String sender;
        private String target;

        public WebSocketLog(String sender, String target) {
            this.sender = sender;
            this.target = target;
        }
    }

    protected static final Logger LOGGER = LogManager.getLogger(GameWebSocket.class,
            StringFormatterMessageFactory.INSTANCE);


    private static final Map<String, Set<Session>> rooms = new ConcurrentHashMap<>();
    private static final Map<Integer, List<WebSocketLog>> webSocketLogs = new ConcurrentHashMap<>();

    /**
     * Stores the game state logs to handle player reconnections and persistence during the game lifecycle.
     * <p>
     * <strong>Data Structure:</strong> {@code Map<GameID, Map<Username, List<ActionData>>>}
     * <ul>
     * <li><strong>Outer Key ({@code Integer}):</strong> The {@code gameID} uniquely identifying the active game.</li>
     * <li><strong>Inner Key ({@code String}):</strong> The {@code username} of the player who performed the action.</li>
     * <li><strong>Value ({@code List<PlaysAsIn>}):</strong> A list of game state objects representing the actions or visible data associated with that specific player in that game.</li>
     * </ul>
     * <p>
     * This structure allows efficient O(1) retrieval of a specific player's history within a specific game.
     */
    private static final Map<Integer, Map<String, List<PlaysAsIn>>> gameStateCache = new ConcurrentHashMap<>();

    private static DataSource ds;

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room) {
        session.getUserProperties().put("room", room);

        String username = session.getUserProperties().get("username").toString();

        LOGGER.info(String.format("Start WS for %s in village: %s", username, room));
        rooms.computeIfAbsent(room, k -> new CopyOnWriteArraySet<>()).add(session);

        try {
            int gameID = new GetGameIdFormPublicGameIdDAO(getConnection(), room).access().getOutputParam();
            initGameStateCache(gameID);
            for (WebSocketLog wsl : webSocketLogs.getOrDefault(gameID, Collections.emptyList()))
                sendMessage(session, wsl.sender, wsl.target, gameID);

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in retrieve game actions", e);
        } catch (IOException e) {
            LOGGER.error("Error sending message", e);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        String room = (String) session.getUserProperties().get("room");
        String username = (String) session.getUserProperties().get("username");

        broadcast(username, message, room);
    }

    @OnClose
    public void onClose(Session session) {
        String username = (String) session.getUserProperties().get("username");
        String room = (String) session.getUserProperties().get("room");

        Set<Session> roomSessions = rooms.get(room);
        if (roomSessions != null) {
            roomSessions.remove(session);
            if (roomSessions.isEmpty())
                rooms.remove(room);
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        LOGGER.error("WebSocket error for session " + session.getId(), throwable);
    }

    private void broadcast(String sender, String target, String room) {

        PossibleGameActions possibleGameActions;
        try {
            int gameID = new GetGameIdFormPublicGameIdDAO(getConnection(), room).access().getOutputParam();
            possibleGameActions = new PossibleGameActions(getDataSource(), gameID);
            possibleGameActions.populateList();
            Set<Session> roomSessions = rooms.get(room);
            if (roomSessions == null)
                return;

            List<ActionTarget> actions = possibleGameActions.getListOfActions();

            boolean found = false;
            for (ActionTarget at : actions) {
                if (at.getPlayers().contains(sender) && (at.getTargets().contains(target) || (at.getAction().equals(GameRoleAction.SHERIFF.getAction()) && sender.equals(target)))) {
                    found = true;
                    break;
                }
            }
            if (!found) return;

            String senderRole = new GetRoleByGameIdAndPlayerUsernameDAO(getConnection(), gameID, sender).access().getOutputParam();
            if (senderRole.equals(GameRoleAction.MASTER.getName())) return;

            saveMessage(sender, target, gameID);
            for (Session s : roomSessions) {
                if (!s.isOpen()) return;
                sendMessage(s, sender, target, gameID);
            }

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in retrieve game actions", e);
        } catch (IOException e) {
            LOGGER.error("Error sending message", e);
        }
    }

    private void sendMessage(Session s, String sender, String target, int gameID) throws SQLException, NamingException, IOException {
        String sessionUser = s.getUserProperties().get("username").toString();
        List<PlaysAsIn> playsAs = gameStateCache.get(gameID).get(sessionUser);
        for (PlaysAsIn p : playsAs) {
            if (p.getPlayerUsername().equals(sender) && !p.getRole().isEmpty() && !p.getRole().equals(GameRoleAction.MASTER.getName()))
                s.getBasicRemote().sendText(sender + ":" + target);
        }
    }

    private void saveMessage(String sender, String target, int gameID){
        List<WebSocketLog> logs = webSocketLogs.computeIfAbsent(gameID, k -> new CopyOnWriteArrayList<>());

        boolean updated = false;
        for (WebSocketLog wsl : logs) {
            if (wsl.sender.equals(sender)) {
                wsl.target = target;
                updated = true;
                break;
            }
        }

        if (!updated)
            logs.add(new WebSocketLog(sender, target));
    }

    private static DataSource getDataSource() throws NamingException {
        if (ds == null) {
            InitialContext cxt = new InitialContext();
            ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/lupusdb");
        }
        return ds;
    }

    private static Connection getConnection() throws SQLException, NamingException {
        return getDataSource().getConnection();
    }

    public static void freeGameWebSocket(int gameID, boolean end){
        LOGGER.info(String.format("Free webSocketLogs for %d", gameID));
        webSocketLogs.remove(gameID);
        gameStateCache.remove(gameID);
        if (!end)
            initGameStateCache(gameID);
    }

    public static void initGameStateCache(int gameID){
        if (gameStateCache.containsKey(gameID))
            return;
        try {
            Map<String, String> players = new GetPlayersAndRoleByGameIdDAO(getConnection(), gameID).access().getOutputParam();
            for (Map.Entry<String, String> entry : players.entrySet()) {
                String username = entry.getKey();
                String role = entry.getValue();

                List<PlaysAsIn> playsAs = new GetGamePlayersDAO(getDataSource(), getConnection(), gameID, role.equals(GameRoleAction.MASTER.getName()), username, role).access().getOutputParam();
                gameStateCache.computeIfAbsent(gameID, k -> new ConcurrentHashMap<>())
                        .computeIfAbsent(username, k -> new CopyOnWriteArrayList<>(playsAs));
            }
        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in recreate playersAs in WebSocket", e);
        }
    }
}
