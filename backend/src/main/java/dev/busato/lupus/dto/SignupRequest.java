package dev.busato.lupus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Body of POST /signup. The repeated password is a UI check, not sent. */
public record SignupRequest(
    @NotBlank
        @Pattern(
            regexp = USERNAME,
            message = "3-20 letters, digits, - or _, not starting or ending with a symbol")
        String username,
    @NotBlank @Email @Size(max = 100) String email,
    @NotBlank
        @Pattern(
            regexp = PASSWORD,
            message = "8-20 characters with upper case, lower case, a digit and a symbol")
        String password) {

  static final String USERNAME = "^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$";
  static final String PASSWORD = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,20}$";
}
