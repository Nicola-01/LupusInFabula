package dev.busato.lupus.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Settings that can be enabled in a game. Not implemented yet in the game logic.
 */
@Getter
@RequiredArgsConstructor
public enum GameSetting {
  MASTER_FREE(
      "Master-Free: No player is the master, each user chooses the target autonomously"),
  ILLUSIONIST_BLOCK(
      "Illusionist block: If a player is blocked by the illusionist he does not know it"),
  LARGER_ROLE_NUMBER(
      "Insert more roles than players, to give more randomness");

  private final String description;
}
