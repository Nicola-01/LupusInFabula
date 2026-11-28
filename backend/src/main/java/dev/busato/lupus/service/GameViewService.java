package dev.busato.lupus.service;

import dev.busato.lupus.dto.ConfigurationResponse;
import dev.busato.lupus.dto.GamePlayerResponse;
import dev.busato.lupus.dto.GameStatusResponse;
import dev.busato.lupus.dto.LiveGameResponse;
import dev.busato.lupus.exceptions.GameNotFoundException;
import dev.busato.lupus.mappers.GameMapper;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.GameRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Read-only views of a game: what any logged user can ask about a game, roles filtered per viewer. */
@Service
@RequiredArgsConstructor
public class GameViewService {

  private static final int MAX_LIVE = 50;

  private final GameRepository gameRepository;
  private final GamePlayerRepository gamePlayerRepository;
  private final GameMapper gameMapper;

  @Transactional(readOnly = true)
  public GameStatusResponse status(String publicId) {
    return gameMapper.mapToStatus(game(publicId));
  }

  /** The seats in order; each role is shown only if {@link RoleVisibility#canSee} allows the viewer. */
  @Transactional(readOnly = true)
  public List<GamePlayerResponse> players(UUID viewerId, String publicId) {
    Game game = game(publicId);
    List<GamePlayer> seats = gamePlayerRepository.findSeats(game);
    GamePlayer viewer =
        seats.stream().filter(seat -> seat.getPlayer().getId().equals(viewerId)).findFirst().orElse(null);
    boolean all = RoleVisibility.seesAll(game, viewerId);
    return seats.stream()
        .map(seat -> gameMapper.mapToPlayer(seat, all || RoleVisibility.canSee(game, viewer, seat)))
        .toList();
  }

  @Transactional(readOnly = true)
  public ConfigurationResponse configuration(String publicId) {
    return gameMapper.mapToConfiguration(game(publicId));
  }

  /** The games not ended yet, newest first, at most {@value #MAX_LIVE}. */
  @Transactional(readOnly = true)
  public List<LiveGameResponse> live() {
    return gameRepository.findLive(Limit.of(MAX_LIVE)).stream().map(gameMapper::mapToLive).toList();
  }

  private Game game(String publicId) {
    return gameRepository
        .findByPublicId(publicId)
        .orElseThrow(() -> new GameNotFoundException(publicId));
  }
}
