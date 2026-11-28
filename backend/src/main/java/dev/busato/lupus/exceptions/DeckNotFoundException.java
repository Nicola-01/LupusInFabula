package dev.busato.lupus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/**
 * 404: no deck with that id for the caller. Also used when the deck belongs to someone else: a 403
 * would reveal that the id exists.
 */
public class DeckNotFoundException extends ErrorResponseException {
  public DeckNotFoundException() {
    super(HttpStatus.NOT_FOUND, ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Deck not found"), null);
  }
}
