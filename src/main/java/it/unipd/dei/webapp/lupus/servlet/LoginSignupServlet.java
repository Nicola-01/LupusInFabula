package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Abstract DAO object class.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class LoginSignupServlet extends AbstractDatabaseServlet {

    // Define the regex pattern to check if the string is valid
    /**
     * Represents the regular expression pattern to validate email addresses.
     * The email address must have the format local_part@domain.
     * It must contain at least one character before the "@" symbol,
     * followed by the "@" symbol, and then the domain name with at least one dot.
     */
    String emailRegex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$";

    /**
     * Represents the regular expression pattern to validate usernames.
     * Usernames must be between 3 and 20 characters long and consist of alphanumeric characters.
     * They cannot start or end with a special character (_,-, or .) and cannot have consecutive special characters.
     */
    String usernameRegex = "^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$";

    /**
     * Represents the regular expression pattern to validate passwords.
     * Passwords must be between 8 and 16 characters long and contain at least one uppercase letter,
     * one lowercase letter, one number, and one special character.
     */
    String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,20}$";

    /**
     * The compiled pattern for validating email addresses.
     */
    Pattern emailRegexPattern = Pattern.compile(emailRegex);

    /**
     * The compiled pattern for validating usernames.
     */
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);

    /**
     * The compiled pattern for validating passwords.
     */
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);

    /**
     * Constant representing the name of the login token cookie.
     * This constant is used to identify and manipulate the session token cookie in HTTP requests and responses.
     */
    public static String LoginToken = "loginToken";


    /**
     * Method to handles GET request, the method will invalidate the session and return the login jsp page
     *
     * @param request  HTTP request from the client.
     * @param response HTTP response from the server.
     * @throws ServletException if any error occurs while executing the servlet.
     * @throws IOException      if any error occurs in the client/server communication.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LogContext.setIPAddress(request.getRemoteAddr());
        LogContext.setAction(Actions.LOGIN_REDIRECT_ACTION);

        String op = request.getRequestURI();
        op = op.split("/")[2];
        LOGGER.info("Access using GET, operation: %s, redirect to /jsp/login.jsp", op);


        if (op.startsWith("logout")) {
            HttpSession session = request.getSession();
            Player p = (Player) session.getAttribute(UserFilter.USER_ATTRIBUTE);

            LogContext.setUser(p.getUsername());
            response.setStatus(HttpServletResponse.SC_OK);
            LOGGER.info("the PLAYER %s logged out", p.getUsername());
            LogContext.removeUser();
        }

        request.getSession().invalidate();
        try {
            invalidateToken(request, response);
        } catch (SQLException e) {
            ErrorCode er = ErrorCode.INTERNAL_ERROR;
            response.setStatus(er.getHTTPCode());
            LOGGER.error("stacktrace:", e);
        }

        LogContext.removeIPAddress();
        LogContext.removeAction();
        if (op.startsWith("logout"))
            response.sendRedirect(request.getContextPath() + "/login");
        else
            request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
    }

    /**
     * Handles POST request for sign up and login.
     *
     * @param request  HTTP request from the client.
     * @param response HTTP response from the server.
     * @throws IOException if any error occurs in the client/server communication.
     */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LogContext.setIPAddress(request.getRemoteAddr());

        String op = request.getRequestURI();
        op = op.split("[/;]")[2]; // to handle also jsessionid:
        // /lupus/player/signup;jsessionid=C5771A95DD33E55251182A81F34A74CB

        LOGGER.info("Access using POST, operation: %s", op);

        request.getSession().invalidate();

        switch (op) {
            case "signup":
                signup(request, response);
                break;
            case "login":
                login(request, response);
                break;
            // case "logout": -> the session is already invalidated
        }

        LogContext.removeAction();
        LogContext.removeIPAddress();
    }


    /**
     * Retrieves all the parameters sent by the client, verifies their correctness and, if correct, adds the user to the database.
     *
     * @param request  HTTP request from the client.
     * @param response HTTP response from the server.
     * @throws IOException if any error occurs in the client/server communication.
     */
    public void signup(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            LogContext.setAction(Actions.SIGNUP_ACTION);

            // recover all necessary parameters
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String password_rp = request.getParameter("password_rp");

            LogContext.setUser(username);
            LOGGER.info("username (%s, %s) is trying to singup", username, email);

            Message m = null;

            // checks that all parameters have been set and are not null
            if (username == null || username.isEmpty() ||
                    email == null || email.isEmpty() ||
                    password == null || password.isEmpty() ||
                    password_rp == null || password_rp.isEmpty()) {

                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Some fields are empty");
                m = new Message("Some fields are empty", ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                LogContext.removeIPAddress();
                LogContext.removeAction();

                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
            }
            // checks if the username respect the regex
            else if (!usernameRegexPattern.matcher(username).matches()) {
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Username not valid");
                m = new Message("Username not valid", ec.getErrorCode(), ec.getErrorMessage());
            }
            // checks if the email respect the regex
            else if (!emailRegexPattern.matcher(email).matches()) {
                ErrorCode ec = ErrorCode.INVALID_EMAIL_FORMAT;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Email not valid");
                m = new Message("Email not valid", ec.getErrorCode(), ec.getErrorMessage());
            }
            // checks if the password respect the regex
            else if (!passwordRegexPattern.matcher(password).matches()) {
                ErrorCode ec = ErrorCode.INVALID_PASSWORD_FORMAT;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Passwords not complex enough");
                m = new Message("Passwords not complex enough", ec.getErrorCode(), ec.getErrorMessage());
            }
            // checks if the password and the repeat password ar the same
            else if (!password.equals(password_rp)) {
                ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Passwords do not match");
                m = new Message("Passwords do not match", ec.getErrorCode(), ec.getErrorMessage());
            } else {
                // searches if already exist users with that username or email
                Player player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
                Player player_email = new SearchPlayerByEmailDAO(getConnection(), email).access().getOutputParam();

                // username already used
                if (player_user != null) {
                    ErrorCode ec = ErrorCode.USERNAME_ALREADY_USED;
                    response.setStatus(ec.getHTTPCode());

                    LOGGER.info("Username already used");
                    m = new Message("Username already used", ec.getErrorCode(), ec.getErrorMessage());
                }
                // email already used
                else if (player_email != null) {
                    ErrorCode ec = ErrorCode.EMAIL_ALREADY_USED;
                    response.setStatus(ec.getHTTPCode());

                    LOGGER.info("Email already used");
                    m = new Message("Email already used", ec.getErrorCode(), ec.getErrorMessage());
                } else {
                    // creates the user
                    Player signupPlayer = new Player(username, email, password);
                    new SignupPlayerDAO(getConnection(), signupPlayer).access();

                    // adds the user to the session
                    HttpSession session = request.getSession();
                    session.setAttribute(UserFilter.USER_ATTRIBUTE, signupPlayer);
                    LOGGER.info("the PLAYER (%s, %s) correctly signup", username, email);

                    LogContext.removeIPAddress();
                    LogContext.removeAction();
                    LogContext.removeUser();

                    // after sign up, redirects all to the homepage
                    response.sendRedirect(request.getContextPath() + "/home");

                }
            }

            if (m != null) {
                // if there were any error, return the error message
                request.setAttribute("message", m);

                LogContext.removeIPAddress();
                LogContext.removeAction();
                LogContext.removeUser();

                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
            }
        } catch (SQLException | ServletException e) {
            ErrorCode er = ErrorCode.INTERNAL_ERROR;
            response.setStatus(er.getHTTPCode());
            LOGGER.error("stacktrace:", e);
        } finally {
            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeUser();
        }
    }

    /**
     * Retrieves all the parameters sent by the client, checks if they are correct, and allows login.
     *
     * @param request  HTTP request from the client.
     * @param response HTTP response from the server.
     * @throws IOException if any error occurs in the client/server communication.
     */
    public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            LogContext.setAction(Actions.LOGIN_ACTION);

            // recover all necessary parameters
            String user = request.getParameter("user");
            String password = request.getParameter("password");

            LogContext.setUser(user);
            LOGGER.info("User %s is trying to login", user);

            Message m = null;

            //checks that all parameters have been set and are not null
            if (user == null || user.isEmpty() ||
                    password == null || password.isEmpty()) {

                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                response.setStatus(ec.getHTTPCode());

                LOGGER.info("Some fields are empty");
                m = new Message("Some fields are empty", ec.getErrorCode(), ec.getErrorMessage());

            } else {
                // queries the database to find the user
                Player p = new LoginPlayerDAO(getConnection(), user, password).access().getOutputParam();

                // The user does not exist
                if (p == null) {
                    ErrorCode ec = ErrorCode.WRONG_CREDENTIALS;
                    response.setStatus(ec.getHTTPCode());

                    LOGGER.info("Credentials are wrong");
                    m = new Message("Credentials are wrong", ec.getErrorCode(), ec.getErrorMessage());
                } else if (p.getUsername().equals(p.getEmail())) {
                    ErrorCode ec = ErrorCode.ACCOUNT_DELETED;
                    response.setStatus(ec.getHTTPCode());

                    LOGGER.info("Account is deleted");
                    m = new Message("The account '" + p.getUsername() + "' is deleted", ec.getErrorCode(), ec.getErrorMessage());
                } else {
                    // activate a session to keep the user data
                    HttpSession session = request.getSession();

                    int gameID = new GetGameIdByPlayerUsernameDAO(getConnection(), p.getUsername()).access().getOutputParam();
                    if (gameID > 0) {
                        String publicGameID = new PlayerInGameDAO(getConnection(), p.getUsername()).access().getOutputParam();
                        String gameMaster = new GetMasterFromIdGameDAO(getConnection(), gameID).access().getOutputParam();

                        LOGGER.info(gameMaster.equals(p.getUsername()));
                        LOGGER.info(publicGameID);

                        if (gameMaster.equals(p.getUsername()))
                            session.setAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE, publicGameID);
                        else
                            session.setAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE, "");
                    } else
                        session.setAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE, "");

                    if (Objects.equals(request.getParameter("keepLogged"), "on"))
                        keepLoggedUser(response, p.getUsername());

                    response.setStatus(HttpServletResponse.SC_OK);
                    session.setAttribute(UserFilter.USER_ATTRIBUTE, p);
                    LOGGER.info("The user (%s, %s) logged in", p.getUsername(), p.getEmail());
                    response.sendRedirect(request.getContextPath() + "/home");
                }
            }
            if (m != null) {
                // if there were any error, return the error message
                request.setAttribute("message", m);

                LogContext.removeIPAddress();
                LogContext.removeAction();
                LogContext.removeUser();

                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
            }
        } catch (SQLException | ServletException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            response.setStatus(ec.getHTTPCode());
            LOGGER.error("Unexpected error", e);
            final Message m = new Message("Unexpected error.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("stacktrace:", e);
        } finally {
            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeUser();
        }
    }

    /**
     * Generates and sets a session token cookie for the logged-in user.
     *
     * @param response the HttpServletResponse object to manipulate the response to the client.
     * @param user     the username of the logged-in user.
     * @throws SQLException if a database access error occurs.
     */
    private void keepLoggedUser(HttpServletResponse response, String user) throws SQLException {
        String token = UUID.randomUUID().toString();
        new AddUserTokenDAO(getConnection(), user, token).access();

        LOGGER.info("Added token ", token);

        // Create a cookie to store the token
        Cookie loginCookie = new Cookie(LoginToken, token);
        loginCookie.setMaxAge(60 * 60 * 24 * 365); // 365 days
        loginCookie.setPath("/");

        response.addCookie(loginCookie);
    }

    /**
     * Invalidates (deletes) the session token stored in the request cookies.
     * This method deletes the token from the database, effectively logging out the user.
     *
     * @param request  the HttpServletRequest object containing the incoming request.
     * @param response the HttpServletResponse object to manipulate the response to the client.
     * @throws SQLException if a database access error occurs.
     */
    public void invalidateToken(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String token = "";

        Cookie[] cookies = request.getCookies();
        if (cookies != null)
            for (Cookie cookie : cookies)
                if (LoginToken.equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }

        Cookie cookie = new Cookie(LoginToken, "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        new InvalidateTokenDAO(getConnection(), token).access();
    }
}