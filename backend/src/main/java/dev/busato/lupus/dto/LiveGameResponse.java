package dev.busato.lupus.dto;

import dev.busato.lupus.model.GamePhase;
import dev.busato.lupus.model.GameSetting;
import java.time.Instant;
import java.util.Set;

/** A game of the live board: {@code players} = number of seats. */
public record LiveGameResponse(
    String publicId,
    String master,
    Instant startedAt,
    int round,
    GamePhase phase,
    int players,
    Set<GameSetting> settings) {}
