package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGamePlayersDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/gameWS/{room}", configurator = GetHttpSessionConfigurator.class)
public class GameWebSocket {

    protected static final Logger LOGGER = LogManager.getLogger(GameWebSocket.class,
            StringFormatterMessageFactory.INSTANCE);

    private static final Map<String, Set<Session>> rooms = new ConcurrentHashMap<>();

    private static DataSource ds;

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room) {
        //TODO: Manca un controllo della sesssione, mi posso impersonare da altro user
        session.getUserProperties().put("room", room);

        String username = session.getUserProperties().get("username").toString();

        LOGGER.info(String.format("Start WS for %s in village: %s", username, room));
        rooms.computeIfAbsent(room, k -> new CopyOnWriteArraySet<>()).add(session);
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
            for (ActionTarget at : actions){
                if (at.getPlayers().contains(sender) && at.getTargets().contains(target)) {
                    found = true;
                    break;
                }
            }
            if (!found) return;

            String senderRole = new GetRoleByGameIdAndPlayerUsernameDAO(getConnection(), gameID, sender).access().getOutputParam();
            if(senderRole.equals(GameRoleAction.MASTER.getName())) return;

            for (Session s : roomSessions) {
                if (!s.isOpen())
                    return;

                String sessionUser = s.getUserProperties().get("username").toString();
                String role = new GetRoleByGameIdAndPlayerUsernameDAO(getConnection(), gameID, sessionUser).access().getOutputParam();
                List<PlaysAsIn> playsAs = new GetGamePlayersDAO(getDataSource(), getConnection(), gameID, role.equals(GameRoleAction.MASTER.getName()), sessionUser, role).access().getOutputParam();

                for (PlaysAsIn p : playsAs){
                    if (p.getPlayerUsername().equals(sender) && !p.getRole().isEmpty())
                        s.getBasicRemote().sendText(sender + ":" + target);
                }
            }

        } catch (SQLException | NamingException e) {
            LOGGER.warn("Error in retrieve game actions", e);
        } catch (IOException e) {
            LOGGER.error("Error sending message", e);
        }

    }

    private DataSource getDataSource() throws NamingException {
        if (ds == null) {
            InitialContext cxt = new InitialContext();
            ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/lupusdb");
        }
        return ds;
    }

    private Connection getConnection() throws SQLException, NamingException {
        return getDataSource().getConnection();
    }
}
