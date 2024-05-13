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
import java.util.stream.Stream;

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
     * The round of current game.
     */
    private int currentRound;

    /**
     * Map containing the actions available during the night phase of the game.
     * The key is the role name, and the value is the corresponding action.
     */
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
    private static Map<String, Boolean> deadPlayers = new HashMap<>();

    /**
     * List with all roles that are Wolf, Berserk, Explorer or Puppy
     */
    List<String> wolfPlayers = new ArrayList<>();

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

        deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null
                    && playerRole.containsValue(role.getName())
                    && !role.getAction().equals(GameRoleAction.SAM.getAction())
                    && !role.getAction().equals(GameRoleAction.CARPENTER.getAction())
                    && !role.getAction().equals(GameRoleAction.KAMIKAZE.getAction())
            )
                // insert only the role that exist in the game
                nightAction.put(role.getName(), role.getAction());


        wolfPlayers = Stream.concat(wolfPlayers.stream(),
                playerWithRole(GameRoleAction.WOLF.getName()).stream()).toList();
        wolfPlayers = Stream.concat(wolfPlayers.stream(),
                playerWithRole(GameRoleAction.BERSERKER.getName()).stream()).toList();
        wolfPlayers = Stream.concat(wolfPlayers.stream(),
                playerWithRole(GameRoleAction.EXPLORER.getName()).stream()).toList();
        wolfPlayers = Stream.concat(wolfPlayers.stream(),
                playerWithRole(GameRoleAction.PUPPY.getName()).stream()).toList();
        if (new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
            wolfPlayers = Stream.concat(wolfPlayers.stream(),
                    playerWithRole(GameRoleAction.DORKY.getName()).stream()).toList();
    }

    @Override
    protected void doServe() throws IOException {
        try {
            LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            currentRound = game.getRounds();
            int currentPhase = game.getPhase();
            int currentSubphase = game.getSubphase();

            String publicGameID = game.getPublic_ID();
            LogContext.setGame(publicGameID);

            if (game.getWho_win() == -1) {
                LOGGER.info("In the game " + publicGameID + ", the current round is " + currentRound + ", the current phase is " + currentPhase);
                if (currentPhase == GamePhase.NIGHT.getId())
                    handleNightPhase();
                else
                    handleDayPhase();
            } else {
                ErrorCode ec = ErrorCode.GAME_IS_OVER;
                LOGGER.warn("The game is over");
                res.setStatus(ec.getHTTPCode());
                Message m = new Message("ERROR: the game is over", ec.getErrorCode(), ec.getErrorMessage());
                m.toJSON(res.getOutputStream());
            }

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
     * @throws IOException If an I/O error occurs.
     */
    private void handleDayPhase() throws IOException, SQLException {
        List<ActionTarget> actionTargets = new ArrayList<>();

//        LOGGER.info("Handling day phase. Second ballot: " + secondBallot);

        // Get the players in order of insert
        List<String> players = new GetPlayersByGameDAO(ds.getConnection(), gameID).access().getOutputParam();

        // for each player in the game
        String sam = "";
        String plagueSpreader = "";

        for (String player : players) {
            String role = playerRole.get(player);
            List<String> targets = new ArrayList<>();

            if (role.equals(GameRoleAction.SAM.getName()) && !deadPlayers.get(player))
                sam = player;
            if (role.equals(GameRoleAction.PLAGUE_SPREADER.getName()) && !deadPlayers.get(player))
                plagueSpreader = player;

//            // Skip voting for dead players in the second ballot
//            if (secondBallot && areDead.get(player))
//                continue;

            // generate targets for voting
            for (String targetPlayer : playerRole.keySet()) {
                if (!player.equals(targetPlayer) && !deadPlayers.get(targetPlayer))
                    // if the player is different from the target
                    targets.add(targetPlayer);
            }

            Collections.sort(targets);
            actionTargets.add(new ActionTarget(role, player, Action.VOTE, targets));
        }

        if (!sam.isEmpty()) {
            List<String> targets = new ArrayList<>(players);
            final String finalSam = sam;
            targets.removeIf(player -> Objects.equals(finalSam, player));
            actionTargets.add(new ActionTarget(GameRoleAction.SAM.getName(), sam, GameRoleAction.SAM.getAction(), targets));
        }
        if (!plagueSpreader.isEmpty()) {
            String plaguedPlayer = new PlayerWithPlagueInGameDAO(ds.getConnection(), gameID, currentRound).access().getOutputParam();

            List<String> targets = new ArrayList<>(players);
            // the first player is the one with the plague
            targets.add(0, plaguedPlayer);
            actionTargets.add(new ActionTarget(GameRoleAction.PLAGUE_SPREADER.getName(), plagueSpreader, GameRoleAction.PLAGUE_SPREADER.getAction(), targets));
        }


        LOGGER.info("Returning the actions of day phase.");
        res.setStatus(HttpServletResponse.SC_OK);
        new ResourceList<>(actionTargets).toJSON(res.getOutputStream());
    }

    /**
     * Handles the night phase of the game, generating action targets based on the roles' actions.
     *
     * @throws IOException  If an I/O error occurs.
     * @throws SQLException If a SQL exception occurs while accessing the database.
     */
    private void handleNightPhase() throws IOException, SQLException {
        LOGGER.info("Handling night phase.");

        List<ActionTarget> actionTargets = new ArrayList<>();

        boolean wolfAlreadyInsert = false;

        // for each player in the game
        for (Map.Entry<String, String> pr : playerRole.entrySet()) {

            String player = pr.getKey();
            String role = pr.getValue();
            LOGGER.info("Actions for player: " + player + "; with role: " + role);

            // if the role don't have nightAction or if the player is death
            if (!nightAction.containsKey(role) || deadPlayers.get(player))
                continue;

            List<String> targets = new ArrayList<>();

            // if the role is not a puppy or is a puppy but is the last wolf alive
            if (role.equals(GameRoleAction.PUPPY.getName()) && !(new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()))
                continue;

            if (role.equals(GameRoleAction.WOLF.getName())) {
                if (wolfAlreadyInsert)
                    continue;
                wolfAlreadyInsert = true;
            }

            for (String targetPlayer : playerRole.keySet()) {
                if (isValidTarget(player, targetPlayer, role))
                    targets.add(targetPlayer);
            }
            if (role.equals(GameRoleAction.MEDIUM.getName()) && targets.isEmpty())
                continue;
            Collections.sort(targets);
            if (role.equals(GameRoleAction.SHERIFF.getName()))
                targets.add(0, "No shot");

            LOGGER.info("targets: " + String.join(", ", targets));
            actionTargets.add(new ActionTarget(role, playerWithRole(role),
                    getNightAction(role), targets));

            if (role.equals((GameRoleAction.BERSERKER.getName()))) {
                List<String> targetsTmp = new ArrayList<>(targets);
                targetsTmp.add(0, "No rage");
                actionTargets.add(new ActionTarget(role, playerWithRole(role),
                        getNightAction(role), targetsTmp));
            }
        }

        LOGGER.info("Returning the actions of night phase.");
        res.setStatus(HttpServletResponse.SC_OK);
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
            if (player.getValue().equals(role) && !deadPlayers.get(player.getKey()))
                players.add(player.getKey());
        }
        return players;
    }

    /**
     * Checks if the specified target player is a valid target for the given role.
     *
     * @param player       The player who is executing the action
     * @param targetPlayer The player to be checked as a target.
     * @param role         The role of the player performing the action.
     * @return {@code true} if the target player is valid for the given role, {@code false} otherwise.
     * @throws SQLException if an SQL exception occurs.
     */
    private boolean isValidTarget(String player, String targetPlayer, String role) throws SQLException {
        // the medium can only target dead players
        if (role.equals(GameRoleAction.MEDIUM.getName()))
            return deadPlayers.get(targetPlayer);

        // the target player must be alive
        if (deadPlayers.get(targetPlayer))
            return false;

        // Plague Spreader can target themselves
        if (role.equals(GameRoleAction.PLAGUE_SPREADER.getName()))
            return true;

        // Knight can target themselves, but it needs to be different from the previous target
        if (role.equals(GameRoleAction.KNIGHT.getName()))
            return !targetPlayer.equals(new LastPlayerProtectedByKnightDAO(ds.getConnection(), gameID).access().getOutputParam());

        // the target can not have the sema role
        if (player.equals(targetPlayer))
            return false;

        // if the player is a wolf can't target another wolf
        if (wolfPlayers.contains(player) && wolfPlayers.contains(targetPlayer))
            return false;

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
        if ((role.equals(GameRoleAction.PUPPY.getName()) && new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
                || (role.equals(GameRoleAction.EXPLORER.getName()) && new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())
                || (role.equals(GameRoleAction.DORKY.getName()) && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()))
            return GameRoleAction.WOLF.getAction();
        else
            // if the role is not a wolf, return the corresponding night action
            return nightAction.get(role);
    }
}