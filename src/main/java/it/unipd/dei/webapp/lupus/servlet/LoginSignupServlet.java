package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByEmailDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SingupPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.sql.SQLException;

import java.util.regex.Pattern;

public class LoginSignupServlet extends AbstractDatabaseServlet {

    // Define the regex pattern to check if the string is valid
    String emailRegex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$";
    String usernameRegex = "^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$";
    String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,16}$";
    // Compile the regex pattern
    Pattern emailRegexPattern = Pattern.compile(emailRegex);
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LogContext.setIPAddress(request.getRemoteAddr());

        String op = request.getRequestURI();
        op = op.split("/")[3];
        LOGGER.info("Access using GET, operation: %s, redirect to /jsp/login.jsp", op);


        if (op.startsWith("logout")) {
            HttpSession session = request.getSession();
            Player p = (Player) session.getAttribute("player");

            LOGGER.info("the PLAYER %s logged out", p.getUsername());
        }
        // session invalidate for all cases
        request.getSession().invalidate();
        request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);

        LogContext.removeIPAddress();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        LogContext.setIPAddress(request.getRemoteAddr());

        String op = request.getRequestURI();
        op = op.split("[/;]")[3]; // to handle also jssasionid:
        // /lupus/player/signup;jsessionid=C5771A95DD33E55251182A81F34A74CB

        LOGGER.info("Access using POST, operation: %s", op);

        switch (op) {
            case "signup":
                singup(request, response);
                break;
            case "login":
                login(request, response);
                break;
        }

        LogContext.removeIPAddress();
    }

    public void singup(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String password_rp = request.getParameter("password_rp");

        Date registerDate = new Date(System.currentTimeMillis());

        LOGGER.info("username (%s, %s) is trying to singup", username, email);

        try {
            //check that all registrations parameters have been set and are not null
            if (username == null || username.isEmpty() ||
                    email == null || email.isEmpty() ||
                    password == null || password.isEmpty() ||
                    password_rp == null || password_rp.isEmpty()) {

                // TODO: To check
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Some fields are empty", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                // LOGGER.debug("User have invalid fields"); // .debug not work
                LOGGER.info("Some fields are empty");

//                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
            } else if (!usernameRegexPattern.matcher(username).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Username not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                LOGGER.info("Username not valid");
            } else if (!emailRegexPattern.matcher(email).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_EMAIL_FORMAT;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Email not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                LOGGER.info("Email not valid");
            } else if (!passwordRegexPattern.matcher(password).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_PASSWORD_FORMAT;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Passwords not complex enough", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                LOGGER.info("Passwords not complex enough");
            } else if (!password.equals(password_rp)) {
                // TODO: To check
                ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Passwords do not match", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                LOGGER.info("Passwords do not match");
            } else {

                Player player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
                Player player_email = new SearchPlayerByEmailDAO(getConnection(), email).access().getOutputParam();

                if (player_user != null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.USERNAME_ALREADY_USED;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Username already used", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Username already used");
                } else if (player_email != null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.EMAIL_ALREADY_USED;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Email already used", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Email already used");
                } else {
                    Player signupPlayer = new Player(username, email, password, registerDate);
                    new SingupPlayerDAO(getConnection(), signupPlayer).access();

                    HttpSession session = request.getSession();
                    session.setAttribute("player", signupPlayer);
                    LOGGER.info("the PLAYER (%s, %s) correctly signup", username, email);

                    // login credentials were correct: we redirect the user to the homepage
//                    request.getRequestDispatcher("/jsp/home.jsp").forward(request, response);
                    response.sendRedirect(request.getContextPath() + "/jsp/home.jsp");

                }
            }
        } catch (SQLException e) {
//            writeError(response, ErrorCode.INTERNAL_ERROR);
            LOGGER.error("stacktrace:", e);
        }
    }

    public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String user = request.getParameter("user");
            String password = request.getParameter("password");

            LOGGER.info("User %s is trying to login", user);

            if (user == null || user.isEmpty() ||
                    password == null || password.isEmpty()) {

                // TODO: To check
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                response.setStatus(ec.getHTTPCode());

                Message m = new Message("Some fields are empty", "" + ec.getErrorCode(), ec.getErrorMessage());
                request.setAttribute("message", m);

                // LOGGER.debug("User have invalid fields"); // .debug not work
                LOGGER.info("Some fields are empty");

//                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
            } else {
                Player p = new LoginPlayerDAO(getConnection(), user, password).access().getOutputParam();
                if (p == null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.WRONG_CREDENTIALS;
                    response.setStatus(ec.getHTTPCode());
                    Message m = new Message("Credentials are wrong", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);
                    LOGGER.info("Credentials are wrong");
//                    request.getRequestDispatcher("/jsp/student/login.jsp").forward(request, response);
                } else {
                    // activate a session to keep the user data
                    HttpSession session = request.getSession();
                    session.setAttribute("player", p);
                    LOGGER.info("the user (%s, %s) logged in", p.getUsername(), p.getEmail());

                    // login credentials were correct: we redirect the user to the homepage
//                    request.getRequestDispatcher("/jsp/home.jsp").forward(request, response);
                    response.sendRedirect(request.getContextPath() + "/jsp/home.jsp");

                }
            }
        } catch (SQLException e) {
//            writeError(response, ErrorCode.INTERNAL_ERROR);
            LOGGER.error("stacktrace:", e);
        }
    }

}