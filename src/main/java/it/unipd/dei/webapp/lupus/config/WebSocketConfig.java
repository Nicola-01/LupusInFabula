package it.unipd.dei.webapp.lupus.config;

import it.unipd.dei.webapp.lupus.webSocket.GameWebSocket;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import javax.sql.DataSource;

/**
 * Registers only {@link GameWebSocket} and hands it the Spring {@link DataSource}.
 */
@Configuration
public class WebSocketConfig {

    @Bean
    public ServerEndpointExporter serverEndpointExporter(DataSource ds) {
        GameWebSocket.setDataSource(ds);
        ServerEndpointExporter exporter = new ServerEndpointExporter();
        exporter.setAnnotatedEndpointClasses(GameWebSocket.class);
        return exporter;
    }
}
