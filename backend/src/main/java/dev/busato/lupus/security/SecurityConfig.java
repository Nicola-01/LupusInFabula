package dev.busato.lupus.security;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.servlet.HandlerExceptionResolver;

/** Session + remember-me + CSRF for the SPA. Login/signup/logout are in AuthController and LogoutFilter. */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /** Spring builds the DaoAuthenticationProvider from our UserDetailsService and PasswordEncoder. */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  /** One instance shared by the filter chain and AuthController, so both read/write the same session. */
  @Bean
  public SecurityContextRepository securityContextRepository() {
    return new HttpSessionSecurityContextRepository();
  }

  @Bean
  public TokenBasedRememberMeServices rememberMeServices(
      @Value("${app.remember-me.key}") String key, UserDetailsService userDetailsService) {
    TokenBasedRememberMeServices services = new TokenBasedRememberMeServices(
        key, userDetailsService, TokenBasedRememberMeServices.RememberMeTokenAlgorithm.SHA256);
    services.setTokenValiditySeconds((int) Duration.ofDays(30).toSeconds());
    // we call loginSuccess only when the user asked for keepLogged, so it must not look for a form parameter
    services.setAlwaysRemember(true);
    return services;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      SecurityContextRepository securityContextRepository,
      RememberMeServices rememberMeServices,
      @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) throws Exception {
    return http
        // XSRF-TOKEN cookie readable by JS, the frontend sends it back in the X-XSRF-TOKEN header
        .csrf(csrf -> csrf.spa())
        .securityContext(c -> c.securityContextRepository(securityContextRepository))
        // no redirect after login in a JSON API: without this every anonymous 401 would create a session
        .requestCache(c -> c.disable())
        .rememberMe(r -> r.rememberMeServices(rememberMeServices))
        // after the session and the remember-me have rebuilt the login, so the user is known
        .addFilterAfter(new LogContextFilter(), RememberMeAuthenticationFilter.class)
        .logout(l -> l
            .logoutUrl("/logout")
            .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT))
            .deleteCookies("JSESSIONID"))
        // errors of the filters go to GlobalExceptionHandler too, so every error is a ProblemDetail built in one place
        .exceptionHandling(e -> e
            .authenticationEntryPoint((req, res, ex) -> resolver.resolveException(req, res, null, ex))
            .accessDeniedHandler((req, res, ex) -> resolver.resolveException(req, res, null, ex)))
        // same protected URLs as the old UserFilter; pages and static files stay public
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/user/**", "/game/**", "/api/session", "/api/village/**")
            .authenticated()
            .anyRequest().permitAll())
        .build();
  }
}
