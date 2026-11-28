package dev.busato.lupus.dto;

import dev.busato.lupus.model.GameSetting;

public record SettingResponse(GameSetting name, String description) {}
