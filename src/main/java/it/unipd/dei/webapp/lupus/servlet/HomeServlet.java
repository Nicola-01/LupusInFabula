package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.PlayerInGameDAO;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

public class HomeServlet extends AbstractDatabaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            HttpSession session = req.getSession(false);
            Player player = (Player) session.getAttribute("player");

            int gameID = new PlayerInGameDAO(getConnection(), player.getUsername()).access().getOutputParam();

            if (gameID != -1) { // The player is in a game
                session.setAttribute("gameID", gameID);
                session.setAttribute("player", player);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
}
