package dev.busato.lupus.repository;

import dev.busato.lupus.model.GamePlayer;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends JpaRepository<GamePlayer, UUID> {}
