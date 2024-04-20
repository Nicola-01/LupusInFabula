package it.unipd.dei.webapp.lupus.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 * Enumeration representing error codes and their associated error messages and HTTP status codes.
 */
public enum ErrorCode {

//    WRONG_FORMAT(-100, HttpServletResponse.SC_BAD_REQUEST,"Wrong format."),
//    NO_HOMEWORKS_TO_PUBLISH(-101, HttpServletResponse.SC_NOT_FOUND, "No homeworks to publish."),
    // Login or edit credentials
    EMPTY_INPUT_FIELDS(-101, HttpServletResponse.SC_BAD_REQUEST, "One or more input fields are empty."),
    INVALID_USERNAME_FORMAT(-102, HttpServletResponse.SC_BAD_REQUEST, "Invalid username format."),
    INVALID_EMAIL_FORMAT(-103, HttpServletResponse.SC_BAD_REQUEST, "Invalid email format."),
    INVALID_PASSWORD_FORMAT(-104, HttpServletResponse.SC_BAD_REQUEST, "Invalid password format."),
    PASSWORD_NOT_MATCH(-104, HttpServletResponse.SC_BAD_REQUEST, "Passwords do not match."),
    USERNAME_ALREADY_USED(-105, HttpServletResponse.SC_CONFLICT, "Username already used"),
    EMAIL_ALREADY_USED(-106, HttpServletResponse.SC_CONFLICT, "Email already used"),
    WRONG_CREDENTIALS(-107, HttpServletResponse.SC_BAD_REQUEST, "Submitted credentials are wrong"),

    // invalid data
    INVALID_JSON_FORMAT(-116, HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON"),

    // game creation
    PLAYER_NOT_EXIST(-108, HttpServletResponse.SC_BAD_REQUEST, "One or more players does not exist"),
    PLAYER_ALREADY_IN_GAME(-109, HttpServletResponse.SC_BAD_REQUEST, "One or more players are already in a game"),
    MASTER_ALREADY_IN_GAME(-110, HttpServletResponse.SC_BAD_REQUEST, "The gamemaster is already in a game"),
    ROLE_NOT_EXIST(-111, HttpServletResponse.SC_BAD_REQUEST, "One or more roles does not exist"),
    NUMBER_PLAYERS_ROLES_NOT_MATCH(-112, HttpServletResponse.SC_BAD_REQUEST, "Number of players entered does not correspond to the number of roles"),
    NOT_ENOUGH_PLAYERS(-113, HttpServletResponse.SC_BAD_REQUEST, "Not enough players"),
    INVALID_GAMESETTINGS(-114, HttpServletResponse.SC_BAD_REQUEST, "The parameter does not exist"),
    INVALID_ROLES_CARDINALITY(-115, HttpServletResponse.SC_BAD_REQUEST, "Invalid role max cardinality"),

    // session
//    INVALID_SESSION(-200, HttpServletResponse.SC_BAD_REQUEST, "Invalid session"),
    NOT_LOGGED(-201, HttpServletResponse.SC_FORBIDDEN, "Account not logged in"),
    NOT_MASTER(-201, HttpServletResponse.SC_FORBIDDEN, "The account is not a gamemaster"),
    GAME_NOT_EXIST(-201, HttpServletResponse.SC_NOT_FOUND, "The game doesn't exist"),
    DIFFERENT_GAMEID(-202, HttpServletResponse.SC_CONFLICT, "The gameIDs do not match"),

    // errors
    DATABASE_ERROR(-203, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal database error"),
    INTERNAL_ERROR(-999, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Error");

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
    private final int errorCode;

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
    ErrorCode(int errorCode, int httpCode, String errorMessage) {
        this.errorCode = errorCode;
        this.httpCode = httpCode;
        this.errorMessage = errorMessage;
    }
    /**
     * Gets the error code.
     *
     * @return The error code.
     */
    public int getErrorCode() {
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
