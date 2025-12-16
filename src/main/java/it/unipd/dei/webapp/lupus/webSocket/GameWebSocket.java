package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/gameWS/{room}/{username}")
public class GameWebSocket {

    protected static final Logger LOGGER = LogManager.getLogger(GameWebSocket.class,
            StringFormatterMessageFactory.INSTANCE);

    private static final Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room, @PathParam("username") String username) {
        session.getUserProperties().put("room", room);
        session.getUserProperties().put("username", username);

        LOGGER.info(String.format("Start WS for %s in village: %s", username, room));
        sessions.add(session);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        String room = (String) session.getUserProperties().get("room");
        String username = (String) session.getUserProperties().get("username");

        broadcast(username, message, room);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);

        String username = (String) session.getUserProperties().get("username");
        String room = (String) session.getUserProperties().get("room");
    }

    private void broadcast(String sender, String message, String targetRoom) {
        for (Session s : sessions) {
            String userRoom = (String) s.getUserProperties().get("room");

            if (targetRoom.equals(userRoom)) {
                try {
                    if (s.isOpen()) {
                        s.getBasicRemote().sendText(sender + ":" + message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
