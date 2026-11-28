package dev.busato.lupus.dto;

/** A search result. {@code currentGame} = publicId of an unfinished game the player is in, or null. */
public record PlayerSearchResponse(String username, String currentGame) {}
