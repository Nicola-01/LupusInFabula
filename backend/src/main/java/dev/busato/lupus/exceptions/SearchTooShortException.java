package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 400: the player search needs at least 2 characters. */
public class SearchTooShortException extends ErrorResponseException {
  public SearchTooShortException() {
    super(HttpStatus.BAD_REQUEST, ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Search text must be at least 2 characters"), null);
  }
}
