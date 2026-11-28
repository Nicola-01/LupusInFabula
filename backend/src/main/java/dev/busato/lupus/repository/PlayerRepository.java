package dev.busato.lupus.repository;

import dev.busato.lupus.model.Player;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {

  boolean existsByUsernameIgnoreCase(String username);

  boolean existsByEmail(String email);

  Optional<Player> findByIdAndDeletedAtIsNull(UUID id);

  /** Active player by username (any case) or email (already lower case). Parentheses: a derived name would read OR before AND wrongly. */
  @Query("SELECT p FROM Player p WHERE (lower(p.username) = lower(:login) OR p.email = :email) AND p.deletedAt IS NULL")
  Optional<Player> findActiveByLogin(String login, String email);
}
