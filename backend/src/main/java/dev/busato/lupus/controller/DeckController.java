package dev.busato.lupus.controller;

import dev.busato.lupus.dto.DeckRequest;
import dev.busato.lupus.dto.DeckResponse;
import dev.busato.lupus.security.PlayerPrincipal;
import dev.busato.lupus.service.DeckService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Saved decks: own decks are edited by the owner only, other users' decks are public to read. */
@RestController
@RequiredArgsConstructor
public class DeckController {

  private final DeckService deckService;

  @GetMapping("/user/me/deck")
  public ResponseEntity<List<DeckResponse>> mine(@AuthenticationPrincipal PlayerPrincipal me) {
    return ResponseEntity.ok(deckService.mine(me.id()));
  }

  @PostMapping("/user/me/deck")
  public ResponseEntity<DeckResponse> create(
      @AuthenticationPrincipal PlayerPrincipal me, @Valid @RequestBody DeckRequest body) {
    return ResponseEntity.status(HttpStatus.CREATED).body(deckService.create(me.id(), body));
  }

  @PutMapping("/user/me/deck/{deckId}")
  public ResponseEntity<DeckResponse> update(
      @AuthenticationPrincipal PlayerPrincipal me,
      @PathVariable UUID deckId,
      @Valid @RequestBody DeckRequest body) {
    return ResponseEntity.ok(deckService.update(me.id(), deckId, body));
  }

  @DeleteMapping("/user/me/deck/{deckId}")
  public ResponseEntity<Void> delete(
      @AuthenticationPrincipal PlayerPrincipal me, @PathVariable UUID deckId) {
    deckService.delete(me.id(), deckId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/user/{username}/deck")
  public ResponseEntity<List<DeckResponse>> of(@PathVariable String username) {
    return ResponseEntity.ok(deckService.of(username));
  }
}
