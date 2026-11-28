package dev.busato.lupus.service;

import dev.busato.lupus.dto.DeckRequest;
import dev.busato.lupus.dto.DeckResponse;
import dev.busato.lupus.exceptions.AlreadyUsedException;
import dev.busato.lupus.exceptions.DeckNotFoundException;
import dev.busato.lupus.exceptions.InvalidGameException;
import dev.busato.lupus.exceptions.PlayerNotFoundException;
import dev.busato.lupus.mappers.DeckMapper;
import dev.busato.lupus.model.Deck;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.repository.DeckRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.EnumMap;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeckService {

  private final DeckRepository deckRepository;
  private final PlayerRepository playerRepository;
  private final DeckMapper deckMapper;

  @Transactional(readOnly = true)
  public List<DeckResponse> mine(UUID id) {
    return deckRepository.findByOwnerIdOrderByNameAsc(id).stream().map(deckMapper::mapToResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<DeckResponse> of(String username) {
    Player owner =
        playerRepository
            .findByUsernameIgnoreCaseAndDeletedAtIsNull(username)
            .orElseThrow(() -> new PlayerNotFoundException(username));
    return deckRepository.findByOwnerIdOrderByNameAsc(owner.getId()).stream().map(deckMapper::mapToResponse).toList();
  }

  @Transactional
  public DeckResponse create(UUID id, DeckRequest request) {
    Player owner = active(id);
    validate(request);
    if (deckRepository.existsByOwnerIdAndNameIgnoreCase(id, request.name()))
      throw new AlreadyUsedException("name");
    Deck deck =
        deckRepository.save(
            Deck.builder()
                .owner(owner)
                .name(request.name())
                .players(request.players())
                .roles(new EnumMap<>(request.roles()))
                .build());
    log.info("Deck created: {} by {}", deck.getName(), owner.getUsername());
    return deckMapper.mapToResponse(deck);
  }

  /** Dirty checking saves the changes at the end of the transaction: no explicit save. */
  @Transactional
  public DeckResponse update(UUID id, UUID deckId, DeckRequest request) {
    Deck deck = deckRepository.findByIdAndOwnerId(deckId, id).orElseThrow(DeckNotFoundException::new);
    validate(request);
    if (deckRepository.existsByOwnerIdAndNameIgnoreCaseAndIdNot(id, request.name(), deckId))
      throw new AlreadyUsedException("name");
    deck.setName(request.name());
    deck.setPlayers(request.players());
    deck.setRoles(new EnumMap<>(request.roles()));
    log.info("Deck updated: {}", deck.getName());
    return deckMapper.mapToResponse(deck);
  }

  @Transactional
  public void delete(UUID id, UUID deckId) {
    Deck deck = deckRepository.findByIdAndOwnerId(deckId, id).orElseThrow(DeckNotFoundException::new);
    deckRepository.delete(deck);
    log.info("Deck deleted: {}", deck.getName());
  }

  /** Same card rules as a game, but the balance is checked only when the deck is exactly the hand. */
  private void validate(DeckRequest request) {
    List<Role> cards = GameService.cards(request.roles());
    if (cards.size() < request.players())
      throw new InvalidGameException(
          cards.size() + " cards for " + request.players() + " players: at least one per player");
    // More cards than players: the hand is dealt, and balanced, when a game is created
    if (cards.size() == request.players()) {
      String problem = GameService.unbalanced(cards);
      if (problem != null) throw new InvalidGameException(problem);
    }
  }

  private Player active(UUID id) {
    return playerRepository
        .findByIdAndDeletedAtIsNull(id)
        .orElseThrow(() -> new InsufficientAuthenticationException("Account deleted"));
  }
}
