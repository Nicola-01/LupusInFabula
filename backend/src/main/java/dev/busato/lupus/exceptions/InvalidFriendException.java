package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 400: a player cannot be his own friend. */
public class InvalidFriendException extends ErrorResponseException {
  public InvalidFriendException() {
    super(HttpStatus.BAD_REQUEST, ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "You cannot add yourself as a friend"), null);
  }
}
