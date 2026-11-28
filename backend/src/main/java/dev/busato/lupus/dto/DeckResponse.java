package dev.busato.lupus.dto;

import dev.busato.lupus.model.Role;
import java.util.Map;
import java.util.UUID;

/** A deck as sent to the frontend; {@code roles} is in enum order. */
public record DeckResponse(UUID id, String name, int players, Map<Role, Integer> roles) {}
