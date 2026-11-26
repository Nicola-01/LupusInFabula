package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.ActionTarget;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import it.unipd.dei.webapp.lupus.utils.PossibleGameActions;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
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
    private static final Map<String, UUID> gameIdMap = new ConcurrentHashMap<>();
    private static final Map<UUID, String> gamePhaseMap = new ConcurrentHashMap<>();


    private static final Map<UUID, List<WebSocketLog>> webSocketLogs = new ConcurrentHashMap<>();

    /**
     * Stores the game state logs to handle player reconnections and persistence during the game lifecycle.
     * <p>
     * <strong>Data Structure:</strong> {@code Map<GameID, Map<Username, List<ActionData>>>}
     * <ul>
     * <li><strong>Outer Key ({@code UUID}):</strong> The {@code gameID} uniquely identifying the active game.</li>
     * <li><strong>Inner Key ({@code String}):</strong> The {@code username} of the player who performed the action.</li>
     * <li><strong>Value ({@code List<PlaysAsIn>}):</strong> A list of game state objects representing the actions or visible data associated with that specific player in that game.</li>
     * </ul>
     * <p>
     * This structure allows efficient O(1) retrieval of a specific player's history within a specific game.
     */
    private static final Map<UUID, Map<String, List<PlaysAsIn>>> gameStateCache = new ConcurrentHashMap<>();
    private static final Map<UUID, List<ActionTarget>> gameActionCache = new ConcurrentHashMap<>();

    /**
     * Last {@code #votes:} snapshot sent by the master during the day, per gameID.
     */
    private static final Map<UUID, String> votesSnapshotMap = new ConcurrentHashMap<>();

    /** Sent to every session of a game when its state changed; the clients reload their data. */
    public static final String UPDATE_MESSAGE = "#update";
    private static final String VOTES_PREFIX = "#votes:";
    private static final int MAX_VOTES_MESSAGE_BYTES = 10 * 1024;

    private static DataSource ds;

    /** Username of the login cookie, given by {@link GetHttpSessionConfigurator} for this connection; null if missing. */
    private final String username;

    public GameWebSocket(String username) {
        this.username = username;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room) {
        if (username == null) {
            LOGGER.warn(String.format("WebSocket for village %s without a valid login cookie, closed", room));
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Not logged in"));
            } catch (IOException e) {
                LOGGER.warn("Error closing the WebSocket without login", e);
            }
            return;
        }

        session.getUserProperties().put("room", room);
        session.getUserProperties().put("username", username);

        LOGGER.info(String.format("Start WS for %s in village: %s", username, room));
        rooms.computeIfAbsent(room, k -> new CopyOnWriteArraySet<>()).add(session);

        try {
            UUID gameID = gameIdMap.getOrDefault(room, new GetGameIdFormPublicGameIdDAO(getConnection(), room).access().getOutputParam());
            if (gameID == null) { // unknown village
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Unknown village"));
                return;
            }
            gameIdMap.putIfAbsent(room, gameID);
            // stored on the session: gameIdMap loses the room when the game ends, notifyUpdate still needs it
            session.getUserProperties().put("gameID", gameID);
            ensureCaches(gameID);

            boolean isDay = gamePhaseMap.get(gameID).equals(GamePhase.DAY.getName());

            for (WebSocketLog wsl : webSocketLogs.getOrDefault(gameID, Collections.emptyList()))
                sendMessage(session, wsl.sender, wsl.target, gameID, isDay);

            String votes = votesSnapshotMap.get(gameID);
            if (votes != null)
                sendText(session, votes);

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in retrieve game actions", e);
        } catch (IOException e) {
            LOGGER.error("Error sending message", e);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        if (message.startsWith(VOTES_PREFIX)) {
            handleVotes(message, session);
            return;
        }

        String room = (String) session.getUserProperties().get("room");
        String username = (String) session.getUserProperties().get("username");

        broadcast(username, message, room);
    }

    /**
     * Stores the master's current vote form during the day and forwards it, as is, to the whole room.
     * Messages from other users, outside the day or bigger than 10 kB are ignored.
     */
    private void handleVotes(String message, Session session) {
        String room = (String) session.getUserProperties().get("room");
        String username = (String) session.getUserProperties().get("username");
        UUID gameID = (UUID) session.getUserProperties().get("gameID");

        if (gameID == null || message.getBytes(StandardCharsets.UTF_8).length > MAX_VOTES_MESSAGE_BYTES) {
            LOGGER.warn(String.format("Ignored votes message from %s", username));
            return;
        }

        ensureCaches(gameID);
        if (!isMaster(gameID, username) || !GamePhase.DAY.getName().equals(gamePhaseMap.get(gameID)))
            return;

        votesSnapshotMap.put(gameID, message);
        Set<Session> roomSessions = rooms.get(room);
        if (roomSessions == null)
            return;
        for (Session s : roomSessions) {
            if (!s.isOpen()) continue;
            try {
                sendText(s, message);
            } catch (IOException | IllegalStateException e) {
                LOGGER.error("Error sending votes", e);
            }
        }
    }

    /**
     * Tells every open session of the game {@code gameID} that its state changed ({@link #UPDATE_MESSAGE}).
     * Called by the REST handlers after their DB writes. Works also after the game ended, because it
     * matches the gameID stored on each session. A failing session is logged and does not stop the others.
     *
     * @param gameID the internal ID of the game
     */
    public static void notifyUpdate(UUID gameID) {
        for (Set<Session> roomSessions : rooms.values()) {
            for (Session s : roomSessions) {
                if (!s.isOpen() || !gameID.equals(s.getUserProperties().get("gameID")))
                    continue;
                try {
                    sendText(s, UPDATE_MESSAGE);
                } catch (IOException | IllegalStateException e) {
                    LOGGER.error("Error sending update", e);
                }
            }
        }
    }

    /**
     * Sends a text frame; synchronized on the session because the Tomcat remote endpoint
     * does not allow two concurrent text messages (REST threads and the WebSocket thread both send).
     */
    private static void sendText(Session s, String text) throws IOException {
        synchronized (s) {
            s.getBasicRemote().sendText(text);
        }
    }

    /**
     * Whether {@code username} is the master of the game, checked on the cached player roles.
     */
    private static boolean isMaster(UUID gameID, String username) {
        Map<String, List<PlaysAsIn>> players = gameStateCache.get(gameID);
        List<PlaysAsIn> gsc = players == null ? null : players.get(username);
        if (gsc == null)
            return false;
        for (PlaysAsIn psi : gsc) {
            if (psi.getPlayerUsername().equals(username))
                return GameRoleAction.MASTER.getName().equals(psi.getRole());
        }
        return false;
    }

    @OnClose
    public void onClose(Session session) {
        String room = (String) session.getUserProperties().get("room");
        if (room == null) // closed in onOpen before the room was stored
            return;

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
        try {
            UUID gameID = gameIdMap.get(room);
            Set<Session> roomSessions = rooms.get(room);
            if (roomSessions == null)
                return;

            ensureCaches(gameID);
            List<ActionTarget> actions = gameActionCache.get(gameID);

            boolean found = false;
            for (ActionTarget at : actions) {
                if ((at.getPlayer() != null && at.getPlayer().equals(sender))
                        || (at.getPlayers() != null && at.getPlayers().contains(sender) && (at.getTargets().contains(target))
                        || ((at.getAction().equals(GameRoleAction.SHERIFF.getAction()) && sender.equals(target)
                )))) {
                    found = true;
                    break;
                }
            }
            if (!found) return;
            List<PlaysAsIn> gsc = gameStateCache.get(gameID).get(sender);
            String senderRole = null;

            for (PlaysAsIn psi : gsc) {
                if (psi.getPlayerUsername().equals(sender)) {
                    senderRole = psi.getRole();
                    break;
                }
            }

            assert senderRole != null;
            if (senderRole.equals(GameRoleAction.MASTER.getName())) return;

            saveMessage(sender, target, gameID);
            boolean isDay = gamePhaseMap.get(gameID).equals(GamePhase.DAY.getName());
            for (Session s : roomSessions) {
                if (!s.isOpen()) return;
                sendMessage(s, sender, target, gameID, isDay);
            }

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in retrieve game actions", e);
        } catch (IOException e) {
            LOGGER.error("Error sending message", e);
        }
    }

    private void sendMessage(Session s, String sender, String target, UUID gameID, boolean isDay) throws SQLException, NamingException, IOException {
        String sessionUser = s.getUserProperties().get("username").toString();
        List<PlaysAsIn> playsAs = gameStateCache.get(gameID).get(sessionUser);
        for (PlaysAsIn p : playsAs) {
            if ((isDay && !sender.equals(target)) || (!isDay && p.getPlayerUsername().equals(sender) && !p.getRole().isEmpty() && !p.getRole().equals(GameRoleAction.MASTER.getName())))
                sendText(s, sender + ":" + target);
        }
    }

    private void saveMessage(String sender, String target, UUID gameID) {
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

    /**
     * Set once at startup by {@code WebSocketConfig} with the Spring DataSource.
     */
    public static void setDataSource(DataSource dataSource) {
        ds = dataSource;
    }

    private static DataSource getDataSource() throws NamingException {
        return ds;
    }

    private static Connection getConnection() throws SQLException, NamingException {
        return getDataSource().getConnection();
    }

    public static void freeGameWebSocket(UUID gameID, boolean end) {
        LOGGER.info(String.format("Free webSocketLogs for %s", gameID));
        webSocketLogs.remove(gameID);
        votesSnapshotMap.remove(gameID);
        gameStateCache.remove(gameID);
        gameActionCache.remove(gameID);
        gamePhaseMap.remove(gameID);
        // The caches are rebuilt lazily (ensureCaches): this runs before the UPDATE of the game is executed,
        // so rebuilding them here would read the old phase.
        if (end)
            gameIdMap.entrySet().removeIf(entry -> gameID.equals(entry.getValue()));
    }

    /**
     * Rebuilds the caches of a game dropped by {@link #freeGameWebSocket}. Each init is a no-op when the cache is present.
     */
    private static void ensureCaches(UUID gameID) {
        initGamePhaseCache(gameID);
        initGameStateCache(gameID);
        initGameActionCache(gameID);
    }

    public static void initGamePhaseCache(UUID gameID) {
        if (gamePhaseMap.containsKey(gameID))
            return;
        try {
            Game game = new GetGameByGameIdDAO(getConnection(), gameID).access().getOutputParam();
            if (game.getPhase() == GamePhase.NIGHT.getId())
                gamePhaseMap.put(gameID, GamePhase.NIGHT.getName());
            else
                gamePhaseMap.put(gameID, GamePhase.DAY.getName());
        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in getting game phase in WebSocket", e);
        }

    }

    public static void initGameStateCache(UUID gameID) {
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

    public static void initGameActionCache(UUID gameID) {
        if (gameActionCache.containsKey(gameID))
            return;
        try {
            PossibleGameActions possibleGameActions = new PossibleGameActions(getDataSource(), gameID);
            possibleGameActions.populateList();
            gameActionCache.put(gameID, possibleGameActions.getListOfActions());

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in recreate action list in WebSocket", e);
        }
    }
}
