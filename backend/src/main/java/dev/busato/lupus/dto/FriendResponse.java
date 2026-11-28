package dev.busato.lupus.dto;

import java.time.LocalDate;

/** A friend: {@code commonGames} = games both played in, {@code since} = day the friendship was added. */
public record FriendResponse(String username, Long commonGames, LocalDate since) {}
