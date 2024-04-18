package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GameRole;
import it.unipd.dei.webapp.lupus.utils.RoleType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

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
            m = new Message("Cannot search for roles: unexpected error while accessing the database.", "E200", e.getMessage());
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

            for (Role role : roles)
                selectedRoles.put(role.getName(), 0);

            // Gets all parameters passed
            Enumeration<String> parameterNames = request.getParameterNames();
            int playerIndex = 1;
            while (parameterNames.hasMoreElements()) {
                String paramName = parameterNames.nextElement();
                // If start with player -> is a player, I check if exist
                if (paramName.startsWith("player")) {

                    if (!paramName.equals("player" + playerIndex)) { // check if sequence number not correct
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

                    String username = request.getParameter(paramName);
                    // Check if username exist, and obtain the correct name (Lowercase and Lowercase)
                    Player validPlayer = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();

                    if (validPlayer == null) {
                        // TODO, message and error
                        ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                        response.setStatus(ec.getHTTPCode());

                        Message m = new Message("PLAYER " + username + " does not exist", "" + ec.getErrorCode(), ec.getErrorMessage());
                        request.setAttribute("message", m);

                        // LOGGER.debug("User have invalid fields"); // .debug not work
                        LOGGER.info("USER %s does not exist", username);
                        exit = true;
                        break;
                    }

                    username = validPlayer.getUsername();

                    // check if the player is already in a game
                    if (new PlayerInGameDAO(getConnection(), username).access().getOutputParam() != -1) {
                        // TODO, message and error
                        ErrorCode ec = ErrorCode.PLAYER_ALREADY_IN_GAME;
                        response.setStatus(ec.getHTTPCode());

                        Message m = new Message("PLAYER " + username + " is already in a game", "" + ec.getErrorCode(), ec.getErrorMessage());
                        request.setAttribute("message", m);

                        // LOGGER.debug("User have invalid fields"); // .debug not work
                        LOGGER.info("USER %s is already in a game", username);
                        exit = true;
                        break;
                    }
                    // the player is correct added to the new game
                    playerIndex++;
                    selectedPlayers.add(validPlayer.getUsername()); // if it exists, add to the player list

                }
                // if the parameter not start with player -> is a role, check if exists
                else if (isValidRole(roles, paramName)) {
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
                // check the validity of the settings, e.g. number of roles in comparison with number of players
                int totalPlayers = selectedPlayers.size();

                if (totalPlayers < 5) { // at least 5 players, exclude the master
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NOT_ENOUGH_PLAYERS;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Not enough players, player number: " + totalPlayers + " minimum required 5", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Not enough players, player number: %d minimum required 5", totalPlayers);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                } else if (!isValidRolesCardinality(selectedRoles, roles)) { // check if role cardinality respect the maximum
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.INVALID_ROLES_CARDINALITY;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("One or more roles have exceeded the maximum cardinality", "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("One or more roles have exceeded the maximum cardinality", totalPlayers, totalRoles);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                } else if (totalPlayers != totalRoles) { // check if number of players it's equal to number of roles
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NUMBER_PLAYERS_ROLES_NOT_MATCH;
                    response.setStatus(ec.getHTTPCode());

                    Message m = new Message("Player number " + totalPlayers + " does not match the number of roles " + totalRoles, "" + ec.getErrorCode(), ec.getErrorMessage());
                    request.setAttribute("message", m);

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Player number %d does not match the number of roles %d", totalPlayers, totalRoles);
                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
                }
                // Create the game
                else {

                    Game newGame = new CreateGameDAO(getConnection(), roles).access().getOutputParam();
                    int gameID = newGame.getId();
                    String publicID = newGame.getPublic_ID();
                    LOGGER.info("GAME created, gameID: (%d, %s)", gameID, publicID);


                    // TODO add master
                    HttpSession session = request.getSession(false);
                    Player gameMaster = (Player) session.getAttribute("user");
                    int masterID = new SearchRoleByNameDAO(getConnection(), "master").access().getOutputParam().getId();

                    PlaysAsIn master_playsAsIn = new PlaysAsIn(gameMaster.getUsername(), gameID, masterID);
                    new InsertIntoPlayAsInDAO(getConnection(), master_playsAsIn).access();

                    session.setAttribute("master", gameID);
//                    session.setAttribute("gameID", gameID);


                    for (int i = 0; i < totalPlayers; i++) {
                        String selectedRole = randomRole(selectedRoles);
                        int selectedRoleID = new SearchRoleByNameDAO(getConnection(), selectedRole).access().getOutputParam().getId();

                        PlaysAsIn playsAsIn = new PlaysAsIn(selectedPlayers.get(i), gameID, selectedRoleID);
                        new InsertIntoPlayAsInDAO(getConnection(), playsAsIn).access();
                        LOGGER.info("Player %s PlaysAsIn %s", selectedPlayers.get(i), playsAsIn.getRoleId());
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * It checks that the number of roles chosen respects prerequisites.<br>
     * - Roles must have a minimum of 0, or 1 in the case of wolves and must respect the maximum
     * number depending on the role, all have a maximum of 1 except for wolves and farmers.<br>
     * - Evil roles must be less than a quarter
     *
     * @param selectedRoles Map with the roles and the selected cardinality
     * @param roles         List with all the roles
     * @return True if all prerequisites have been satisfied.
     */
    private boolean isValidRolesCardinality(Map<String, Integer> selectedRoles, List<Role> roles) {
        Map<Integer, Integer> type = new HashMap<>(); // roleType it's the key
        int totalRolesNumber = 0;
        for (Role role : roles) {
            if (role.getName().equals(GameRole.MASTER.getName())) continue;

            int cardinality = selectedRoles.get(role.getName());
            if (cardinality < 0 || cardinality > role.getMax_number()) // invalid role cardinality
                return false;
            if (role.getName().equals(GameRole.WOLF.getName()) && cardinality == 0) // at least one wolf
                return false;
            type.put(role.getType(), cardinality);
            totalRolesNumber += cardinality;
        }
        return type.get(RoleType.EVIL.getType()) <= totalRolesNumber / 4;
    }

    private boolean isValidRole(List<Role> roles, String roleToCheck) {
        for (Role role : roles)
            if (role.getName().equals(roleToCheck)) return true;
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

        if (roles.get(role) == 0) roles.remove(role);

        return role;
    }
}
