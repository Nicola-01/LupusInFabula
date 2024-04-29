package it.unipd.dei.webapp.lupus.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 * Enumeration representing error codes and their associated error messages and HTTP status codes.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public enum ErrorCode {
    // errorCode -> E + <acronym> + <progressive number>
    // USR -> USER
    // GME -> GAME
    // FRN -> FRIEND
    // JSN -> JSON
    // SES -> SESSION
    // DSP -> DISPATCHER
    // DTB -> DATABASE
    // INT -> INTERNAL
    // ACT -> ACTION

    // Login or edit credentials
    EMPTY_INPUT_FIELDS("EUSR1", HttpServletResponse.SC_BAD_REQUEST, "One or more input fields are empty."),
    INVALID_USERNAME_FORMAT("EUSR2", HttpServletResponse.SC_BAD_REQUEST, "Invalid username format."),
    INVALID_EMAIL_FORMAT("EUSR3", HttpServletResponse.SC_BAD_REQUEST, "Invalid email format."),
    INVALID_PASSWORD_FORMAT("EUSR4", HttpServletResponse.SC_BAD_REQUEST, "Invalid password format."),
    PASSWORD_NOT_MATCH("EUSR5", HttpServletResponse.SC_BAD_REQUEST, "Passwords do not match."),
    USERNAME_ALREADY_USED("EUSR6", HttpServletResponse.SC_CONFLICT, "Username already used"),
    EMAIL_ALREADY_USED("EUSR7", HttpServletResponse.SC_CONFLICT, "Email already used"),
    WRONG_CREDENTIALS("EUSR8", HttpServletResponse.SC_BAD_REQUEST, "Submitted credentials are wrong"),

    //user
    USER_NOT_FOUND("EUSR9", HttpServletResponse.SC_NOT_FOUND, "User not found"),

    // game
    PLAYER_NOT_EXIST("EGME1", HttpServletResponse.SC_NOT_FOUND, "One or more players does not exist."),
    PLAYER_ALREADY_IN_GAME("EGME2", HttpServletResponse.SC_CONFLICT, "One or more players are already in a game."),
    MASTER_ALREADY_IN_GAME("EGME3", HttpServletResponse.SC_CONFLICT, "The gamemaster is already in a game."),
    ROLE_NOT_EXIST("EGME4", HttpServletResponse.SC_NOT_FOUND, "One or more roles does not exist."),
    NUMBER_PLAYERS_ROLES_NOT_MATCH("EGME5", HttpServletResponse.SC_BAD_REQUEST, "Number of players entered does not correspond to the number of roles."),
    NOT_ENOUGH_PLAYERS("EGME6", HttpServletResponse.SC_BAD_REQUEST, "Not enough players."),
    INVALID_GAME_SETTINGS("EGME7", HttpServletResponse.SC_BAD_REQUEST, "The parameter does not exist."),
    INVALID_ROLES_CARDINALITY("EGME8", HttpServletResponse.SC_BAD_REQUEST, "Invalid role max cardinality."),

    GAME_NOT_FOUND("EGME9", HttpServletResponse.SC_NOT_FOUND, "Game not found."),
    GAME_IS_OVER("EGME10", HttpServletResponse.SC_CONFLICT, "Game is over."),

    // friend
    FRIEND_ALREADY_EXIST("EFRN1", HttpServletResponse.SC_CONFLICT, "The friend is already in the list"),
    FRIEND_NOT_EXIST("EFRN2", HttpServletResponse.SC_BAD_REQUEST, "The friend is not in the list"),

    //game logs
    LOGS_NOT_EXIST("EGLN1", HttpServletResponse.SC_NOT_FOUND, "Logs not found."),

    // invalid data
    INVALID_JSON_FORMAT("EJSN1", HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON."),

    // session
    //    INVALID_SESSION(-200, HttpServletResponse.SC_BAD_REQUEST, "Invalid session"),
    NOT_LOGGED("ESES1", HttpServletResponse.SC_FORBIDDEN, "Account not logged in."),
    NOT_MASTER("ESES2", HttpServletResponse.SC_FORBIDDEN, "The account is not a gamemaster."),
    NO_GAME_SESSION("ESES3", HttpServletResponse.SC_NOT_FOUND, "The game doesn't exist."),
    DIFFERENT_GAME_SESSION("ESES4", HttpServletResponse.SC_CONFLICT, "The player isn't the gamemaster of this game."),

    // dispatcher
    UNKNOWN_RESOURCE("EDSP1", HttpServletResponse.SC_NOT_FOUND, "Unknown resource requested."),
    METHOD_NOT_ALLOWED("EDSP2", HttpServletResponse.SC_METHOD_NOT_ALLOWED, "The method is not allowed"),

    // actions
    NULL_ACTION("EACT1", HttpServletResponse.SC_BAD_REQUEST, "Null action requested."),
    NOT_VALID_TARGET("EACT2", HttpServletResponse.SC_BAD_REQUEST, "Invalid target requested."),
    PLAYER_NOT_IN_GAME("EACT3", HttpServletResponse.SC_BAD_REQUEST, "Player is not in a game."),
    ROLE_NOT_CORRESPOND("EACT4", HttpServletResponse.SC_BAD_REQUEST, "Role is not corresponding to that player."),
    DEAD_PLAYER("EACT5", HttpServletResponse.SC_CONFLICT, "The player is dead."),
    TOO_MANY_WOLVES_ACTIONS("EACT6", HttpServletResponse.SC_CONFLICT, "Too many wolves actions."),
    NOT_VALID_ACTION("EACT7", HttpServletResponse.SC_BAD_REQUEST, "Invalid action requested."),
    NUMBER_ACTIONS_DOESNT_MATCH("EACT8", HttpServletResponse.SC_CONFLICT, "Number of actions does not match."),
    VOTE_LIST_NOT_VALID("EACT9", HttpServletResponse.SC_BAD_REQUEST, "List of vote not valid."),
    BALLOT_VOTE_NOT_VALID("EACT10", HttpServletResponse.SC_BAD_REQUEST, "Target of ballot vote not valid."),

    // errors
    DATABASE_ERROR("EDTB1", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal database error."),
    INTERNAL_ERROR("EINT1", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal error."),
    NULL_OBJECT_ERROR("EINT2", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Null object internal error.");

    /**
     * The error code associated with the error.
     */
    private final String errorCode;

    /**
     * The HTTP status code associated with the error.
     */
    private final int httpCode;

    /**
     * The error message associated with the error.
     */
    private final String errorMessage;

    /**
     * Constructs an ErrorCode enum constant with the specified error code, HTTP status code, and error message.
     *
     * @param errorCode    The error code.
     * @param httpCode     The HTTP status code.
     * @param errorMessage The error message.
     */
    ErrorCode(String errorCode, int httpCode, String errorMessage) {
        this.errorCode = errorCode;
        this.httpCode = httpCode;
        this.errorMessage = errorMessage;
    }

    /**
     * Gets the error code.
     *
     * @return The error code.
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * Gets the HTTP status code.
     *
     * @return The HTTP status code.
     */
    public int getHTTPCode() {
        return httpCode;
    }

    /**
     * Gets the error message.
     *
     * @return The error message.
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * Converts the error code and message to a JSON object.
     *
     * @return The JSON object containing the error code and message.
     */
    public JSONObject toJSON() {
        JSONObject data = new JSONObject();
        data.put("code", errorCode);
        data.put("message", errorMessage);
        JSONObject info = new JSONObject();
        info.put("error", data);
        return info;
    }
}
