package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 409: the master or a player is already in an unfinished game. */
public class InGameException extends ErrorResponseException {
  public InGameException(String detail) {
    super(HttpStatus.CONFLICT, ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, detail), null);
  }
}
