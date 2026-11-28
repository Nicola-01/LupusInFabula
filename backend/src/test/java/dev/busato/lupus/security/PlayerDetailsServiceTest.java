package dev.busato.lupus.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class PlayerDetailsServiceTest {

  @Mock private PlayerRepository playerRepository;
  @InjectMocks private PlayerDetailsService playerDetailsService;

  @Test
  void activePlayer_becomesPrincipalWithId() {
    UUID id = UUID.randomUUID();
    Player player =
        Player.builder().id(id).username("wolf").email("w@test.it").passwordHash("hash").build();
    when(playerRepository.findActiveByLogin("wolf", "wolf"))
        .thenReturn(Optional.of(player));

    PlayerPrincipal principal = playerDetailsService.loadUserByUsername("wolf");

    assertEquals(new PlayerPrincipal(id, "wolf", "hash"), principal);
  }

  @Test
  void deletedPlayer_isNotFound() {
    when(playerRepository.findActiveByLogin("gone", "gone")).thenReturn(Optional.empty());

    assertThrows(
        UsernameNotFoundException.class, () -> playerDetailsService.loadUserByUsername("gone"));
  }

  @Test
  void missingPlayer_isNotFound() {
    when(playerRepository.findActiveByLogin("nobody", "nobody"))
        .thenReturn(Optional.empty());

    assertThrows(
        UsernameNotFoundException.class, () -> playerDetailsService.loadUserByUsername("nobody"));
  }
}
