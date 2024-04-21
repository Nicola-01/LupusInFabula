package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByEmailDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SignupPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

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
    String emailRegex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$"; // the email need to be at least a@b.c
    String usernameRegex = "^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$"; // username must be made from 3 to 20 alphanumeric characters
    String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,16}$"; // password with at least 8 alphanumeric characters,
    // must contain at least one uppercase, number, and special character

    // Compile the regex pattern
    Pattern emailRegexPattern = Pattern.compile(emailRegex);
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);


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
            LOGGER.info("the PLAYER %s logged out", p.getUsername());
            LogContext.removeUser();
        }
        // session invalidate for all cases
        request.getSession().invalidate();

        LogContext.removeIPAddress();
        LogContext.removeAction();

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
        op = op.split("[/;]")[2]; // to handle also jssasionid:
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
                    session.setAttribute("user", signupPlayer);
                    LOGGER.info("the PLAYER (%s, %s) correctly signup", username, email);

                    LogContext.removeIPAddress();
                    LogContext.removeAction();
                    LogContext.removeUser();

                    // after sign up, redirects all to the homepage
                    response.sendRedirect(request.getContextPath() + "/jsp/home.jsp");

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
                } else {
                    // activate a session to keep the user data
                    HttpSession session = request.getSession();
                    session.setAttribute("user", p);
                    LOGGER.info("The user (%s, %s) logged in", p.getUsername(), p.getEmail());

                    response.sendRedirect(request.getContextPath() + "/jsp/home.jsp");
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
}