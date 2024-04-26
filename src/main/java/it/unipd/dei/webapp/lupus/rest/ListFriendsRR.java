package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.ListFriendsDAO;
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
 * Rest Resource for listing friends of a player.
 * handles the GET request to retrieve the list of friends
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class ListFriendsRR extends AbstractRR {

    /**
     * Constructs a new ListFriendsRR with the given request, response, and data source.
     *
     * @param req the HttpServletRequest object
     * @param res the HttpServletResponse object
     * @param ds  the DataSource object for database access
     */
    public ListFriendsRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.LIST_FRIENDS, req, res, ds);
    }

    /**
     * Serves the request to list friends of a player.
     *
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doServe() throws IOException {
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());
        LogContext.setIPAddress(req.getRemoteAddr());


        List<Friend> fl = null;
        Message m = null;
        Player player = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE));

        try {

            // creates a new DAO for accessing the database and lists the employee(s)
            fl = new ListFriendsDAO(ds.getConnection(), player.getUsername()).access().getOutputParam();

            if (fl != null) {
                LOGGER.info("Friend(s) successfully listed.");
                res.setStatus(HttpServletResponse.SC_OK);
                new ResourceList(fl).toJSON(res.getOutputStream());
            }

        } catch (SQLException ex) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot list friend(s): unexpected database error.", ec.getErrorCode(), ex.getMessage());
            LOGGER.error("Cannot list friend(s): unexpected database error.", ex);
            m.toJSON(res.getOutputStream());
        }catch (IOException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            m = new Message("Cannot return the possible actions: unexpected error", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Error to return the possible actions.", e);
            // An error occurred while processing the request. Unable to generate role search
            // results due to an unexpected database access error.
            m.toJSON(res.getOutputStream());
        }finally{
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeAction();
        }
    }
}
