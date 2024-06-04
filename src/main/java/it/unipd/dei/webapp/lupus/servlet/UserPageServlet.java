package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Manages requests related to user pages.
 * <p>
 * This servlet handles GET requests to display user pages and user statistics. It processes the request URI to determine
 * the requested user and retrieves the relevant information from the database. If an error occurs, it sends an
 * appropriate error response to the client.
 * </p>
 *
 * @version 1.0
 * @since 1.0
 */
public class UserPageServlet extends AbstractDatabaseServlet {

    /**
     * Handles the GET request for displaying user pages and statistics.
     * <p>
     * This method processes the GET request to display the user's page or statistics. It retrieves the username from
     * the request URI and fetches the corresponding player information from the database. If the session is valid and
     * the user is authenticated, it forwards the request to the appropriate JSP view for rendering. If an error occurs
     * during the process, an appropriate error message is sent to the client.
     * </p>
     *
     * @param req  the HTTP servlet request
     * @param resp the HTTP servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs while processing the request
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        if (req.getSession(false) == null || req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE) == null)
            resp.sendRedirect(req.getContextPath() + "/login");
        else {

            Message m = null;
            String uri = req.getRequestURI();
            Player player_user;

            try {
                if (uri.endsWith("/me"))
                    req.getRequestDispatcher("/jsp/user/userPage.jsp").forward(req, resp);
                else {

                    String username = uri.substring(uri.lastIndexOf("/lupus/habitant/") + 16);


                    if (username.isEmpty()) {
                        String username_requested = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                        resp.sendRedirect(req.getContextPath() + "/habitant/" + username_requested);
                        return;
                    } else {
                        player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
                        if (player_user == null) {
                            req.getRequestDispatcher("/jsp/pageNotFound.jsp").forward(req, resp);
                            return;
                        }
                        if (!username.equals(player_user.getUsername())) {
                            resp.sendRedirect(req.getContextPath() + "/habitant/" + player_user.getUsername());
                            return;
                        }
                    }

                    req.setAttribute("player", username);
                    req.getRequestDispatcher("/jsp/user/userStatistics.jsp").forward(req, resp);
                }

                }
            } catch (SQLException e) {
                ErrorCode er = ErrorCode.INTERNAL_ERROR;
                resp.setStatus(er.getHTTPCode());
                LOGGER.error("stacktrace:", e);
            }
        }
    }
}