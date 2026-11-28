package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.PlayerResponse;
import dev.busato.lupus.dto.ProfileResponse;
import dev.busato.lupus.model.Player;
import org.springframework.stereotype.Component;

@Component
public class PlayerMapper {

  public PlayerResponse mapToResponse(Player player) {
    return new PlayerResponse(player.getUsername(), player.getEmail());
  }

  public ProfileResponse mapToOwnProfile(Player player) {
    return new ProfileResponse(player.getUsername(), player.getEmail(), player.getRegisteredOn());
  }

  /** Profile of another player: no email. */
  public ProfileResponse mapToPublicProfile(Player player) {
    return new ProfileResponse(player.getUsername(), null, player.getRegisteredOn());
  }
}
