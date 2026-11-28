package dev.busato.lupus.dto;

import dev.busato.lupus.model.GamePhase;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.WinFaction;
import java.time.Instant;
import java.util.Set;

/** Public state of a game: {@code master} = username of the master, {@code winner} null while in progress. */
public record GameStatusResponse(
    String publicId,
    String master,
    int round,
    GamePhase phase,
    Instant startedAt,
    Instant endedAt,
    WinFaction winner,
    Set<GameSetting> settings) {}
