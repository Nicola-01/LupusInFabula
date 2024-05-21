package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGamePlayersDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.postgresql.shaded.com.ongres.scram.common.message.ServerFinalMessage;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Handles the GET request for /game/status.
 * Returns the current status of the game for a specific match.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameStatusRR extends AbstractRR {

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * Creates a new GameStatusRR REST resource.
     *
     * @param req    the HTTP request.
     * @param res    the HTTP response.
     * @param ds     the dataSource for the connection.
     * @param gameID the ID of the game
     */
    public GameStatusRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds, int gameID) {
        super(Actions.GET_GAME_STATUS_ACTION, req, res, ds);
        this.gameID = gameID;
    }

    /**
     * function to serve the request made to the url /game/status/{publicID} or /game/status
     */
    @Override
    protected void doServe() throws IOException {

        String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setGame(gameID);
        try {
            LOGGER.info("Get status of game " + gameID);
            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            if (game != null) {
                res.setStatus(HttpServletResponse.SC_OK);
                game.toJSON(res.getOutputStream());
            }
            else{
                ErrorCode ec = ErrorCode.GAME_NOT_FOUND;
                Message m = new Message("Invalid game", ec.getErrorCode(),"The game doesn't exists.");
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
            }

        } catch (SQLException ex) {
            LOGGER.error("Cannot return game info: unexpected database error.", ex);

            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("Cannot return game info: unexpected database error.", ec.getErrorCode(), ex.getMessage());
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
