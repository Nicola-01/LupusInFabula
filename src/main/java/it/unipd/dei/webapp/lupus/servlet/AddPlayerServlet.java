package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.InsertPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.sql.SQLException;

public final class AddPlayerServlet extends AbstractDatabaseServlet {

    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        int id;
        String username;
        String email;
        String password;
        Date registerDate;

        Player p;
        Message m;
        res.setContentType("text/html; charset=utf-8");

        PrintWriter out = res.getWriter();

        try {
            username = req.getParameter("username");
            email = req.getParameter("email");
            password = req.getParameter("password");
            registerDate = new Date(System.currentTimeMillis());

            p = new Player(1, username, email, password, registerDate);

            out.println(p.getId());
            out.println(p.getUsername());
            out.println(p.getEmail());
            out.println(p.getPassword());
            out.println(p.getRegisterDate());
            out.println("<br><br>");

            new InsertPlayerDAO(getConnection(), p).access();

            m = new Message("Players added");
        }
        // Menages error/success
        catch (SQLException e) {
            m = new Message("Error SQLException", "E200", e.getMessage());
        } catch (NumberFormatException e) {
            m = new Message("Error NumberFormatException", "E200", e.getMessage());
        }


        out.printf(m.getMessage());
        out.println("<br>");
        out.printf(m.getErrorDetails());
    }
}
