package dev.busato.lupus.dto;

/** GET /api/session. {@code gamemaster} is the publicId of the unfinished game the user masters, or null. */
public record SessionResponse(PlayerResponse user, String gamemaster) {}
