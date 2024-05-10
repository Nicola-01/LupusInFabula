package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.dao.PlayerInGameDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByPartialUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class SearchPlayerRR extends AbstractRR {

    private final String username;

    /**
     * Creates a new REST resource.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @param ds  the dataSource for the connection.
     */
    public SearchPlayerRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.SEARCH_PLAYER, req, res, ds);
        this.username = username;
    }

    @Override
    protected void doServe() throws IOException {
        Message m = null;

        try {
            LogContext.setUser(username);
            List<Player> players = new SearchPlayerByPartialUsernameDAO(ds.getConnection(), username).access().getOutputParam();

            for (Player p : players)
                p.setGameId(new PlayerInGameDAO(ds.getConnection(), p.getUsername()).access().getOutputParam());

            res.setStatus(HttpServletResponse.SC_OK);
            new ResourceList<>(players).toJSON(res.getOutputStream());

        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot search the " + username + ": unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot search the user %s: unexpected error while accessing the database.", username, e);
            m.toJSON(res.getOutputStream());
        } catch (IOException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot return the user " + username + ": unexpected error.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot return the user %s: unexpected error.", username, e);
            m.toJSON(res.getOutputStream());
            throw e;
        } finally {
            LogContext.removeUser();
        }
    }
}
