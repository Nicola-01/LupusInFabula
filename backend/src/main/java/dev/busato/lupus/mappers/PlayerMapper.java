package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.PlayerResponse;
import dev.busato.lupus.model.Player;
import org.springframework.stereotype.Component;

@Component
public class PlayerMapper {

  public PlayerResponse mapToResponse(Player player) {
    return new PlayerResponse(player.getUsername(), player.getEmail());
  }
}
