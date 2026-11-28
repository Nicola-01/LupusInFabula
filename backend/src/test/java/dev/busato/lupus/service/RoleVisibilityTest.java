package dev.busato.lupus.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePhase;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import java.time.Instant;
import java.util.EnumSet;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class RoleVisibilityTest {

  private final Player master = Player.builder().id(UUID.randomUUID()).username("master").build();

  private Game game(GameSetting... settings) {
    EnumSet<GameSetting> set = EnumSet.noneOf(GameSetting.class);
    set.addAll(java.util.List.of(settings));
    return Game.builder().master(master).settings(set).build();
  }

  private GamePlayer seat(Game game, Role role, int seat) {
    Player player = Player.builder().id(UUID.randomUUID()).username("p" + seat).build();
    return GamePlayer.builder()
        .id(UUID.randomUUID())
        .game(game)
        .player(player)
        .role(role)
        .seat(seat)
        .build();
  }

  @Test
  void gameOverSeesEveryone() {
    Game game = game();
    game.setEndedAt(Instant.now());
    assertTrue(RoleVisibility.seesAll(game, UUID.randomUUID()));
  }

  @Test
  void masterSeesEveryone() {
    Game game = game();
    assertTrue(RoleVisibility.seesAll(game, master.getId()));
  }

  @Test
  void masterInMasterFreeSeesOnlyOwnSeat() {
    Game game = game(GameSetting.MASTER_FREE);
    GamePlayer masterSeat = seat(game, Role.FARMER, 1);
    GamePlayer other = seat(game, Role.SEER, 2);
    assertFalse(RoleVisibility.seesAll(game, master.getId()));
    assertTrue(RoleVisibility.canSee(game, masterSeat, masterSeat));
    assertFalse(RoleVisibility.canSee(game, masterSeat, other));
  }

  @Test
  void spectatorSeesNothing() {
    Game game = game();
    GamePlayer target = seat(game, Role.WOLF, 1);
    assertFalse(RoleVisibility.seesAll(game, UUID.randomUUID()));
    assertFalse(RoleVisibility.canSee(game, null, target));
  }

  @Test
  void playerSeesOwnRole() {
    Game game = game();
    GamePlayer viewer = seat(game, Role.SEER, 1);
    assertTrue(RoleVisibility.canSee(game, viewer, viewer));
  }

  @Test
  void wolfSeesPuppy() {
    Game game = game();
    GamePlayer viewer = seat(game, Role.WOLF, 1);
    GamePlayer puppy = seat(game, Role.PUPPY, 2);
    assertTrue(RoleVisibility.canSee(game, viewer, puppy));
  }

  @Test
  void wolfDoesNotSeeSeer() {
    Game game = game();
    GamePlayer viewer = seat(game, Role.WOLF, 1);
    GamePlayer seer = seat(game, Role.SEER, 2);
    assertFalse(RoleVisibility.canSee(game, viewer, seer));
  }

  @Test
  void masonSeesMason() {
    Game game = game();
    GamePlayer viewer = seat(game, Role.MASON, 1);
    GamePlayer mason = seat(game, Role.MASON, 2);
    assertTrue(RoleVisibility.canSee(game, viewer, mason));
  }

  @Test
  void masonDoesNotSeeWolf() {
    Game game = game();
    GamePlayer viewer = seat(game, Role.MASON, 1);
    GamePlayer wolf = seat(game, Role.WOLF, 2);
    assertFalse(RoleVisibility.canSee(game, viewer, wolf));
  }

  @Test
  void dorkyAndWolfDoNotSeeEachOtherWhileDorkyIsNotWolf() {
    Game game = game();
    GamePlayer dorky = seat(game, Role.DORKY, 1);
    GamePlayer wolf = seat(game, Role.WOLF, 2);
    assertFalse(RoleVisibility.canSee(game, dorky, wolf));
    assertFalse(RoleVisibility.canSee(game, wolf, dorky));
  }

  @Test
  void deadTargetStaysHiddenToSeer() {
    Game game = game();
    GamePlayer seer = seat(game, Role.SEER, 1);
    GamePlayer dead = seat(game, Role.WOLF, 2);
    dead.setDeathRound(1);
    dead.setDeathPhase(GamePhase.DAY);
    dead.setDiedAt(Instant.now());
    assertFalse(RoleVisibility.canSee(game, seer, dead));
  }
}
