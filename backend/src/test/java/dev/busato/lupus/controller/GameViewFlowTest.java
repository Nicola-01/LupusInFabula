package dev.busato.lupus.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.busato.lupus.model.Game;
import dev.busato.lupus.model.GamePlayer;
import dev.busato.lupus.model.Role;
import dev.busato.lupus.model.WinFaction;
import dev.busato.lupus.repository.GamePlayerRepository;
import dev.busato.lupus.repository.GameRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read-only game views over the whole stack. Two open games: A (master-a, not in the list) and B
 * (MASTER_FREE, master-b in the list); the spectator is in no game. Each test runs in a transaction
 * rolled back at the end.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class GameViewFlowTest {

  private static final String PASSWORD = "Passw0rd!";
  private static final String[] TABLE_A = {"a-one", "a-two", "a-three", "a-four", "a-five", "a-six"};
  private static final String[] TABLE_B = {"b-one", "b-two", "b-three", "b-four", "b-five"};
  private static final String ROLES = "\"roles\": {\"WOLF\": 2, \"SEER\": 1, \"FARMER\": 3}";
  // one wolf and no power roles: the master, a plain player here, sees nobody else
  private static final String CREATE_A =
      "{\"players\": [\"a-one\", \"a-two\", \"a-three\", \"a-four\", \"a-five\", \"a-six\"], " + ROLES + "}";
  private static final String CREATE_B =
      "{\"players\": [\"master-b\", \"b-one\", \"b-two\", \"b-three\", \"b-four\", \"b-five\"], "
          + "\"roles\": {\"WOLF\": 1, \"FARMER\": 5}, \"settings\": [\"MASTER_FREE\"]}";

  @Autowired private MockMvc mockMvc;
  @Autowired private GameRepository gameRepository;
  @Autowired private GamePlayerRepository gamePlayerRepository;
  @Autowired private EntityManager entityManager;

  private final Map<String, MockHttpSession> sessions = new HashMap<>();
  private String gameA;
  private String gameB;

  @BeforeEach
  void setUp() throws Exception {
    signup("master-a");
    for (String name : TABLE_A) signup(name);
    signup("master-b");
    for (String name : TABLE_B) signup(name);
    signup("spectator");
    gameA = create("master-a", CREATE_A);
    gameB = create("master-b", CREATE_B);
    // as in production: the following reads come from the database, not from this persistence context
    gameRepository.flush();
    entityManager.clear();
  }

  private void signup(String username) throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/signup")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\": \"%s\", \"email\": \"%s@test.it\", \"password\": \"%s\"}"
                        .formatted(username, username, PASSWORD)))
            .andExpect(status().isCreated())
            .andReturn();
    sessions.put(username, (MockHttpSession) result.getRequest().getSession(false));
  }

  /** Creates the game as {@code master}; returns its publicId. */
  private String create(String master, String body) throws Exception {
    MvcResult result =
        mockMvc
            .perform(post("/game/create").with(csrf()).session(sessions.get(master))
                .contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated())
            .andReturn();
    return result.getResponse().getHeader("Location").substring("/village/".length());
  }

  /** The seats of the game, read from the database (same transaction as the test). */
  private List<GamePlayer> seats(String publicId) {
    Game game = gameRepository.findByPublicId(publicId).orElseThrow();
    return gamePlayerRepository.findSeats(game);
  }

  /** Username of the first seat holding this role. */
  private String userWithRole(String publicId, Role role) {
    return seats(publicId).stream()
        .filter(seat -> seat.getRole() == role)
        .findFirst()
        .orElseThrow()
        .getPlayer()
        .getUsername();
  }

  @Test
  void status_isThePublicStateOfTheGame() throws Exception {
    mockMvc
        .perform(get("/game/status/" + gameA).session(sessions.get("spectator")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.publicId").value(gameA))
        .andExpect(jsonPath("$.master").value("master-a"))
        .andExpect(jsonPath("$.round").value(1))
        .andExpect(jsonPath("$.phase").value("NIGHT"))
        .andExpect(jsonPath("$.winner", nullValue()));
  }

  @Test
  void status_unknownGame_isNotFound() throws Exception {
    mockMvc
        .perform(get("/game/status/nope").session(sessions.get("spectator")))
        .andExpect(status().isNotFound());
  }

  @Test
  void configuration_returnsTheDeck() throws Exception {
    mockMvc
        .perform(get("/game/configuration/" + gameA).session(sessions.get("spectator")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.deck.WOLF").value(2))
        .andExpect(jsonPath("$.deck.SEER").value(1))
        .andExpect(jsonPath("$.deck.FARMER").value(3));
  }

  @Test
  void players_asMaster_seesEveryRole() throws Exception {
    mockMvc
        .perform(get("/game/players/" + gameA).session(sessions.get("master-a")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(6)))
        .andExpect(jsonPath("$[*].role", everyItem(notNullValue())));
  }

  @Test
  void players_asSpectator_seesSeatsButNoRoles() throws Exception {
    mockMvc
        .perform(get("/game/players/" + gameA).session(sessions.get("spectator")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(6)))
        .andExpect(jsonPath("$[*].username", contains(TABLE_A)))
        .andExpect(jsonPath("$[*].seat", contains(1, 2, 3, 4, 5, 6)))
        .andExpect(jsonPath("$[*].dead", everyItem(is(false))))
        .andExpect(jsonPath("$[*].role", everyItem(nullValue())));
  }

  @Test
  void players_asWolf_seesThePackButNotTheSeer() throws Exception {
    String wolf = userWithRole(gameA, Role.WOLF);
    String otherWolf =
        seats(gameA).stream()
            .filter(seat -> seat.getRole() == Role.WOLF && !seat.getPlayer().getUsername().equals(wolf))
            .findFirst()
            .orElseThrow()
            .getPlayer()
            .getUsername();
    String seer = userWithRole(gameA, Role.SEER);

    mockMvc
        .perform(get("/game/players/" + gameA).session(sessions.get(wolf)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.username=='%s')].role".formatted(wolf), hasItem("WOLF")))
        .andExpect(jsonPath("$[?(@.username=='%s')].role".formatted(otherWolf), hasItem("WOLF")))
        .andExpect(jsonPath("$[?(@.username=='%s')].role".formatted(seer), hasItem(nullValue())));
  }

  @Test
  void players_masterFree_masterInTheListSeesOnlyHisOwnRole() throws Exception {
    mockMvc
        .perform(get("/game/players/" + gameB).session(sessions.get("master-b")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.username=='master-b')].role", hasItem(notNullValue())))
        .andExpect(jsonPath("$[?(@.username!='master-b')].role", hasSize(5)))
        .andExpect(jsonPath("$[?(@.username!='master-b')].role", everyItem(nullValue())));
  }

  @Test
  void live_listsOpenGames_andDropsTheEndedOne() throws Exception {
    mockMvc
        .perform(get("/game/live").session(sessions.get("spectator")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.publicId=='%s')].master".formatted(gameA), hasItem("master-a")))
        .andExpect(jsonPath("$[?(@.publicId=='%s')].players".formatted(gameA), hasItem(6)))
        .andExpect(jsonPath("$[?(@.publicId=='%s')].settings".formatted(gameA), hasItem(empty())))
        .andExpect(jsonPath("$[?(@.publicId=='%s')].players".formatted(gameB), hasItem(6)))
        .andExpect(jsonPath("$[?(@.publicId=='%s')].settings".formatted(gameB),
            hasItem(contains("MASTER_FREE"))))
        .andExpect(jsonPath("$[*].publicId", hasItem(gameA)))
        .andExpect(jsonPath("$[*].publicId", hasItem(gameB)));

    Game ended = gameRepository.findByPublicId(gameB).orElseThrow();
    ended.setEndedAt(Instant.now());
    ended.setWinner(WinFaction.FARMERS);
    gameRepository.flush();

    mockMvc
        .perform(get("/game/live").session(sessions.get("spectator")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[*].publicId", hasItem(gameA)))
        .andExpect(jsonPath("$[*].publicId", not(hasItem(gameB))));
  }
}
