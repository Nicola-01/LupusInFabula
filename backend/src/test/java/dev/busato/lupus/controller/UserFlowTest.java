package dev.busato.lupus.controller;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
class UserFlowTest {

  private static final String PASSWORD = "Passw0rd!";

  @Autowired private MockMvc mockMvc;

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

  private int login(String user, String password) throws Exception {
    return mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"%s\", \"password\": \"%s\", \"keepLogged\": false}".formatted(user, password)))
        .andReturn()
        .getResponse()
        .getStatus();
  }

  @Test
  void meReturnsTheOwnEmail() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(get("/user/me").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("wolf-user"))
        .andExpect(jsonPath("$.email").value("wolf@test.it"));
  }

  @Test
  void publicProfileHasNoEmail_andTheStoredSpelling() throws Exception {
    MockHttpSession session = signup("other-user", "other@test.it");
    signup("Wolf-User", "wolf@test.it");

    mockMvc
        .perform(get("/user/wolf-user").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("Wolf-User"))
        .andExpect(jsonPath("$.email").doesNotExist());
  }

  @Test
  void unknownProfile_isNotFound() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(get("/user/nobody").session(session))
        .andExpect(status().isNotFound());
  }

  @Test
  void usernameChange_keepsTheSessionWithTheNewName() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(put("/user/me").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"%s\", \"username\": \"new-wolf\"}".formatted(PASSWORD)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("new-wolf"));

    mockMvc
        .perform(get("/api/session").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.username").value("new-wolf"));
  }

  @Test
  void updateWithWrongCurrentPassword_isForbidden() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(put("/user/me").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"Wrong0pass!\", \"username\": \"new-wolf\"}"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.detail").value("Wrong password"));
  }

  @Test
  void passwordChange_invalidatesTheOldPassword() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(put("/user/me").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"%s\", \"password\": \"N3wPassw0rd!\"}".formatted(PASSWORD)))
        .andExpect(status().isOk());

    assertThat(login("wolf-user", PASSWORD)).isEqualTo(401);
    assertThat(login("wolf-user", "N3wPassw0rd!")).isEqualTo(204);
  }

  @Test
  void deleteAccount_freesTheEmailButNotTheUsername() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(delete("/user/me").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"currentPassword\": \"%s\"}".formatted(PASSWORD)))
        .andExpect(status().isNoContent());

    assertThat(login("wolf@test.it", PASSWORD)).isEqualTo(401);
    mockMvc
        .perform(post("/signup").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"other-user\", \"email\": \"wolf@test.it\", \"password\": \"%s\"}".formatted(PASSWORD)))
        .andExpect(status().isCreated());
    mockMvc
        .perform(post("/signup").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"wolf-user\", \"email\": \"third@test.it\", \"password\": \"%s\"}".formatted(PASSWORD)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.field").value("username"));
  }

  @Test
  void friends_addListRemove() throws Exception {
    MockHttpSession session = signup("wolf-user", "wolf@test.it");
    signup("bea-user", "bea@test.it");

    mockMvc
        .perform(post("/user/me/friend").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"bea-user\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.username").value("bea-user"))
        .andExpect(jsonPath("$.commonGames").value(0))
        .andExpect(jsonPath("$.since").exists());
    mockMvc
        .perform(post("/user/me/friend").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"bea-user\"}"))
        .andExpect(status().isConflict());
    mockMvc
        .perform(post("/user/me/friend").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"wolf-user\"}"))
        .andExpect(status().isBadRequest());
    mockMvc
        .perform(get("/user/me/friend").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].username").value("bea-user"));
    mockMvc
        .perform(delete("/user/me/friend").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"bea-user\"}"))
        .andExpect(status().isNoContent());
    mockMvc
        .perform(delete("/user/me/friend").with(csrf()).session(session).contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\": \"bea-user\"}"))
        .andExpect(status().isNotFound());
  }

  @Test
  void search_findsOthersNotYourself_andNeedsTwoCharacters() throws Exception {
    MockHttpSession session = signup("ab-me", "me@test.it");
    signup("xab-friend", "friend@test.it");

    mockMvc
        .perform(get("/user/search/ab").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[*].username", hasItem("xab-friend")))
        .andExpect(jsonPath("$[*].username", not(hasItem("ab-me"))));
    mockMvc
        .perform(get("/user/search/a").session(session))
        .andExpect(status().isBadRequest());
  }

  @Test
  void oldHabitantEndpoint_isNoLongerProtected() throws Exception {
    mockMvc.perform(get("/api/habitant/wolf-user")).andExpect(status().isNotFound());
  }
}
