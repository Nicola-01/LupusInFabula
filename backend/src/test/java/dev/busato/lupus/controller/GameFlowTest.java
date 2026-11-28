package dev.busato.lupus.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

/** Whole stack with the real PostgreSQL; each test runs in a transaction rolled back at the end. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class GameFlowTest {

  private static final String PASSWORD = "Passw0rd!";
  private static final String[] PLAYERS = {"p-one", "p-two", "p-three", "p-four", "p-five"};
  private static final String CREATE_BODY =
      "{\"players\": [\"p-one\", \"p-two\", \"p-three\", \"p-four\", \"p-five\"], \"roles\": {\"WOLF\": 1, \"FARMER\": 4}}";

  @Autowired private MockMvc mockMvc;

  private MockHttpSession master;
  private MockHttpSession firstPlayer;

  /** Signs up and returns the session of the new user. */
  private MockHttpSession signup(String username, String email) throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/signup")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"username\": \"%s\", \"email\": \"%s\", \"password\": \"%s\"}"
                        .formatted(username, email, PASSWORD)))
            .andExpect(status().isCreated())
            .andReturn();
    return (MockHttpSession) result.getRequest().getSession(false);
  }

  /** The master and five players signed up; the master creates a game. Returns its publicId. */
  private String startGame() throws Exception {
    master = signup("master-user", "master@test.it");
    for (String name : PLAYERS) {
      MockHttpSession session = signup(name, name + "@test.it");
      if (firstPlayer == null) firstPlayer = session;
    }
    MvcResult result =
        mockMvc
            .perform(post("/game/create").with(csrf()).session(master)
                .contentType(MediaType.APPLICATION_JSON).content(CREATE_BODY))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", startsWith("/village/")))
            .andReturn();
    return result.getResponse().getHeader("Location").substring("/village/".length());
  }

  @Test
  void settingsAreListed() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(get("/game/settings").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(3)));
  }

  @Test
  void master_seesTheGameInListSessionAndVillage() throws Exception {
    String publicId = startGame();

    mockMvc
        .perform(get("/game/list").session(master))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.publicId").value(publicId))
        .andExpect(jsonPath("$.master").value(true));
    mockMvc
        .perform(get("/api/session").session(master))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gamemaster").value(publicId));
    mockMvc
        .perform(get("/api/village/" + publicId).session(master))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.publicId").value(publicId))
        .andExpect(jsonPath("$.isMaster").value(true))
        .andExpect(jsonPath("$.winner", nullValue()));
  }

  @Test
  void player_isNotTheMaster() throws Exception {
    String publicId = startGame();

    mockMvc
        .perform(get("/game/list").session(firstPlayer))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.publicId").value(publicId))
        .andExpect(jsonPath("$.master").value(false));
    mockMvc
        .perform(get("/api/village/" + publicId).session(firstPlayer))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.isMaster").value(false));
  }

  @Test
  void masterInAnotherGame_isConflict() throws Exception {
    startGame();

    mockMvc
        .perform(post("/game/create").with(csrf()).session(master)
            .contentType(MediaType.APPLICATION_JSON).content(CREATE_BODY))
        .andExpect(status().isConflict());
  }

  @Test
  void deleteAccountDuringAGame_isConflict() throws Exception {
    startGame();

    mockMvc
        .perform(delete("/user/me").with(csrf()).session(firstPlayer)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"%s\"}".formatted(PASSWORD)))
        .andExpect(status().isConflict());
  }

  @Test
  void unknownPlayer_isBadRequestWithItsProblem() throws Exception {
    startGame();
    MockHttpSession other = signup("other-master", "other@test.it");

    mockMvc
        .perform(post("/game/create").with(csrf()).session(other)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"players\": [\"ghost-user\", \"p-one\", \"p-two\", \"p-three\", \"p-four\"], \"roles\": {\"WOLF\": 1, \"FARMER\": 3}}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.players['ghost-user']").value("NOT_FOUND"))
        .andExpect(jsonPath("$.players['p-one']").value("IN_GAME"));
  }

  @Test
  void unknownGame_isNotFound() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(get("/api/village/nope").session(session))
        .andExpect(status().isNotFound());
  }
}
