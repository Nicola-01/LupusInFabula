package dev.busato.lupus.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.busato.lupus.repository.DeckRepository;
import dev.busato.lupus.repository.PlayerRepository;
import java.util.UUID;
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
class DeckFlowTest {

  private static final String PASSWORD = "Passw0rd!";
  private static final String LUPI =
      "{\"name\": \"Lupi\", \"players\": 5, \"roles\": {\"WOLF\": 1, \"FARMER\": 4}}";

  @Autowired private MockMvc mockMvc;
  @Autowired private DeckRepository deckRepository;
  @Autowired private PlayerRepository playerRepository;

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

  /** Creates a deck with the given body and returns its id. */
  private String createDeck(MockHttpSession session, String body) throws Exception {
    MvcResult result =
        mockMvc
            .perform(post("/user/me/deck").with(csrf()).session(session)
                .contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated())
            .andReturn();
    return JsonPath.read(result.getResponse().getContentAsString(), "$.id");
  }

  @Test
  void owner_managesDecks_othersOnlyRead() throws Exception {
    MockHttpSession ann = signup("ann-user", "ann@test.it");
    MockHttpSession bea = signup("bea-user", "bea@test.it");
    String deckId = createDeck(ann, LUPI);

    mockMvc
        .perform(get("/user/me/deck").session(ann))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(deckId));
    mockMvc
        .perform(get("/user/ann-user/deck").session(bea))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Lupi"))
        .andExpect(jsonPath("$[0].roles.WOLF").value(1));

    // not the owner: 404, as if the deck did not exist
    mockMvc
        .perform(put("/user/me/deck/" + deckId).with(csrf()).session(bea)
            .contentType(MediaType.APPLICATION_JSON).content(LUPI))
        .andExpect(status().isNotFound());
    mockMvc
        .perform(delete("/user/me/deck/" + deckId).with(csrf()).session(bea))
        .andExpect(status().isNotFound());

    mockMvc
        .perform(put("/user/me/deck/" + deckId).with(csrf()).session(ann)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"Villaggio\", \"players\": 5, \"roles\": {\"WOLF\": 2, \"FARMER\": 3}}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Villaggio"))
        .andExpect(jsonPath("$.roles.WOLF").value(2));

    // same name as the renamed deck, in another case: refused
    mockMvc
        .perform(post("/user/me/deck").with(csrf()).session(ann)
            .contentType(MediaType.APPLICATION_JSON).content(LUPI.replace("Lupi", "VILLAGGIO")))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.field").value("name"));

    mockMvc
        .perform(delete("/user/me/deck/" + deckId).with(csrf()).session(ann))
        .andExpect(status().isNoContent());
  }

  @Test
  void deletingTheAccount_deletesItsDecks() throws Exception {
    MockHttpSession ann = signup("ann-user", "ann@test.it");
    MockHttpSession bea = signup("bea-user", "bea@test.it");
    createDeck(ann, LUPI);
    UUID annId = playerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull("ann-user").orElseThrow().getId();

    mockMvc
        .perform(delete("/user/me").with(csrf()).session(ann)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"%s\"}".formatted(PASSWORD)))
        .andExpect(status().isNoContent());

    assertThat(deckRepository.findByOwnerIdOrderByNameAsc(annId)).isEmpty();
    mockMvc
        .perform(get("/user/ann-user/deck").session(bea))
        .andExpect(status().isNotFound());
  }

  /**
   * "search" is reserved: it cannot be a username, so /user/search/deck always reaches the search
   * route and never a user's decks.
   */
  @Test
  void userNamedSearch_isRejectedAtSignup() throws Exception {
    mockMvc
        .perform(
            post("/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"username\": \"search\", \"email\": \"search@test.it\", \"password\": \"%s\"}"
                        .formatted(PASSWORD)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.username").exists());
  }
}
