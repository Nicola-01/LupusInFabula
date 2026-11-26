package it.unipd.dei.webapp.lupus.webSocket;

import it.unipd.dei.webapp.lupus.utils.Auth;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;

import java.util.List;
import java.util.Map;

/**
 * Reads the username from the login cookie during the handshake and hands it to the endpoint instance
 * created for that connection.
 * <p>
 * The username is not stored in {@code config.getUserProperties()}: that map is shared by all the connections
 * of the endpoint, so two simultaneous handshakes would overwrite each other.
 * The handshake and {@link #getEndpointInstance} run one after the other on the same thread (container
 * upgrade); the ThreadLocal only carries the value between the two calls. If the value is missing,
 * {@link GameWebSocket#onOpen} closes the connection.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {

    private static final ThreadLocal<String> HANDSHAKE_USERNAME = new ThreadLocal<>();

    @Override
    public void modifyHandshake(ServerEndpointConfig config, HandshakeRequest request, HandshakeResponse response) {
        String cookieHeader = null;
        for (Map.Entry<String, List<String>> header : request.getHeaders().entrySet())
            if ("Cookie".equalsIgnoreCase(header.getKey()))
                cookieHeader = String.join("; ", header.getValue());

        HANDSHAKE_USERNAME.set(Auth.usernameFromCookieHeader(cookieHeader));
    }

    @Override
    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
        String username = HANDSHAKE_USERNAME.get();
        HANDSHAKE_USERNAME.remove();
        return endpointClass.cast(new GameWebSocket(username));
    }
}
