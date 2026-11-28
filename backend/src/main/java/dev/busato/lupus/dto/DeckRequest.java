package dev.busato.lupus.dto;

import dev.busato.lupus.model.Role;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

/** Body of POST and PUT /user/me/deck. {@code roles}: role -> number of cards. */
public record DeckRequest(
    @NotBlank @Size(max = 50) String name,
    @Min(5) int players,
    @NotEmpty Map<Role, @NotNull @Min(1) Integer> roles) {}
