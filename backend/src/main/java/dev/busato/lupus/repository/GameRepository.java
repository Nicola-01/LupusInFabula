package dev.busato.lupus.repository;

import dev.busato.lupus.model.Game;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {

  Optional<Game> findFirstByMasterIdAndEndedAtIsNull(UUID masterId);
}
