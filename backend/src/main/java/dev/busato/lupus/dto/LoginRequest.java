package dev.busato.lupus.dto;

import jakarta.validation.constraints.NotBlank;

/** Body of POST /login. {@code user} is the username or the email. */
public record LoginRequest(@NotBlank String user, @NotBlank String password, boolean keepLogged) {}
