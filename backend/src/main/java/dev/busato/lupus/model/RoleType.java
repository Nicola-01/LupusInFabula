package dev.busato.lupus.model;

/** What a role is. Sent in JSON as its name ("GOOD", "EVIL", ...). */
public enum RoleType {
  /** Villagers' side. */
  GOOD,
  /** Wolves' side. */
  EVIL,
  /** Plays alone and steals the victory (hamster, jester). */
  VICTORY_STEALER,
  /** Plays with either side and causes chaos (illusionist, plague spreader). */
  NEUTRAL
}
