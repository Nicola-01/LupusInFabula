package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;
import it.unipd.dei.webapp.lupus.resource.Role;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

@WebServlet(name = "GameSettingsServlet", value = "/game/settings")
public class GameSettingsServlet extends AbstractDatabaseServlet {

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

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            // TODO: check all users who have been passed, that they exist and that they are not in another game
            String players = request.getParameter("players");

            // TODO: check the roles entered and their number
            // e.g number of wolf <= 1/4 total number
            String roles = request.getParameter("roles");

            // TODO
            Map<String, Integer> selectedRoles = new HashMap<>();
            List<String> selectedPlayers = new ArrayList<>();

            // Example
            selectedRoles.put("wolf", 3);
            selectedRoles.put("farmer", 2);
            selectedRoles.put("seer", 1);
            selectedRoles.put("jester", 1);
            selectedRoles.put("hamster", 1);
            selectedRoles.put("knight", 0);

            selectedPlayers.add("User1");
            selectedPlayers.add("User2");
            selectedPlayers.add("User3");
            selectedPlayers.add("User4");
            selectedPlayers.add("User5");
            selectedPlayers.add("User6");
            selectedPlayers.add("User7");
            selectedPlayers.add("User8");

            int totalPlayers = selectedPlayers.size();

            int gameID = new CreateGameDAO(getConnection()).access().getOutputParam();
            LOGGER.info("GAME created, gameID: %d", gameID);

            for (int i = 0; i < totalPlayers; i++) {
                String selectedRole = randomRole(selectedRoles);
                int selectedRoleID = new SearchRoleByNameDAO(getConnection(), selectedRole).access().getOutputParam().getId();

                String selectedPlayer = new SearchPlayerByUsernameDAO(getConnection(), // This way I am sure that the name is written correctly
                        selectedPlayers.get(i)).access().getOutputParam().getUsername();

                PlaysAsIn playsAsIn = new PlaysAsIn(selectedPlayer, gameID, selectedRoleID);
                new InsertIntoPlayAsInDAO(getConnection(), playsAsIn).access();
                LOGGER.info("Player %s PlaysAsIn %s", selectedPlayers.get(i), playsAsIn.getRoleId());
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private String randomRole(Map<String, Integer> roles) throws SQLException {
        Random rand = new Random();
        String[] availableRoles = roles.keySet().toArray(new String[0]);
        String role;

        do {
            role = availableRoles[rand.nextInt(availableRoles.length)];
        } while (roles.get(role) == 0);
        roles.put(role, roles.get(role) - 1);

        if(roles.get(role) == 0)
            roles.remove(role);

        return role;
    }
}
