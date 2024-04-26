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
    // JSN -> JSON
    // SES -> SESSION
    // DSP -> DISPATCHER
    // DTB -> DATABASE
    // INT -> INTERNAL

    // TODO: check error code

    //    WRONG_FORMAT(-100, HttpServletResponse.SC_BAD_REQUEST,"Wrong format."),
//    NO_HOMEWORKS_TO_PUBLISH(-101, HttpServletResponse.SC_NOT_FOUND, "No homeworks to publish."),
    // Login or edit credentials
    EMPTY_INPUT_FIELDS("EUSR1", HttpServletResponse.SC_BAD_REQUEST, "One or more input fields are empty."),
    INVALID_USERNAME_FORMAT("EUSR2", HttpServletResponse.SC_BAD_REQUEST, "Invalid username format."),
    INVALID_EMAIL_FORMAT("EUSR3", HttpServletResponse.SC_BAD_REQUEST, "Invalid email format."),
    INVALID_PASSWORD_FORMAT("EUSR4", HttpServletResponse.SC_BAD_REQUEST, "Invalid password format."),
    PASSWORD_NOT_MATCH("EUSR5", HttpServletResponse.SC_BAD_REQUEST, "Passwords do not match."),
    USERNAME_ALREADY_USED("EUSR6", HttpServletResponse.SC_CONFLICT, "Username already used"),
    EMAIL_ALREADY_USED("EUSR7", HttpServletResponse.SC_CONFLICT, "Email already used"),
    WRONG_CREDENTIALS("EUSR8", HttpServletResponse.SC_BAD_REQUEST, "Submitted credentials are wrong"),

    // game
    PLAYER_NOT_EXIST("EGME1", HttpServletResponse.SC_BAD_REQUEST, "One or more players does not exist."),
    PLAYER_ALREADY_IN_GAME("EGME2", HttpServletResponse.SC_BAD_REQUEST, "One or more players are already in a game."),
    MASTER_ALREADY_IN_GAME("EGME3", HttpServletResponse.SC_BAD_REQUEST, "The gamemaster is already in a game."),
    ROLE_NOT_EXIST("EGME4", HttpServletResponse.SC_BAD_REQUEST, "One or more roles does not exist."),
    NUMBER_PLAYERS_ROLES_NOT_MATCH("EGME5", HttpServletResponse.SC_BAD_REQUEST, "Number of players entered does not correspond to the number of roles."),
    NOT_ENOUGH_PLAYERS("EGME6", HttpServletResponse.SC_BAD_REQUEST, "Not enough players."),
    INVALID_GAMESETTINGS("EGME7", HttpServletResponse.SC_BAD_REQUEST, "The parameter does not exist."),
    INVALID_ROLES_CARDINALITY("EGME8", HttpServletResponse.SC_BAD_REQUEST, "Invalid role max cardinality."),

    GAME_NOT_FOUND("EGME9", HttpServletResponse.SC_NOT_FOUND, "Game not found."),

    // friend
    FRIEND_ALREADY_EXIST("EFRN1", HttpServletResponse.SC_CONFLICT, "The friend is already in the list"),
    FRIEND_NOT_EXIST("EFRN2", HttpServletResponse.SC_BAD_REQUEST, "The friend is not in the list"),

    //game logs
    LOGS_NOT_EXIST("EGLN1", HttpServletResponse.SC_NOT_FOUND, "Logs not found."),

    // invalid data
    INVALID_JSON_FORMAT("EJSON1", HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON."),

    // session
//    INVALID_SESSION(-200, HttpServletResponse.SC_BAD_REQUEST, "Invalid session"),
    NOT_LOGGED("ESES1", HttpServletResponse.SC_FORBIDDEN, "Account not logged in."),
    NOT_MASTER("ESES2", HttpServletResponse.SC_FORBIDDEN, "The account is not a gamemaster."),
    NO_GAME_SESSION("ESES3", HttpServletResponse.SC_NOT_FOUND, "The game doesn't exist."),
    DIFFERENT_GAME_SESSION("ESES4", HttpServletResponse.SC_CONFLICT, "The player isn't the gamemaster of this game."),

    // dispatcher
    UNKNOWN_RESOURCE("EDSP1", HttpServletResponse.SC_NOT_FOUND, "Unknown resource requested."),
    METHOD_NOT_ALLOWED("EDSP2", HttpServletResponse.SC_METHOD_NOT_ALLOWED, "The method is not allowed"),

    // errors
    DATABASE_ERROR("EDTB1", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal database error."),
    INTERNAL_ERROR("EINT1", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal error."),
    NULL_OBJECT_ERROR("EINT2", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Null object internal error.");

    //    EMAIL_MISSING(-103, HttpServletResponse.SC_BAD_REQUEST, "Email missing"),
//    COURSEID_MISSING(-203, HttpServletResponse.SC_BAD_REQUEST, "Courseid missing"),
//    MASTERID_MISSING(-203, HttpServletResponse.SC_BAD_REQUEST, "Masterid missing"),
//    PASSWORD_MISSING(-104, HttpServletResponse.SC_BAD_REQUEST, "Password missing"),
//    GROUP_NAME_MISSING(-106, HttpServletResponse.SC_BAD_REQUEST, "Group name is missing"),
//    WRONG_INTERVALS(-107, HttpServletResponse.SC_CONFLICT, "different passwords"),
//    MAIL_ALREADY_USED(-108, HttpServletResponse.SC_CONFLICT, "mail already used"),
//    WRONG_GROUP_INFO(-109, HttpServletResponse.SC_BAD_REQUEST, "The group information are not correct"),
//    ERROR_SAVING_EVAL(-110, HttpServletResponse.SC_BAD_REQUEST, "The park name has already been used."),
//    UPDATE_ERROR(-111, HttpServletResponse.SC_BAD_REQUEST, "Problems in updating student"),
//    REGISTRATION_CLOSED(-112, HttpServletResponse.SC_BAD_REQUEST, "Registration is closed"),
//    WRONG_REST_FORMAT(-113, HttpServletResponse.SC_BAD_REQUEST, "Wrong rest request format."),
//    EMPTY_MASTER_DEGREES(-114, HttpServletResponse.SC_BAD_REQUEST, "Empty degrees or cfus"),
//    COURSE_NOT_MATCH_MASTER(-115, HttpServletResponse.SC_CONFLICT, "Course is not included in the study plan of a master degree"),
//    REGISTRATION_ALREADY_IN(-116, HttpServletResponse.SC_CONFLICT, "The registration for this course already took place"),
//    BADLY_FORMATTED_JSON(-120,  HttpServletResponse.SC_BAD_REQUEST, "The input json is in the wrong format."),
//    DEADLINE_EXPIRED(-121, HttpServletResponse.SC_BAD_REQUEST, "Deadline expired"),
//    OPERATION_UNKNOWN(-200, HttpServletResponse.SC_BAD_REQUEST, "Operation unknown."),
//    METHOD_NOT_ALLOWED(-500, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "The method is not allowed"),
//    TOKEN_TAMPERED(-750, HttpServletResponse.SC_UNAUTHORIZED, "The token has been tampered!!!!"),
//    TOKEN_EXPIRED(-751, HttpServletResponse.SC_UNAUTHORIZED, "The token has expired."),

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
