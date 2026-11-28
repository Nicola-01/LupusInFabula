package dev.busato.lupus.controller;

import dev.busato.lupus.dto.DeleteAccountRequest;
import dev.busato.lupus.dto.FriendRequest;
import dev.busato.lupus.dto.FriendResponse;
import dev.busato.lupus.dto.PlayerSearchResponse;
import dev.busato.lupus.dto.ProfileResponse;
import dev.busato.lupus.dto.UpdateProfileRequest;
import dev.busato.lupus.security.PlayerPrincipal;
import dev.busato.lupus.security.SessionAuthenticator;
import dev.busato.lupus.service.FriendService;
import dev.busato.lupus.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Own profile, friends and search; other players' public profile. */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final FriendService friendService;
  private final SessionAuthenticator sessionAuthenticator;

  @GetMapping("/me")
  public ResponseEntity<ProfileResponse> me(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(userService.me(me.id()));
  }

  /** The session holds the username and the password hash: refresh it when either changes. */
  @PutMapping("/me")
  public ResponseEntity<ProfileResponse> update(
      @AuthenticationPrincipal PlayerPrincipal me,
      @Valid @RequestBody UpdateProfileRequest body,
      HttpServletRequest request,
      HttpServletResponse response) {
    ProfileResponse profile = userService.update(me.id(), body);
    if (body.username() != null || body.password() != null)
      sessionAuthenticator.refresh(profile.username(), request, response);
    return ResponseEntity.ok(profile);
  }

  @DeleteMapping("/me")
  public ResponseEntity<Void> delete(
      @AuthenticationPrincipal PlayerPrincipal me,
      @Valid @RequestBody DeleteAccountRequest body,
      Authentication auth,
      HttpServletRequest request,
      HttpServletResponse response) {
    userService.delete(me.id(), body.currentPassword());
    sessionAuthenticator.logout(request, response, auth);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me/friend")
  public ResponseEntity<List<FriendResponse>> friends(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(friendService.list(me.id()));
  }

  @PostMapping("/me/friend")
  public ResponseEntity<FriendResponse> addFriend(
      @AuthenticationPrincipal PlayerPrincipal me, @Valid @RequestBody FriendRequest body) {
    return ResponseEntity.status(HttpStatus.CREATED).body(friendService.add(me.id(), body.username()));
  }

  // body on DELETE kept as in the old API
  @DeleteMapping("/me/friend")
  public ResponseEntity<Void> removeFriend(
      @AuthenticationPrincipal PlayerPrincipal me, @Valid @RequestBody FriendRequest body) {
    friendService.remove(me.id(), body.username());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/search/{text}")
  public ResponseEntity<List<PlayerSearchResponse>> search(
      @AuthenticationPrincipal PlayerPrincipal me, @PathVariable String text) {
    return ResponseEntity.ok(userService.search(me.id(), text));
  }

  @GetMapping("/{username}")
  public ResponseEntity<ProfileResponse> profile(@PathVariable String username) {
    return ResponseEntity.ok(userService.profile(username));
  }
}
