package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

public class UserpageServlet extends AbstractDatabaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Message m = null;
        String uri = req.getRequestURI();
        String username = uri.substring(uri.lastIndexOf("/lupus/player") + 14);

        try {
            Player player_user = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();
            if(player_user == null) {
                ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                resp.setStatus(ec.getHTTPCode());
                LOGGER.info("Username not exists");
                m = new Message("Username not exists", ec.getErrorCode(), ec.getErrorMessage());
                req.setAttribute("message", m);
            }

        } catch (SQLException e) {
            ErrorCode er = ErrorCode.INTERNAL_ERROR;
            resp.setStatus(er.getHTTPCode());
            LOGGER.error("stacktrace:", e);
        }

        req.setAttribute("player", username);
        req.getRequestDispatcher("/jsp/testLogs/testlogs.jsp").forward(req, resp);

    }


}
