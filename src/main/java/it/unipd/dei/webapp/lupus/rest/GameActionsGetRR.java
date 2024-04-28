package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

/**
 * Handles the HTTP GET request to retrieve game actions based on the current game phase.
 * It contains methods to handle both day and night phases of the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameActionsGetRR extends AbstractRR {

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * Map containing the actions available during the night phase of the game.
     * The key is the role name, and the value is the corresponding action.
     */
    // TODO -> remove SAM and CARPENTER
    private static final Map<String, String> nightAction = new HashMap<>();

    /**
     * Map containing the players and their roles in the game.
     * The key is the player's name, and the value is the player's role.
     */
    private static Map<String, String> playerRole = new HashMap<>();

    /**
     * Map indicating whether players are dead or alive in the game.
     * The key is the player's name, and the value is a boolean indicating if the player is dead.
     */
    private static Map<String, Boolean> areDead = new HashMap<>();

    /**
     * Constructs a new GameActionsGetRR object with the specified game ID, request, response, and data source.
     *
     * @param gameID The ID of the game.
     * @param req    The HTTP servlet request.
     * @param res    The HTTP servlet response.
     * @param ds     The data source.
     * @throws SQLException If an SQL error occurs.
     */
    public GameActionsGetRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) throws SQLException {
        super(Actions.GET_GAME_ACTIONS_ACTION, req, res, ds);
        this.gameID = gameID;

        playerRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        areDead = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null && playerRole.containsValue(role.getName()))
                // insert only the role that exist in the game
                nightAction.put(role.getName(), role.getAction());

    }

    @Override
    protected void doServe() throws IOException {
        try {
            LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            int currentRound = game.getRounds();
            int currentPhase = game.getPhase();
            int currentSubphase = game.getSubphase();

            String publicGameID = game.getPublic_ID();
            LogContext.setGame(publicGameID);

            LOGGER.info("In the game " + publicGameID + ", the current round is " + currentRound + ", the current phase is " + currentPhase);
            if (GamePhase.NIGHT.getId() != currentPhase)
                handleDayPhase(currentSubphase > 0);
            else
                handleNightPhase();

        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            res.setStatus(ec.getHTTPCode());
            Message m = new Message("Cannot search for roles: unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Cannot search for roles: unexpected error while accessing the database.", e);
            m.toJSON(res.getOutputStream());
        } catch (IOException e) {
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            Message m = new Message("Cannot return the possible actions: unexpected error", ec.getErrorCode(), e.getMessage());
            LOGGER.error("Error to return the possible actions.", e);
            // An error occurred while processing the request. Unable to generate role search
            // results due to an unexpected database access error.
            m.toJSON(res.getOutputStream());
        } finally {
            LogContext.removeAction();
            LogContext.removeGame();
            LogContext.removeUser();
        }
    }

    /**
     * Handles the day phase of the game.
     * Generates action targets for voting.
     *
     * @param secondBallot Indicates if it is the second ballot of the day.
     * @throws IOException If an I/O error occurs.
     */
    private void handleDayPhase(boolean secondBallot) throws IOException {
        List<ActionTarget> actionTargets = new ArrayList<>();

        LOGGER.info("Handling day phase. Second ballot: " + secondBallot);

        // for each player in the game
        for (String player : playerRole.keySet()) {
            List<String> targets = new ArrayList<>();

            // Skip voting for dead players in the second ballot
            if (secondBallot && areDead.get(player))
                continue;

            // generate targets for voting
            for (String targetPlayer : playerRole.keySet()) {
                if (!player.equals(targetPlayer) && !areDead.get(targetPlayer))
                    // if the player is different from the target
                    targets.add(targetPlayer);
            }

            Collections.sort(targets);
            actionTargets.add(new ActionTarget(player, Action.VOTE, targets));
        }
        LOGGER.info("Returning the actions of day phase.");
        new ResourceList<>(actionTargets).toJSON(res.getOutputStream());
    }

    /**
     * Handles the night phase of the game.
     * Generates action targets based on the roles' actions.
     *
     * @throws IOException If an I/O error occurs.
     */
    private void handleNightPhase() throws IOException, SQLException {
        LOGGER.info("Handling night phase.");

        List<ActionTarget> actionTargets = new ArrayList<>();

        // for each action that can be done in the night
        for (Map.Entry<String, String> night : nightAction.entrySet()) {

            // if the role is not in the game
            if (!playerRole.containsValue(night.getKey()))
                continue;

            String role = night.getKey();
            List<String> targets = new ArrayList<>();

            // if the role is not a puppy or is a puppy but is the last wolf alive
            if (!role.equals(GameRoleAction.PUPPY.getName()) || new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                for (String targetPlayer : playerRole.keySet()) {
                    if (isValidTarget(targetPlayer, role))
                        targets.add(targetPlayer);
                    // TODO -> fix comments
                    // If the role is different from the role of the target player,
                    // excluding the knight and plague spreader roles, which can target themselves,
                    // add the target player to the list of targets.
                    // The dead players can not be voted

                }
                Collections.sort(targets);
                actionTargets.add(new ActionTarget(role, playerWithRole(role),
                        getNightAction(role), targets));
            }
        }
        LOGGER.info("Returning the actions of night phase.");
        new ResourceList<>(actionTargets).toJSON(res.getOutputStream());
    }


    /**
     * Retrieves a list of players with the specified role.
     *
     * @param role The role for which to retrieve players.
     * @return A list of players with the specified role.
     */
    private List<String> playerWithRole(String role) {
        List<String> players = new ArrayList<>();
        for (Map.Entry<String, String> player : playerRole.entrySet()) {
            if (player.getValue().equals(role))
                players.add(player.getKey());
        }
        return players;
    }

    /**
     * Checks if the specified target player is a valid target for the given role.
     *
     * @param targetPlayer The player to be checked as a target.
     * @param role         The role of the player performing the action.
     * @return {@code true} if the target player is valid for the given role, {@code false} otherwise.
     * @throws SQLException if an SQL exception occurs.
     */
    private boolean isValidTarget(String targetPlayer, String role) throws SQLException {
        // the target player must be alive
        if (areDead.get(targetPlayer))
            return false;

        // Plague Spreader can target themselves
        if (role.equals(GameRoleAction.PLAGUE_SPREADER.getName()))
            return true;

        // Knight can target themselves, but it needs to be different from the previous target
        if (role.equals(GameRoleAction.KNIGHT.getName()))
            return !targetPlayer.equals(new LastPlayerProtectedByKnightDAO(ds.getConnection(), gameID).access().getOutputParam());

        return true;
    }

    /**
     * Gets the night action for the specified role.
     *
     * @param role The role for which to retrieve the night action.
     * @return The night action associated with the specified role.
     * @throws SQLException if an SQL exception occurs.
     */
    private String getNightAction(String role) throws SQLException {
        // if the role is not Puppy, Explorer, or Dorky, return the corresponding night action
        if (!role.equals(GameRoleAction.PUPPY.getName()) && !role.equals(GameRoleAction.EXPLORER.getName()) && !role.equals(GameRoleAction.DORKY.getName()))
            return nightAction.get(role);

        // if the role is Puppy and is a wolf, or Explorer and is a wolf, or Dorky and is a wolf, return the wolf action
        if ((role.equals(GameRoleAction.PUPPY.getName()) && new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())
                || (role.equals(GameRoleAction.EXPLORER.getName()) && new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())
                || (role.equals(GameRoleAction.DORKY.getName()) && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()))
            return GameRoleAction.WOLF.getAction();
        else
            // if the role is not a wolf, return the corresponding night action
            return nightAction.get(role);
    }
}