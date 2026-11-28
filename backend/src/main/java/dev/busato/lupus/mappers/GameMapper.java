package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.ConfigurationResponse;
import dev.busato.lupus.dto.GamePlayerResponse;
import dev.busato.lupus.dto.GameStatusResponse;
import dev.busato.lupus.dto.GameSummaryResponse;
import dev.busato.lupus.dto.LiveGameResponse;
import dev.busato.lupus.dto.SettingResponse;
import dev.busato.lupus.dto.VillageResponse;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Role;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
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

  public GameStatusResponse mapToStatus(Game game) {
    return new GameStatusResponse(
        game.getPublicId(),
        game.getMaster().getUsername(),
        game.getRound(),
        game.getPhase(),
        game.getStartedAt(),
        game.getEndedAt(),
        game.getWinner(),
        copySettings(game));
  }

  /** {@code role} stays null when {@code showRole} is false. */
  public GamePlayerResponse mapToPlayer(GamePlayer seat, boolean showRole) {
    return new GamePlayerResponse(
        seat.getPlayer().getUsername(),
        seat.getSeat(),
        showRole ? seat.getRole() : null,
        seat.getDeathRound() != null,
        seat.getDeathRound(),
        seat.getDeathPhase());
  }

  public ConfigurationResponse mapToConfiguration(Game game) {
    // copied: the lazy map must not leave the transaction
    Map<Role, Integer> deck = new EnumMap<>(Role.class);
    deck.putAll(game.getDeck());
    return new ConfigurationResponse(deck);
  }

  public LiveGameResponse mapToLive(Game game) {
    return new LiveGameResponse(
        game.getPublicId(),
        game.getMaster().getUsername(),
        game.getStartedAt(),
        game.getRound(),
        game.getPhase(),
        game.getPlayers().size(),
        copySettings(game));
  }

  public SettingResponse mapToResponse(GameSetting setting) {
    return new SettingResponse(setting, setting.getDescription());
  }

  /** A new EnumSet, also when the game has no settings. */
  private static Set<GameSetting> copySettings(Game game) {
    Set<GameSetting> settings = EnumSet.noneOf(GameSetting.class);
    settings.addAll(game.getSettings());
    return settings;
  }

  private static boolean isMaster(Game game, UUID callerId) {
    return game.getMaster().getId().equals(callerId);
  }
}
