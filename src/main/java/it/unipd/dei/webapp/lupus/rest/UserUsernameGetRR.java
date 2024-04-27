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

/**
 * Represents a REST resource handler for handling GET requests related to retrieving user information by username.
 * <p>
 * This class handles GET requests initiated to retrieve user information based on a specified username. It searches
 * the database for the user with the given username and returns the corresponding user information if found. If the
 * username is not found, an appropriate error message is returned.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserUsernameGetRR extends AbstractRR {

    /**
     * The username for which user information is requested.
     */
    private final String username;

    /**
     * Constructs a new UserUsernameGetRR object with the specified username, HTTP request, response, and data source.
     *
     * @param username the username for which user information is requested
     * @param req      the HTTP request
     * @param res      the HTTP response
     * @param ds       the data source
     */
    public UserUsernameGetRR(String username, HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.GET_USERNAME, req, res, ds);
        this.username = username;
    }

    /**
     * Handles the GET request for retrieving user information by username.
     * <p>
     * This method processes the GET request sent by the client to retrieve user information based on the specified
     * username. It searches the database for the user with the given username and returns the user information if
     * found. If the username is not found, an appropriate error message is returned.
     * </p>
     *
     * @throws IOException if an I/O error occurs while processing the request or sending the response
     */
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
