package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import dev.busato.lupus.exceptions.AlreadyFriendException;
import dev.busato.lupus.exceptions.InvalidFriendException;
import dev.busato.lupus.exceptions.NotFriendException;
import dev.busato.lupus.exceptions.PlayerNotFoundException;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.FriendshipRepository;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FriendServiceTest {

  @Mock private FriendshipRepository friendshipRepository;
  @Mock private PlayerRepository playerRepository;
  @Mock private GamePlayerRepository gamePlayerRepository;
  @InjectMocks private FriendService friendService;

  private final UUID id = UUID.randomUUID();
  private final Player me = Player.builder().id(id).username("wolf-user").email("wolf@test.it").build();
  private final Player bea = Player.builder().id(UUID.randomUUID()).username("bea-user").email("bea@test.it").build();

  @BeforeEach
  void setUp() {
    lenient().when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(me));
  }

  @Test
  void add_yourself_isInvalid() {
    when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("wolf-user")).thenReturn(Optional.of(me));

    assertThrows(InvalidFriendException.class, () -> friendService.add(id, "wolf-user"));
  }

  @Test
  void add_unknownUser_isNotFound() {
    when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("ghost")).thenReturn(Optional.empty());

    assertThrows(PlayerNotFoundException.class, () -> friendService.add(id, "ghost"));
  }

  @Test
  void add_twice_isConflict() {
    when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("bea-user")).thenReturn(Optional.of(bea));
    when(friendshipRepository.existsByPlayerIdAndFriendId(id, bea.getId())).thenReturn(true);

    assertThrows(AlreadyFriendException.class, () -> friendService.add(id, "bea-user"));
  }

  @Test
  void remove_nonFriend_isNotFound() {
    when(friendshipRepository.findByPlayerIdAndFriendUsernameIgnoreCase(id, "bea-user")).thenReturn(Optional.empty());

    assertThrows(NotFriendException.class, () -> friendService.remove(id, "bea-user"));
  }
}
