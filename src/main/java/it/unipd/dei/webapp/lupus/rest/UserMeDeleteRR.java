package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.DeletePlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

public class UserMeDeleteRR extends AbstractRR {

    public UserMeDeleteRR(final HttpServletRequest req, final HttpServletResponse res, Connection con) {
        super(Actions.ADD_ACTIONS, req, res, con);
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            HttpSession session = req.getSession();
            String username = ((Player) session.getAttribute("player")).getUsername();
            LOGGER.info("Username: " + username + " --> trying to delete the account");
            int result = new DeletePlayerDAO(con, username).access().getOutputParam();

            if (result == 1) {

                LOGGER.info("Player successfully deleted");
                // TODO --> add the page linked to this servlet (for successfully deleted player)
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            } else {

                m = new Message("Player not found");
                LOGGER.info("Player not found");
                req.setAttribute("m", m);
                // TODO --> add the page linked to this servlet (for the player not found)
                //req.getRequestDispatcher("/jsp/...").forward(req, res);
            }

        } catch (SQLException e) {

            // TODO --> check the error code
            m = new Message("Player not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
