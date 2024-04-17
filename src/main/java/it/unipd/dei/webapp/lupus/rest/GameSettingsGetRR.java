package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
import it.unipd.dei.webapp.lupus.dao.SearchFriendsByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GameSettingsGetRR extends AbstractRR {

    public GameSettingsGetRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {

        // list of friends of the player creating the game
//        HttpSession session = req.getSession();
//        Player user = (Player) session.getAttribute("user");
//        List<Is_Friend_With> friends = null;


        List<Role> roles = new ArrayList<>();
        Message m = null;

        try {
//            friends = new SearchFriendsByUsernameDAO(ds.getConnection(), user.getUsername()).access().getOutputParam();
//            LOGGER.info("Searching friends by username: " + user.getUsername());
            roles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
            LOGGER.info("Searching roles");

        } catch (SQLException e) {
            m = new Message("Cannot search for roles: unexpected error while accessing the database.", "E200", e.getMessage());
            LOGGER.info("Cannot search for roles: unexpected error while accessing the database.", e);
            m.toJSON(res.getOutputStream());
        }

//        new ResourceList(friends).toJSON(res.getOutputStream());
        new ResourceList(roles).toJSON(res.getOutputStream());

    }
}
