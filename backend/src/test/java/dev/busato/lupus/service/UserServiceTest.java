package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.busato.lupus.dto.UpdateProfileRequest;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.exceptions.PlayerNotFoundException;
import dev.busato.lupus.exceptions.SearchTooShortException;
import dev.busato.lupus.exceptions.WrongPasswordException;
import dev.busato.lupus.mappers.PlayerMapper;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Limit;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock private PlayerRepository playerRepository;
  @Spy private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // real hashes, to check the password
  @Spy private PlayerMapper playerMapper;
  @InjectMocks private UserService userService;

  private final UUID id = UUID.randomUUID();
  private Player player;

  @BeforeEach
  void setUp() {
    player =
        Player.builder()
            .id(id)
            .username("wolf-user")
            .email("wolf@test.it")
            .passwordHash(passwordEncoder.encode("Passw0rd!"))
            .build();
    lenient().when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(player));
  }

  @Test
  void update_withWrongPassword_isWrongPassword() {
    UpdateProfileRequest request = new UpdateProfileRequest("Wrong0pass!", "new-wolf", null, null);

    assertThrows(WrongPasswordException.class, () -> userService.update(id, request));
    assertEquals("wolf-user", player.getUsername());
  }

  @Test
  void update_withUsedUsername_isConflictOnUsername() {
    when(playerRepository.existsByUsernameIgnoreCaseAndIdNot("other-user", id)).thenReturn(true);
    UpdateProfileRequest request = new UpdateProfileRequest("Passw0rd!", "other-user", null, null);

    AlreadyUsedException ex =
        assertThrows(AlreadyUsedException.class, () -> userService.update(id, request));
    assertEquals("username", ex.getBody().getProperties().get("field"));
  }

  @Test
  void update_checksEmailInLowerCase() {
    UpdateProfileRequest request = new UpdateProfileRequest("Passw0rd!", null, "New@Example.COM", null);

    userService.update(id, request);

    verify(playerRepository).existsByEmailAndIdNot("new@example.com", id);
    assertEquals("new@example.com", player.getEmail());
  }

  @Test
  void update_reEncodesThePassword() {
    UpdateProfileRequest request = new UpdateProfileRequest("Passw0rd!", null, null, "N3wPassw0rd!");

    userService.update(id, request);

    assertTrue(passwordEncoder.matches("N3wPassw0rd!", player.getPasswordHash()));
  }

  @Test
  void delete_setsDeletedAtAndClearsEmail() {
    userService.delete(id, "Passw0rd!");

    assertNotNull(player.getDeletedAt());
    assertNull(player.getEmail());
  }

  @Test
  void delete_withWrongPassword_keepsTheAccount() {
    assertThrows(WrongPasswordException.class, () -> userService.delete(id, "Wrong0pass!"));
    assertNull(player.getDeletedAt());
  }

  @Test
  void deletedAccount_isUnauthenticated() {
    when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

    assertThrows(InsufficientAuthenticationException.class, () -> userService.me(id));
  }

  @Test
  void profile_unknownUser_isNotFound() {
    when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("ghost")).thenReturn(Optional.empty());

    assertThrows(PlayerNotFoundException.class, () -> userService.profile("ghost"));
  }

  @Test
  void search_withOneCharacter_isTooShort() {
    assertThrows(SearchTooShortException.class, () -> userService.search(id, " a "));
  }

  @Test
  void search_escapesLikeWildcardsAndCapsTheResults() {
    when(playerRepository.search(anyString(), any(), any())).thenReturn(List.of());

    userService.search(id, "a_%");

    verify(playerRepository).search(eq("a\\_\\%"), eq(id), eq(Limit.of(20)));
  }
}
