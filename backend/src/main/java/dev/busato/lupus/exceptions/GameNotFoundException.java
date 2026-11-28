package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 404: no game with that public id. */
public class GameNotFoundException extends ErrorResponseException {
  public GameNotFoundException(String publicId) {
    super(HttpStatus.NOT_FOUND, ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Game " + publicId + " not found"), null);
  }
}
