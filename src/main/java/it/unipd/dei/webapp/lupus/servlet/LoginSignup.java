package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SingupPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.LogContext;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.sql.SQLException;

public class LoginSignup extends AbstractDatabaseServlet {

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
        String op = req.getRequestURI();
        op = op.split("/")[2];
        LOGGER.info("Operation: {}", op);

        Player p = null;
        Message m = null;

        switch (op) {
            case "signup":
                singup(req, res);
                break;
            case "login":
                login(req, res);
                break;
        }

    }

    public void singup(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String username = req.getParameter("username");
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        Date registerDate = new Date(System.currentTimeMillis());
        Player p = new Player( username, email, password, registerDate);

        try {
            new SingupPlayerDAO(getConnection(), p).access();
            // TODO: da togliere, solo per test
            PrintWriter out = res.getWriter();
            out.println("<html><body>");
            out.println("Done");
            out.println(p.getUsername());
            out.println(p.getEmail());
            out.println("</body></html>");
            out.flush();
            out.close();
        } catch (SQLException e) {
            LOGGER.error("stacktrace:", e);
//            writeError(res, ErrorCode.INTERNAL_ERROR);
        }

    }

    public void login(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        String user = req.getParameter("user");
        String password = req.getParameter("password");
        Player p = null;
        try {
            p = new LoginPlayerDAO(getConnection(), user, password).access().getOutputParam();
        } catch (SQLException e) {
//            logger.error("stacktrace:", e);
//            writeError(res, ErrorCode.INTERNAL_ERROR);
        }

        if (p == null) {
//            ErrorCode ec = ErrorCode.WRONG_CREDENTIALS;
//            res.setStatus(ec.getHTTPCode());
//            Message m = new Message(true, "Credentials are wrong");
//            req.setAttribute("message", m);
            PrintWriter out = res.getWriter();
            out.println("<html><body>");
            out.println("Done");
            out.println("Player non trovato");
            out.println("</body></html>");
            out.flush();
            out.close();

//            req.getRequestDispatcher("/jsp/login.jsp").forward(req, res);


        }
        else{
            // TODO: da togliere, solo per test
            PrintWriter out = res.getWriter();
            out.println("<html><body>");
            out.println("Done");
            out.println(p.getUsername());
            out.println(p.getEmail());
            out.println("</body></html>");
            out.flush();
            out.close();


            // activate a session to keep the user data
            HttpSession session = req.getSession();
            session.setAttribute("player", p);
            LOGGER.info("the player {} logged in", p.getEmail());

            // login credentials were correct: we redirect the user to the homepage
//            res.sendRedirect("/jsp/home.jsp");
        }
    }

}