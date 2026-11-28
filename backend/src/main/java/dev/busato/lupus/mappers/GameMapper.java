package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.GameSummaryResponse;
import dev.busato.lupus.dto.SettingResponse;
import dev.busato.lupus.dto.VillageResponse;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GameSetting;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Maps use the settings and the master: call them inside the transaction that loaded the game. */
@Component
public class GameMapper {

  public GameSummaryResponse mapToSummary(Game game, UUID callerId) {
    return new GameSummaryResponse(
        game.getPublicId(), game.getStartedAt(), game.getEndedAt(), game.getWinner(), isMaster(game, callerId));
  }

  public VillageResponse mapToVillage(Game game, UUID callerId) {
    // copied: the lazy PersistentSet must not leave the transaction
    Set<GameSetting> settings = EnumSet.noneOf(GameSetting.class);
    settings.addAll(game.getSettings());
    return new VillageResponse(game.getPublicId(), isMaster(game, callerId), game.getWinner(), settings);
  }

  public SettingResponse mapToResponse(GameSetting setting) {
    return new SettingResponse(setting, setting.getDescription());
  }

  private static boolean isMaster(Game game, UUID callerId) {
    return game.getMaster().getId().equals(callerId);
  }
}
