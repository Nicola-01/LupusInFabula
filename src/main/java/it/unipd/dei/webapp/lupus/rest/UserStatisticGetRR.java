package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Handles the GET request for retrieving statistics for a specific user.
 * Returns statistics of roles played by the specified user.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserStatisticGetRR extends AbstractRR {

    /**
     * The username of the user whose statistics are to be retrieved.
     */
    private final String username;

    /**
     * Creates a new UserStatisticGetRR REST resource.
     *
     * @param username the username of the user.
     * @param req      the HTTP request.
     * @param res      the HTTP response.
     * @param ds       the dataSource for the connection.
     */
    public UserStatisticGetRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_STATS_USER, req, res, ds);
        this.username = username;
    }

    @Override
    protected void doServe() throws IOException {
        Message m = null;
        List<StatsRole> stats = null;

        try {
            stats = new GetStatsPerRoleDAO(ds.getConnection(), username).access().getOutputParam();
            LOGGER.info("Stats successfully collected for user: %s", username);

        } catch (SQLException e) {
            m = new Message("Cannot search stats for user " + username + ": unexpected error while accessing the database.", "E200", e.getMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
            LOGGER.info("Cannot search stats for user %s: unexpected error while accessing the database.", username, e);
        }

        try {

            m = new Message("Access to stats of Player " + username + " that has played " + stats.size() + " roles");
            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());
            new ResourceList<StatsRole>(stats).toJSON(res.getOutputStream());

        } catch (Exception e) {
            m = new Message("Stats not found for user " + username, "E200", e.getMessage());
            LOGGER.error("Stats not found for user %s", username, e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
            throw e;
        }
    }
}
