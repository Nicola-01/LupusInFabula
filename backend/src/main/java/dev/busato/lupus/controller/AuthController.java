package dev.busato.lupus.controller;

import dev.busato.lupus.dto.LoginRequest;
import dev.busato.lupus.dto.SessionResponse;
import dev.busato.lupus.dto.SignupRequest;
import dev.busato.lupus.security.PlayerPrincipal;
import dev.busato.lupus.security.SessionAuthenticator;
import dev.busato.lupus.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Signup, login and the session. Logout is handled by Spring Security's LogoutFilter (POST /logout). */
@RestController
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final SessionAuthenticator sessionAuthenticator;

  @PostMapping("/signup")
  public ResponseEntity<Void> signup(
      @Valid @RequestBody SignupRequest body, HttpServletRequest request, HttpServletResponse response) {
    authService.signup(body);
    sessionAuthenticator.login(body.username(), body.password(), false, request, response);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping("/login")
  public ResponseEntity<Void> login(
      @Valid @RequestBody LoginRequest body, HttpServletRequest request, HttpServletResponse response) {
    sessionAuthenticator.login(body.user(), body.password(), body.keepLogged(), request, response);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/api/session")
  public ResponseEntity<SessionResponse> session(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(authService.session(me.id()));
  }
}
