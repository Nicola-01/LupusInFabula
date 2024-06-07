package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Servlet that manages the "current game" section.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class CurrentGameServlet extends AbstractDatabaseServlet
{
    /**
     * Handles a GET request for "current game" section of the webapp.
     * Current game shows a match between players, which is managed by a master.
     *
     * @param req the HTTP request.
     * @param resp the HTTP response.
     * @throws ServletException if any server side errors occur.
     * @throws IOException to handle I/O errors.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        // if the user isn't logged in, redirect to login page
        if(req.getSession(false) == null)
            resp.sendRedirect(req.getContextPath() + "/login");
        else {
            // check if user is a master of some match
            String gameMaster = (String) req.getSession().getAttribute("gamemaster");
            String[] urlParts = req.getRequestURI().split("/");

            // if the url is /lupus/village
            // so there's no public game ID
            // redirect the user to its game if the game exists
            // otherwise redirect him/her to the homepage
            if (urlParts.length == 3) {
                String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                try {
                    int privateGameID = new GetGameIdByPlayerUsernameDAO(getConnection(), username).access().getOutputParam();
                    Game game = new GetGameByGameIdDAO(getConnection(), privateGameID).access().getOutputParam();
                    if (game == null) {
                        resp.sendRedirect("/lupus/home");
                        return;
                    } else {
                        resp.sendRedirect("/lupus/village/" + game.getPublic_ID());
                        return;
                    }
                } catch (SQLException e) {
                    ErrorCode ec = ErrorCode.INTERNAL_ERROR;
                    resp.setStatus(ec.getHTTPCode());

                    LOGGER.info("Internal error");
                    Message m = new Message("Internal error", ec.getErrorCode(), e.getMessage());
                    req.setAttribute("message", m);
                }
            }

            // if the url contains a public game ID
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
                // set this attribute if the game is over
                if (game.getWho_win() >= 0)
                    req.setAttribute("gameOver", game.getWho_win());
            } catch (SQLException e) {
                ErrorCode ec = ErrorCode.INTERNAL_ERROR;
                resp.setStatus(ec.getHTTPCode());

                LOGGER.info("Internal error");
                Message m = new Message("Internal error", ec.getErrorCode(), e.getMessage());
                req.setAttribute("message", m);
            }

            // handle master page / user page
            // if the user is master and it's not requesting currentGame in master mode
            if (!req.getRequestURI().endsWith("/master") && gameId.equals(gameMaster)) {
                resp.sendRedirect(req.getRequestURI() + "/master");
                return;
            }
            // if the user is not master but request currentGame in master mode
            if (req.getRequestURI().endsWith("/master") && !gameId.equals(gameMaster)) {
                String newURL = req.getRequestURI().replace("/master", "");
                resp.sendRedirect(newURL);
                return;
            }
            req.setAttribute("isMaster", req.getPathInfo().contains("/master"));
            req.getRequestDispatcher("/jsp/game/currentGame.jsp").forward(req, resp);
        }
    }
}
