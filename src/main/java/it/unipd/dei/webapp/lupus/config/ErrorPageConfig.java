package it.unipd.dei.webapp.lupus.config;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

/**
 * Unknown URLs get the React app (which renders PageNotFound) with status 404, as the old web.xml error page did.
 */
@Configuration
public class ErrorPageConfig {

    @Bean
    public ErrorPageRegistrar notFoundErrorPage() {
        return registry -> registry.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/index.html"));
    }
}
