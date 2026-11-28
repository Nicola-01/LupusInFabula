package dev.busato.lupus.repository;

import dev.busato.lupus.dto.PlayerSearchResponse;
import dev.busato.lupus.model.Player;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {

  boolean existsByUsernameIgnoreCase(String username);

  boolean existsByEmail(String email);

  boolean existsByUsernameIgnoreCaseAndIdNot(String username, UUID id);

  boolean existsByEmailAndIdNot(String email, UUID id);

  Optional<Player> findByIdAndDeletedAtIsNull(UUID id);

  Optional<Player> findByUsernameIgnoreCaseAndDeletedAtIsNull(String username);

  /** Active player by username (any case) or email (already lower case). Parentheses: a derived name would read OR before AND wrongly. */
  @Query("SELECT p FROM Player p WHERE (lower(p.username) = lower(:login) OR p.email = :email) AND p.deletedAt IS NULL")
  Optional<Player> findActiveByLogin(String login, String email);

  /** Active players whose username contains the text (already LIKE-escaped with '\'), except one. */
  @Query("""
      SELECT new dev.busato.lupus.dto.PlayerSearchResponse(p.username,
        (SELECT max(g.publicId) FROM GamePlayer gp JOIN gp.game g WHERE gp.player = p AND g.endedAt IS NULL))
      FROM Player p
      WHERE lower(p.username) LIKE lower(concat('%', :text, '%')) ESCAPE '\\'
        AND p.deletedAt IS NULL AND p.id <> :excludedId
      ORDER BY lower(p.username)""")
  List<PlayerSearchResponse> search(String text, UUID excludedId, Limit limit);
}
