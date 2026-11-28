package dev.busato.lupus.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Standalone MockMvc: only a fake controller + the handler, no Spring context, no database.
 */
class GlobalExceptionHandlerTest {

  /** Same shape as our domain exceptions will have. */
  static class ThingNotFoundException extends ErrorResponseException {
    ThingNotFoundException(String name) {
      super(
          HttpStatus.NOT_FOUND,
          ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Thing '" + name + "' not found"),
          null);
    }
  }

  record ThingRequest(@NotBlank String name, @Size(max = 3) String code) {}

  @RestController
  static class FakeController {
    @GetMapping("/not-found")
    void notFound() {
      throw new ThingNotFoundException("wolf");
    }

    @GetMapping("/bug")
    void bug() {
      throw new IllegalStateException("secret internal detail");
    }

    @PostMapping("/things")
    void create(@Valid @RequestBody ThingRequest request) {}
  }

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc =
        MockMvcBuilders.standaloneSetup(new FakeController())
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
  }

  @Test
  void domainException_becomesProblemDetailWithItsStatus() throws Exception {
    mockMvc
        .perform(get("/not-found"))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.title").value("Not Found"))
        .andExpect(jsonPath("$.detail").value("Thing 'wolf' not found"));
  }

  @Test
  void validationError_listsTheInvalidFields() throws Exception {
    mockMvc
        .perform(
            post("/things")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"\", \"code\": \"toolong\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.detail").value("Invalid request content"))
        .andExpect(jsonPath("$.errors.name").exists())
        .andExpect(jsonPath("$.errors.code").exists());
  }

  @Test
  void malformedJson_isBadRequest() throws Exception {
    mockMvc
        .perform(post("/things").contentType(MediaType.APPLICATION_JSON).content("{not json"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400));
  }

  @Test
  void unexpectedException_isGeneric500WithoutInternals() throws Exception {
    mockMvc
        .perform(get("/bug"))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.detail").value("Unexpected server error"));
  }

  @Test
  void wrongMethod_is405() throws Exception {
    mockMvc.perform(post("/bug")).andExpect(status().isMethodNotAllowed());
  }
}
