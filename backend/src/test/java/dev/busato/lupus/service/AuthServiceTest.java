package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.busato.lupus.dto.SessionResponse;
import dev.busato.lupus.dto.SignupRequest;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.mappers.PlayerMapper;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.GameRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock private PlayerRepository playerRepository;
  @Mock private GameRepository gameRepository;
  @Spy private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  @Spy private PlayerMapper playerMapper;
  @InjectMocks private AuthService authService;

  private static final SignupRequest REQUEST =
      new SignupRequest("wolf-user", "wolf@test.it", "Passw0rd!");

  @Test
  void signup_savesABcryptHashNotThePassword() {
    authService.signup(REQUEST);

    ArgumentCaptor<Player> saved = ArgumentCaptor.forClass(Player.class);
    verify(playerRepository).save(saved.capture());
    assertEquals("wolf-user", saved.getValue().getUsername());
    assertEquals("wolf@test.it", saved.getValue().getEmail());
    assertTrue(passwordEncoder.matches("Passw0rd!", saved.getValue().getPasswordHash()));
  }

  @Test
  void signup_withUsedUsername_isConflictOnUsername() {
    when(playerRepository.existsByUsernameIgnoreCase("wolf-user")).thenReturn(true);

    AlreadyUsedException ex =
        assertThrows(AlreadyUsedException.class, () -> authService.signup(REQUEST));
    assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    assertEquals("username", ex.getBody().getProperties().get("field"));
    verify(playerRepository, org.mockito.Mockito.never()).save(any());
  }

  @Test
  void signup_withUsedEmail_isConflictOnEmail() {
    when(playerRepository.existsByEmail("wolf@test.it")).thenReturn(true);

    AlreadyUsedException ex =
        assertThrows(AlreadyUsedException.class, () -> authService.signup(REQUEST));
    assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    assertEquals("email", ex.getBody().getProperties().get("field"));
  }

  @Test
  void signup_checksEmailInLowerCase() {
    authService.signup(new SignupRequest("mario-user", "Mario@Example.COM", "Passw0rd!"));

    verify(playerRepository).existsByEmail("mario@example.com");
  }

  @Test
  void session_ofDeletedPlayer_isUnauthenticated() {
    UUID id = UUID.randomUUID();
    when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

    assertThrows(InsufficientAuthenticationException.class, () -> authService.session(id));
  }

  @Test
  void session_returnsGamemasterPublicIdWhenMasterOfAGame() {
    UUID id = UUID.randomUUID();
    Player player = Player.builder().id(id).username("sam").email("s@test.it").build();
    when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(player));
    when(gameRepository.findFirstByMasterIdAndEndedAtIsNull(id))
        .thenReturn(Optional.of(Game.builder().publicId("wolf-seer-sam").build()));

    SessionResponse session = authService.session(id);

    assertEquals("sam", session.user().username());
    assertEquals("wolf-seer-sam", session.gamemaster());
  }

  @Test
  void session_gamemasterIsNullWhenNoOpenGame() {
    UUID id = UUID.randomUUID();
    Player player = Player.builder().id(id).username("sam").email("s@test.it").build();
    when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(player));
    when(gameRepository.findFirstByMasterIdAndEndedAtIsNull(id)).thenReturn(Optional.empty());

    assertNull(authService.session(id).gamemaster());
  }
}
