package dev.busato.lupus.repository;

import dev.busato.lupus.model.Deck;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeckRepository extends JpaRepository<Deck, UUID> {

  List<Deck> findByOwnerIdOrderByNameAsc(UUID ownerId);

  Optional<Deck> findByIdAndOwnerId(UUID id, UUID ownerId);

  boolean existsByOwnerIdAndNameIgnoreCase(UUID ownerId, String name);

  boolean existsByOwnerIdAndNameIgnoreCaseAndIdNot(UUID ownerId, String name, UUID id);

  void deleteByOwnerId(UUID ownerId);
}
