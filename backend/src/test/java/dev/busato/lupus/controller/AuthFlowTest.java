package dev.busato.lupus.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/** Whole stack with the real PostgreSQL; each test runs in a transaction rolled back at the end. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ExtendWith(OutputCaptureExtension.class)
class AuthFlowTest {

  private static final String SIGNUP_JSON =
      """
      {"username": "wolf-user", "email": "wolf@test.it", "password": "Passw0rd!"}
      """;

  @Autowired private MockMvc mockMvc;

  private MvcResult signup(String username, String email) throws Exception {
    return mockMvc
        .perform(
            post("/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"username\": \"%s\", \"email\": \"%s\", \"password\": \"Passw0rd!\"}"
                        .formatted(username, email)))
        .andExpect(status().isCreated())
        .andReturn();
  }

  @Test
  void sessionWithoutLogin_isUnauthorizedProblem() throws Exception {
    mockMvc
        .perform(get("/api/session"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.detail").value("Authentication required"));
  }

  @Test
  void signupStartsASession_andSessionReturnsTheUser() throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/signup")
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(SIGNUP_JSON))
            .andExpect(status().isCreated())
            .andReturn();
    MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);

    mockMvc
        .perform(get("/api/session").session(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.username").value("wolf-user"))
        .andExpect(jsonPath("$.gamemaster").value(nullValue()));
  }

  @Test
  void signupWithoutCsrf_isForbiddenProblem() throws Exception {
    mockMvc
        .perform(post("/signup").contentType(MediaType.APPLICATION_JSON).content(SIGNUP_JSON))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.detail").value("Invalid or missing CSRF token"));
  }

  @Test
  void signupWithInvalidUsername_isBadRequestWithFieldErrors() throws Exception {
    mockMvc
        .perform(
            post("/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"username\": \"-x\", \"email\": \"wolf@test.it\", \"password\": \"Passw0rd!\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.username").exists());
  }

  @Test
  void signupWithReservedUsernameSearch_isBadRequest_evenInOtherCase() throws Exception {
    mockMvc
        .perform(
            post("/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"username\": \"Search\", \"email\": \"search@test.it\", \"password\": \"Passw0rd!\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.username").exists());
  }

  @Test
  void signupWithUsedUsername_isConflictOnUsername() throws Exception {
    signup("wolf-user", "first@test.it");

    mockMvc
        .perform(
            post("/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"username\": \"wolf-user\", \"email\": \"second@test.it\", \"password\": \"Passw0rd!\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.field").value("username"));
  }

  @Test
  void loginWithWrongPassword_orUnknownUser_isWrongCredentials() throws Exception {
    signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"wolf-user\", \"password\": \"Wrong0pass!\", \"keepLogged\": false}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.detail").value("Wrong credentials"));
    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"nobody\", \"password\": \"Passw0rd!\", \"keepLogged\": false}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.detail").value("Wrong credentials"));
  }

  @Test
  void loginByEmailWithKeepLogged_setsRememberMeCookieFor30Days() throws Exception {
    signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"wolf@test.it\", \"password\": \"Passw0rd!\", \"keepLogged\": true}"))
        .andExpect(status().isNoContent())
        .andExpect(cookie().exists("remember-me"))
        .andExpect(cookie().maxAge("remember-me", 30 * 24 * 60 * 60));
  }

  @Test
  void emailLoginIgnoresCaseOfTheEmail() throws Exception {
    signup("wolf-user", "Wolf@Test.IT");

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"WOLF@TEST.IT\", \"password\": \"Passw0rd!\", \"keepLogged\": false}"))
        .andExpect(status().isNoContent());
  }

  @Test
  void loginWithoutKeepLogged_hasNoRememberMeCookie() throws Exception {
    signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"wolf@test.it\", \"password\": \"Passw0rd!\", \"keepLogged\": false}"))
        .andExpect(status().isNoContent())
        .andExpect(cookie().doesNotExist("remember-me"));
  }

  @Test
  void rememberMeCookieAloneRestoresTheSession() throws Exception {
    signup("wolf-user", "wolf@test.it");
    MvcResult login =
        mockMvc
            .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"user\": \"wolf@test.it\", \"password\": \"Passw0rd!\", \"keepLogged\": true}"))
            .andExpect(status().isNoContent())
            .andReturn();
    Cookie rememberMe = login.getResponse().getCookie("remember-me");

    mockMvc
        .perform(get("/api/session").cookie(rememberMe))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.username").value("wolf-user"));
  }

  @Test
  void logoutEndsTheSession() throws Exception {
    MvcResult result = signup("wolf-user", "wolf@test.it");
    MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);

    mockMvc
        .perform(post("/logout").with(csrf()).session(session))
        .andExpect(status().isNoContent());
    mockMvc
        .perform(get("/api/session").session(session))
        .andExpect(status().isUnauthorized());
  }

  /** Number of times {@code text} appears in the console output captured so far. */
  private static int countOf(CapturedOutput output, String text) {
    return StringUtils.countOccurrencesOf(output.toString(), text);
  }

  @Test
  void signupIsLogged_withTheClientIpInTheSameLine(CapturedOutput output) throws Exception {
    signup("wolf-user", "wolf@test.it");

    String line =
        output.toString().lines().filter(l -> l.contains("Signup: wolf-user")).findFirst().orElseThrow();
    assertThat(line).contains("[anonymous 127.0.0.1]");
  }

  @Test
  void loginIsLoggedOnce(CapturedOutput output) throws Exception {
    signup("wolf-user", "wolf@test.it");
    int beforeLogin = countOf(output, "Login ok: wolf-user"); // the signup starts a session too

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"wolf@test.it\", \"password\": \"Passw0rd!\", \"keepLogged\": false}"))
        .andExpect(status().isNoContent());

    assertThat(countOf(output, "Login ok: wolf-user") - beforeLogin).isEqualTo(1);
  }

  @Test
  void wrongPasswordIsLoggedWithoutThePassword(CapturedOutput output) throws Exception {
    signup("wolf-user", "wolf@test.it");

    mockMvc
        .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"user\": \"wolf-user\", \"password\": \"Wrong0pass!\", \"keepLogged\": false}"))
        .andExpect(status().isUnauthorized());

    assertThat(output.toString()).contains("Login failed: wolf-user (BadCredentialsException)");
    assertThat(output.toString()).doesNotContain("Wrong0pass!");
  }

  @Test
  void logoutIsLogged_andNoPasswordEverReachesTheLog(CapturedOutput output) throws Exception {
    MvcResult result = signup("wolf-user", "wolf@test.it");
    MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);

    mockMvc
        .perform(post("/logout").with(csrf()).session(session))
        .andExpect(status().isNoContent());

    assertThat(output.toString()).contains("Logout: wolf-user");
    assertThat(output.toString()).doesNotContain("Passw0rd!");
  }

  @Test
  void rememberMeLoginIsLoggedOnce(CapturedOutput output) throws Exception {
    signup("wolf-user", "wolf@test.it");
    MvcResult login =
        mockMvc
            .perform(post("/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"user\": \"wolf@test.it\", \"password\": \"Passw0rd!\", \"keepLogged\": true}"))
            .andExpect(status().isNoContent())
            .andReturn();
    Cookie rememberMe = login.getResponse().getCookie("remember-me");

    mockMvc.perform(get("/api/session").cookie(rememberMe)).andExpect(status().isOk());

    assertThat(countOf(output, "Login ok via remember-me: wolf-user")).isEqualTo(1);
  }

  @Test
  void rulesStayPublic() throws Exception {
    mockMvc.perform(get("/api/rules/roles")).andExpect(status().isOk());
  }
}
