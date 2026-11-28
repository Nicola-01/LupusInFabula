package dev.busato.lupus.dto;

import dev.busato.lupus.model.Role;
import java.util.Map;

/** The deck of a game. With LARGER_ROLE_NUMBER the whole deck, so nobody knows which cards were discarded. */
public record ConfigurationResponse(Map<Role, Integer> deck) {}
