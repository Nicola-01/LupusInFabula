package dev.busato.lupus.mappers;

import dev.busato.lupus.dto.DeckResponse;
import dev.busato.lupus.model.Deck;
import java.util.EnumMap;
import org.springframework.stereotype.Component;

@Component
public class DeckMapper {

  /** Copied into an EnumMap: the JSON lists the roles in enum order, not in the stored order. */
  public DeckResponse mapToResponse(Deck deck) {
    return new DeckResponse(
        deck.getId(), deck.getName(), deck.getPlayers(), new EnumMap<>(deck.getRoles()));
  }
}
