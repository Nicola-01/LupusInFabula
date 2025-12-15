package it.unipd.dei.webapp.lupus.webSocket;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

// L'URL sarà tipo: ws://localhost:8080/lupus/chat/generale/nicola
@ServerEndpoint("/chat/{room}/{username}")
public class ChatServer {

    // Usiamo un Set thread-safe per memorizzare tutte le sessioni attive
    private static final Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("room") String room, @PathParam("username") String username) {
        // Salviamo le info dentro la sessione stessa per recuperarle dopo
        session.getUserProperties().put("room", room);
        session.getUserProperties().put("username", username);

        sessions.add(session);

        // Notifica tutti che qualcuno è entrato
        broadcast("Sistema", ">>> " + username + " è entrato nella stanza " + room, room);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // Recuperiamo i dati dell'utente che sta scrivendo
        String username = (String) session.getUserProperties().get("username");
        String room = (String) session.getUserProperties().get("room");

        // Inviamo il messaggio formattato
        broadcast(username, message, room);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);

        String username = (String) session.getUserProperties().get("username");
        String room = (String) session.getUserProperties().get("room");

        broadcast("Sistema", "<<< " + username + " ha lasciato la stanza.", room);
    }

    // Metodo per inviare il messaggio a tutti gli utenti DELLA STESSA STANZA
    private void broadcast(String sender, String message, String targetRoom) {
        for (Session s : sessions) {
            // Controlliamo se l'utente è nella stessa stanza
            String userRoom = (String) s.getUserProperties().get("room");

            if (targetRoom.equals(userRoom)) {
                try {
                    // Inviamo il messaggio semplice (es: "Nicola: Ciao!")
                    // In un'app reale invieresti un JSON
                    if (s.isOpen()) {
                        s.getBasicRemote().sendText(sender + ": " + message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}