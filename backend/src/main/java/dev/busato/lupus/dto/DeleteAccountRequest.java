package dev.busato.lupus.dto;

import jakarta.validation.constraints.NotBlank;

/** Body of DELETE /user/me: the password is asked again before deleting the account. */
public record DeleteAccountRequest(@NotBlank String currentPassword) {}
