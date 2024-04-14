package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;
import it.unipd.dei.webapp.lupus.resource.Role;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

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
            List<String> selectedPlayers = new ArrayList<>();
            List<Role> roles = new SelectRoleDAO(getConnection()).access().getOutputParam();
            Map<String, Integer> selectedRoles = new HashMap<>();
            int totalRoles = 0;
            boolean exit = false;

            for (Role role : roles) {
                selectedRoles.put(role.getName(), 0);
            }

            // Gets all parameters passed
            Enumeration<String> parameterNames = request.getParameterNames();
            int playerIndex = 1;
            while (parameterNames.hasMoreElements()) {
                String paramName = parameterNames.nextElement();
                // If start with player -> is a player, I check if exist
                if (paramName.startsWith("player")) {
                    if (paramName.equals("player" + playerIndex)) { // check if sequence number is correct
                        playerIndex++;
                        String username = request.getParameter(paramName);
                        // Check if username exist, and obtain the correct name (Lowercase and Lowrcase)
                        Player selectedPlayer = new SearchPlayerByUsernameDAO(getConnection(), username)
                                .access().getOutputParam();
                        if (selectedPlayer == null) { // check if player not exist
                            // TODO, message and error
                            ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                            response.setStatus(ec.getHTTPCode());

                            Message m = new Message("PLAYER " + username + " does not exist", "" + ec.getErrorCode(), ec.getErrorMessage());
                            request.setAttribute("message", m);

                            // LOGGER.debug("User have invalid fields"); // .debug not work
                            LOGGER.info("%s does not exist", username);
                            exit = true;
                            break;
                        }
                        selectedPlayers.add(selectedPlayer.getUsername()); // if it exists, add to the player list
                    } else { // check if sequence number not correct
                        // TODO, message and error
                        ErrorCode ec = ErrorCode.INVALID_GAMESETTINGS;
                        response.setStatus(ec.getHTTPCode());

                        Message m = new Message("Parameter  " + paramName + " is not valid, paramName: player" + playerIndex, "" + ec.getErrorCode(), ec.getErrorMessage());
                        request.setAttribute("message", m);

                        // LOGGER.debug("User have invalid fields"); // .debug not work
                        LOGGER.info("Parameter %s is not valid, paramName: player%d", paramName, playerIndex);
                        exit = true;
                        break;
                    }
                } else if (isValidRole(roles, paramName)) { // if the parameter not start with player -> is a role, check if exists
                    int number = Integer.parseInt(request.getParameter(paramName));
                    selectedRoles.put(paramName, number); // add role and number to the map
                    totalRoles += number; // total number of roles
                } else {
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.ROLE_NOT_EXIST;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("ROLE " + paramName + " does not exist", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("ROLE %s does not exist", paramName);
                    exit = true;
                    break;
                }
            }
            if (exit) { // error in the while loop
                request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
            } else {
                int totalPlayers = selectedPlayers.size();

                if(totalPlayers < 5) {
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NOT_ENOUGH_PLAYERS;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Not enough players, player number: " + totalPlayers + " minimum required 5",
                            "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Not enough players, player number: %d minimum required 5", totalPlayers);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                }
                else if (totalPlayers != totalRoles) { // check if number of players it's equal to number of roles
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NUMBER_PLAYERS_ROLES_NOT_MATCH;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Player number " + totalPlayers + " does not match the number of roles " + totalRoles,
                            "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Player number %d does not match the number of roles %d", totalPlayers, totalRoles);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                } else if (!isValidRolesCardinality(selectedRoles, roles)) {

                    // TODO, message and error
                    ErrorCode ec = ErrorCode.INVALID_ROLES_CARDINALITY;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("One or more roles have exceeded the maximum cardinality",
                            "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("One or more roles have exceeded the maximum cardinality", totalPlayers, totalRoles);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                } else {

                    // TODO: check the roles number
                    // e.g number of wolf <= 1/4 total number

                    // TODO check

                    int gameID = new CreateGameDAO(getConnection()).access().getOutputParam();
                    LOGGER.info("GAME created, gameID: %d", gameID);


                    // TODO add master
//                    HttpSession session = request.getSession();
//                    Player gameMaster = (Player) session.getAttribute("player");
//                    int masterID = new SearchRoleByNameDAO(getConnection(), "master").access().getOutputParam().getId();
//
//                    PlaysAsIn master_playsAsIn = new PlaysAsIn(gameMaster.getUsername(), gameID, masterID);
//                    new InsertIntoPlayAsInDAO(getConnection(), master_playsAsIn).access();


                    for (int i = 0; i < totalPlayers; i++) {
                        String selectedRole = randomRole(selectedRoles);
                        int selectedRoleID = new SearchRoleByNameDAO(getConnection(), selectedRole).access().getOutputParam().getId();

                        PlaysAsIn playsAsIn = new PlaysAsIn(selectedPlayers.get(i), gameID, selectedRoleID);
                        new InsertIntoPlayAsInDAO(getConnection(), playsAsIn).access();
                        LOGGER.info("Player %s PlaysAsIn %s", selectedPlayers.get(i), playsAsIn.getRoleId());
                    }
                }
            }
        } catch (
                SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private boolean isValidRolesCardinality(Map<String, Integer> selectedRoles, List<Role> roles) {
        for (Role role : roles)
            if (selectedRoles.get(role.getName()) > role.getMax_number()) // role
                return false;
        // TODO Evil roles <= 1/4 all roles
        return true;
    }

    private boolean isValidRole(List<Role> roles, String roleToCheck) {
        for (Role role : roles)
            if (role.getName().equals(roleToCheck))
                return true;
        return false;
    }

    private String randomRole(Map<String, Integer> roles) throws SQLException {
        Random rand = new Random();
        String[] availableRoles = roles.keySet().toArray(new String[0]);
        String role;

        do {
            role = availableRoles[rand.nextInt(availableRoles.length)];
        } while (roles.get(role) == 0);
        roles.put(role, roles.get(role) - 1);

        if (roles.get(role) == 0)
            roles.remove(role);

        return role;
    }
}
