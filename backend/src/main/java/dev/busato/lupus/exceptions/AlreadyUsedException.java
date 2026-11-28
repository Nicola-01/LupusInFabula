package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 409: a unique value (username, email) is already taken. */
public class AlreadyUsedException extends ErrorResponseException {
  public AlreadyUsedException(String field) {
    super(HttpStatus.CONFLICT, problem(field), null);
  }

  private static ProblemDetail problem(String field) {
    ProblemDetail body = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
        Character.toUpperCase(field.charAt(0)) + field.substring(1) + " already used");
    body.setProperty("field", field);
    return body;
  }
}
