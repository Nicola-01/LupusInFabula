package dev.busato.lupus.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.dto.PlayerSearchResponse;
import dev.busato.lupus.model.Player;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
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

  @Test
  void search_skipsDeletedAndExcludedPlayers_isCaseInsensitive_andEscapesUnderscore() {
    Player me = playerRepository.save(Player.builder().username("alpha-me").email("alpha-me@test.it").passwordHash("hash").build());
    playerRepository.save(Player.builder().username("Alpha_one").email("alpha-one@test.it").passwordHash("hash").build());
    playerRepository.save(Player.builder().username("alphaX").email("alphax@test.it").passwordHash("hash").build());
    playerRepository.save(Player.builder().username("alpha-gone").email("alpha-gone@test.it").passwordHash("hash").deletedAt(Instant.now()).build());
    entityManager.flush();
    entityManager.clear();

    List<String> all = usernames(playerRepository.search("ALPHA", me.getId(), Limit.unlimited()));
    List<String> underscore = usernames(playerRepository.search("alpha\\_", me.getId(), Limit.unlimited()));

    assertThat(all).containsExactlyInAnyOrder("Alpha_one", "alphaX");
    assertThat(underscore).containsExactly("Alpha_one");
  }

  private static List<String> usernames(List<PlayerSearchResponse> results) {
    return results.stream().map(PlayerSearchResponse::username).toList();
  }

  @Test
  void emailOfADeletedAccountCanBeReused() {
    Player old = playerRepository.save(Player.builder().username("old-owner").email("reuse@test.it").passwordHash("hash").build());
    old.setDeletedAt(Instant.now());
    old.setEmail(null);
    playerRepository.saveAndFlush(old);

    playerRepository.saveAndFlush(Player.builder().username("new-owner").email("reuse@test.it").passwordHash("hash").build());

    assertTrue(playerRepository.existsByEmail("reuse@test.it"));
  }

  @Test
  void activePlayerWithoutEmail_isRejected() {
    assertThrows(
        DataIntegrityViolationException.class,
        () -> playerRepository.saveAndFlush(Player.builder().username("no-mail").passwordHash("hash").build()));
  }
}
