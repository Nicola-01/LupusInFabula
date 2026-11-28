package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 403 (not 401: the user is logged in, a 401 would look like an expired session). */
public class WrongPasswordException extends ErrorResponseException {
  public WrongPasswordException() {
    super(HttpStatus.FORBIDDEN, ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Wrong password"), null);
  }
}
