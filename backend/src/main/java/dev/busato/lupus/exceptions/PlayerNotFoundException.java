package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 404: no active player with that username. */
public class PlayerNotFoundException extends ErrorResponseException {
  public PlayerNotFoundException(String username) {
    super(HttpStatus.NOT_FOUND, ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Player " + username + " not found"), null);
  }
}
