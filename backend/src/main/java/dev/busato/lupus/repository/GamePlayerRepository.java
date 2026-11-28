package dev.busato.lupus.repository;

import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends JpaRepository<GamePlayer, UUID> {

  @Query("SELECT count(gp1) FROM GamePlayer gp1, GamePlayer gp2 WHERE gp1.game = gp2.game AND gp1.player.id = :a AND gp2.player.id = :b")
  long countCommonGames(UUID a, UUID b);

  /** The seats of a game in seat order; the player is fetched for the username. */
  @Query("SELECT gp FROM GamePlayer gp JOIN FETCH gp.player WHERE gp.game = :game ORDER BY gp.seat")
  List<GamePlayer> findSeats(Game game);
}
