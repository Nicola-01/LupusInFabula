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
        super(Actions.DELETE_USER, req, res, con);
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            // TODO --> implement the password verification of the user
            String username = ((Player) req.getSession().getAttribute("user")).getUsername();
            LOGGER.info("Username: " + username + " --> trying to delete the account");
            int result = new DeletePlayerDAO(con, username).access().getOutputParam();

            if (result == 1) {

                m = new Message("User successfully deleted");
                LOGGER.info("User successfully deleted");
                res.setStatus(HttpServletResponse.SC_OK);
                m.toJSON(res.getOutputStream());
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            } else {

                m = new Message("User not found");
                LOGGER.info("User not found");
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            }

        } catch (SQLException e) {

            // TODO --> check the error code
            m = new Message("User not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
