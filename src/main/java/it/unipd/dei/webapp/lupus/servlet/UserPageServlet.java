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

public class UserPageServlet extends AbstractDatabaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Message m = null;
        String uri = req.getRequestURI();

        try {
            if (uri.endsWith("/me"))
                req.getRequestDispatcher("/jsp/user/userPage.jsp").forward(req, resp);
            else {

                String username = uri.substring(uri.lastIndexOf("/lupus/habitant/") + 16);


                if (username.isEmpty()) {
                    username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                    resp.sendRedirect(req.getContextPath() + "/habitant/" + username);
                    return;
                }

                Player player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
                if (player_user == null) {
                    req.getRequestDispatcher("/jsp/pageNotFound.jsp").forward(req, resp);
                    return;
                }

                req.setAttribute("player", username);
                req.getRequestDispatcher("/jsp/testLogs/testlogs.jsp").forward(req, resp);

            }
        } catch (SQLException e) {
            ErrorCode er = ErrorCode.INTERNAL_ERROR;
            resp.setStatus(er.getHTTPCode());
            LOGGER.error("stacktrace:", e);
        }
    }
}