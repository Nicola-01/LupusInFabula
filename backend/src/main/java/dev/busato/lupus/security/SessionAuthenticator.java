package dev.busato.lupus.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

/** Starts, refreshes and ends the session: shared by AuthController and UserController. */
@Component
@RequiredArgsConstructor
public class SessionAuthenticator {

  private final AuthenticationManager authenticationManager;
  private final SecurityContextRepository securityContextRepository;
  private final TokenBasedRememberMeServices rememberMeServices;
  private final UserDetailsService userDetailsService;
  // not injected: a plain strategy object, Lombok skips initialized final fields
  private final SessionAuthenticationStrategy sessionStrategy = new ChangeSessionIdAuthenticationStrategy();

  /** The "Storing the Authentication manually" pattern from the Spring Security docs. */
  public void login(
      String login, String password, boolean keepLogged, HttpServletRequest request, HttpServletResponse response) {
    Authentication auth =
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(login, password));
    sessionStrategy.onAuthentication(auth, request, response); // new session id: protects against session fixation
    store(auth, request, response);
    if (keepLogged) rememberMeServices.loginSuccess(request, response, auth);
  }

  /** After a username or password change: the session keeps the user logged in with the new data. */
  public void refresh(String username, HttpServletRequest request, HttpServletResponse response) {
    UserDetails principal = userDetailsService.loadUserByUsername(username);
    Authentication auth =
        UsernamePasswordAuthenticationToken.authenticated(principal, null, principal.getAuthorities());
    sessionStrategy.onAuthentication(auth, request, response);
    store(auth, request, response);
    // the old remember-me cookie is signed with the old username and password hash, so it no longer works:
    // issue a new one only if the user had chosen keepLogged
    if (WebUtils.getCookie(request, AbstractRememberMeServices.SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY) != null)
      rememberMeServices.loginSuccess(request, response, auth);
  }

  public void logout(HttpServletRequest request, HttpServletResponse response, Authentication auth) {
    rememberMeServices.logout(request, response, auth); // deletes the remember-me cookie
    new SecurityContextLogoutHandler().logout(request, response, auth); // invalidates the session
  }

  private void store(Authentication auth, HttpServletRequest request, HttpServletResponse response) {
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(auth);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(context, request, response);
  }
}
