package dev.busato.lupus.controller;

import dev.busato.lupus.dto.ConfigurationResponse;
import dev.busato.lupus.dto.CreateGameRequest;
import dev.busato.lupus.dto.CreateGameResponse;
import dev.busato.lupus.dto.GamePlayerResponse;
import dev.busato.lupus.dto.GameStatusResponse;
import dev.busato.lupus.dto.GameSummaryResponse;
import dev.busato.lupus.dto.LiveGameResponse;
import dev.busato.lupus.dto.SettingResponse;
import dev.busato.lupus.dto.VillageResponse;
import dev.busato.lupus.security.PlayerPrincipal;
import dev.busato.lupus.service.GameService;
import dev.busato.lupus.service.GameViewService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Games: settings, creation, the latest game, the village page and the read-only game views.
 * Paths are explicit (no class-level prefix).
 */
@RestController
@RequiredArgsConstructor
public class GameController {

  private final GameService gameService;
  private final GameViewService gameViewService;

  @GetMapping("/game/settings")
  public ResponseEntity<List<SettingResponse>> settings() {
    return ResponseEntity.ok(gameService.settings());
  }

  @PostMapping("/game/create")
  public ResponseEntity<CreateGameResponse> create(
      @AuthenticationPrincipal PlayerPrincipal me, @Valid @RequestBody CreateGameRequest body) {
    CreateGameResponse created = gameService.create(me.id(), body);
    return ResponseEntity.created(URI.create("/village/" + created.publicId())).body(created);
  }

  // one game, the latest: the old URL name is kept, the list of all games is not built yet
  @GetMapping("/game/list")
  public ResponseEntity<GameSummaryResponse> latest(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(gameService.latest(me.id()));
  }

  @GetMapping("/api/village/{publicId}")
  public ResponseEntity<VillageResponse> village(
      @AuthenticationPrincipal PlayerPrincipal me, @PathVariable String publicId) {
    return ResponseEntity.ok(gameService.village(me.id(), publicId));
  }

  // One URL per resource: the answer depends on who asks, so there are no /master variants as in the old API.
  @GetMapping("/game/status/{publicId}")
  public ResponseEntity<GameStatusResponse> status(@PathVariable String publicId) {
    return ResponseEntity.ok(gameViewService.status(publicId));
  }

  @GetMapping("/game/players/{publicId}")
  public ResponseEntity<List<GamePlayerResponse>> players(
      @AuthenticationPrincipal PlayerPrincipal me, @PathVariable String publicId) {
    return ResponseEntity.ok(gameViewService.players(me.id(), publicId));
  }

  @GetMapping("/game/configuration/{publicId}")
  public ResponseEntity<ConfigurationResponse> configuration(@PathVariable String publicId) {
    return ResponseEntity.ok(gameViewService.configuration(publicId));
  }

  @GetMapping("/game/live")
  public ResponseEntity<List<LiveGameResponse>> live() {
    return ResponseEntity.ok(gameViewService.live());
  }
}
