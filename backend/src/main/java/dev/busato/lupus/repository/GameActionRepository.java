package dev.busato.lupus.repository;

import dev.busato.lupus.model.GameAction;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameActionRepository extends JpaRepository<GameAction, UUID> {}
