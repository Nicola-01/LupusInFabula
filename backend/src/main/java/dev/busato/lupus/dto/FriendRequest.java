package dev.busato.lupus.dto;

import jakarta.validation.constraints.NotBlank;

/** Body of POST and DELETE /user/me/friend. */
public record FriendRequest(@NotBlank String username) {}
