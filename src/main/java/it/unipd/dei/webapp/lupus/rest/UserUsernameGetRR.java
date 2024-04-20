package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

public class UserUsernameGetRR extends AbstractRR {

    private final String username;

    public UserUsernameGetRR(String username, HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.GET_USERNAME, req, res, ds);
        this.username = username;
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        //I take the substring after the last /
        Player player;
        Message m;

        try {

            player = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();

            if (player != null) {

                m = new Message("User " + username + " successfully found.");
                LOGGER.info("User %s successfully found.", username);
                res.setStatus(HttpServletResponse.SC_OK);
                m.toJSON(res.getOutputStream());
                // TODO insert the jsp file linked to this servlet
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            } else {

                m = new Message("Username " + username + " not found");
                LOGGER.info("Username %s not found", username);
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
                // TODO --> insert the jsp file linked to this servlet (the jsp for the error)
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            }

        } catch (SQLException e) {

            // TODO --> check the error code
            m = new Message("Username not found", "E200", e.getMessage());
            LOGGER.info("Unable to send a response", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } catch (Exception e) {

            LOGGER.error("Unable to send response", e);
            throw e;

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }
    }
}
