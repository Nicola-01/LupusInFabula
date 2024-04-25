package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.ListFriendsDAO;
import it.unipd.dei.webapp.lupus.resource.*;
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

        List<Friend> fl = null;
        Message m = null;
        Player player = (Player) req.getSession().getAttribute("user");
        try {

            // creates a new DAO for accessing the database and lists the employee(s)
            fl = new ListFriendsDAO(ds.getConnection(), player.getUsername()).access().getOutputParam();

            if (fl != null) {
                LOGGER.info("Friend(s) successfully listed.");
                res.setStatus(HttpServletResponse.SC_OK);
                new ResourceList(fl).toJSON(res.getOutputStream());
            } else { // it should not happen
                LOGGER.error("Fatal error while listing friend(s).");

                m = new Message("Cannot list friend(s): unexpected error.", "E5A1", null);
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
            }
        } catch (SQLException ex) {
            LOGGER.error("Cannot list friend(s): unexpected database error.", ex);

            m = new Message("Cannot list friend(s): unexpected database error.", "E5A1", ex.getMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
        }
    }
}
