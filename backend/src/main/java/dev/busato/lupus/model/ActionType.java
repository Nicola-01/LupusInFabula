package dev.busato.lupus.model;

/**
 * What a player did. {@code VOTE} is the day vote, the others are role powers (maul, protect, ...).
 */
public enum ActionType {
  VOTE,
  MAUL,
  INVESTIGATE,
  PROTECT,
  SHOT,
  RAGE,
  POINT,
  EXPLORE,
  BLOCK,
  PLAGUE,
  LOOK,
  REVENGE,
  LAST_CHANCE,
  BLOWUP
}
