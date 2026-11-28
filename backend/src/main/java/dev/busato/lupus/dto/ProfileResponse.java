package dev.busato.lupus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;

/**
 * GET /user/me has the email; GET /user/{username} (someone else) does not: the email is null and
 * left out of the JSON.
 */
public record ProfileResponse(
    String username,
    @JsonInclude(JsonInclude.Include.NON_NULL) String email,
    LocalDate registeredOn) {}
