package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import it.unipd.dei.webapp.lupus.utils.RoleType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

public class GameActionsPostRR extends AbstractRR {

    /**
     * Map containing the actions available during the night phase of the game.
     * The key is the role name, and the value is the corresponding action.
     */
    private static final Map<String, String> nightAction = new HashMap<>();

    /**
     * Map indicating whether players are dead or alive in the game.
     * The key is the player's name, and the value is a boolean indicating if the player is dead.
     */
    private final Map<String, Boolean> deadPlayers;

    /**
     * Map containing the players and their roles in the game.
     * The key is the player's name, and the value is the player's role.
     */
    private final Map<String, String> playersRole;

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * The current round, phase, and subphase of the game.
     */
    int currentRound, currentPhase, currentSubPhase;

    /**
     * Constructs a new GameActionsPostRR object with the specified game ID, request, response, and data source.
     *
     * @param gameID The ID of the game.
     * @param req    The HTTP servlet request.
     * @param res    The HTTP servlet response.
     * @param ds     The data source.
     * @throws SQLException If an SQL error occurs.
     */
    public GameActionsPostRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) throws SQLException {
        super(Actions.ADD_ACTIONS, req, res, ds);
        this.gameID = gameID;

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null
                    && !role.getAction().equals(GameRoleAction.SAM.getAction())
                    && !role.getAction().equals(GameRoleAction.CARPENTER.getAction()))
                nightAction.put(role.getName(), role.getAction());

        deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        playersRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
    }

    /**
     * Processes the game actions received in the request.
     * This method checks the correctness of the actions, handles night and day phases separately, updates the game
     * status based on the actions, and determines the winner(s) if the game is finished.
     *
     * @throws IOException if an I/O exception occurs
     */
    @Override
    protected void doServe() throws IOException {

        try {

            List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream());

            // check of the correctness of the actions
            if (!correctnessOfActions(gameActions))
                return;
            LOGGER.info("correctness of actions done");

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            currentRound = game.getRounds() == 0 ? 1 : game.getRounds();
            currentPhase = game.getPhase();
            currentSubPhase = game.getSubphase();

            if (currentPhase == GamePhase.NIGHT.getId()) {
                if (!handleNightPhase(gameActions))
                    return;
            } else if (!handleDayPhase(gameActions))
                return;

            Message m = isAVictory();
            if (m != null) {
                m.toJSON(res.getOutputStream());
                currentPhase = GamePhase.DAY.getId(); // the game always finish during the day

                LOGGER.info("The game finished, winner(s): " + m.getMessage());
                new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound).access();
            }
            else {

                if (currentPhase == GamePhase.DAY.getId()) {
                    currentRound++;
                    currentPhase = GamePhase.NIGHT.getId();
                } else {
                    currentPhase = GamePhase.DAY.getId();
                }

                // TODO --> update game table (last thing to do, before doing it i have to check if someone wins)

                LOGGER.info("updating round " + currentRound + " phase " + currentPhase);
                new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound).access();
                LOGGER.info("updating game");
            }

        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }

    }


    private boolean handleDayPhase(List<GameAction> gameActions) throws SQLException, IOException {
        //The first thing to do is handling the vote
        //Then update the database based on the action and the death player
        Map<String, Integer> votesMap = getVotesMap(gameActions);
        Map<String, Integer> ballotVotesMap = getVotesMap(gameActions);
        int voteNumber = playersRole.size();
        int ballotVoteNumber = voteNumber - countDeadPlayers(deadPlayers);

        int numberAction = 0;

        for (GameAction gameAction : gameActions) {

            numberAction++;
            LOGGER.info(numberAction);
            LOGGER.info(currentSubPhase);
            String player = gameAction.getPlayer();
            String role = gameAction.getRole();
            String target = gameAction.getTarget();
            LOGGER.info(ballotVoteNumber);
            if (numberAction <= voteNumber) {
                LOGGER.info("%s with role %s has voted %s", player, role, target);

                Action action = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, Action.VOTE, target);
                // DAO for add the action to the database
                new InsertIntoActionDAO(ds.getConnection(), action).access();
                votesMap.put(target, votesMap.get(target) + 1);

                //First vote
                if (numberAction == voteNumber) {
                    List<Map.Entry<String, Integer>> votesList = new ArrayList<>(votesMap.entrySet());
                    Collections.sort(votesList, (entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

                    for (Map.Entry<String, Integer> entry : votesList) {
                        LOGGER.info("Player: " + entry.getKey() + ", Votes received: " + entry.getValue());
                    }

                    String votedPlayer = votesList.get(0).getKey();

                    if (votesList.get(0).getValue() == votesList.get(1).getValue()) {
                        LOGGER.info("Ballot");
                        currentSubPhase++;
                    } else {
                        LOGGER.info("Players %s is voted", votedPlayer);

                        if (!carpenterCheck(votedPlayer)) {
                            updatePlayerDeath(votedPlayer);
                        }
                    }

                }
            }else if((numberAction <= (voteNumber+ballotVoteNumber)) && (currentSubPhase > 0)) {
                LOGGER.info("%s with role %s has voted %s", player, role, target);

                Action action = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, Action.VOTE, target);
                // DAO for add the action to the database
                new InsertIntoActionDAO(ds.getConnection(), action).access();
                ballotVotesMap.put(target, ballotVotesMap.get(target) + 1);
                LOGGER.info(voteNumber+ballotVoteNumber);
                if (numberAction == (voteNumber+ballotVoteNumber)) {
                    List<Map.Entry<String, Integer>> ballotVotesList = new ArrayList<>(ballotVotesMap.entrySet());
                    Collections.sort(ballotVotesList, (entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

                    for (Map.Entry<String, Integer> entry : ballotVotesList) {
                        LOGGER.info("Player: " + entry.getKey() + ", Votes received: " + entry.getValue());
                    }

                    String votedPlayer = ballotVotesList.get(0).getKey();
                    LOGGER.info("Players %s is voted", votedPlayer);

                    if (!carpenterCheck((votedPlayer))) {
                        updatePlayerDeath(votedPlayer);
                    }
                }
            }else{
                currentSubPhase++;
                if(role.equals(GameRoleAction.SAM.getName())) {
                    //He can decide to kill someone else before his dead
                    LOGGER.info("Sam killed %s", target);
                    Action samAction = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, GameRoleAction.SAM.getAction(), target);
                    new InsertIntoActionDAO(ds.getConnection(), samAction).access();
                    updatePlayerDeath(target);
                    updatePlayerDeath(player);
                    break;
                }else{
                    //error
                    LOGGER.info("Error");
                }
            }

        }

        return true;
    }


    private static int countDeadPlayers(Map<String, Boolean> deadPlayers) {
        int numDeadPlayers = 0;


        for (Boolean isDead : deadPlayers.values()) {
            if (isDead) {
                numDeadPlayers++;
            }
        }
        return numDeadPlayers;
    }


    private boolean carpenterCheck(String player) throws SQLException{
        if ((new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam()).equals("carpenter")) {
            LOGGER.info("Carpenter ability check");
            if (new CarpenterAbilityDAO(ds.getConnection(), gameID).access().getOutputParam()) {
                LOGGER.info("Carpenter is safe this round");
                currentSubPhase++;
                Action carpenterAction = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, GameRoleAction.CARPENTER.getAction(), player);
                new InsertIntoActionDAO(ds.getConnection(), carpenterAction).access();
                return true;
            }
        }
        return false;
    }

    /**
     * Handles the night phase of the game by processing the actions performed by players. <br>
     * This method evaluates the actions submitted by players during the night phase of the game. It checks the validity
     * of the actions, resolves their effects, and updates the game state accordingly. It processes various actions such as
     * exploration, blocking, protection, mauling, pointing, investigation, shooting, and special actions unique to specific
     * roles. It also handles cases where players target themselves or perform actions that affect other players' actions.
     *
     * @param gameActions the list of game actions submitted by players during the night phase
     * @return {@code true} if the night phase actions were processed successfully; {@code false} otherwise
     * @throws SQLException if a SQL exception occurs while accessing the database
     * @throws IOException  if an I/O exception occurs
     */
    private boolean handleNightPhase(List<GameAction> gameActions) throws SQLException, IOException {

        try {

            Map<String, Map<String, Boolean>> actionsMap = getActionsMap(gameActions, playersRole);
            int number_of_wolves = wolfCount();
            int berserker_count = 0;

            // check of the actions
            if (!actionCheck(actionsMap, playersRole))
                return false;

            // for each player in the map i check the associated map. Then for each element in this map i check if the player is a target of which action
            for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

                String target = entry.getKey();
                Map<String, Boolean> actionPlayerMap = entry.getValue();

                if (!deadPlayers.get(entry.getKey())) {

                    // check for the "explore" action --> EXPLORER
                    // (he can explore only once in a game, so if he decides to do it, after that he will become a normal wolf)
                    if (actionPlayerMap.get(GameRoleAction.EXPLORER.getAction())) {
                        if (!new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction())) {
                            LOGGER.info("The target " + target + " has been killed by the explorer");
                            String explorer = "";
                            for (GameAction gameAction : gameActions) {
                                if (gameAction.getTarget().equals(target)) {
                                    explorer = gameAction.getPlayer();
                                }
                            }
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, explorer, currentRound, currentPhase, 0, GameRoleAction.EXPLORER.getAction(), target)).access();
                            updatePlayerDeath(target);
                        }
                    }

                    // check of the "block" action --> ILLUSIONIST
                    // (if the target is blocked his action must be blocked (put them to false)
                    if (actionPlayerMap.get(GameRoleAction.ILLUSIONIST.getAction())) {

                        String illusionist = "";
                        String player_role = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getPlayer().equals(target)) {
                                illusionist = gameAction.getPlayer();
                                player_role = gameAction.getRole();
                            }
                        }

                        Map<String, Boolean> tmp = actionsMap.get(target);
                        String player_action = nightAction.get(player_role);
                        tmp.put(player_action, false);
                        actionsMap.put(target, tmp);

                        LOGGER.info("The target " + target + " has been blocked during the night");
                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, illusionist, currentRound, currentPhase, 0, GameRoleAction.ILLUSIONIST.getAction(), target)).access();
                    }

                    // check for the "protect" action --> KNIGHT
                    // (if the current target is the same as the previous turn target, tha knight has to change target)
                    if (actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())
                            && target.equals(new LastPlayerProtectedByKnightDAO(ds.getConnection(), gameID).access().getOutputParam())) {

                        LOGGER.error("ACTION NOT POSSIBLE: you have already protected " + target + " the previous turn");
                        ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                        Message m = new Message("ACTION NOT POSSIBLE: you have already protected " + target + " the previous turn", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        m.toJSON(res.getOutputStream());
                        return false;

                    } else if (actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())) {

                        LOGGER.info("The knight has protect " + target);
                        String knight = "";
                        for (GameAction gameAction : gameActions) {
                            //LOGGER.info(gameAction.getTarget() + " " + gameAction.getPlayer());
                            if (gameAction.getTarget().equals(target)) {
                                knight = gameAction.getPlayer();
                            }
                        }

                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, knight, currentRound, currentPhase, 0, GameRoleAction.KNIGHT.getAction(), target)).access();

                        if (playersRole.get(target).equals(GameRoleAction.HAMSTER.getAction())) {
                            LOGGER.info("The knight has protected the hamster " + target);
                            updatePlayerDeath(target);
                        }

                    }

                    // check of the "maul" action --> WOLVES
                    // (if the target is protected, or is the hamster, or is the hobbit and in the game are still alive more than 1 wolf, then the target will not die)
                    if (actionPlayerMap.get(GameRoleAction.WOLF.getAction())) {

                        String wolf = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getTarget().equals(target)) {
                                wolf = gameAction.getPlayer();
                            }
                        }

                        if ((!actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())
                                && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction()))
                                && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName())) {

                            //updatePlayerDeath(target);
                            LOGGER.info("The target " + target + " has been killed by the wolves during the night");
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target)).access();
                            updatePlayerDeath(target);

                        } else if (new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName()) && (number_of_wolves <= 1)) {

                            LOGGER.info("The target " + target + " has been killed by the wolves during the night (number of wolves: " + number_of_wolves + ")");
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target)).access();
                            updatePlayerDeath(target);

                        }

                    }

                    // check for the "point" action --> DORKY
                    // (only if the dorky had not already pointed a wolf pack member: if the target target is a member of the pack, then the dorky becomes a wolf)
                    if (!new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {
                        if (actionPlayerMap.get(GameRoleAction.DORKY.getAction())) {

                            String dorky = "";
                            for (GameAction gameAction : gameActions)
                                if (gameAction.getTarget().equals(target))
                                    dorky = gameAction.getPlayer();

                            //add the action point to action table since the dorky is not a wolf
                            LOGGER.info("The target " + target + " has been pointed by the dorky");
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, dorky, currentRound, currentPhase, 0, GameRoleAction.DORKY.getAction(), target)).access();
                        }
                    }

                    // check of the "investigate" action --> SEER
                    if (actionPlayerMap.get(GameRoleAction.SEER.getAction())) {

                        String seer = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getTarget().equals(target)) {
                                seer = gameAction.getPlayer();
                            }
                        }
                        // in case the seer sees the puppy he will see that is a good role
                        LOGGER.info("The target " + target + " has been seen during the night");
                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, seer, currentRound, currentPhase, 0, GameRoleAction.SEER.getAction(), target)).access();

                        if (playersRole.get(target).equals(GameRoleAction.HAMSTER.getAction())) {
                            LOGGER.info("The seer has seen the hamster " + target);
                            updatePlayerDeath(target);
                        }

                    }

                    // check of the "shot" action --> SHERIFF
                    // (if the target is a member of the wolf pack or a victory stealer he will die, otherwise the sheriff will die)
                    if (actionPlayerMap.get(GameRoleAction.SHERIFF.getAction())) {

                        String sheriff = "";
                        for (GameAction gameAction : gameActions)
                            if (gameAction.getTarget().equals(target))
                                sheriff = gameAction.getPlayer();

                        GameRoleAction player_role = GameRoleAction.valueOfName(playersRole.get(target));
                        assert player_role != null;
                        if (player_role.getRoleType().getType() == 1 || player_role.getRoleType().getType() == 2) {

                            LOGGER.info("The target " + target + " has been killed by the sheriff during the night");
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), target)).access();
                            updatePlayerDeath(target);

                        } else {

                            LOGGER.info("The sheriff " + sheriff + " has killed himself during the night");
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), sheriff)).access();
                            updatePlayerDeath(sheriff);
                        }

                    }

                    // check for the "blowup" action --> KAMIKAZE
                    // (if the target is the kamikaze and the action is true, the kamikaze kill himself and the wolf)
                    if (playersRole.get(target).equals(GameRoleAction.KAMIKAZE.getName())
                            && actionPlayerMap.get(GameRoleAction.WOLF.getAction())) {
                        String wolf = "";
                        for (GameAction gameAction : gameActions)
                            if (gameAction.getTarget().equals(target))
                                wolf = gameAction.getPlayer();

                        LOGGER.info("The target " + target + " is blown up with the wolf " + wolf);
                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, target, currentRound, currentPhase, 0, GameRoleAction.KAMIKAZE.getName(), wolf)).access();
                        updatePlayerDeath(wolf);
                    }

                    // check for the "plague" action --> PLAGUE SPREADER
                    if (actionPlayerMap.get(GameRoleAction.PLAGUE_SPREADER.getAction())) {

                        String plague_spreader = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getTarget().equals(target)) {
                                plague_spreader = gameAction.getPlayer();
                            }
                        }

                        LOGGER.info("The target " + target + " is anointed");
                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, plague_spreader, currentRound, currentPhase, 0, GameRoleAction.PLAGUE_SPREADER.getAction(), target)).access();

                    }

                    // check for the "rage" action --> BERSERKER
                    // he can maul two target (so in the json he will appear two time), bypassing the knight and dying after he activated his effect
                    if (actionPlayerMap.get(GameRoleAction.BERSERKER.getAction())) {

                        if (!new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction())) {

                            String berserker = "";
                            for (GameAction gameAction : gameActions) {
                                if (gameAction.getTarget().equals(target)) {
                                    berserker = gameAction.getPlayer();
                                }
                            }

                            LOGGER.info("The target " + target + " has been killed by the berserker");
                            berserker_count++;
                            new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, berserker, currentRound, currentPhase, 0, GameRoleAction.BERSERKER.getAction(), target)).access();

                            if (berserker_count == 2) {
                                LOGGER.info("The berserker has killed also himself during the night");
                                updatePlayerDeath(berserker);
                            }

                        }

                    }

                    // check for the "look" action --> MEDIUM
                    // (he looks at the RoleType of the target that died by the stake during the day)
                    if (actionPlayerMap.get(GameRoleAction.MEDIUM.getAction())) {

                        String medium = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getTarget().equals(target)) {
                                medium = gameAction.getPlayer();
                            }
                        }

                        LOGGER.info("The target " + target + " have seen if the stake dead target is good, evil or neutral");
                        new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, medium, currentRound, currentPhase, 0, GameRoleAction.MEDIUM.getAction(), target)).access();

                    }

                }

            }

        } catch (SQLException | IOException e) {

            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
            return false;
            //throw new RuntimeException(e);

        }

        return true;

    }

    /**
     * Counts the number of wolves (including special wolf roles) still alive in the game.
     *
     * @return the number of wolves still alive in the game
     * @throws SQLException
     */
    private int wolfCount() throws SQLException {

        // count of wolves still alive for some effects
        int number_of_wolves = 0;
        //Map<String, Boolean> deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        for (Map.Entry<String, String> playerRole : playersRole.entrySet())
            if ((playerRole.getValue().equals(GameRoleAction.WOLF.getName())
                    || playerRole.getValue().equals(GameRoleAction.BERSERKER.getName())
                    || playerRole.getValue().equals(GameRoleAction.EXPLORER.getName()))
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;
            else if (playerRole.getValue().equals(GameRoleAction.PUPPY.getName())
                    && new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;
            else if (playerRole.getValue().equals(GameRoleAction.DORKY.getName())
                    && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;

        return number_of_wolves;
    }

    /**
     * Checks the correctness of the actions performed during the game round. <br>
     * This method verifies the correctness of the actions performed by players during the game round.
     * It checks whether the player and target are in the game, if the player has the correct role,
     * if both the player and target are alive, and if the actions correspond to the roles' abilities.
     * Additionally, it ensures that the correct number of actions is performed by each role with an effect.
     *
     * @param gameActions the list of game actions to be checked
     * @return true if the actions are correct, false otherwise
     * @throws SQLException if a SQL exception occurs while accessing the database
     * @throws IOException  if an I/O exception occurs
     */
    private boolean correctnessOfActions(List<GameAction> gameActions) throws SQLException, IOException {

        Message m;
        boolean wolfActionDone = false;
        int berserkerCount = 0;


        for (GameAction gameAction : gameActions) {

            int game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id != gameID) {

                LOGGER.error("ERROR: the player " + gameAction.getPlayer() + " is not in the game");
                ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
                m = new Message("ERROR: the player " + gameAction.getPlayer() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                return false;

            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id != gameID) {

                LOGGER.error("ERROR: the target " + gameAction.getTarget() + " is not in the game");
                ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
                m = new Message("ERROR: the target " + gameAction.getTarget() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                return false;

            }

            String player_role = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), game_id, gameAction.getPlayer()).access().getOutputParam();
            //check if the player has the correct role in the game
            if (!player_role.equals(gameAction.getRole())) {

                LOGGER.error("ERROR: the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + player_role + ") in the game");
                ErrorCode ec = ErrorCode.ROLE_NOT_CORRESPOND;
                m = new Message("ERROR: the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + player_role + ") in the game", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                return false;

            }

            // check if the target and the player are alive
            if (deadPlayers.get(gameAction.getPlayer())) {

                LOGGER.error("ERROR: the player " + gameAction.getPlayer() + " is dead");
                ErrorCode ec = ErrorCode.DEAD_PLAYER;
                m = new Message("ERROR: the player " + gameAction.getPlayer() + " is dead", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
                return false;

            } else if (deadPlayers.get(gameAction.getTarget())) {

                LOGGER.error("ERROR: the target " + gameAction.getTarget() + " is dead");
                ErrorCode ec = ErrorCode.DEAD_PLAYER;
                m =  new Message("ERROR: the target " + gameAction.getTarget() + " is dead", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
                return false;

            }

            //check for the correct number of wolf pack action
            if (gameAction.getRole().equals(GameRoleAction.WOLF.getName())
                    || gameAction.getRole().equals(GameRoleAction.EXPLORER.getName())
                    || gameAction.getRole().equals(GameRoleAction.BERSERKER.getName())) {

                if (!gameAction.getRole().equals(GameRoleAction.BERSERKER.getName())) {

                    if (!wolfActionDone) {

                        wolfActionDone = true;

                    } else {

                        LOGGER.error("ERROR: the wolves has already done their action this night");
                        ErrorCode ec = ErrorCode.TOO_MANY_WOLVES_ACTIONS;
                        m = new Message("ERROR: the wolves has already done their action this night", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(HttpServletResponse.SC_CONFLICT);
                        m.toJSON(res.getOutputStream());
                        return false;

                    }
                } else {

                    if (!wolfActionDone) {

                        switch (berserkerCount) {
                            case 0:
                                berserkerCount++;
                                break;
                            case 1:
                                berserkerCount++;
                                wolfActionDone = true;
                                break;

                        }

                    } else {

                        LOGGER.error("ERROR: there's too many action for the wolf pack");
                        ErrorCode ec = ErrorCode.TOO_MANY_WOLVES_ACTIONS;
                        m = new Message("ERROR: there's too many action for the wolf pack", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(HttpServletResponse.SC_CONFLICT);
                        m.toJSON(res.getOutputStream());
                        return false;

                    }

                }

            } else if (gameAction.getRole().equals(GameRoleAction.PUPPY.getName())
                    && !new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                LOGGER.error("ACTION NOT POSSIBLE: the puppy can't maul anyone since there's still some wolves alive");
                ErrorCode ec = ErrorCode.NOT_VALID_TARGET;
                m = new Message("ACTION NOT POSSIBLE: the puppy can't maul anyone since there's still some wolves alive", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                return false;

            }
        }

        //map with the player and his role in the game (only roles with a night active effect (e.g. kamikaze has a passive effect because he activates it only if a wolf attack him) and alive)
        //if in the game there's the berserker he can do two action
        Map<String, String> rolesWithEffect = new HashMap<>();
        for (Map.Entry<String, String> playerRoleEntry : playersRole.entrySet()) {

            GameRoleAction gameRoleAction = GameRoleAction.valueOfName(playerRoleEntry.getValue());
            assert gameRoleAction != null;
            if (gameRoleAction.getAction() != null
                    && !gameRoleAction.getName().equals(GameRoleAction.KAMIKAZE.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.PUPPY.getName())
                    && !deadPlayers.get(playerRoleEntry.getKey())) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());

            } else if (gameRoleAction.getAction() != null
                    && gameRoleAction.getName().equals(GameRoleAction.PUPPY.getName())
                    && new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());

        }

        //check if each role with an effect has done the action
        if (berserkerCount == 0) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 1)) {
                //LOGGER.info(gameActions.size() + " " + rolesWithEffect.size() + " " + wolfCount());
                LOGGER.error("ERROR: someone has not done his action, or has done too many actions this turn");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action, or has done too many actions this turn", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
                return false;

            }
        } else if (berserkerCount == 1) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 1)) {

                LOGGER.error("ERROR: someone has not done his action this turn");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action this turn", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
                return false;

            }
        } else if (berserkerCount == 2) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 2)) {

                LOGGER.error("ERROR: someone has not done his action, or has done too many actions this turn (berserker case)");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action, or has done too many actions this turn (berserker case)", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                m.toJSON(res.getOutputStream());
                return false;

            }
        }

        return true;

    }

    /**
     * Checks the validity of actions performed by players ensuring that the
     * target of each action is valid for the corresponding player role.
     *
     * @param actionsMap a map containing player names as keys and maps of actions as values
     * @param playerRole a map containing player names as keys and their corresponding roles as values
     * @return {@code true} if all actions are valid, {@code false} otherwise
     * @throws IOException if an I/O exception occurs
     */
    private boolean actionCheck(Map<String, Map<String, Boolean>> actionsMap, Map<String, String> playerRole) throws IOException {

        if (actionsMap == null)
            return false;

        // for all targeted players
        for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

            String player = entry.getKey();
            String roleOfPlayer = playerRole.get(player);
            Map<String, Boolean> actionTarget = entry.getValue();

            for (Map.Entry<String, Boolean> entry1 : actionTarget.entrySet()) {
                String action = entry1.getKey();
                Boolean target = entry1.getValue();
                //LOGGER.info("The action " + action + " is " + target + " " + player + " " + roleOfPlayer);
                if (target) {
                    //LOGGER.info(nightAction.get(roleOfPlayer) + " " + action + " " + player + " " + roleOfPlayer);
                    //check if player can be a target of the action
                    if (nightAction.get(roleOfPlayer) != null
                            && nightAction.get(roleOfPlayer).equals(action)
                            && !roleOfPlayer.equals(GameRoleAction.KNIGHT.getName())
                            && !roleOfPlayer.equals(GameRoleAction.PLAGUE_SPREADER.getName())) {

                        LOGGER.error("ERROR: the target of " + action + " is not a valid target");
                        ErrorCode ec = ErrorCode.NOT_VALID_TARGET;
                        Message m = new Message("ERROR: the target of " + action + " is not a valid target", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        m.toJSON(res.getOutputStream());
                        return false;

                    }
                }
            }
        }
        return true;
    }

    /**
     * Generates a map of actions performed during the game round.
     * This method constructs a map where each player is associated with a map of actions. The map of actions represents
     * if the player associated with it is targeted by some action. If he's targeted then the map of action will have
     * the corresponding value of that action set to {@code true}, {@code false} otherwise. <br>
     * It considers special cases for certain roles, such as Dorky, Puppy, and Explorer, and updates the action map accordingly.
     *
     * @param gameActions a list of GameAction objects representing actions performed by players
     * @param playerRole  a map containing player names as keys and their corresponding roles as values
     * @return a map of actions to be performed by players during the game round
     * @throws IOException  if an I/O exception occurs
     * @throws SQLException if a SQL exception occurs
     */
    private Map<String, Map<String, Boolean>> getActionsMap(List<GameAction> gameActions, Map<String, String> playerRole) throws IOException, SQLException {

        // first String: playerUsername , second String: action , boolean: if playerUsername is the target of action
        Map<String, Map<String, Boolean>> actions = new HashMap<>();

        for (Map.Entry<String, String> entry : playerRole.entrySet()) {

            Map<String, Boolean> tmp = new HashMap<>();
            // take each action in nightAction and put it in tmp
            for (Map.Entry<String, String> entry1 : nightAction.entrySet()) {

                if (entry1.getKey().equals(GameRoleAction.DORKY.getName())) {
                    // if the dorky has pointed a wolf during the game, his action will be maul
                    if (!new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
                        tmp.put(entry1.getValue(), false);
                    else
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                } else if (entry1.getKey().equals(GameRoleAction.PUPPY.getName())) {
                    // if the puppy is the last wolf pack member alive he can start to maul
                    if (new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                } else if (entry1.getKey().equals(GameRoleAction.EXPLORER.getName())) {
                    // if the explorer has already activated his effect then he can only maul
                    if (new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam())
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                    else
                        tmp.put(entry1.getValue(), false);
                } else
                    tmp.put(entry1.getValue(), false);

            }

            // take each playerUsername and the map tmp and put them into action
            actions.put(entry.getKey(), tmp);

        }

        for (GameAction gameAction : gameActions) {
            // take the map relative to the target in gameAction, update the value into true and then update action with the new tmp
            if (nightAction.get(gameAction.getRole()) != null) {
                //LOGGER.info(gameAction.getRole() + " " + gameAction.getPlayer());
                if (!deadPlayers.get(gameAction.getPlayer())) {
                    // if the player of the action is puppy and if he's the last wolf alive, then i can start to maul
                    if (!gameAction.getRole().equals(GameRoleAction.PUPPY.getName())) {

                        Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                        tmp.put(nightAction.get(gameAction.getRole()), true);
                        actions.put(gameAction.getTarget(), tmp);

                    } else if (new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                        Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                        tmp.put(nightAction.get(gameAction.getRole()), true);
                        actions.put(gameAction.getTarget(), tmp);

                    }

                }

            } else {

                LOGGER.error("ERROR, the action is null");
                ErrorCode ec = ErrorCode.NULL_ACTION;
                Message m = new Message("ERROR, the action is null", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                return null;

            }

            // special cases: dorky, puppy, explorer
            if (!deadPlayers.get(gameAction.getPlayer())) {

                if (gameAction.getRole().equals(GameRoleAction.DORKY.getName())
                        && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

                if (gameAction.getRole().equals(GameRoleAction.PUPPY.getName())
                        && new IsPuppyAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

                if (gameAction.getRole().equals(GameRoleAction.EXPLORER.getName())
                        && new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

            }

        }

        return actions;

    }


    private Map<String, Integer> getVotesMap(List<GameAction> gameActions) {
        Map<String, Integer> votesMap = new HashMap<>();

        for (GameAction gameAction : gameActions) {
            votesMap.put(gameAction.getPlayer(), 0);
        }

        return votesMap;
    }

    /**
     * Updates the information about a player's death in the game.
     *
     * @param player The username of the player who died.
     * @throws SQLException if a database access error occurs.
     */
    private void updatePlayerDeath(String player) throws SQLException {
        PlaysAsIn playsAsIn = new PlaysAsIn(player, gameID, playersRole.get(player), currentRound, currentPhase);
        new UpdateDeathOfPlayerInTheGameDAO(ds.getConnection(), playsAsIn).access();
    }

    /**
     * Determines if the game has reached a victory condition.
     *
     * @return a {@code Message} indicating the result of the victory condition:
     * <ul>
     *     <li>"The Evil roles win the game" if Evil wins.</li>
     *     <li>"The Hamster wins the game" if Hamster wins.</li>
     *     <li>"The Good and Neutral roles win the game" if Good and Neutral win.</li>
     *     <li>"The Jester wins the game" if Jester wins.</li>
     *     <li>{@code null} if no victory condition is met.</li>
     * </ul>
     * @throws SQLException if there is an error accessing the database.
     */
    private Message isAVictory() throws SQLException {
        Map<Integer, Integer> roleTypeCardinality = new HashMap<>();
        List<Role> roles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
        String hamster = "";
        String jester = "";

        for (Map.Entry<String, String> playerRole : playersRole.entrySet()) {
            for (Role role : roles)
                if (role.getName().equals(playerRole.getValue()) && !deadPlayers.get(playerRole.getKey()))
                    roleTypeCardinality.put(role.getWith_who_wins(), roleTypeCardinality.getOrDefault(role.getWith_who_wins(), 0) + 1);

            if (playerRole.getValue().equals(GameRoleAction.HAMSTER.getName()) && !deadPlayers.get(playerRole.getKey()))
                hamster = playerRole.getKey();
            if (playerRole.getValue().equals(GameRoleAction.JESTER.getName()) && deadPlayers.get(playerRole.getKey()))
                jester = playerRole.getKey();
        }

        int totalRoles = 0;
        for (int number : roleTypeCardinality.values())
            totalRoles += number;

        if (roleTypeCardinality.get(RoleType.EVIL.getType()) >= totalRoles - roleTypeCardinality.get(RoleType.EVIL.getType()))
            return new Message("The Evil roles win the game");

        if (roleTypeCardinality.get(RoleType.EVIL.getType()) == 0 && !hamster.isEmpty())
            return new Message("The Hamster wins the game");

        if (roleTypeCardinality.get(RoleType.EVIL.getType()) == 0)
            return new Message("The Good and Neutral roles win the game");

        if (!jester.isEmpty() && new IsJesterVotedOut(ds.getConnection(), ds, gameID).access().getOutputParam())
            return new Message("The Jester wins the game");

        return null;
    }

}