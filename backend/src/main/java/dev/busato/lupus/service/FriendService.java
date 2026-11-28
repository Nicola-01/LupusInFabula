package dev.busato.lupus.service;

import dev.busato.lupus.dto.FriendResponse;
import dev.busato.lupus.exceptions.AlreadyFriendException;
import dev.busato.lupus.exceptions.InvalidFriendException;
import dev.busato.lupus.exceptions.NotFriendException;
import dev.busato.lupus.exceptions.PlayerNotFoundException;
import dev.busato.lupus.model.Friendship;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.repository.FriendshipRepository;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.PlayerRepository;
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
public class FriendService {

  private final FriendshipRepository friendshipRepository;
  private final PlayerRepository playerRepository;
  private final GamePlayerRepository gamePlayerRepository;

  @Transactional(readOnly = true)
  public List<FriendResponse> list(UUID id) {
    return friendshipRepository.findFriends(id);
  }

  @Transactional
  public FriendResponse add(UUID id, String username) {
    Player me = active(id);
    Player friend =
        playerRepository
            .findByUsernameIgnoreCaseAndDeletedAtIsNull(username)
            .orElseThrow(() -> new PlayerNotFoundException(username));
    if (friend.getId().equals(me.getId())) throw new InvalidFriendException();
    if (friendshipRepository.existsByPlayerIdAndFriendId(me.getId(), friend.getId()))
      throw new AlreadyFriendException(friend.getUsername());
    Friendship saved =
        friendshipRepository.saveAndFlush(Friendship.builder().player(me).friend(friend).build());
    log.info("Friend added: {} -> {}", me.getUsername(), friend.getUsername());
    return new FriendResponse(
        friend.getUsername(),
        gamePlayerRepository.countCommonGames(me.getId(), friend.getId()),
        saved.getSince());
  }

  @Transactional
  public void remove(UUID id, String username) {
    Player me = active(id);
    Friendship friendship =
        friendshipRepository
            .findByPlayerIdAndFriendUsernameIgnoreCase(me.getId(), username)
            .orElseThrow(() -> new NotFriendException(username));
    friendshipRepository.delete(friendship);
    log.info("Friend removed: {} -> {}", me.getUsername(), friendship.getFriend().getUsername());
  }

  private Player active(UUID id) {
    return playerRepository
        .findByIdAndDeletedAtIsNull(id)
        .orElseThrow(() -> new InsufficientAuthenticationException("Account deleted"));
  }
}
