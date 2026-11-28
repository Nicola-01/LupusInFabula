package dev.busato.lupus.exceptions;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** 400: some listed players cannot play. {@code players} maps each bad username (as sent) to its problem. */
public class InvalidPlayersException extends ErrorResponseException {

  public enum PlayerProblem {
    NOT_FOUND,
    IN_GAME,
    IS_MASTER
  }

  public InvalidPlayersException(Map<String, PlayerProblem> players) {
    super(HttpStatus.BAD_REQUEST, problem(players), null);
  }

  private static ProblemDetail problem(Map<String, PlayerProblem> players) {
    ProblemDetail body = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid players");
    body.setProperty("players", players);
    return body;
  }
}
