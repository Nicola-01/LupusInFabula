package dev.busato.lupus.repository;

import dev.busato.lupus.model.Game;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {

  Optional<Game> findFirstByMasterIdAndEndedAtIsNull(UUID masterId);

  /** True if the player is master or player of a game not ended yet. */
  @Query("""
      SELECT count(g) > 0 FROM Game g
      WHERE g.endedAt IS NULL
        AND (g.master.id = :playerId
             OR EXISTS (SELECT gp FROM GamePlayer gp WHERE gp.game = g AND gp.player.id = :playerId))""")
  boolean existsOpenGameOf(UUID playerId);

  /** The most recent game of the player, as master or player. */
  @Query("""
      SELECT g FROM Game g
      WHERE g.master.id = :playerId
         OR EXISTS (SELECT gp FROM GamePlayer gp WHERE gp.game = g AND gp.player.id = :playerId)
      ORDER BY g.startedAt DESC""")
  List<Game> findLatestOf(UUID playerId, Limit limit);

  boolean existsByPublicId(String publicId);

  Optional<Game> findByPublicId(String publicId);

  /** Games not ended yet, newest first; the master is fetched for the live board. */
  @Query("SELECT g FROM Game g JOIN FETCH g.master WHERE g.endedAt IS NULL ORDER BY g.startedAt DESC")
  List<Game> findLive(Limit limit);
}
