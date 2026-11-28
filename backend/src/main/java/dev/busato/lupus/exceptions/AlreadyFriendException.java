package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 409: the player is already in the friends list. */
public class AlreadyFriendException extends ErrorResponseException {
  public AlreadyFriendException(String username) {
    super(HttpStatus.CONFLICT, ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, username + " is already a friend"), null);
  }
}
