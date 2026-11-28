package dev.busato.lupus.dto;

import dev.busato.lupus.model.WinFaction;
import java.time.Instant;

/** A game in the list. {@code master} = the caller is the master of the game. */
public record GameSummaryResponse(
    String publicId, Instant startedAt, Instant endedAt, WinFaction winner, boolean master) {}
