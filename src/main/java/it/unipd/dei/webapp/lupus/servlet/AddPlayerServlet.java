package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.InsertPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.SelectPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.sql.SQLException;
import java.util.List;

public final class AddPlayerServlet extends AbstractDatabaseServlet {

    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        int id = -1;
        String username = null;
        String email = null;
        String password = null;
        Date registerDate = null;

        Player p = null;
        Message m = null;
        res.setContentType("text/html; charset=utf-8");

        PrintWriter out = res.getWriter();

        try {
            id = Integer.parseInt(req.getParameter("id"));
            username = req.getParameter("username");
            email = req.getParameter("email");
            password = req.getParameter("password");
            registerDate = new Date(System.currentTimeMillis());

            p = new Player(id, username, email, password, registerDate);

            out.println(p.getId());
            out.println(p.getUsername());
            out.println(p.getEmail());
            out.println(p.getPassword());
            out.println(p.getRegisterDate());
            out.println("<br><br>");

            new InsertPlayerDAO(getDataSource().getConnection(), p).createPlayer();

            m = new Message("Players added");
        } catch (SQLException e) {
            m = new Message("Error SQLException", "E200", e.getMessage());
        } catch (NumberFormatException e) {
            m = new Message("Error NumberFormatException", "E200", e.getMessage());
        }


        out.printf(m.getMessage());
        out.println("<br>");
        out.printf(m.getErrorDetails());
    }
}
