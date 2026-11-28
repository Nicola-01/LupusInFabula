package dev.busato.lupus.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.model.ActionType;
import dev.busato.lupus.model.Friendship;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GameAction;
import dev.busato.lupus.model.GamePhase;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.WinFaction;
import java.time.Instant;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Limit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

/** Real PostgreSQL (Replace.NONE), each test in a transaction rolled back at the end. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class GameRepositoryTest {

  @Autowired private PlayerRepository playerRepository;
  @Autowired private GameRepository gameRepository;
  @Autowired private GamePlayerRepository gamePlayerRepository;
  @Autowired private GameActionRepository gameActionRepository;
  @Autowired private FriendshipRepository friendshipRepository;
  @Autowired private TestEntityManager entityManager;

  private Player newPlayer(String name) {
    return playerRepository.save(
        Player.builder().username(name).email(name + "@test.it").passwordHash("hash").build());
  }

  @Test
  void gameIsSavedAndReadBackWithPlayersAndSettings() {
    Player master = newPlayer("sam-master");
    Player wolf = newPlayer("wolf-user");
    Player seer = newPlayer("seer-user");
    Game game =
        gameRepository.save(
            Game.builder()
                .publicId("wolf-seer-sam")
                .master(master)
                .settings(EnumSet.of(GameSetting.MASTER_FREE))
                .build());
    GamePlayer wolfPlay =
        gamePlayerRepository.save(
            GamePlayer.builder().game(game).player(wolf).role(Role.WOLF).seat(1).build());
    GamePlayer seerPlay =
        gamePlayerRepository.save(
            GamePlayer.builder().game(game).player(seer).role(Role.SEER).seat(2).build());
    gameActionRepository.save(
        GameAction.builder()
            .game(game)
            .actor(wolfPlay)
            .target(seerPlay)
            .round(1)
            .phase(GamePhase.NIGHT)
            .type(ActionType.MAUL)
            .build());
    entityManager.flush();
    entityManager.clear();

    Game loaded = gameRepository.findById(game.getId()).orElseThrow();

    assertNotNull(loaded.getId());
    assertEquals(7, loaded.getId().version());
    assertEquals(1, loaded.getRound());
    assertEquals(GamePhase.NIGHT, loaded.getPhase());
    assertNull(loaded.getWinner());
    assertNotNull(loaded.getStartedAt());
    assertTrue(loaded.getSettings().contains(GameSetting.MASTER_FREE));
    assertEquals("sam-master", loaded.getMaster().getUsername());
    assertEquals(2, loaded.getPlayers().size());
    assertEquals(
        List.of(Role.WOLF, Role.SEER),
        loaded.getPlayers().stream().map(GamePlayer::getRole).toList());
  }

  @Test
  void samePlayerTwiceInOneGameIsRejected() {
    Game game = gameRepository.save(Game.builder().publicId("twice").master(newPlayer("m1")).build());
    Player player = newPlayer("p1");
    gamePlayerRepository.saveAndFlush(
        GamePlayer.builder().game(game).player(player).role(Role.WOLF).seat(1).build());

    assertThrows(
        DataIntegrityViolationException.class,
        () ->
            gamePlayerRepository.saveAndFlush(
                GamePlayer.builder().game(game).player(player).role(Role.SEER).seat(2).build()));
  }

  @Test
  void playerCannotFollowHimself() {
    Player player = newPlayer("narcissus");

    assertThrows(
        DataIntegrityViolationException.class,
        () ->
            friendshipRepository.saveAndFlush(
                Friendship.builder().player(player).friend(player).build()));
  }

  private Game newGame(String publicId, Player master) {
    return gameRepository.save(Game.builder().publicId(publicId).master(master).build());
  }

  @Test
  void existsOpenGameOf_trueForMasterAndPlayer_falseOnceEnded() {
    Player master = newPlayer("sam-master");
    Player wolf = newPlayer("wolf-user");
    Player idle = newPlayer("idle-user");
    Game game = newGame("open-game", master);
    gamePlayerRepository.save(
        GamePlayer.builder().game(game).player(wolf).role(Role.WOLF).seat(1).build());
    entityManager.flush();

    assertTrue(gameRepository.existsOpenGameOf(master.getId()));
    assertTrue(gameRepository.existsOpenGameOf(wolf.getId()));
    assertFalse(gameRepository.existsOpenGameOf(idle.getId()));

    game.setEndedAt(Instant.now());
    game.setWinner(WinFaction.FARMERS);
    entityManager.flush();

    assertFalse(gameRepository.existsOpenGameOf(master.getId()));
    assertFalse(gameRepository.existsOpenGameOf(wolf.getId()));
  }

  @Test
  void findLatestOf_returnsTheMostRecentGameOfThePlayer() {
    Player wolf = newPlayer("wolf-user");
    Player sam = newPlayer("sam-master");
    Game old = newGame("old-game", wolf);
    Game recent = newGame("recent-game", sam);
    gamePlayerRepository.save(
        GamePlayer.builder().game(recent).player(wolf).role(Role.WOLF).seat(1).build());
    entityManager.flush();
    // startedAt is set by Hibernate on insert and cannot be changed through the entity
    entityManager
        .getEntityManager()
        .createNativeQuery("UPDATE game SET started_at = :t WHERE id = :id")
        .setParameter("t", Instant.parse("2020-01-01T00:00:00Z"))
        .setParameter("id", old.getId())
        .executeUpdate();
    entityManager.clear();

    List<Game> latest = gameRepository.findLatestOf(wolf.getId(), Limit.of(1));

    assertEquals(1, latest.size());
    assertEquals("recent-game", latest.get(0).getPublicId());
  }

  @Test
  void deckIsSavedAndReadBack() {
    Game game = gameRepository.save(Game.builder().publicId("deck-game").master(newPlayer("deck-master")).build());
    EnumMap<Role, Integer> deck = new EnumMap<>(Role.class);
    deck.put(Role.WOLF, 2);
    deck.put(Role.FARMER, 3);
    game.setDeck(deck);
    entityManager.flush();
    entityManager.clear();

    Game loaded = gameRepository.findById(game.getId()).orElseThrow();

    assertEquals(deck, loaded.getDeck());
  }

  /** Sets startedAt, which Hibernate fills on insert and the entity cannot change. */
  private void setStartedAt(Game game, String when) {
    entityManager
        .getEntityManager()
        .createNativeQuery("UPDATE game SET started_at = :t WHERE id = :id")
        .setParameter("t", Instant.parse(when))
        .setParameter("id", game.getId())
        .executeUpdate();
  }

  @Test
  void findLive_onlyOpenGames_newestFirst_masterFetched() {
    Game old = newGame("live-old", newPlayer("live-old-master"));
    Game recent = newGame("live-recent", newPlayer("live-recent-master"));
    Game ended = newGame("live-ended", newPlayer("live-ended-master"));
    ended.setEndedAt(Instant.now());
    ended.setWinner(WinFaction.WOLVES);
    entityManager.flush();
    setStartedAt(old, "2020-01-01T00:00:00Z");
    setStartedAt(recent, "2021-01-01T00:00:00Z");
    setStartedAt(ended, "2022-01-01T00:00:00Z");
    entityManager.clear();

    // the database may hold other open games: keep only the ones of this test
    List<Game> live = gameRepository.findLive(Limit.unlimited()).stream()
        .filter(g -> Set.of("live-old", "live-recent", "live-ended").contains(g.getPublicId()))
        .toList();

    assertEquals(List.of("live-recent", "live-old"), live.stream().map(Game::getPublicId).toList());
    assertTrue(Hibernate.isInitialized(live.get(0).getMaster()));
    assertEquals("live-recent-master", live.get(0).getMaster().getUsername());
  }

  @Test
  void findSeats_orderedBySeat_withPlayerLoaded() {
    Game game = newGame("seats-game", newPlayer("seats-master"));
    gamePlayerRepository.save(
        GamePlayer.builder().game(game).player(newPlayer("seat-two")).role(Role.SEER).seat(2).build());
    gamePlayerRepository.save(
        GamePlayer.builder().game(game).player(newPlayer("seat-one")).role(Role.WOLF).seat(1).build());
    entityManager.flush();
    entityManager.clear();

    Game loaded = gameRepository.findByPublicId("seats-game").orElseThrow();
    List<GamePlayer> seats = gamePlayerRepository.findSeats(loaded);

    assertEquals(
        List.of("seat-one", "seat-two"),
        seats.stream().map(seat -> seat.getPlayer().getUsername()).toList());
    assertTrue(seats.stream().allMatch(seat -> Hibernate.isInitialized(seat.getPlayer())));
  }
}
