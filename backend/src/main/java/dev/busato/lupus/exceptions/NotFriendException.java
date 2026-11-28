package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 404: the player is not in the friends list. */
public class NotFriendException extends ErrorResponseException {
  public NotFriendException(String username) {
    super(HttpStatus.NOT_FOUND, ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, username + " is not a friend"), null);
  }
}
