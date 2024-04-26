package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
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
            LogContext.setUser(username);

            stats = new GetStatsPerRoleDAO(ds.getConnection(), username).access().getOutputParam();

            LOGGER.info("Stats successfully collected for user: %s", username);

            m = new Message("Access to stats of Player " + username + " that has played " + stats.size() + " roles");
            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());

            new ResourceList<StatsRole>(stats).toJSON(res.getOutputStream());

        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot search stats for user " + username + ": unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            LOGGER.info("Cannot search stats for user %s: unexpected error while accessing the database.", username, e);
            m.toJSON(res.getOutputStream());
        }
        catch (IOException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot return the stats for user " + username + ": unexpected error.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot return the stats for user %s: unexpected error.", username, e);
            m.toJSON(res.getOutputStream());
            throw e;
        }
        finally {
            LogContext.removeUser();
        }
    }
}
