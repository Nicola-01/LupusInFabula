package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 404: the player has never been master or player of a game. */
public class NoGamesException extends ErrorResponseException {
  public NoGamesException() {
    super(HttpStatus.NOT_FOUND, ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "You have not played any game yet"), null);
  }
}
