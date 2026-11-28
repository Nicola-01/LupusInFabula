package dev.busato.lupus.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import java.util.EnumSet;
import java.util.List;
import org.junit.jupiter.api.Test;
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
}
