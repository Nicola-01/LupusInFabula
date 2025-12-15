package it.unipd.dei.webapp.lupus.webSocket;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/echo")
public class TestSocket {

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Nuova connessione (Jakarta): " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("Messaggio ricevuto: " + message);
        session.getBasicRemote().sendText("Echo da Tomcat 11: " + message);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("Connessione chiusa: " + session.getId());
    }
}