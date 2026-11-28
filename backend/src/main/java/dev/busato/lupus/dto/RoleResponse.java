package dev.busato.lupus.dto;

import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.RoleType;
import dev.busato.lupus.model.WinFaction;

/** A role as sent to the frontend. {@code name} is the enum constant ("WOLF"). */
public record RoleResponse(
    Role name, RoleType type, WinFaction withWhoWins, int maxNumber, String description) {}
