package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SelectRoleByTypeDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Role;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "GameSettingsServlet", value = "/game/settings")
public class GameSettingsServlet extends AbstractDatabaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        super.doPost(request, response);

        // TODO: check all users who have been passed, that they exist and that they are not in another game
        String players = request.getParameter("players");

        // TODO: check the roles entered and their number
        String roles = request.getParameter("roles");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // list of friends of the player creating the game
        List<Player> friends = null; // GetFriendsOfUserDAO

        List<List<Role>> roles = new ArrayList<>();
        Message m = null;

        try {
            for (int i = 0; i < 4; i++) {
                roles.add(new SelectRoleByTypeDAO(getConnection(), i).access().getOutputParam());
                LOGGER.info("Roles successfully selected by type: %d", i);
            }
            LOGGER.info("Roles successfully selected by type");

        } catch (SQLException e) {
            m = new Message("Cannot search for roles: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for roles: unexpected error while accessing the database.", e);
        }

        request.setAttribute("friends", friends);
        request.setAttribute("roles", roles);
        request.setAttribute("m", m);


    }
}
