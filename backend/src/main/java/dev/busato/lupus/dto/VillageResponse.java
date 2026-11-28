package dev.busato.lupus.dto;

import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.WinFaction;
import java.util.Set;

/** A game as seen by the caller: {@code isMaster} = the caller is its master, {@code winner} null while in progress. */
public record VillageResponse(
    String publicId, boolean isMaster, WinFaction winner, Set<GameSetting> settings) {}
