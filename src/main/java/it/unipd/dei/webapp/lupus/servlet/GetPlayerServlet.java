package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SelectPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public final class GetPlayerServlet extends AbstractDatabaseServlet {

    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<Player> players = null;
        Message m = null;

        try {
            players = new SelectPlayerDAO(getConnection()).searchPlayer();
            m = new Message("Players found");
        } catch (SQLException e) {
            m = new Message("Error SQLException", "E200", e.getMessage());
        } catch (NumberFormatException e) {
            m = new Message("Error NumberFormatException", "E200", e.getMessage());
        }

        res.setContentType("text/html; charset=utf-8");

        PrintWriter out = res.getWriter();

        out.printf(m.getMessage());
        out.println("<br>");
        out.printf(m.getErrorDetails());
    }
}
