package dev.busato.lupus.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.model.Player;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

/** Real PostgreSQL (Replace.NONE), each test in a transaction rolled back at the end. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PlayerRepositoryTest {

  @Autowired private PlayerRepository playerRepository;
  @Autowired private TestEntityManager entityManager;

  @Test
  void emailIsStoredInLowerCase_soExistsByEmailMatchesExactly() {
    Player saved =
        playerRepository.save(
            Player.builder().username("mixed-user").email("Mixed@Example.COM").passwordHash("hash").build());
    entityManager.flush();
    entityManager.clear();

    Player loaded = playerRepository.findById(saved.getId()).orElseThrow();

    assertEquals("mixed@example.com", loaded.getEmail());
    assertTrue(playerRepository.existsByEmail("mixed@example.com"));
  }

  @Test
  void findByIdAndDeletedAtIsNull_returnsActivePlayerOnly() {
    Player active = playerRepository.save(Player.builder().username("active-id").email("active-id@test.it").passwordHash("hash").build());
    Player deleted = playerRepository.save(Player.builder().username("deleted-id").email("deleted-id@test.it").passwordHash("hash").deletedAt(Instant.now()).build());
    entityManager.flush();
    entityManager.clear();

    assertTrue(playerRepository.findByIdAndDeletedAtIsNull(active.getId()).isPresent());
    assertFalse(playerRepository.findByIdAndDeletedAtIsNull(deleted.getId()).isPresent());
  }

  @Test
  void findActiveByLogin_findsByUsernameInAnyCaseAndByEmail() {
    playerRepository.save(Player.builder().username("Login-Wolf").email("wolf-login@test.it").passwordHash("hash").build());
    entityManager.flush();
    entityManager.clear();

    assertTrue(playerRepository.findActiveByLogin("login-wolf", "login-wolf").isPresent());
    assertTrue(playerRepository.findActiveByLogin("wolf-login@test.it", "wolf-login@test.it").isPresent());
  }

  @Test
  void findActiveByLogin_doesNotFindDeletedPlayerByUsernameOrByEmail() {
    playerRepository.save(Player.builder().username("gone-login").email("gone-login@test.it").passwordHash("hash").deletedAt(Instant.now()).build());
    entityManager.flush();
    entityManager.clear();

    assertFalse(playerRepository.findActiveByLogin("gone-login", "gone-login").isPresent());
    assertFalse(playerRepository.findActiveByLogin("gone-login@test.it", "gone-login@test.it").isPresent());
  }
}
