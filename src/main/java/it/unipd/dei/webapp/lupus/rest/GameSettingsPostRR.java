package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GameRole;
import it.unipd.dei.webapp.lupus.utils.RoleType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.*;

public class GameSettingsPostRR extends AbstractRR {

    public GameSettingsPostRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {

        LOGGER.info("Handling game settings");
        InputStream inputStream = req.getInputStream();

        try {
            String JSON = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            InputStream stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
            List<RoleCardinality> roleCardinalities = RoleCardinality.fromJSON(stream);

            stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
            List<String> givenPlayers = Player.fromJSON(stream);
            List<String> selectedPlayers = new ArrayList<>();
//            for (String player : givenPlayers) {
//                LOGGER.info(player);
//            }

            int totalRoles = 0;
            boolean exit = false;

            List<Role> realRoles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
            // remove master from the list
            realRoles.removeIf(role -> Objects.equals(role.getName(), GameRole.MASTER.getName()));

            Map<String, Integer> selectedRoles = new HashMap<>();
            for (Role role : realRoles)
                selectedRoles.put(role.getName(), 0); // set all cardinality to 0

            // Name check
            for (String username : givenPlayers) {
                Player validPlayer = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();

                // Check if username exist, and obtain the correct name (Lowercase and Lowercase)
                if (validPlayer == null) {
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("PLAYER " + username + " does not exist", "" + ec.getErrorCode(), ec.getErrorMessage());
//                    m.toJSON(res.getOutputStream());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("USER %s does not exist", username);
                    exit = true;
                    break;
                }
                username = validPlayer.getUsername();

                // check if the player is already in a game
                if (new PlayerInGameDAO(ds.getConnection(), username).access().getOutputParam() != -1) {
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.PLAYER_ALREADY_IN_GAME;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("PLAYER " + username + " is already in a game", "" + ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("USER %s is already in a game", username);
                    exit = true;
                    break;
                }

                selectedPlayers.add(username);
            }

            // Role check
            for (RoleCardinality roleCardinality : roleCardinalities) {
                if (isValidRole(realRoles, roleCardinality.getRole())) {
                    selectedRoles.put(roleCardinality.getRole(), roleCardinality.getCarnality()); // set the correct cardinality
                    totalRoles += roleCardinality.getCarnality();
                } else {
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.ROLE_NOT_EXIST;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("ROLE " + roleCardinality.getRole() + " does not exist", "" + ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("ROLE %s does not exist", roleCardinality.getRole());
                    exit = true;
                    break;
                }

            }

            if (exit) { // error in the while loop
//                request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, response);
            } else {

                // check the validity of the settings, e.g. number of roles in comparison with number of players
                int totalPlayers = selectedPlayers.size();

                if (totalPlayers < 5) { // at least 5 players, exclude the master
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NOT_ENOUGH_PLAYERS;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Not enough players, player number: " + totalPlayers + " minimum required 5", "" + ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Not enough players, player number: %d minimum required 5", totalPlayers);
//                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, res);
                } else if (!isValidRolesCardinality(selectedRoles, realRoles)) { // check if role cardinality respect the maximum
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.INVALID_ROLES_CARDINALITY;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("One or more roles have exceeded the maximum cardinality", "" + ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("One or more roles have exceeded the maximum cardinality", totalPlayers, totalRoles);
//                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, res);
                } else if (totalPlayers != totalRoles) { // check if number of players it's equal to number of roles
                    // TODO, message and error
                    ErrorCode ec = ErrorCode.NUMBER_PLAYERS_ROLES_NOT_MATCH;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Player number " + totalPlayers + " does not match the number of roles " + totalRoles, "" + ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    // LOGGER.debug("User have invalid fields"); // .debug not work
                    LOGGER.info("Player number %d does not match the number of roles %d", totalPlayers, totalRoles);
//                    request.getRequestDispatcher("/jsp/game/settings.jsp").forward(request, res);
                }
                //
                else {
                    Game createdGame = new CreateGameDAO(ds.getConnection(), realRoles).access().getOutputParam();
                    int gameID = createdGame.getId();
                    String publicID = createdGame.getPublic_ID();
                    LOGGER.info("GAME created, gameID: (%d, %s)", gameID, publicID);


                    // TODO add master
                    HttpSession session = req.getSession(false);
                    Player gameMaster = (Player) session.getAttribute("user");
                    int masterID = new SearchRoleByNameDAO(ds.getConnection(), "master").access().getOutputParam().getId();

                    PlaysAsIn master_playsAsIn = new PlaysAsIn(gameMaster.getUsername(), gameID, masterID);
                    new InsertIntoPlayAsInDAO(ds.getConnection(), master_playsAsIn).access();

                    session.setAttribute("master", gameID);
//                    session.setAttribute("gameID", gameID);


                    for (int i = 0; i < totalPlayers; i++) {
                        String selectedRole = randomRole(selectedRoles);
                        int selectedRoleID = new SearchRoleByNameDAO(ds.getConnection(), selectedRole).access().getOutputParam().getId();

                        PlaysAsIn playsAsIn = new PlaysAsIn(selectedPlayers.get(i), gameID, selectedRoleID);
                        new InsertIntoPlayAsInDAO(ds.getConnection(), playsAsIn).access();
                        LOGGER.info("Player %s PlaysAsIn %s", selectedPlayers.get(i), playsAsIn.getRoleId());
                    }

                    createdGame.toJSON(res.getOutputStream());

                }
            }
        } catch (IOException e) {
            ErrorCode ec = ErrorCode.INVALID_JSON_FORMAT;
            res.setStatus(ec.getHTTPCode());

            Message m = new Message("Invalid JSON format", "" + ec.getErrorCode(), ec.getErrorMessage());
//                    m.toJSON(res.getOutputStream());
            m.toJSON(res.getOutputStream());

            LOGGER.error("Invalid JSON format", e);
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

            int cardinality = selectedRoles.get(role.getName());
            if (cardinality < 0 || cardinality > role.getMax_number()) // invalid role cardinality
                return false;
            if (role.getName().equals(GameRole.WOLF.getName()) && cardinality == 0) // at least one wolf
                return false;
            type.put(role.getType(), cardinality);
            totalRolesNumber += cardinality;
        }
        boolean maxGood = type.get(RoleType.GOOD.getType()) <= ((totalRolesNumber) * 3 / 4);
        boolean maxEvil = type.get(RoleType.EVIL.getType()) <= totalRolesNumber / 4;
        boolean minEvil = type.get(RoleType.EVIL.getType()) >= Math.round((float) totalRolesNumber / 8);
        return maxGood && maxEvil && minEvil;
    }

    private boolean isValidRole(List<Role> roles, String roleToCheck) {
        for (Role role : roles)
            if (role.getName().equals(roleToCheck)) return true;
        return false;
    }

    private String randomRole(Map<String, Integer> roles) throws SQLException {
//        Random rand = new Random();
        Random rand = new Random();
        rand.setSeed(System.currentTimeMillis());

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
