package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GameConfigurationDAO;
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
 * Handles the GET request for /game/configuration/{game}.
 * Returns all the roles in the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameConfigurationGet extends AbstractRR {

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * Constructs a new GameConfigurationGet object with the specified game ID, request, response, and data source.
     *
     * @param req    the HTTP request.
     * @param res    the HTTP response.
     * @param ds     the dataSource for the connection.
     * @param gameID the ID of the game
     */
    public GameConfigurationGet(HttpServletRequest req, HttpServletResponse res, DataSource ds, int gameID) {
        super(Actions.GET_GAME_CONFIGURATION, req, res, ds);

        this.gameID = gameID;
    }

    @Override
    protected void doServe() throws IOException {

        String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setGame(gameID);

        try {
            LOGGER.info("Get configuration of game " + gameID);
            List<Role> roles = new GameConfigurationDAO(ds.getConnection(), gameID).access().getOutputParam();
            if (!roles.isEmpty()) {
                res.setStatus(HttpServletResponse.SC_OK);
                new ResourceList<>(roles).toJSON(res.getOutputStream());
            }
        } catch (SQLException e) {
            LOGGER.error("Cannot return game configuration: unexpected database error.", e);

            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("Cannot return game configuration: unexpected database error.", ec.getErrorCode(), e.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());

        } finally {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeGame();
        }
    }

}
