package dev.busato.lupus.dto;

import dev.busato.lupus.model.GamePhase;
import dev.busato.lupus.model.Role;

/** A seat of a game. {@code role} is null when the caller can't see it. */
public record GamePlayerResponse(
    String username, int seat, Role role, boolean dead, Integer deathRound, GamePhase deathPhase) {}
