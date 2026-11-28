package dev.busato.lupus.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.model.Deck;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

/** Real PostgreSQL (Replace.NONE), each test in a transaction rolled back at the end. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DeckRepositoryTest {

  @Autowired private PlayerRepository playerRepository;
  @Autowired private DeckRepository deckRepository;
  @Autowired private TestEntityManager entityManager;

  private Player newPlayer(String name) {
    return playerRepository.save(
        Player.builder().username(name).email(name + "@test.it").passwordHash("hash").build());
  }

  private Deck newDeck(Player owner, String name, Map<Role, Integer> roles) {
    return Deck.builder().owner(owner).name(name).players(5).roles(new EnumMap<>(roles)).build();
  }

  @Test
  void rolesMapRoundTripsThroughTheDatabase() {
    Player owner = newPlayer("wolf-user");
    Deck saved = deckRepository.save(newDeck(owner, "Lupi", Map.of(Role.WOLF, 2, Role.SEER, 1, Role.FARMER, 2)));
    entityManager.flush();
    entityManager.clear();

    Deck found = deckRepository.findById(saved.getId()).orElseThrow();

    assertEquals(Map.of(Role.WOLF, 2, Role.SEER, 1, Role.FARMER, 2), found.getRoles());
  }

  @Test
  void rolesColumnIsJsonb() {
    String type =
        (String)
            entityManager
                .getEntityManager()
                .createNativeQuery(
                    "SELECT data_type FROM information_schema.columns WHERE table_name = 'deck' AND column_name = 'roles'")
                .getSingleResult();

    assertEquals("jsonb", type);
  }

  @Test
  void sameOwnerAndSameName_isRejected() {
    Player owner = newPlayer("wolf-user");
    deckRepository.saveAndFlush(newDeck(owner, "Lupi", Map.of(Role.WOLF, 1, Role.FARMER, 4)));

    assertThrows(
        DataIntegrityViolationException.class,
        () -> deckRepository.saveAndFlush(newDeck(owner, "Lupi", Map.of(Role.WOLF, 2, Role.FARMER, 3))));
  }

  @Test
  void twoOwners_canUseTheSameName() {
    Player ann = newPlayer("ann-user");
    Player bea = newPlayer("bea-user");
    deckRepository.saveAndFlush(newDeck(ann, "Lupi", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    deckRepository.saveAndFlush(newDeck(bea, "Lupi", Map.of(Role.WOLF, 1, Role.FARMER, 4)));

    assertEquals(1, deckRepository.findByOwnerIdOrderByNameAsc(ann.getId()).size());
    assertEquals(1, deckRepository.findByOwnerIdOrderByNameAsc(bea.getId()).size());
  }

  @Test
  void deleteByOwnerId_removesOnlyThatOwnersDecks() {
    Player ann = newPlayer("ann-user");
    Player bea = newPlayer("bea-user");
    deckRepository.save(newDeck(ann, "Lupi", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    deckRepository.save(newDeck(ann, "Bosco", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    deckRepository.save(newDeck(bea, "Villaggio", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    entityManager.flush();

    deckRepository.deleteByOwnerId(ann.getId());
    entityManager.flush();
    entityManager.clear();

    assertTrue(deckRepository.findByOwnerIdOrderByNameAsc(ann.getId()).isEmpty());
    assertEquals(1, deckRepository.findByOwnerIdOrderByNameAsc(bea.getId()).size());
  }

  @Test
  void findByOwner_isOrderedByName() {
    Player owner = newPlayer("wolf-user");
    deckRepository.save(newDeck(owner, "Lupi", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    deckRepository.save(newDeck(owner, "Bosco", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    deckRepository.save(newDeck(owner, "Villaggio", Map.of(Role.WOLF, 1, Role.FARMER, 4)));
    entityManager.flush();
    entityManager.clear();

    List<String> names =
        deckRepository.findByOwnerIdOrderByNameAsc(owner.getId()).stream().map(Deck::getName).toList();

    assertEquals(List.of("Bosco", "Lupi", "Villaggio"), names);
  }
}
