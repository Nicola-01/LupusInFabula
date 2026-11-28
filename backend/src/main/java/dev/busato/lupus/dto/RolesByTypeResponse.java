package dev.busato.lupus.dto;

import dev.busato.lupus.model.RoleType;
import java.util.List;
import java.util.Map;

/** {@code {"roles": {"GOOD": [...], "EVIL": [...], "VICTORY_STEALER": [...], "NEUTRAL": [...]}}}. */
public record RolesByTypeResponse(Map<RoleType, List<RoleResponse>> roles) {}
