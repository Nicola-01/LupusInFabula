package dev.busato.lupus.service;

import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Role;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

/** Who can see the role of whom in a game. Pure rules, no database. */
final class RoleVisibility {

  /** The wolf pack sees each other at night. */
  static final Set<Role> PACK = EnumSet.of(Role.WOLF, Role.PUPPY, Role.BERSERKER, Role.EXPLORER);

  private RoleVisibility() {}

  /**
   * Game over, or the master of a game that has one (not MASTER_FREE): sees every role. Uses the id
   * because the master has no seat.
   */
  static boolean seesAll(Game game, UUID viewerId) {
    if (game.getEndedAt() != null) return true;
    // in master-free the master is a normal player: his view comes from canSee
    return viewerId.equals(game.getMaster().getId())
        && !game.getSettings().contains(GameSetting.MASTER_FREE);
  }

  /**
   * A player's view: his own role and his team mates. {@code viewer} null = doesn't play (spectator,
   * master without a seat): sees nothing.
   */
  static boolean canSee(Game game, GamePlayer viewer, GamePlayer target) {
    if (viewer == null) return false;

    // own role
    if (viewer.getId().equals(target.getId())) return true;

    Role viewerRole = viewer.getRole();
    Role targetRole = target.getRole();

    if (PACK.contains(viewerRole) && PACK.contains(targetRole)) return true;

    if (dorkyIsWolf(game)
        && ((viewerRole == Role.DORKY && PACK.contains(targetRole))
            || (PACK.contains(viewerRole) && targetRole == Role.DORKY))) {
      return true;
    }

    // masons know each other; dead players keep their role hidden (no death rule)
    return viewerRole == Role.MASON && targetRole == Role.MASON;
  }

  // shortcut: always false, the dorky turns into a wolf through the game logic (step 5), implement it there
  static boolean dorkyIsWolf(Game game) {
    return false;
  }
}
