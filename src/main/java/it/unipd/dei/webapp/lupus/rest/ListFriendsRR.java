package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.SearchFriendsByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class ListFriendsRR extends AbstractRR{

    public ListFriendsRR(final HttpServletRequest req, final HttpServletResponse res, Connection con) {
        super(Actions.LIST_FRIENDS, req, res, con);
    }


    @Override
    protected void doServe() throws IOException {

        List<Is_Friend_With> fl = null;
        Message m = null;
        Player player = (Player) req.getSession().getAttribute("user");
        try {

            // creates a new DAO for accessing the database and lists the employee(s)
            fl = new SearchFriendsByUsernameDAO(con, player.getUsername()).access().getOutputParam();

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
