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
    String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    String usernameRegex = "^[a-zA-Z0-9](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$";
    String passwordRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";
    // Compile the regex pattern
    Pattern emailRegexPattern = Pattern.compile(emailRegex);
    Pattern usernameRegexPattern = Pattern.compile(usernameRegex);
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        LogContext.setIPAddress(req.getRemoteAddr());

        String op = req.getRequestURI();
        op = op.split("/")[2];
        LOGGER.info("Access using GET, operation: %s, redirect to /jsp/login.jsp", op);

        req.getSession().invalidate();
        req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);

        LogContext.removeIPAddress();
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
        LogContext.setIPAddress(req.getRemoteAddr());

        String op = req.getRequestURI();
        op = op.split("/")[2];
        LOGGER.info("Access using POST, operation: %s, redirect to /jsp/login.jsp", op);

        switch (op) {
            case "signup":
                singup(req, res);
                break;
            case "login":
                login(req, res);
                break;
        }

        LogContext.removeIPAddress();
    }

    public void singup(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String username = req.getParameter("username");
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        String password_rp = req.getParameter("password_rp");

        Date registerDate = new Date(System.currentTimeMillis());

        Player signupPlayer = new Player(username, email, password, registerDate);

        LOGGER.info("username (%s, %s) is trying to singup", username, email);

        try {
            //check that all registrations parameters have been set and are not null
            if (username == null || username.isEmpty() ||
                    email == null || email.isEmpty() ||
                    password == null || password.isEmpty() ||
                    password_rp == null || password_rp.isEmpty()) {

                // TODO: To check
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Some fields are empty", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                // LOGGER.debug("User have invalid fields"); // .debug not work
                LOGGER.info("Some fields are empty");

//                req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);
            } else if (!usernameRegexPattern.matcher(username).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_USERNAME_FORMAT;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Username not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                LOGGER.info("Username not valid");
            } else if (!emailRegexPattern.matcher(email).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_EMAIL_FORMAT;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Email not valid", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                LOGGER.info("Email not valid");
            } else if (!passwordRegexPattern.matcher(password).matches()) {
                // TODO: To check
                ErrorCode ec = ErrorCode.INVALID_PASSWORD_FORMAT;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Passwords not complex enough", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                LOGGER.info("Passwords not complex enough");
            } else if (!password.equals(password_rp)) {
                // TODO: To check
                ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Passwords do not match", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                LOGGER.info("Passwords do not match");
            } else {

                Player player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
                Player player_email = new SearchPlayerByEmailDAO(getConnection(), email).access().getOutputParam();

                if (player_user != null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.USERNAME_ALREADY_USED;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Username already used", "" + ec.getErrorCode(), ec.getErrorMessage());
                    req.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Username already used");
                } else if (player_email != null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.EMAIL_ALREADY_USED;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Email already used", "" + ec.getErrorCode(), ec.getErrorMessage());
                    req.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Email already used");
                } else {
                    new SingupPlayerDAO(getConnection(), signupPlayer).access();
                    //                // TODO: da togliere, solo per test
                    //                PrintWriter out = res.getWriter();
                    //                out.println("<html><body>");
                    //                out.println("Done");
                    //                out.println(p.getUsername());
                    //                out.println(p.getEmail());
                    //                out.println("</body></html>");
                    //                out.flush();
                    //                out.close();
                    LOGGER.info("User correctly added");
                }
            }
        } catch (SQLException e) { // (SQLException | ServletException e)
//            writeError(res, ErrorCode.INTERNAL_ERROR);
            LOGGER.error("stacktrace:", e);
        }
    }

    public void login(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        try {
            String user = req.getParameter("user");
            String password = req.getParameter("password");

            LOGGER.info("User %s is trying to login", user);

            if (user == null || user.isEmpty() ||
                    password == null || password.isEmpty()) {

                // TODO: To check
                ErrorCode ec = ErrorCode.EMPTY_INPUT_FIELDS;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("Some fields are empty", "" + ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);

                // LOGGER.debug("User have invalid fields"); // .debug not work
                LOGGER.info("Some fields are empty");

//                req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);
            } else {
                Player p = new LoginPlayerDAO(getConnection(), user, password).access().getOutputParam();
                if (p == null) {
                    // TODO: To check
                    ErrorCode ec = ErrorCode.WRONG_CREDENTIALS;
                    res.setStatus(ec.getHTTPCode());
                    Message m = new Message("Credentials are wrong",  "" + ec.getErrorCode(), ec.getErrorMessage());
                    req.setAttribute("message", m);
                    LOGGER.info("Credentials are wrong");
//                    req.getRequestDispatcher("/jsp/student/login.jsp").forward(req, res);
                }
                else {
                    // activate a session to keep the user data
                    HttpSession session = req.getSession();
                    session.setAttribute("player", p);
                    LOGGER.info("the user (%s, %s) logged in", p.getUsername(), p.getEmail());

                    // login credentials were correct: we redirect the user to the homepage
                    // res.sendRedirect("/jsp/home.jsp");
                }
            }
        } catch (SQLException e) { // (SQLException | ServletException e)
//            writeError(res, ErrorCode.INTERNAL_ERROR);
            LOGGER.error("stacktrace:", e);
        }
    }

}