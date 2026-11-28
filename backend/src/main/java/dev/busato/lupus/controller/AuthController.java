package dev.busato.lupus.controller;

import dev.busato.lupus.dto.LoginRequest;
import dev.busato.lupus.dto.SessionResponse;
import dev.busato.lupus.dto.SignupRequest;
import dev.busato.lupus.security.PlayerPrincipal;
import dev.busato.lupus.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Signup, login and the session. Logout is handled by Spring Security's LogoutFilter (POST /logout). */
@RestController
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final AuthenticationManager authenticationManager;
  private final SecurityContextRepository securityContextRepository;
  private final RememberMeServices rememberMeServices;
  // not injected: a plain strategy object, Lombok skips initialized final fields
  private final SessionAuthenticationStrategy sessionStrategy = new ChangeSessionIdAuthenticationStrategy();

  @PostMapping("/signup")
  public ResponseEntity<Void> signup(
      @Valid @RequestBody SignupRequest body, HttpServletRequest request, HttpServletResponse response) {
    authService.signup(body);
    startSession(body.username(), body.password(), false, request, response);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping("/login")
  public ResponseEntity<Void> login(
      @Valid @RequestBody LoginRequest body, HttpServletRequest request, HttpServletResponse response) {
    startSession(body.user(), body.password(), body.keepLogged(), request, response);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/api/session")
  public ResponseEntity<SessionResponse> session(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(authService.session(me.id()));
  }

  /** The "Storing the Authentication manually" pattern from the Spring Security docs. */
  private void startSession(
      String login, String password, boolean keepLogged, HttpServletRequest request, HttpServletResponse response) {
    Authentication auth =
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(login, password));
    sessionStrategy.onAuthentication(auth, request, response); // new session id: protects against session fixation
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(auth);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(context, request, response);
    if (keepLogged) rememberMeServices.loginSuccess(request, response, auth);
  }
}
