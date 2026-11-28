package dev.busato.lupus.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.stereotype.Component;

/** Logs login, failed login and logout from the events Spring Security publishes: no log call in the controller. */
@Slf4j
@Component
public class AuthEventsLogger {

  @EventListener
  public void onSuccess(AuthenticationSuccessEvent event) {
    if (event.getAuthentication() instanceof RememberMeAuthenticationToken)
      log.info("Login ok via remember-me: {}", event.getAuthentication().getName());
    else
      log.info("Login ok: {}", event.getAuthentication().getName());
  }

  @EventListener
  public void onFailure(AbstractAuthenticationFailureEvent event) {
    log.warn("Login failed: {} ({})", event.getAuthentication().getName(), event.getException().getClass().getSimpleName());
  }

  @EventListener
  public void onLogout(LogoutSuccessEvent event) {
    log.info("Logout: {}", event.getAuthentication().getName());
  }
}
