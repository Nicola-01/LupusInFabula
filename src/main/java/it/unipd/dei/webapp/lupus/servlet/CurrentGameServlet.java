package it.unipd.dei.webapp.lupus.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class CurrentGameServlet extends AbstractDatabaseServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        String gameMaster = (String) req.getSession().getAttribute("gamemaster");
        String[] urlParts = req.getRequestURI().split("/");

        String gameId;
        if(req.getRequestURI().endsWith("/master"))
            gameId = urlParts[urlParts.length - 2];
        else
            gameId = urlParts[urlParts.length - 1];

        // if the user is master and it's not requesting currentGame in master mode
        if (!req.getRequestURI().endsWith("/master") && gameId.equals(gameMaster))
        {
            LOGGER.info("1");
            resp.sendRedirect(req.getRequestURI() + "/master");
            return;
        }
        // if the user is not master but request currentGame in master mode
        if(req.getRequestURI().endsWith("/master") && !gameId.equals(gameMaster))
        {
            LOGGER.info("2");
            String newURL = req.getRequestURI().replace("/master", "");
            resp.sendRedirect(newURL);
            return;
        }
        req.setAttribute("isMaster", req.getPathInfo().contains("/master"));
        req.getRequestDispatcher("/jsp/game/currentGame.jsp").forward(req, resp);
    }
}
