package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.http.HttpSession;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;

public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {

    @Override
    public void modifyHandshake(ServerEndpointConfig config, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();

        if (httpSession != null) {
            Player player = (Player) httpSession.getAttribute(UserFilter.USER_ATTRIBUTE);
            config.getUserProperties().put("username", player.getUsername());
        }
    }
}
