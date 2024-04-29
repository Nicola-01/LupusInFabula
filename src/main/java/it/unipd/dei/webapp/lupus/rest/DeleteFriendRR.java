package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.DeleteFriendDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Rest Resource for deleting a friend relationship.
 * handle the DELETE request to delete one friend of the player
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class DeleteFriendRR extends AbstractRR {

    /**
     * Constructs a new DeleteFriendRR with the given request, response, and data source.
     *
     * @param req the HttpServletRequest object
     * @param res the HttpServletResponse object
     * @param ds  the DataSource object for database access
     */
    public DeleteFriendRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.DELETE_FRIEND, req, res, ds);
    }

    /**
     * Serves the request to delete a friend relationship.
     *
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doServe() throws IOException {
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());
        LogContext.setIPAddress(req.getRemoteAddr());

        Message m = null;

        try{
            Player player = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE));
            String friend_username = Friend.fromJSON(req.getInputStream()).getUsername();

            // creates a new DAO for accessing the database and deletes the employee
            Friend f = new DeleteFriendDAO(ds.getConnection(), player.getUsername(), friend_username).access().getOutputParam();

            if(f != null) {
                LOGGER.info("Friend successfully deleted.");

                res.setStatus(HttpServletResponse.SC_OK);
                f.toJSON(res.getOutputStream());
            } else {
                ErrorCode ec = ErrorCode.FRIEND_NOT_EXIST;
                res.setStatus(ec.getHTTPCode());
                LOGGER.warn("Friend not found. Cannot delete it.");
                m = new Message(String.format("Friend not found. Cannot delete it."), ec.getErrorCode(), null);
                res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                m.toJSON(res.getOutputStream());
            }

        } catch (SQLException ex) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            LOGGER.error("Cannot delete the friend: unexpected database error.", ex);
            m = new Message("Cannot delete the friend: unexpected database error.", ec.getErrorCode(), ex.getMessage());
            m.toJSON(res.getOutputStream());
        } catch (IOException e) {
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
