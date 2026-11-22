package it.unipd.dei.webapp.lupus.config;

import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import it.unipd.dei.webapp.lupus.filter.PagesFilter;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Registers the servlet filters with the same URL patterns and order as the former {@code WEB-INF/web.xml}.
 */
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<UserFilter> userFilter(DataSource ds) {
        FilterRegistrationBean<UserFilter> reg = new FilterRegistrationBean<>(new UserFilter(ds));
        reg.addUrlPatterns("/logout", "/game/*", "/user/*", "/api/session", "/api/village/*", "/api/habitant/*");
        reg.setOrder(1);
        return reg;
    }

    @Bean
    public FilterRegistrationBean<GameMasterFilter> gameMasterFilter(DataSource ds) {
        FilterRegistrationBean<GameMasterFilter> reg = new FilterRegistrationBean<>(new GameMasterFilter(ds));
        reg.addUrlPatterns("/game/*");
        reg.setOrder(2);
        return reg;
    }

    @Bean
    public FilterRegistrationBean<PagesFilter> pagesFilter(DataSource ds) {
        FilterRegistrationBean<PagesFilter> reg = new FilterRegistrationBean<>(new PagesFilter(ds));
        reg.addUrlPatterns("/home", "/habitant/*", "/newVillage", "/village/*");
        reg.setOrder(3);
        return reg;
    }
}
