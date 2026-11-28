package dev.busato.lupus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Body of PUT /user/me. Every field but the password is optional: {@code null} = unchanged. */
public record UpdateProfileRequest(
    @NotBlank String currentPassword,
    @Pattern(
            regexp = SignupRequest.USERNAME,
            message = "3-20 letters, digits, - or _, not starting or ending with a symbol")
        String username,
    @Email @Size(min = 3, max = 100) String email,
    @Pattern(
            regexp = SignupRequest.PASSWORD,
            message = "8-20 characters with upper case, lower case, a digit and a symbol")
        String password) {}
