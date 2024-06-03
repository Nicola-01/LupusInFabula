package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.AddFriendDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.postgresql.util.PSQLException;

import javax.sql.DataSource;
import java.io.EOFException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;

/**
 * Rest Resource for adding a friend relationship.
 * handles the POST request to add a friend
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class AddFriendRR extends AbstractRR {

    /**
     * Constructs a new AddFriendRR with the given request, response, and data source.
     *
     * @param req the HttpServletRequest object
     * @param res the HttpServletResponse object
     * @param ds  the DataSource object for database access
     */
    public AddFriendRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_FRIEND, req, res, ds);
    }

    /**
     * Serves the request to add a friend relationship.
     *
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doServe() throws IOException {
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());
        LogContext.setIPAddress(req.getRemoteAddr());

        Message m = null;

        try {
            Player player = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE));
            String friend_username = Friend.fromJSON(req.getInputStream()).getUsername();
            Date date = new Date(System.currentTimeMillis());

            // creates a new DAO for accessing the database and stores the employee
            Friend f = new AddFriendDAO(ds.getConnection(), player.getUsername(), friend_username, date).access().getOutputParam();

            if (player.getUsername().equals(friend_username)) {
                ErrorCode ec = ErrorCode.INVALID_FRIEND;
                res.setStatus(ec.getHTTPCode());
                m = new Message("Cannot add yourself as a friend.", ec.getErrorCode(), "Invalid operation: a player cannot be friends with themselves.");
                m.toJSON(res.getOutputStream());
                return;
            }

            if (f != null) {
                LOGGER.info("Friend successfully added.");

                res.setStatus(HttpServletResponse.SC_CREATED);
                f.toJSON(res.getOutputStream());
            }
        } catch (EOFException ex) {
            LOGGER.warn("Cannot add the friend: no Friend JSON object found in the request.", ex);

            ErrorCode ec = ErrorCode.INVALID_JSON_FORMAT;
            m = new Message("Cannot add the friend: no Friend JSON object found in the request.", ec.getErrorCode(),
                    ex.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
        } catch (SQLException ex) {

            if ("23505".equals(ex.getSQLState())) {
                ErrorCode ec = ErrorCode.FRIEND_ALREADY_EXIST;
                res.setStatus(ec.getHTTPCode());
                LOGGER.warn("This player is already your friend.");
                m = new Message("This player is already your friend.", ec.getErrorCode(), ex.getMessage());
                m.toJSON(res.getOutputStream());
            } else if (ex.getMessage().contains("is_friend_with_friend_username_fkey")) {

                ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                res.setStatus(ec.getHTTPCode());
                LOGGER.warn("Cannot add the friend: friend username doesn't exist.");
                m = new Message("Cannot add the friend: friend username doesn't exist.", ec.getErrorCode(), ex.getMessage());
                m.toJSON(res.getOutputStream());
            } else {
                ErrorCode ec = ErrorCode.DATABASE_ERROR;
                res.setStatus(ec.getHTTPCode());
                LOGGER.error("Cannot add the friend: unexpected database error.", ex);
                m = new Message("Cannot add the friend: unexpected database error.", ec.getErrorCode(), ex.getMessage());
                m.toJSON(res.getOutputStream());
            }

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
