package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
import it.unipd.dei.webapp.lupus.dao.SelectSettingsDAO;
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
 * Handles the GET request for /game/settings.
 * Returns all the settings that can be used into a game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameSettingsGetRR extends AbstractRR {

    public GameSettingsGetRR( HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_SETTINGS, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException, SQLException {

        String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());
        try {
            List<Setting> settings = new SelectSettingsDAO(ds.getConnection()).access().getOutputParam();
            LOGGER.info("Searching settings");

            res.setStatus(HttpServletResponse.SC_OK);
            new ResourceList<>(settings).toJSON(res.getOutputStream());

        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            Message m = new Message("Cannot search for settings: unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot search for settings: unexpected error while accessing the database.", e);
            m.toJSON(res.getOutputStream());
        }
        finally {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
        }

    }
}
