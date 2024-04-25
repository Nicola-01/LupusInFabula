package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetLogsDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.resource.ResourceList;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Handles the GET request for retrieving logs for a specific user.
 * Returns logs of games played by the specified user.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserLogsGetRR extends AbstractRR {

    /**
     * The username of the user whose logs are to be retrieved.
     */
    private final String username;

    /**
     * Creates a new UserLogsGetRR REST resource.
     *
     * @param username the username of the user.
     * @param req      the HTTP request.
     * @param res      the HTTP response.
     * @param ds       the dataSource for the connection.
     */
    public UserLogsGetRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_LOGS_USER, req, res, ds);
        this.username = username;
    }

    @Override
    protected void doServe() throws IOException {
        Message m = null;
        List<PlaysJoinGame> logs = null;

        try {
            logs = new GetLogsDAO(ds.getConnection(), username).access().getOutputParam();
            LOGGER.info("Logs successfully collected for user: %s", username);

        } catch (SQLException e) {
            m = new Message("Cannot search logs for user " + username + ": unexpected error while accessing the database.", "E200", e.getMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
            LOGGER.error("Cannot search logs for user %s: unexpected error while accessing the database.", username, e);
        }

        try {

            m = new Message("Access to logs of Player " + username + " that has played " + logs.size() + " games");
            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());
            new ResourceList<PlaysJoinGame>(logs).toJSON(res.getOutputStream());

        } catch (Exception e) {

            m = new Message("Logs not found for user " + username, "E200", e.getMessage());
            LOGGER.error("Logs not found for user %s", username, e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
            throw e;
        }
    }
}
