package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.busato.lupus.dto.CreateGameRequest;
import dev.busato.lupus.dto.CreateGameResponse;
import dev.busato.lupus.exceptions.InGameException;
import dev.busato.lupus.exceptions.InvalidGameException;
import dev.busato.lupus.exceptions.InvalidPlayersException;
import dev.busato.lupus.exceptions.InvalidPlayersException.PlayerProblem;
import dev.busato.lupus.mappers.GameMapper;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.GameRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

  @Mock private GameRepository gameRepository;
  @Mock private GamePlayerRepository gamePlayerRepository;
  @Mock private PlayerRepository playerRepository;
  @Spy private GameMapper gameMapper;
  @InjectMocks private GameService gameService;

  @Captor private ArgumentCaptor<Game> gameCaptor;
  @Captor private ArgumentCaptor<List<GamePlayer>> seatsCaptor;

  private final Player master = player("sam-master");

  private static Player player(String username) {
    return Player.builder()
        .id(UUID.randomUUID())
        .username(username)
        .email(username + "@test.it")
        .passwordHash("hash")
        .build();
  }

  /** A player that exists in the table and is not in a game. */
  private Player known(String username) {
    Player p = player(username);
    lenient()
        .when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull(username))
        .thenReturn(Optional.of(p));
    return p;
  }

  private static CreateGameRequest request(Set<GameSetting> settings, Map<Role, Integer> roles, String... usernames) {
    return new CreateGameRequest(List.of(usernames), roles, settings);
  }

  /** Six players, not the master: WOLF 2, SEER 1, FARMER 3 is a valid deck for them. */
  private final Map<Role, Integer> sixDeck = Map.of(Role.WOLF, 2, Role.SEER, 1, Role.FARMER, 3);
  private final String[] six = {"p-one", "p-two", "p-three", "p-four", "p-five", "p-six"};

  @BeforeEach
  void setUp() {
    lenient()
        .when(playerRepository.findByIdAndDeletedAtIsNull(master.getId()))
        .thenReturn(Optional.of(master));
    lenient()
        .when(playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("sam-master"))
        .thenReturn(Optional.of(master));
    lenient().when(gameRepository.existsOpenGameOf(any())).thenReturn(false);
    lenient().when(gameRepository.existsByPublicId(anyString())).thenReturn(false);
    lenient()
        .when(gameRepository.save(any(Game.class)))
        .thenAnswer(inv -> inv.getArgument(0));
    for (String name : six) known(name);
  }

  @Test
  void masterAlreadyInAGame_isInGame() {
    when(gameRepository.existsOpenGameOf(master.getId())).thenReturn(true);

    assertThrows(
        InGameException.class,
        () -> gameService.create(master.getId(), request(null, sixDeck, six)));
  }

  @Test
  void duplicateUsernames_ignoringCase_areInvalid() {
    assertThrows(
        InvalidGameException.class,
        () -> gameService.create(master.getId(), request(null, sixDeck, "p-one", "P-ONE", "p-two", "p-three", "p-four", "p-five")));
  }

  @Test
  void unknownInGameAndMaster_areReportedTogether() {
    Player bea = known("bea-user");
    when(gameRepository.existsOpenGameOf(bea.getId())).thenReturn(true);
    CreateGameRequest body = request(null, Map.of(Role.WOLF, 1, Role.FARMER, 3), "ghost-user", "bea-user", "sam-master", "p-one", "p-two");

    InvalidPlayersException ex =
        assertThrows(InvalidPlayersException.class, () -> gameService.create(master.getId(), body));

    Map<?, ?> players = (Map<?, ?>) ex.getBody().getProperties().get("players");
    assertEquals(
        Map.of(
            "ghost-user", PlayerProblem.NOT_FOUND,
            "bea-user", PlayerProblem.IN_GAME,
            "sam-master", PlayerProblem.IS_MASTER),
        players);
  }

  @Test
  void masterFreeWithoutTheMaster_isInvalid() {
    CreateGameRequest body = request(Set.of(GameSetting.MASTER_FREE), sixDeck, six);

    assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
  }

  @Test
  void masterFreeWithTheMaster_takesASeat() {
    CreateGameRequest body =
        request(
            Set.of(GameSetting.MASTER_FREE),
            Map.of(Role.WOLF, 1, Role.FARMER, 5),
            "sam-master", "p-one", "p-two", "p-three", "p-four", "p-five");

    gameService.create(master.getId(), body);

    verify(gamePlayerRepository).saveAll(seatsCaptor.capture());
    assertTrue(seatsCaptor.getValue().stream().anyMatch(gp -> gp.getPlayer().equals(master)));
    assertEquals(6, seatsCaptor.getValue().size());
  }

  @Test
  void fewerThanFivePlayers_isInvalid() {
    CreateGameRequest body = request(null, Map.of(Role.WOLF, 1, Role.FARMER, 3), "p-one", "p-two", "p-three", "p-four");

    assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
  }

  @Test
  void roleOverItsMaximum_isInvalid() {
    CreateGameRequest body = request(null, Map.of(Role.WOLF, 6, Role.FARMER, 0), six);

    InvalidGameException ex =
        assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
    assertEquals("At most 5 WOLF, got 6", ex.getBody().getDetail());
  }

  @Test
  void rolesDifferentFromPlayers_withoutLargerNumber_isInvalid() {
    CreateGameRequest body = request(null, Map.of(Role.WOLF, 1, Role.FARMER, 4), six);

    assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
  }

  @Test
  void largerNumber_withFewerCardsThanPlayers_isInvalid() {
    CreateGameRequest body = request(Set.of(GameSetting.LARGER_ROLE_NUMBER), Map.of(Role.WOLF, 1, Role.FARMER, 4), six);

    InvalidGameException ex =
        assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
    assertEquals("5 roles for 6 players: at least one per player", ex.getBody().getDetail());
  }

  @Test
  void moreCardsThanPlayers_withoutLargerNumber_isInvalid() {
    CreateGameRequest body = request(null, Map.of(Role.WOLF, 2, Role.SEER, 1, Role.FARMER, 4), six);

    InvalidGameException ex =
        assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
    assertEquals("More roles than players requires LARGER_ROLE_NUMBER", ex.getBody().getDetail());
  }

  @Test
  void unbalancedDeck_isInvalid() {
    CreateGameRequest body = request(null, Map.of(Role.FARMER, 5), "p-one", "p-two", "p-three", "p-four", "p-five");

    assertThrows(InvalidGameException.class, () -> gameService.create(master.getId(), body));
  }

  @Test
  void create_savesTheGameAndSeatsInRequestOrder() {
    CreateGameRequest body = request(Set.of(GameSetting.ILLUSIONIST_BLOCK), sixDeck, six);

    CreateGameResponse response = gameService.create(master.getId(), body);

    assertTrue(response.publicId().matches("^[a-z]+-[a-z]+-[a-z]+-\\d{4}$"));
    verify(gameRepository).save(gameCaptor.capture());
    Game game = gameCaptor.getValue();
    assertEquals(response.publicId(), game.getPublicId());
    assertEquals(sixDeck, game.getDeck());
    assertEquals(Set.of(GameSetting.ILLUSIONIST_BLOCK), game.getSettings());

    verify(gamePlayerRepository).saveAll(seatsCaptor.capture());
    List<GamePlayer> seats = seatsCaptor.getValue();
    assertEquals(List.of(1, 2, 3, 4, 5, 6), seats.stream().map(GamePlayer::getSeat).toList());
    for (int i = 0; i < six.length; i++)
      assertEquals(six[i], seats.get(i).getPlayer().getUsername());
    assertEquals(
        Map.of(Role.WOLF, 2L, Role.SEER, 1L, Role.FARMER, 3L),
        seats.stream().map(GamePlayer::getRole).collect(Collectors.groupingBy(r -> r, Collectors.counting())));
  }

  @Test
  void largerNumber_dealsFiveBalancedCardsOutOfEight() {
    Map<Role, Integer> eightDeck = Map.of(Role.WOLF, 2, Role.FARMER, 3, Role.MASON, 1, Role.SEER, 1, Role.HAMSTER, 1);
    CreateGameRequest body =
        request(Set.of(GameSetting.LARGER_ROLE_NUMBER), eightDeck, "p-one", "p-two", "p-three", "p-four", "p-five");

    gameService.create(master.getId(), body);

    verify(gameRepository).save(gameCaptor.capture());
    assertEquals(eightDeck, gameCaptor.getValue().getDeck());
    verify(gamePlayerRepository).saveAll(seatsCaptor.capture());
    List<Role> hand = seatsCaptor.getValue().stream().map(GamePlayer::getRole).toList();
    assertEquals(5, hand.size());
    assertNull(GameService.unbalanced(hand));
    for (Role role : hand) {
      assertTrue(hand.stream().filter(role::equals).count() <= eightDeck.get(role));
    }
  }

  @Test
  void unbalancedFormulas_forEightCards() {
    assertNull(
        GameService.unbalanced(List.of(Role.FARMER, Role.FARMER, Role.FARMER, Role.WOLF, Role.WOLF, Role.WOLF, Role.HAMSTER, Role.HAMSTER)));
    assertEquals(
        "GOOD roles must be at least 3, got 2; EVIL roles must be at most 3, got 4",
        GameService.unbalanced(List.of(Role.FARMER, Role.FARMER, Role.WOLF, Role.WOLF, Role.WOLF, Role.WOLF, Role.HAMSTER, Role.HAMSTER)));
    assertEquals(
        "EVIL roles must be at least 1, got 0",
        GameService.unbalanced(IntStream.range(0, 8).mapToObj(i -> Role.FARMER).toList()));
  }
}
