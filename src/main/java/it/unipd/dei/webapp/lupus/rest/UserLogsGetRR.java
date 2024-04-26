package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetPlayerLogsDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
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
            if (new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam() != null)
            {
                LogContext.setUser(username);

                logs = new GetPlayerLogsDAO(ds.getConnection(), username).access().getOutputParam();

                LOGGER.info("Logs successfully collected for user: %s", username);

                m = new Message("Access to logs of Player " + username + " that has played " + logs.size() + " games");
                res.setStatus(HttpServletResponse.SC_OK);
                m.toJSON(res.getOutputStream());

                new ResourceList<PlaysJoinGame>(logs).toJSON(res.getOutputStream());
            }
            else {
                ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                res.setStatus(ec.getHTTPCode());
                m = new Message("Cannot search logs for user " + username + ": user not exists in the database.", ec.getErrorCode(), "One player does not exist.");
                LOGGER.warn("Cannot search logs for user %s: user not exists in the database.", username);
                m.toJSON(res.getOutputStream());
            }
        }
        catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot search logs for user " + username + ": unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            m.toJSON(res.getOutputStream());
            LOGGER.error("Cannot search logs for user %s: unexpected error while accessing the database.", username, e);
        }
        catch (IOException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot return logs for user " + username + ": unexpected error.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot return logs for user %s: unexpected error.", username, e);
            m.toJSON(res.getOutputStream());
            throw e;
        }
        finally {
            LogContext.removeUser();
        }
    }
}
