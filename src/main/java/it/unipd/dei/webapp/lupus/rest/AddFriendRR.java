package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.AddFriendDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.postgresql.util.PSQLException;

import javax.sql.DataSource;
import java.io.EOFException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;

public class AddFriendRR extends AbstractRR{

    public AddFriendRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_FRIEND, req, res, ds);
    }


    @Override
    protected void doServe() throws IOException {

        Message m = null;

        try {
            Player player = (Player) req.getSession().getAttribute("user");
            String friend_username = Friend.fromJSON(req.getInputStream()).getUsername();
            Date date = new Date(System.currentTimeMillis());

            // creates a new DAO for accessing the database and stores the employee
            Friend f = new AddFriendDAO(ds.getConnection(), player.getUsername(), friend_username, date).access().getOutputParam();

            if (f != null) {
                LOGGER.info("Friend successfully added.");

                res.setStatus(HttpServletResponse.SC_CREATED);
                f.toJSON(res.getOutputStream());
            } else { // it should not happen
                LOGGER.error("Fatal error while adding friend.");

                m = new Message("Cannot create the friend: unexpected error.", "E5A1", null);
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
            }
        } catch (EOFException ex) {
            LOGGER.warn("Cannot add the friend: no Friend JSON object found in the request.", ex);

            m = new Message("Cannot add the friend: no Friend JSON object found in the request.", "E4A8",
                    ex.getMessage());
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            m.toJSON(res.getOutputStream());
        } catch (SQLException ex) {
            if ("23505".equals(ex.getSQLState())) {
                LOGGER.warn("Cannot add the friend: it already exists.");

                m = new Message("Cannot add the friend: it already exists.", "E5A2", ex.getMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
            } else if (ex.getMessage().contains("is_friend_with_friend_username_fkey")) {
                LOGGER.warn("Cannot add the friend: friend username does not exist in the 'player' table.");
                m = new Message("Cannot add the friend: friend username does not exist in the 'player' table.", "E5A3", ex.getMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
            }else {
                LOGGER.error("Cannot add the friend: unexpected database error.", ex);

                m = new Message("Cannot add the friend: unexpected database error.", "E5A1", ex.getMessage());
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
            }
        }
    }
}
