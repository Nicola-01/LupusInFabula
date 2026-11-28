package dev.busato.lupus.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import dev.busato.lupus.dto.FriendResponse;
import dev.busato.lupus.model.Friendship;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

/** Real PostgreSQL (Replace.NONE), each test in a transaction rolled back at the end. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class FriendshipRepositoryTest {

  @Autowired private PlayerRepository playerRepository;
  @Autowired private GameRepository gameRepository;
  @Autowired private GamePlayerRepository gamePlayerRepository;
  @Autowired private FriendshipRepository friendshipRepository;
  @Autowired private TestEntityManager entityManager;

  private Player newPlayer(String name) {
    return playerRepository.save(
        Player.builder().username(name).email(name + "@test.it").passwordHash("hash").build());
  }

  private void playTogether(String publicId, Player master, Player... players) {
    Game game = gameRepository.save(Game.builder().publicId(publicId).master(master).build());
    for (int i = 0; i < players.length; i++) {
      gamePlayerRepository.save(
          GamePlayer.builder().game(game).player(players[i]).role(Role.WOLF).seat(i + 1).build());
    }
  }

  @Test
  void findFriends_isOrderedWithoutDeletedFriends_andCountsCommonGames() {
    Player me = newPlayer("wolf-user");
    Player master = newPlayer("sam-master");
    Player ann = newPlayer("Ann-user");
    Player bea = newPlayer("bea-user");
    Player ghost = newPlayer("ghost-user");
    friendshipRepository.save(Friendship.builder().player(me).friend(bea).build());
    friendshipRepository.save(Friendship.builder().player(me).friend(ann).build());
    friendshipRepository.save(Friendship.builder().player(me).friend(ghost).build());
    playTogether("game-1", master, me, ann);
    playTogether("game-2", master, me, ann);
    playTogether("game-3", master, me, bea);
    playTogether("game-4", master, ann, bea); // not with me: does not count
    ghost.setDeletedAt(Instant.now());
    ghost.setEmail(null);
    entityManager.flush();
    entityManager.clear();

    List<FriendResponse> friends = friendshipRepository.findFriends(me.getId());

    assertEquals(2, friends.size());
    assertEquals("Ann-user", friends.get(0).username());
    assertEquals(2L, friends.get(0).commonGames());
    assertEquals("bea-user", friends.get(1).username());
    assertEquals(1L, friends.get(1).commonGames());
  }
}
