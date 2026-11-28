package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import dev.busato.lupus.dto.DeckRequest;
import dev.busato.lupus.dto.DeckResponse;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.exceptions.DeckNotFoundException;
import dev.busato.lupus.exceptions.InvalidGameException;
import dev.busato.lupus.mappers.DeckMapper;
import dev.busato.lupus.model.Deck;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.repository.DeckRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DeckServiceTest {

  @Mock private DeckRepository deckRepository;
  @Mock private PlayerRepository playerRepository;
  @Spy private DeckMapper deckMapper;
  @InjectMocks private DeckService deckService;

  private final UUID id = UUID.randomUUID();
  private final UUID deckId = UUID.randomUUID();
  private final Player me =
      Player.builder().id(id).username("wolf-user").email("wolf@test.it").passwordHash("hash").build();

  @BeforeEach
  void setUp() {
    lenient().when(playerRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(me));
    lenient().when(deckRepository.save(any(Deck.class))).thenAnswer(inv -> inv.getArgument(0));
  }

  private static DeckRequest request(String name, int players, Map<Role, Integer> roles) {
    return new DeckRequest(name, players, roles);
  }

  @Test
  void roleOverItsMaximum_isInvalid() {
    DeckRequest body = request("Lupi", 5, Map.of(Role.WOLF, 6));

    assertThrows(InvalidGameException.class, () -> deckService.create(id, body));
  }

  @Test
  void fewerCardsThanPlayers_isInvalid() {
    DeckRequest body = request("Lupi", 5, Map.of(Role.FARMER, 3));

    assertThrows(InvalidGameException.class, () -> deckService.create(id, body));
  }

  @Test
  void exactDeckUnbalanced_isInvalid() {
    // 5 GOOD and no EVIL: the same balance rule as a game
    DeckRequest body = request("Lupi", 5, Map.of(Role.FARMER, 5));

    assertThrows(InvalidGameException.class, () -> deckService.create(id, body));
  }

  @Test
  void largerDeck_isNotCheckedForBalance() {
    // 8 cards for 5 players: the balance is checked on the dealt hand, at game creation
    DeckRequest body = request("Villaggio", 5, Map.of(Role.FARMER, 8));

    DeckResponse created = deckService.create(id, body);

    assertEquals("Villaggio", created.name());
  }

  @Test
  void duplicateName_isAlreadyUsed() {
    when(deckRepository.existsByOwnerIdAndNameIgnoreCase(id, "Lupi")).thenReturn(true);
    DeckRequest body = request("Lupi", 5, Map.of(Role.WOLF, 1, Role.FARMER, 4));

    assertThrows(AlreadyUsedException.class, () -> deckService.create(id, body));
  }

  @Test
  void updateOfADeckNotOwned_isNotFound() {
    when(deckRepository.findByIdAndOwnerId(deckId, id)).thenReturn(Optional.empty());
    DeckRequest body = request("Lupi", 5, Map.of(Role.WOLF, 1, Role.FARMER, 4));

    assertThrows(DeckNotFoundException.class, () -> deckService.update(id, deckId, body));
  }

  @Test
  void renameToItsOwnName_passes() {
    Deck deck =
        Deck.builder()
            .id(deckId)
            .owner(me)
            .name("Lupi")
            .players(5)
            .roles(new EnumMap<>(Map.of(Role.WOLF, 1, Role.FARMER, 4)))
            .build();
    when(deckRepository.findByIdAndOwnerId(deckId, id)).thenReturn(Optional.of(deck));
    // the name check excludes the deck itself, so its own name is not a duplicate
    when(deckRepository.existsByOwnerIdAndNameIgnoreCaseAndIdNot(id, "Lupi", deckId)).thenReturn(false);
    DeckRequest body = request("Lupi", 5, Map.of(Role.WOLF, 1, Role.FARMER, 4));

    DeckResponse updated = deckService.update(id, deckId, body);

    assertEquals("Lupi", updated.name());
    assertEquals(deckId, updated.id());
  }
}
