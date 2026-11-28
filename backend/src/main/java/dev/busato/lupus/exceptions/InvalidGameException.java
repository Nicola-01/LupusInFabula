package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 400: a game rule is violated; the detail says which one. */
public class InvalidGameException extends ErrorResponseException {
  public InvalidGameException(String detail) {
    super(HttpStatus.BAD_REQUEST, ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detail), null);
  }
}
