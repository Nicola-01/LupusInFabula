package dev.busato.lupus.model;

/**
 * A faction that can win the game. Used by a role (who it wins with) and, later, by a game (who
 * won). "Nobody" (the master, or a game not finished yet) is {@code null}, not a constant.
 */
public enum WinFaction {
  FARMERS,
  WOLVES,
  HAMSTER,
  JESTER,
  /** Only as a game result: nobody won. */
  DRAW
}
