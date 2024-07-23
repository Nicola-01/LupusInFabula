package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
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

/**
 * Handles the POST request for /game/create.
 * Get the game setting, i.e., the players and the number of roles, check if they are correct, and if so, create the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameCreationPostRR extends AbstractRR {

    /**
     * Creates a new GameSettingsPost REST resource.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @param ds  the dataSource for the connection.
     */
    public GameCreationPostRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.POST_GAME_CREATION, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {
        try {
            // Recover the game master, i.e., the user who is creating the game
            HttpSession session = req.getSession(false);
            Player gameMaster = (Player) session.getAttribute(UserFilter.USER_ATTRIBUTE);

            LogContext.setIPAddress(req.getRemoteAddr());
            LogContext.setUser(gameMaster.getUsername());

            List<Message> messages = new ArrayList<>();

            if (new PlayerInGameDAO(ds.getConnection(), gameMaster.getUsername()).access().getOutputParam() != null) {
                ErrorCode ec = ErrorCode.MASTER_ALREADY_IN_GAME;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("The player " + gameMaster.getUsername() + " is already in a game", ec.getErrorCode(), ec.getErrorMessage());
                messages.add(m);
                // m.toJSON(res.getOutputStream());

                LOGGER.warn("the USER %s is already in a game", gameMaster.getUsername());
            }

            LOGGER.info("The player %s is creating new game", gameMaster.getUsername());

            // for reading the JSON multiple times
            InputStream inputStream = req.getInputStream();
            String JSON = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            InputStream stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
            List<RoleCardinality> roleCardinalities = RoleCardinality.fromJSON(stream);

            stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
            List<String> givenPlayers = Player.fromJSON(stream);
            List<String> selectedPlayers = new ArrayList<>();

            stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
            List<Setting> givenSettings = Setting.fromJSON(stream);
            givenSettings.removeIf(setting -> !setting.isEnable());
            // todo : to finish

            // recover all roles, and remove the master
            List<Role> realRoles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
            realRoles.removeIf(role -> Objects.equals(role.getName(), GameRoleAction.MASTER.getName()));

            // create a map with all the roles and their cardinality
            Map<String, Integer> selectedRoles = new HashMap<>();

            int totalRoles = 0;

            // Check all passed users
            for (String username : givenPlayers) {
                // search for the user in the database and return the user if found
                Player validPlayer = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();

                // Check if the username exists or if it's deleted
                // If the email is the same as the username, it indicates that the user was deleted.
                if (validPlayer == null || validPlayer.getUsername().equals(validPlayer.getEmail())) {
                    ErrorCode ec = ErrorCode.PLAYER_NOT_EXIST;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("The player '" + username + "' does not exist.", ec.getErrorCode(), ec.getErrorMessage());
                    messages.add(m);
                    // m.toJSON(res.getOutputStream());

                    LOGGER.info("USER %s does not exist", username);
                } else {
                    // if the user exists, retrieve the correct name (lowercase and lowercase)
                    username = validPlayer.getUsername();

                    // check if the player is already in a game
                    if (new PlayerInGameDAO(ds.getConnection(), username).access().getOutputParam() != null) {
                        ErrorCode ec = ErrorCode.PLAYER_ALREADY_IN_GAME;
                        res.setStatus(ec.getHTTPCode());

                        Message m = new Message("PLAYER " + username + " is already in a game", ec.getErrorCode(), ec.getErrorMessage());
                        messages.add(m);
                        // m.toJSON(res.getOutputStream());

                        LOGGER.warn("USER %s is already in a game", username);
                    }

                    // add the player to the list
                    if (!selectedPlayers.contains(username))
                        selectedPlayers.add(username);
                }
            }

            if (selectedPlayers.contains(gameMaster)) {
                ErrorCode ec = ErrorCode.MASTER_ALREADY_IN_GAME;
                res.setStatus(ec.getHTTPCode());

                Message m = new Message("The master can't be a player of a game", ec.getErrorCode(), ec.getErrorMessage());
                messages.add(m);

                LOGGER.warn("The master can't be a player");
            }

            // Check all the roles
            for (RoleCardinality roleCardinality : roleCardinalities) {
                if (isValidRole(realRoles, roleCardinality.getRole())) {
                    selectedRoles.put(roleCardinality.getRole(), roleCardinality.getCardinality()); // set the cardinality
                    totalRoles += roleCardinality.getCardinality();

                } else {
                    ErrorCode ec = ErrorCode.ROLE_NOT_EXIST;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("ROLE " + roleCardinality.getRole() + " does not exist", ec.getErrorCode(), ec.getErrorMessage());
                    messages.add(m);
                    // m.toJSON(res.getOutputStream());

                    LOGGER.warn("ROLE %s does not exist", roleCardinality.getRole());
                }

            }

            if (messages.isEmpty()) {
                // check the validity of the settings, e.g. number of roles in comparison with number of players
                int totalPlayers = selectedPlayers.size();

                if (totalPlayers < 5) { // at least 5 players, exclude the master
                    ErrorCode ec = ErrorCode.NOT_ENOUGH_PLAYERS;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Not enough players. Player number passed: " + totalPlayers + ". A minimum of 5 players is required.", ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    LOGGER.warn("Not enough players, player number: %d minimum required 5", totalPlayers);
//                    request.getRequestDispatcher("/jsp/game/create.jsp").forward(request, res);
                }
                // check if role setting respect the cardinality
                else if (!isValidRolesCardinality(selectedRoles, realRoles).isEmpty()) {
                    String message = isValidRolesCardinality(selectedRoles, realRoles);
                    ErrorCode ec = ErrorCode.INVALID_ROLES_CARDINALITY;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Invalid roles cardinality", ec.getErrorCode(), message);
                    m.toJSON(res.getOutputStream());

                    LOGGER.warn(message);
                }
                // check if number of players it's equal to number of roles
                else if (totalPlayers != totalRoles) {
                    ErrorCode ec = ErrorCode.NUMBER_PLAYERS_ROLES_NOT_MATCH;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("Player number " + totalPlayers + " does not match the number of roles " + totalRoles, ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());

                    LOGGER.warn("Player number %d does not match the number of roles %d", totalPlayers, totalRoles);
                }
                //
                else {
                    // All checked, create the game
                    Game createdGame = new CreateGameDAO(ds.getConnection(), ds).access().getOutputParam();

                    // obtain the private gameID (a progressive integer) and
                    // obtain the public gameID (a random combination of three roles to create a string used in the URL),
                    // e.g. /seer-wolf-farmer
                    int gameID = createdGame.getId();
                    String publicID = createdGame.getPublic_ID();
                    LogContext.setGame(publicID);
                    LOGGER.info("GAME created, gameID: (%d, %s), game master %s", gameID, publicID, gameMaster.getUsername());

                    // set the gamemaster role to the player who created the game
                    PlaysAsIn master_playsAsIn = new PlaysAsIn(gameMaster.getUsername(), gameID, GameRoleAction.MASTER.getName());
                    new InsertIntoPlayAsInDAO(ds.getConnection(), master_playsAsIn, 0).access();

                    // add a session attribute to the user corresponding to the private game ID
                    session.setAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE, publicID);

                    // Assign a random role to each player

                    selectedRoles.entrySet().removeIf(entry -> entry.getValue() == 0);

                    // generate the random generator only one time
                    Random rand = new Random();

                    for (int i = 0; i < totalPlayers; i++) {
                        // Select a random role for the player
                        String selectedRole = randomRole(selectedRoles, rand);

                        // Get the ID of the selected role from the database
//                        int selectedRoleID = new SearchRoleByNameDAO(ds.getConnection(), selectedRole).access().getOutputParam().getId();

                        // Create a PlaysAsIn for the player with the selected role and game ID, and insert into the database
                        PlaysAsIn playsAsIn = new PlaysAsIn(selectedPlayers.get(i), gameID, selectedRole);
                        new InsertIntoPlayAsInDAO(ds.getConnection(), playsAsIn, i + 1).access();

                        LOGGER.info("Player %s assigned role ID %s", selectedPlayers.get(i), selectedRole);
                    }
                    // Return a JSON object containing game information such as gameID (both private and public), creation time, etc.
                    res.setStatus(HttpServletResponse.SC_CREATED);
                    createdGame.toJSON(res.getOutputStream());
                }
            } else { // there was an error during player or role validation
                // return the message(s)
                if (messages.size() == 1)
                    messages.get(0).toJSON(res.getOutputStream());
                else
                    new ResourceList<>(messages).toJSON(res.getOutputStream());
//                request.getRequestDispatcher("/jsp/game/create.jsp").forward(request, response);
            }
        } catch (IOException e) {
            ErrorCode ec = ErrorCode.INVALID_JSON_FORMAT;
            res.setStatus(ec.getHTTPCode());

            Message m = new Message("Invalid JSON format", ec.getErrorCode(), e.getMessage());
            m.toJSON(res.getOutputStream());
            LOGGER.warn("Invalid JSON format", e);
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            Message m = new Message("Unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Unexpected error while accessing the database.", e);
            m.toJSON(res.getOutputStream());
        } finally {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeGame();
        }
    }

    /**
     * Verify if the passed role is valid, i.e., if it exists in the game
     *
     * @param roles       list of all the roles
     * @param roleToCheck role to check
     * @return {@code true} if the role exists, {@code false} otherwise
     */
    private boolean isValidRole(List<Role> roles, String roleToCheck) {
        for (Role role : roles)
            if (role.getName().equals(roleToCheck)) return true;
        return false;
    }

    /**
     * This function verifies that the number of roles chosen meets certain prerequisites:<br>
     *
     * @param selectedRoles Map with the roles and the selected cardinality
     * @param roles         List with all the roles
     * @return if all prerequisites have been satisfied; otherwise, a message describing the first encountered issue.
     * <br> Possible cases for returning a non-empty message include:
     * <ul>
     * <li>Invalid role cardinality, i.e., the cardinality must be greater than or equal to 0 and less than or equal to the maximum cardinality allowed for the role.</li>
     * <li>When the maximum count of good roles exceeds three-quarters of the total number of roles.</li>
     * <li>When the maximum count of evil roles exceeds one-quarter of the total number of roles.</li>
     * <li>When the minimum count of evil roles falls below one-eighth of the total number of roles.</li>
     * </ul>
     */
    private String isValidRolesCardinality(Map<String, Integer> selectedRoles, List<Role> roles) {
        Map<Integer, Integer> type = new HashMap<>(); // roleType it's the key
        int totalRolesNumber = 0;
        for (Role role : roles) {
            // Check if the role is selected
            if (!selectedRoles.containsKey(role.getName())) continue;

            int cardinality = selectedRoles.get(role.getName());
            if (cardinality < 0 || cardinality > role.getMax_number())
                return "Invalid role cardinality: " + cardinality + " for role " + role.getName();

            type.put(role.getType(), type.getOrDefault(role.getType(), 0) + cardinality);
            totalRolesNumber += cardinality;
        }

        String message = "";
        int minGood = (int) Math.floor((totalRolesNumber) / 2.5);
        int maxEvil = (int) Math.round(totalRolesNumber / 3.0); // max 1/3 of total players could be evil
        int minEvil = Math.max((int) Math.round(totalRolesNumber / 8.0), 1); // at least 1

        LOGGER.info("minGood: " + minGood + "; maxEvil: " + maxEvil + "; minEvil: " + minEvil);

        if (type.get(RoleType.GOOD.getType()) < minGood)
            message += "The GOOD role must be at minimum " + minGood + ", but provided " + type.get(RoleType.GOOD.getType()) + "; ";
        if(type.get(RoleType.EVIL.getType()) > maxEvil)
            message += "The EVIL role must be at maximum " + maxEvil + ", but  provided " + type.get(RoleType.EVIL.getType()) + "; ";
        if(type.get(RoleType.EVIL.getType()) < minEvil)
            message += "The EVIL role must be at minimum " + minEvil + ", but  provided " + type.get(RoleType.EVIL.getType()) + "; ";

        return message;
    }

    /**
     * Selects a random role from the available roles.
     *
     * @param roles A map containing available roles and their counts.
     * @return A randomly selected role.
     */
    private String randomRole(Map<String, Integer> roles, Random rand) {

        // Get an array of available roles
        List<String> availableRoles = new ArrayList<>(roles.keySet());
        String role;

        // Select a random role, ensuring it has a non-zero count
        role = availableRoles.get(rand.nextInt(availableRoles.size()));

        // Decrement the count of the selected role, and remove if count becomes zero
        roles.put(role, roles.get(role) - 1);
        if (roles.get(role) == 0) roles.remove(role);

        return role;
    }
}
