package it.unipd.dei.webapp.lupus.controller;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.Auth;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Login, signup and logout (replaces LoginSignupServlet). Errors are written as {@link Message} JSON.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
@Controller
public class LoginSignupController {

    private static final Logger LOGGER = LogManager.getLogger(LoginSignupController.class,
            StringFormatterMessageFactory.INSTANCE);

    String emailRegex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$";
    String usernameRegex = "^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$";
    String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,20}$";

    Pattern emailRegexPattern = Pattern.compile(emailRegex);
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);

    /**
     * Cookie of the old session-token login: cleared on logout if the browser still has it.
     */
    private static final String LEGACY_LOGIN_TOKEN = "loginToken";

    private final DataSource ds;

    public LoginSignupController(DataSource ds) {
        this.ds = ds;
    }

    @GetMapping({"/login", "/signup", "/logout"})
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, jakarta.servlet.ServletException {
        LogContext.setIPAddress(request.getRemoteAddr());
        LogContext.setAction(Actions.LOGIN_REDIRECT_ACTION);

        String op = request.getRequestURI().substring(request.getContextPath().length()).split("/")[1];
        LOGGER.info("Access using GET, operation: %s, redirect to index.html", op);

        if (op.startsWith("logout")) {
            Player p = Auth.currentPlayer(request);
            if (p != null) {
                LogContext.setUser(p.getUsername());
                LOGGER.info("the PLAYER %s logged out", p.getUsername());
                LogContext.removeUser();
            }
            response.setStatus(HttpServletResponse.SC_OK);
        }

        clearLoginCookies(request, response);

        LogContext.removeIPAddress();
        LogContext.removeAction();
        if (op.startsWith("logout"))
            response.sendRedirect(request.getContextPath() + "/login");
        else
            request.getRequestDispatcher("/index.html").forward(request, response);
    }

    @PostMapping({"/login", "/signup", "/logout"})
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LogContext.setIPAddress(request.getRemoteAddr());

        String op = request.getRequestURI().substring(request.getContextPath().length()).split("[/;]")[1]; // to handle also jsessionid

        LOGGER.info("Access using POST, operation: %s", op);

        switch (op) {
            case "signup":
                signup(request, response);
                break;
            case "login":
                login(request, response);
                break;
            case "logout":
                clearLoginCookies(request, response);
                break;
        }

        LogContext.removeAction();
        LogContext.removeIPAddress();
    }

    /**
     * Writes a Message JSON with the given error code as status.
     */
    private void writeError(HttpServletResponse response, ErrorCode ec, Message m) throws IOException {
        response.setStatus(ec.getHTTPCode());
        response.setContentType("application/json;charset=UTF-8");
        m.toJSON(response.getOutputStream());
    }

    public void signup(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            LogContext.setAction(Actions.SIGNUP_ACTION);

            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String password_rp = request.getParameter("password_rp");

            LogContext.setUser(username);
            LOGGER.info("username (%s, %s) is trying to singup", username, email);

            if (username == null || username.isEmpty() ||
                    email == null || email.isEmpty() ||
                    password == null || password.isEmpty() ||
                    password_rp == null || password_rp.isEmpty()) {

                LOGGER.info("Some fields are empty");
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                writeError(response, ec, new Message("Some fields are empty", ec.getErrorCode(), ec.getErrorMessage()));
            } else if (!usernameRegexPattern.matcher(username).matches()) {
                LOGGER.info("Username not valid");
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                writeError(response, ec, new Message("Username not valid", ec.getErrorCode(), ec.getErrorMessage()));
            } else if (!emailRegexPattern.matcher(email).matches()) {
                LOGGER.info("Email not valid");
                ErrorCode ec = ErrorCode.INVALID_EMAIL_FORMAT;
                writeError(response, ec, new Message("Email not valid", ec.getErrorCode(), ec.getErrorMessage()));
            } else if (!passwordRegexPattern.matcher(password).matches()) {
                LOGGER.info("Passwords not complex enough");
                ErrorCode ec = ErrorCode.INVALID_PASSWORD_FORMAT;
                writeError(response, ec, new Message("Passwords not complex enough", ec.getErrorCode(), ec.getErrorMessage()));
            } else if (!password.equals(password_rp)) {
                LOGGER.info("Passwords do not match");
                ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                writeError(response, ec, new Message("Passwords do not match", ec.getErrorCode(), ec.getErrorMessage()));
            } else {
                Player player_user = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();
                Player player_email = new SearchPlayerByEmailDAO(ds.getConnection(), email).access().getOutputParam();

                if (player_user != null) {
                    LOGGER.info("Username already used");
                    ErrorCode ec = ErrorCode.USERNAME_ALREADY_USED;
                    writeError(response, ec, new Message("Username already used", ec.getErrorCode(), ec.getErrorMessage()));
                } else if (player_email != null) {
                    LOGGER.info("Email already used");
                    ErrorCode ec = ErrorCode.EMAIL_ALREADY_USED;
                    writeError(response, ec, new Message("Email already used", ec.getErrorCode(), ec.getErrorMessage()));
                } else {
                    Player signupPlayer = new Player(username, email, password);
                    new SignupPlayerDAO(ds.getConnection(), signupPlayer).access();

                    Auth.setCookie(request, response, username, false);
                    LOGGER.info("the PLAYER (%s, %s) correctly signup", username, email);

                    LogContext.removeIPAddress();
                    LogContext.removeAction();
                    LogContext.removeUser();

                    response.sendRedirect(request.getContextPath() + "/home");
                }
            }
        } catch (SQLException e) {
            ErrorCode er = ErrorCode.INTERNAL_ERROR;
            LOGGER.error("stacktrace:", e);
            writeError(response, er, new Message("Internal error", er.getErrorCode(), e.getMessage()));
        } finally {
            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeUser();
        }
    }

    public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            LogContext.setAction(Actions.LOGIN_ACTION);

            String user = request.getParameter("user");
            String password = request.getParameter("password");

            LogContext.setUser(user);
            LOGGER.info("User %s is trying to login", user);

            if (user == null || user.isEmpty() ||
                    password == null || password.isEmpty()) {

                LOGGER.info("Some fields are empty");
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                writeError(response, ec, new Message("Some fields are empty", ec.getErrorCode(), ec.getErrorMessage()));
            } else {
                Player p = new LoginPlayerDAO(ds.getConnection(), user, password).access().getOutputParam();

                if (p == null) {
                    LOGGER.info("Credentials are wrong");
                    ErrorCode ec = ErrorCode.WRONG_CREDENTIALS;
                    writeError(response, ec, new Message("Credentials are wrong", ec.getErrorCode(), ec.getErrorMessage()));
                } else if (p.getUsername().equals(p.getEmail())) {
                    LOGGER.info("Account is deleted");
                    ErrorCode ec = ErrorCode.ACCOUNT_DELETED;
                    writeError(response, ec, new Message("The account '" + p.getUsername() + "' is deleted", ec.getErrorCode(), ec.getErrorMessage()));
                } else {
                    Auth.setCookie(request, response, p.getUsername(), Objects.equals(request.getParameter("keepLogged"), "on"));

                    response.setStatus(HttpServletResponse.SC_OK);
                    LOGGER.info("The user (%s, %s) logged in", p.getUsername(), p.getEmail());
                    response.sendRedirect(request.getContextPath() + "/home");
                }
            }
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            LOGGER.error("Unexpected error", e);
            writeError(response, ec, new Message("Unexpected error.", ec.getErrorCode(), e.getMessage()));
        } finally {
            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeUser();
        }
    }

    /**
     * Clears the JWT cookie and, if present, the old session-token cookie.
     */
    private void clearLoginCookies(HttpServletRequest request, HttpServletResponse response) {
        Auth.clearCookie(request, response);

        Cookie[] cookies = request.getCookies();
        if (cookies != null)
            for (Cookie cookie : cookies)
                if (LEGACY_LOGIN_TOKEN.equals(cookie.getName())) {
                    Cookie legacy = new Cookie(LEGACY_LOGIN_TOKEN, "");
                    legacy.setMaxAge(0);
                    legacy.setPath("/");
                    response.addCookie(legacy);
                    break;
                }
    }
}
