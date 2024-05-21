package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

public class CurrentGameServlet extends AbstractDatabaseServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String gameMaster = (String) req.getSession().getAttribute("gamemaster");
        String[] urlParts = req.getRequestURI().split("/");

        String gameId;
        if (req.getRequestURI().endsWith("/master"))
            gameId = urlParts[urlParts.length - 2];
        else
            gameId = urlParts[urlParts.length - 1];

        try {
            int privateGameID = new GetGameIdFormPublicGameIdDAO(getConnection(), gameId).access().getOutputParam();
            Game game = new GetGameByGameIdDAO(getConnection(), privateGameID).access().getOutputParam();
            if (game == null) {
                req.getRequestDispatcher("/jsp/pageNotFound.jsp").forward(req, resp);
                return;
            }
            if (game.getWho_win() >= 0)
                req.setAttribute("gameOver", game.getWho_win());
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            resp.setStatus(ec.getHTTPCode());

            LOGGER.info("Internal error");
            Message m = new Message("Internal error", ec.getErrorCode(), e.getMessage());
            req.setAttribute("message", m);
        }

        // if the user is master and it's not requesting currentGame in master mode
        if (!req.getRequestURI().endsWith("/master") && gameId.equals(gameMaster)) {
//            LOGGER.info("1");
            resp.sendRedirect(req.getRequestURI() + "/master");
            return;
        }
        // if the user is not master but request currentGame in master mode
        if (req.getRequestURI().endsWith("/master") && !gameId.equals(gameMaster)) {
//            LOGGER.info("2");
            String newURL = req.getRequestURI().replace("/master", "");
            resp.sendRedirect(newURL);
            return;
        }
        req.setAttribute("isMaster", req.getPathInfo().contains("/master"));
        req.getRequestDispatcher("/jsp/game/currentGame.jsp").forward(req, resp);
    }
}
