package it.unipd.dei.webapp.lupus.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class CurrentGameServlet extends AbstractDatabaseServlet
{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        // Get public ID from URL
        String id = req.getPathInfo().substring(1);

        // Forward ID to jsp page
        req.setAttribute("publicGameID", id);
        req.getRequestDispatcher("/jsp/game/currentGame.jsp").forward(req, resp);
    }
}