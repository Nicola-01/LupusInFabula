package dev.busato.lupus.service;

import dev.busato.lupus.dto.CreateGameRequest;
import dev.busato.lupus.dto.CreateGameResponse;
import dev.busato.lupus.dto.GameSummaryResponse;
import dev.busato.lupus.dto.SettingResponse;
import dev.busato.lupus.dto.VillageResponse;
import dev.busato.lupus.exceptions.GameNotFoundException;
import dev.busato.lupus.exceptions.InGameException;
import dev.busato.lupus.exceptions.InvalidGameException;
import dev.busato.lupus.exceptions.InvalidPlayersException;
import dev.busato.lupus.exceptions.InvalidPlayersException.PlayerProblem;
import dev.busato.lupus.exceptions.NoGamesException;
import dev.busato.lupus.mappers.GameMapper;
import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.GameSetting;
import dev.busato.lupus.model.Player;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.RoleType;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.GameRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Limit;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

  private static final int MIN_PLAYERS = 5;
  private static final int MAX_DEALS = 100;

  private final GameRepository gameRepository;
  private final GamePlayerRepository gamePlayerRepository;
  private final PlayerRepository playerRepository;
  private final GameMapper gameMapper;

  public List<SettingResponse> settings() {
    return Arrays.stream(GameSetting.values()).map(gameMapper::mapToResponse).toList();
  }

  /** Checks the rules in order, then deals the roles to the seats and saves the game. */
  @Transactional
  public CreateGameResponse create(UUID masterId, CreateGameRequest request) {
    Player master = activePlayer(masterId);
    Set<GameSetting> settings = settingsOf(request);
    boolean masterFree = settings.contains(GameSetting.MASTER_FREE);
    boolean larger = settings.contains(GameSetting.LARGER_ROLE_NUMBER);

    if (gameRepository.existsOpenGameOf(master.getId()))
      throw new InGameException("You are already in a game");
    List<Player> seated = seatPlayers(master, request.players(), masterFree);
    List<Role> hand = deal(cards(request.roles()), seated.size(), larger);

    Game game = saveGame(master, settings, request.roles(), seated, hand);
    log.info("Game created: {} by {}", game.getPublicId(), master.getUsername());
    return new CreateGameResponse(game.getPublicId());
  }

  /** The player with this id, unless the account was deleted after the login. */
  private Player activePlayer(UUID playerId) {
    return playerRepository
        .findByIdAndDeletedAtIsNull(playerId)
        .orElseThrow(() -> new InsufficientAuthenticationException("Account deleted"));
  }

  /** The settings of the request as an EnumSet; a null list means no settings. */
  private static Set<GameSetting> settingsOf(CreateGameRequest request) {
    Set<GameSetting> settings = EnumSet.noneOf(GameSetting.class);
    if (request.settings() != null) settings.addAll(request.settings());
    return settings;
  }

  /**
   * Looks up the usernames and returns the seated players in request order; throws if a name is
   * duplicated, unknown or not free, or if the table is too small.
   */
  private List<Player> seatPlayers(Player master, List<String> usernames, boolean masterFree) {
    checkNoDuplicates(usernames);

    Map<String, PlayerProblem> problems = new LinkedHashMap<>();
    List<Player> seated = new ArrayList<>();
    for (String username : usernames) {
      // shortcut: one query per player, fine for a table of ~20; batch it if games get bigger
      Optional<Player> found = playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull(username);
      if (found.isEmpty()) {
        problems.put(username, PlayerProblem.NOT_FOUND);
      } else if (found.get().getId().equals(master.getId())) {
        if (masterFree) seated.add(found.get());
        else problems.put(username, PlayerProblem.IS_MASTER);
      } else if (gameRepository.existsOpenGameOf(found.get().getId())) {
        problems.put(username, PlayerProblem.IN_GAME);
      } else {
        seated.add(found.get());
      }
    }
    if (!problems.isEmpty()) throw new InvalidPlayersException(problems);

    if (masterFree && seated.stream().noneMatch(p -> p.getId().equals(master.getId())))
      throw new InvalidGameException(
          "In master-free mode the master must be in the player list, at his seat");
    int n = seated.size();
    if (n < MIN_PLAYERS)
      throw new InvalidGameException("At least 5 players are required, got " + n);
    return seated;
  }

  /** Throws if the same username appears twice, ignoring case. */
  private static void checkNoDuplicates(List<String> usernames) {
    Set<String> names = new HashSet<>();
    for (String username : usernames) {
      if (!names.add(username.toLowerCase(Locale.ROOT)))
        throw new InvalidGameException("Duplicate player: " + username);
    }
  }

  /** Saves the game (free public id, non-zero deck) and one GamePlayer per seat. */
  private Game saveGame(
      Player master,
      Set<GameSetting> settings,
      Map<Role, Integer> roles,
      List<Player> seated,
      List<Role> hand) {
    String publicId;
    do {
      publicId = randomPublicId();
    } while (gameRepository.existsByPublicId(publicId));

    // only the non-zero counts: the deck map is what the players see
    Map<Role, Integer> deckMap = new EnumMap<>(Role.class);
    roles.forEach((role, count) -> {
      if (count > 0) deckMap.put(role, count);
    });
    Game game =
        gameRepository.save(
            Game.builder()
                .publicId(publicId)
                .master(master)
                .settings(settings)
                .deck(deckMap)
                .build());

    List<GamePlayer> seats = new ArrayList<>();
    for (int i = 0; i < seated.size(); i++) {
      seats.add(
          GamePlayer.builder()
              .game(game)
              .player(seated.get(i))
              .role(hand.get(i))
              .seat(i + 1)
              .build());
    }
    gamePlayerRepository.saveAll(seats);
    return game;
  }

  /** The most recent game of the player, as master or player. */
  @Transactional(readOnly = true)
  public GameSummaryResponse latest(UUID playerId) {
    List<Game> games = gameRepository.findLatestOf(playerId, Limit.of(1));
    if (games.isEmpty()) throw new NoGamesException();
    return gameMapper.mapToSummary(games.get(0), playerId);
  }

  @Transactional(readOnly = true)
  public VillageResponse village(UUID playerId, String publicId) {
    Game game =
        gameRepository
            .findByPublicId(publicId)
            .orElseThrow(() -> new GameNotFoundException(publicId));
    return gameMapper.mapToVillage(game, playerId);
  }

  /**
   * Shuffles the cards so that every card has the same chance: the old code picked a random role
   * name, so a role with 1 card was as likely as one with 7. With LARGER_ROLE_NUMBER the first
   * {@code n} cards of a shuffle are the hand: retried until it is balanced.
   */
  private static List<Role> deal(List<Role> deck, int seated, boolean larger) {
    if (deck.size() < seated)
      throw new InvalidGameException(
          deck.size() + " roles for " + seated + " players: at least one per player");
    if (!larger && deck.size() > seated)
      throw new InvalidGameException("More roles than players requires LARGER_ROLE_NUMBER");
    if (!larger) {
      String problem = unbalanced(deck);
      if (problem != null) throw new InvalidGameException(problem);
      Collections.shuffle(deck);
      return deck;
    }
    for (int i = 0; i < MAX_DEALS; i++) {
      Collections.shuffle(deck);
      List<Role> candidate = new ArrayList<>(deck.subList(0, seated));
      if (unbalanced(candidate) == null) return candidate;
    }
    throw new InvalidGameException("Cannot deal a balanced set of roles from this deck");
  }

  /** One element per card, e.g. {WOLF: 2} -> [WOLF, WOLF]; 400 if a role is over its maxNumber. */
  static List<Role> cards(Map<Role, Integer> roles) {
    List<Role> cards = new ArrayList<>();
    for (Map.Entry<Role, Integer> entry : roles.entrySet()) {
      Role role = entry.getKey();
      int count = entry.getValue();
      if (count > role.getMaxNumber())
        throw new InvalidGameException(
            "At most " + role.getMaxNumber() + " " + role.name() + ", got " + count);
      for (int i = 0; i < count; i++) cards.add(role);
    }
    return cards;
  }

  /** Null if the cards are balanced, else the message(s) telling what is wrong. */
  static String unbalanced(List<Role> cards) {
    int n = cards.size();
    int good = (int) cards.stream().filter(r -> r.getType() == RoleType.GOOD).count();
    int evil = (int) cards.stream().filter(r -> r.getType() == RoleType.EVIL).count();
    int minGood = (int) Math.floor(n / 2.5);
    int maxEvil = (int) Math.round(n / 3.0);
    int minEvil = Math.max((int) Math.round(n / 8.0), 1);
    StringBuilder problems = new StringBuilder();
    if (good < minGood)
      problems.append("GOOD roles must be at least ").append(minGood).append(", got ").append(good).append("; ");
    if (evil > maxEvil)
      problems.append("EVIL roles must be at most ").append(maxEvil).append(", got ").append(evil).append("; ");
    if (evil < minEvil)
      problems.append("EVIL roles must be at least ").append(minEvil).append(", got ").append(evil).append("; ");
    if (problems.isEmpty()) return null;
    return problems.substring(0, problems.length() - 2);
  }

  /** E.g. "seer-wolf-plaguespreader-0427": three role names and four random digits. */
  private static String randomPublicId() {
    ThreadLocalRandom random = ThreadLocalRandom.current();
    StringJoiner id = new StringJoiner("-");
    Role[] roles = Role.values();
    for (int i = 0; i < 3; i++) {
      id.add(roles[random.nextInt(roles.length)].name().toLowerCase(Locale.ROOT).replace("_", ""));
    }
    return id.add(String.format("%04d", random.nextInt(10000))).toString();
  }
}
