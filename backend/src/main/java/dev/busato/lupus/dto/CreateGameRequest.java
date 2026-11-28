package dev.busato.lupus.dto;

import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Role;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Body of POST /game/create. {@code players} are in seat order; {@code settings} may be null (= none).
 * The keys of {@code roles} and {@code settings} are constant names ("WOLF").
 */
public record CreateGameRequest(
    @NotNull List<@NotBlank String> players,
    @NotEmpty Map<Role, @NotNull @Min(0) Integer> roles,
    Set<GameSetting> settings) {}
