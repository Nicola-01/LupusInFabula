package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameInfoDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Handles the GET request for /game/status.
 * Returns the list of players with their respective roles that are playing a specific match.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameInfoRR extends AbstractRR {

    private final int gameID;
    private final boolean URIisMaster;

    /**
     * Creates a new GameInfo REST resource.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @param ds the dataSource for the connection.
     * @param gameID the ID of the game
     * @param URIisMaster whether the requested URI contained /master at the end
     */
    public GameInfoRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds, int gameID, boolean URIisMaster) {
        super(Actions.GET_GAME_STATUS_ACTION, req, res, ds);
        this.gameID = gameID;
        this.URIisMaster = URIisMaster;
    }

    /**
     * function to serve the request made to the url /game/status/{publicID} or /game/status/{publicID}/master
     */
    @Override
    protected void doServe() throws IOException {

        List<PlaysAsIn> el = null;
        Message m = null;

        String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setGame(gameID);
        try {
            String role = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, username).access().getOutputParam();
            el = new GetGameInfoDAO(ds.getConnection(), gameID, URIisMaster, username, role).access().getOutputParam();

            if (el != null) {
                LOGGER.info("Players successfully listed.");

                res.setStatus(HttpServletResponse.SC_OK);
                new ResourceList<PlaysAsIn>(el).toJSON(res.getOutputStream());

            } else { // it should not happen
                LOGGER.error("Fatal error while listing players.");

                m = new Message("Cannot list players: unexpected error.", "E5A1", null);
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
            }
        } catch (SQLException ex) {
            LOGGER.error("Cannot return game info: unexpected database error.", ex);

            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            m = new Message("Cannot return game info: unexpected database error.", ec.getErrorCode(), ex.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
        }
        finally
        {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeGame();
        }
    }
}
