package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.tags.shaded.org.apache.xpath.operations.Bool;

import javax.sql.DataSource;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.*;

/**
 * Handles the HTTP POST request to handle game actions.
 * It contains methods to handle both day and night phases of the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
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
     * List containing the actions that have to be inserted into the database
     */
    List<Action> insertActions;

    /**
     * List containing the deaths that have to be inserted into the database
     */
    List<PlaysAsIn> updatePlayersDeath;

    /**
     * The results of the night actions.
     */
    private final NightActionsResults nightActionsResults;

    /**
     * The results of the day actions.
     */
    private final DayActionsResults dayActionsResults;

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * The current round of the game.
     */
    int currentRound;

    /**
     * The current phase of the game.
     */
    int currentPhase;

    /**
     * The current subphase of the game.
     */
    int currentSubPhase;

    /**
     * Victory condition if the vote of the second ballot is a tie
     */
    Boolean notVote = false;

    /**
     * Object to check the correctness of the action
     */
    PossibleGameActions possibleGameActions;

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
        super(Actions.POST_GAME_ACTIONS_ACTION, req, res, ds);
        this.gameID = gameID;

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null
                    && !role.getAction().equals(GameRoleAction.SAM.getAction())
                    && !role.getAction().equals(GameRoleAction.CARPENTER.getAction()))
                nightAction.put(role.getName(), role.getAction());

        deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        playersRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        nightActionsResults = new NightActionsResults();
        dayActionsResults = new DayActionsResults();

        insertActions = new ArrayList<>();
        updatePlayersDeath = new ArrayList<>();
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
            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            possibleGameActions = new PossibleGameActions(ds, gameID);
            currentRound = game.getRounds() == 0 ? 1 : game.getRounds();
            currentPhase = game.getPhase();
            currentSubPhase = game.getSubphase();

            if (game.getWho_win() != -1) {

                LOGGER.error("ERROR: the game is over");
                ErrorCode ec = ErrorCode.GAME_IS_OVER;
                Message m = new Message("ERROR: the game is over", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());

            } else {
                if (currentPhase == GamePhase.NIGHT.getId()) {

                    List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream());

                    // check of the correctness of the actions
                    if (!correctnessOfNightActions(gameActions))
                        return;
                    LOGGER.info("correctness of night actions done");
                    if (!handleNightPhase(gameActions))
                        return;
                } else {

                    InputStream inputStream = req.getInputStream();
                    String JSON = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                    InputStream stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));

                    List<GameAction> votes_0 = GameAction.fromJSON(stream, "votes_0");
                    LOGGER.info("Votes_0 done");

                    stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
                    List<GameAction> votes_1 = GameAction.fromJSON(stream, "votes_1");
                    LOGGER.info("Votes_1 done");

                    stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
                    List<GameAction> votes_2 = GameAction.fromJSON(stream, "votes_2");
                    LOGGER.info("Votes_2 done");

                    stream = new ByteArrayInputStream(JSON.getBytes(StandardCharsets.UTF_8));
                    List<GameAction> extraActions = GameAction.fromJSON(stream, "extraActions");
                    LOGGER.info("Extra action done");


                    if (!correctnessOfFirstVote(votes_0))
                        return;
                    LOGGER.info("correctness of first vote done");
                    if (!handleDayPhase(votes_0, votes_1, votes_2, extraActions))
                        return;
                }

                VictoryMessage vm = isAVictory();
                if (vm != null) {
                    res.setStatus(HttpServletResponse.SC_OK);
                    vm.toJSON(res.getOutputStream());
                    currentPhase = GamePhase.DAY.getId(); // the game always finish during the day

                    LOGGER.info("The game finished, winner(s): " + vm.getMessage());
                    new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound, vm.getFaction()).access();
                } else {
                    res.setStatus(HttpServletResponse.SC_OK);
                    // return the action result before updating the round and the phase
                    if (currentPhase == GamePhase.DAY.getId()) {
                        res.setStatus(HttpServletResponse.SC_OK);
                        dayActionsResults.toJSON(res.getOutputStream());
                        currentRound++;
                        currentPhase = GamePhase.NIGHT.getId();
                        LOGGER.info(dayActionsResults.toString());
                    } else {
                        res.setStatus(HttpServletResponse.SC_OK);
                        nightActionsResults.toJSON(res.getOutputStream());
                        currentPhase = GamePhase.DAY.getId();
                        LOGGER.info(nightActionsResults.toString());
                    }

                    new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound).access();

                }
            }

        } catch (SQLException | IOException e) {
            LOGGER.error("Unable to serve the REST request.", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            res.setStatus(ec.getHTTPCode());
            Message m = new Message("Unable to serve the REST request.", ec.getErrorCode(), e.getMessage());
            m.toJSON(res.getOutputStream());
        } finally {
            LogContext.removeIPAddress();
            LogContext.removeUser();
            LogContext.removeAction();
            LogContext.removeGame();
        }

    }

    /**
     * Handles the day phase of the game, including voting and actions taken during the day.
     * <p>
     * This method processes the actions performed by players during the day phase of the game,
     * including voting and special actions based on player roles such as the carpenter's ability,
     * sam's ability, and plague spreader's ability. It also handles errors related to invalid actions.
     *
     * @param votes_0      A list of GameAction objects representing the votes performed during the day phase.
     * @param votes_1      A list of GameAction objects representing the first ballot votes performed during the day phase.
     * @param votes_2      A list of GameAction objects representing the second ballot votes (if needed) performed during the day phase.
     * @param extraActions A list of GameAction objects representing the actions performed during the day phase.
     * @return {@code true} if the day phase actions are processed successfully, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean handleDayPhase(List<GameAction> votes_0, List<GameAction> votes_1, List<GameAction> votes_2, List<GameAction> extraActions) throws SQLException, IOException {

        try {

            String votedPlayer;
            Message m = null;


            // First vote with all the players, also the dead player vote in this phase
            List<Map.Entry<String, Integer>> votesList = handleVotes(votes_0);
            List<String> ballotPlayers = votesResult(votesList, false);
            currentSubPhase++;

            if (ballotPlayers.size() == 1) {
                votedPlayer = ballotPlayers.get(0);
            } else {
                // First ballot
                if (!correctnessOfBallotVotes(votes_1, ballotPlayers))
                    return false;
                List<Map.Entry<String, Integer>> ballotList_1 = handleBallot(votes_1, ballotPlayers);
                List<String> ballotPlayers_1 = votesResult(ballotList_1, true);
                currentSubPhase++;

                if (ballotPlayers_1.size() == 1) {
                    votedPlayer = ballotPlayers_1.get(0);
                } else {
                    //Second ballot if needed
                    if (!correctnessOfBallotVotes(votes_2, ballotPlayers_1))
                        return false;
                    List<Map.Entry<String, Integer>> ballotList_2 = handleBallot(votes_2, ballotPlayers_1);
                    List<String> ballotPlayers_2 = votesResult(ballotList_2, true);
                    currentSubPhase++;

                    if (ballotPlayers_2.size() == 1) {
                        votedPlayer = ballotPlayers_2.get(0);
                    } else {
                        notVote = true;
                        return true;
                    }
                }
            }

            //extraAction
            if (!correctnessOfExtraAction(extraActions))
                return false;

            Boolean plaguedPlayerDeath = true;
            int counterPlagueAction = 0;
            String plaguedPlayer = "";

            for (GameAction gameAction : extraActions) {

                String player = gameAction.getPlayer();
                String role = gameAction.getRole();
                String target = gameAction.getTarget();

                if (role.equals(GameRoleAction.SAM.getName()) && (new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, votedPlayer).access().getOutputParam().equals("sam"))) {
                    //He can decide to kill someone else before his dead
                    Action samAction = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, GameRoleAction.SAM.getAction(), target);
                    insertActions.add(samAction);
                    LOGGER.info("Sam killed " + target);
                    dayActionsResults.setSamTarget(target);
                    updatePlayersDeath.add(updatePlayerDeath(target));

                } else if (role.equals(GameRoleAction.PLAGUE_SPREADER.getName())) {

                    counterPlagueAction++;

                    if (counterPlagueAction == 1) {
                        plaguedPlayer = new PlayerWithPlagueInGameDAO(ds.getConnection(), gameID, currentRound).access().getOutputParam();
                        plaguedPlayerDeath = false;
                    }

                    if (gameAction.getTarget().equals(plaguedPlayer)) {
                        plaguedPlayerDeath = true;
                    }

                    Action plagueAction = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, GameRoleAction.PLAGUE_SPREADER.getAction(), target);
                    insertActions.add(plagueAction);
                    LOGGER.info("Plague spreader killed " + target);
                    dayActionsResults.addPlaguePlayer(target);
                    updatePlayersDeath.add(updatePlayerDeath(target));

                } else {
                    //error
                    LOGGER.error("ERROR: not valid action");
                    ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                    m = new Message("ERROR: not valid action", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }
            }

            if (!plaguedPlayerDeath) {
                LOGGER.error("ERROR: not valid action, plague spreader action not correct");
                ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                m = new Message("ERROR: not valid action, plague spreader action not correct", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;
            }

            for (PlaysAsIn p : updatePlayersDeath) {
                if (p.getPlayerUsername().equals(votedPlayer)) {
                    LOGGER.error("ERROR: not valid vote, the player already die from plague");
                    ErrorCode ec = ErrorCode.VOTE_LIST_NOT_VALID;
                    m = new Message("ERROR: not valid vote, the player already die from plague", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }
            }

            updateDayResult(votedPlayer);

            for (Action action : insertActions) {
                new InsertIntoActionDAO(ds.getConnection(), action).access();
            }

            for (PlaysAsIn playsAsIn : updatePlayersDeath) {
                new UpdateDeathOfPlayerInTheGameDAO(ds.getConnection(), playsAsIn).access();
            }

        } catch (SQLException e) {

            LOGGER.error("ERROR: something went wrong in access the database", e);
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("ERROR: something went wrong in access the database", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;

        } catch (IOException e) {

            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;

        }

        return true;

    }

    /**
     * Handles the voting process by counting votes for each player.
     *
     * @param votes a list of GameAction objects representing the votes cast by players.
     * @return a list of objects representing the updated vote counts for each player.
     */
    private List<Map.Entry<String, Integer>> handleVotes(List<GameAction> votes) {

        Map<String, Integer> votesMap = getVotesMap(votes);

        for (GameAction vote : votes) {

            String player = vote.getPlayer();
            String target = vote.getTarget();

            Action action = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, Action.VOTE, target);
            // DAO for add the action to the database
            insertActions.add(action);
            //new InsertIntoActionDAO(ds.getConnection(), action).access();
            votesMap.put(target, votesMap.get(target) + 1);

        }

        return new ArrayList<>(votesMap.entrySet());

    }

    /**
     * Handles the ballot voting process by counting votes for each player.
     *
     * @param votes         a list of GameAction objects representing the votes cast by players.
     * @param ballotPlayers a list of username
     * @return a list objects representing the updated vote counts for each player.
     */
    private List<Map.Entry<String, Integer>> handleBallot(List<GameAction> votes, List<String> ballotPlayers) {

        Map<String, Integer> ballotMap = getBallotMap(ballotPlayers);

        for (GameAction vote : votes) {

            String player = vote.getPlayer();
            String target = vote.getTarget();

            Action action = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, Action.VOTE, target);
            // DAO for add the action to the database
            insertActions.add(action);
            //new InsertIntoActionDAO(ds.getConnection(), action).access();
            ballotMap.put(target, ballotMap.get(target) + 1);

        }

        return new ArrayList<>(ballotMap.entrySet());

    }

    /**
     * Determines the players involved in a ballot or the result of a vote.
     *
     * <p>This method sorts a list of players with their respective votes and determines the players
     * who either proceed to a ballot or win based on the votes. If the ballot flag is false, it returns
     * the top two players. If the ballot flag is true, it checks for ties and includes all tied players.
     *
     * @param votesList a list representing the players and their votes
     * @param ballot    a boolean value indicating whether it's the first vote (false) or a ballot (true)
     * @return a username list of players who either proceed to a ballot or win the vote
     */
    private static List<String> votesResult(List<Map.Entry<String, Integer>> votesList, Boolean ballot) {

        List<String> ballotPlayers = new ArrayList<>();
        Integer nVote;
        String logger = "";

        Collections.sort(votesList, (entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        ballotPlayers.add(votesList.get(0).getKey());
        nVote = votesList.get(0).getValue();
        logger = logger + votesList.get(0).getKey();

        if (votesList.get(1).getValue() == 0) {
            LOGGER.info("The player " + ballotPlayers.get(0) + " voted");
            return ballotPlayers;
        }

        if (!ballot) {
            LOGGER.info("First votation");
            ballotPlayers.add(votesList.get(1).getKey());
            nVote = votesList.get(1).getValue();
            logger = logger + " " + votesList.get(1).getKey();
        } else {
            LOGGER.info("ballot");
            if (nVote == votesList.get(1).getValue()) {
                ballotPlayers.add(votesList.get(1).getKey());
                logger = logger + " " + votesList.get(1).getKey();
            } else {
                LOGGER.info("The player " + ballotPlayers.get(0) + " voted");
                return ballotPlayers;
            }
        }

        for (Map.Entry<String, Integer> vote : votesList) {
            if (vote.getValue() == nVote) {
                if (!(vote.getKey().equals(votesList.get(1).getKey()) || vote.getKey().equals(votesList.get(0).getKey()))) {
                    ballotPlayers.add(vote.getKey());
                    logger = logger + " " + vote.getKey();
                }
            }
        }

        LOGGER.info("Ballot between " + logger);

        return ballotPlayers;
    }

    /**
     * Updates the result of the day based on the player voted out.
     *
     * <p>This method determines if the player voted out is a carpenter by calling the
     * {@link #carpenterCheck(String)} method. If the player is a carpenter, it logs the event
     * and sets the carpenter's ability as used in the {@link DayActionsResults} instance.
     * If the player is not a carpenter, it logs the voted-out player, updates the
     * {@link DayActionsResults} with the voted-out player's name, and adds the result of the
     * {@link #updatePlayerDeath(String)} method to the {@link #updatePlayersDeath} list.
     *
     * @param playerVoted the name of the player who was voted out.
     * @throws SQLException if a database access error occurs.
     * @throws IOException  if an I/O error occurs.
     */
    private void updateDayResult(String playerVoted) throws SQLException, IOException {

        if (carpenterCheck(playerVoted)) {
            LOGGER.info("The carpenter use his ability");
            dayActionsResults.setCarpenterAbility(true);
        } else {
            LOGGER.info(playerVoted + " is voted out");
            dayActionsResults.setVotedPlayer(playerVoted);
            updatePlayersDeath.add(updatePlayerDeath(playerVoted));
        }

    }

    /**
     * Checks the ability of a player with the role "carpenter" during a game round.
     * <p>
     * This method verifies if the player with the specified username has the role "carpenter"
     * in the current game and if the carpenter's ability is active for the current round.
     * If the conditions are met, the method increments the current sub-phase, records the carpenter's action,
     * and returns true indicating the carpenter's safety for the round.
     *
     * @param player The username of the player to check for the role "carpenter".
     * @return {@code true} if the player is a carpenter and is safe this round, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean carpenterCheck(String player) throws SQLException, IOException {
        try {
            if ((new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam()).equals("carpenter")) {
                LOGGER.info("Carpenter ability check");
                if (new CarpenterAbilityDAO(ds.getConnection(), gameID).access().getOutputParam()) {
                    LOGGER.info("Carpenter is safe this round");
                    Action carpenterAction = new Action(gameID, player, currentRound, currentPhase, currentSubPhase, GameRoleAction.CARPENTER.getAction(), player);
                    new InsertIntoActionDAO(ds.getConnection(), carpenterAction).access();
                    return true;
                }
            }
            return false;
        } catch (SQLException e) {
            LOGGER.error("ERROR: something went wrong in access the database", e);
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("ERROR: something went wrong in access the database", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }
    }

    /**
     * Checks the correctness of the actions performed during first vote of the day.
     * <p>
     * This method verifies the correctness of the actions performed by players during a game day.
     * It checks various conditions such as whether players and targets are in the game,
     * if players have the correct role, if targets are dead, and the validity of voting actions.
     *
     * @param votes_0 A list of GameAction objects representing the votes performed during the day phase.
     * @return {@code true} if all actions are correct, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean correctnessOfFirstVote(List<GameAction> votes_0) throws SQLException, IOException {

        try {

            int deadListCount = 0;
            Message m = null;

            m = possibleGameActions.populateList();
            if (m != null) {
                res.setStatus(Objects.requireNonNull(ErrorCode.getErrorCode(m.getErrorCode())).getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;
            }

            List<Map.Entry<String, Boolean>> deadPlayersList = new ArrayList<>(deadPlayers.entrySet());
            deadPlayersList.sort(Map.Entry.comparingByKey());

            votes_0.sort(Comparator.comparing(GameAction::getPlayer));
            for (GameAction vote : votes_0) {

                if (!correctnessOfAction(vote, false))
                    return false;

                if (!(vote.getPlayer().equals(deadPlayersList.get(deadListCount).getKey()))) {
                    LOGGER.error("ERROR: the list of vote isn't correct");
                    ErrorCode ec = ErrorCode.VOTE_LIST_NOT_VALID;
                    m = new Message("ERROR: the list of vote isn't correct", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }

                deadListCount++;
            }

            return true;

        } catch (SQLException e) {
            LOGGER.error("ERROR: something went wrong in access the database", e);
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("ERROR: something went wrong in access the database", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        } catch (IOException e) {
            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }
    }

    /**
     * Checks the correctness of the actions performed during ballot vote of the day.
     * <p>
     * This method verifies the correctness of the actions performed by players during a game day.
     * It checks various conditions such as whether players and targets are in the game,
     * if players have the correct role, if targets are dead, and the validity of voting actions.
     *
     * @param ballotVotes  A list of GameAction objects representing the votes performed during ballot of day phase.
     * @param ballotPlayer A list of String objects that contains the username of the player in the ballot
     * @return {@code true} if all actions are correct, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean correctnessOfBallotVotes(List<GameAction> ballotVotes, List<String> ballotPlayer) throws SQLException, IOException {

        try {
            int deadListCount = 0;
            Message m = null;

            List<Map.Entry<String, Boolean>> deadPlayersList = new ArrayList<>(deadPlayers.entrySet());
            deadPlayersList.sort(Map.Entry.comparingByKey());

            ballotVotes.sort(Comparator.comparing(GameAction::getPlayer));
            for (GameAction vote : ballotVotes) {

                if (!correctnessOfAction(vote, false))
                    return false;

                if (deadPlayers.get(vote.getPlayer())) {
                    LOGGER.error("ERROR: the player " + vote.getPlayer() + " is dead, cannot vote in the ballot");
                    ErrorCode ec = ErrorCode.DEAD_PLAYER;
                    m = new Message("ERROR: the player " + vote.getPlayer() + " is dead, cannot vote in the ballot", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }

                while (deadPlayersList.get(deadListCount).getValue() || ballotPlayer.contains(deadPlayersList.get(deadListCount).getKey())) {
                    deadListCount++;
                }

                if (!(vote.getPlayer().equals(deadPlayersList.get(deadListCount).getKey()))) {
                    LOGGER.error("ERROR: the list of vote isn't correct");
                    LOGGER.error(vote.getPlayer() + " != " + deadPlayersList.get(deadListCount).getKey());
                    ErrorCode ec = ErrorCode.VOTE_LIST_NOT_VALID;
                    m = new Message("ERROR: the list of vote isn't correct", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }

                if (!ballotPlayer.contains(vote.getTarget())) {
                    LOGGER.error("ERROR: the target of the vote isn't one of the player in the ballot");
                    LOGGER.info("target: " + vote.getTarget());
                    ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                    m = new Message("ERROR: the target of the vote isn't one of the player in the ballot", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }

                deadListCount++;
            }

            return true;
        } catch (SQLException e) {
            LOGGER.error("ERROR: something went wrong in access the database", e);
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("ERROR: something went wrong in access the database", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        } catch (IOException e) {
            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }
    }

    /**
     * Checks the correctness of the extra actions performed during the game day.
     * <p>
     * This method verifies the correctness of the actions performed by players during a game day.
     * It checks various conditions such as whether players and targets are in the game,
     * if players have the correct role, if targets are dead, and the validity of voting actions.
     *
     * @param extraActions A list of GameAction objects representing extra actions of the day phase.
     * @return {@code true} if all actions are correct, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean correctnessOfExtraAction(List<GameAction> extraActions) throws SQLException, IOException {

        try {
            Message m = null;

            for (GameAction gameAction : extraActions) {

                if (!correctnessOfAction(gameAction, true))
                    return false;

                if (!(gameAction.getRole().equals("sam")) && !(gameAction.getRole().equals("plague spreader"))) {
                    LOGGER.error("ERROR: action not permitted");
                    ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                    m = new Message("ERROR: action not permitted", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }
            }

            return true;
        } catch (SQLException e) {
            LOGGER.error("ERROR: something went wrong in access the database", e);
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("ERROR: something went wrong in access the database", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        } catch (IOException e) {
            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }
    }

    /**
     * Checks the correctness of the action performed during a game day.
     * <p>
     * This method verifies the correctness of the action performed by players during a game day.
     * It checks various conditions such as whether players and targets are in the game,
     * if players have the correct role, if targets are dead, and the validity of voting actions.
     *
     * @param gameAction A GameAction object representing an action of the day phase.
     * @param extra      A boolean value that indicate if an action is extra or a normal action of the day
     * @return {@code true} if all actions are correct, {@code false} otherwise.
     * @throws SQLException If an SQL exception occurs while accessing the database.
     * @throws IOException  If an IO exception occurs.
     */
    private boolean correctnessOfAction(GameAction gameAction, Boolean extra) throws SQLException, IOException {

        Message m = null;

        if (!possibleGameActions.isValidAction(gameAction, extra)) {

            LOGGER.error("ERROR: the action " + gameAction.getPlayer() + " (" + gameAction.getRole() + ") -> " + gameAction.getTarget() + " is not valid");
            ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
            m = new Message("ERROR: the action " + gameAction.getPlayer() + " (" + gameAction.getRole() + ") -> " + gameAction.getTarget() + " is not valid", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }

        //check if the target is in the game
        if (gameID != new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam()) {

            LOGGER.error("ERROR: the player " + gameAction.getPlayer() + " is not in the game");
            ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
            m = new Message("ERROR: the player " + gameAction.getPlayer() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }

        //check if the player is in the game
        if (gameID != new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam()) {

            LOGGER.error("ERROR: the target " + gameAction.getTarget() + " is not in the game");
            ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
            m = new Message("ERROR: the target " + gameAction.getTarget() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());
            return false;
        }


        return true;
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
            boolean isKamikazeBlocked = false;

            // check of the actions
            for (GameAction gameAction : gameActions) {
                PossibleGameActions possibleGameActions = new PossibleGameActions(ds, gameID);
                Message m = possibleGameActions.populateList();
                if (m != null) {
                    res.setStatus(Objects.requireNonNull(ErrorCode.getErrorCode(m.getErrorCode())).getHTTPCode());
                    m.toJSON(res.getOutputStream());
                    return false;
                }
                if (!possibleGameActions.isValidAction(gameAction, false))
                    return false;
            }

            // illusionist action must be the first one
            for (Map.Entry<String, Map<String, Boolean>> illusionist_entry : actionsMap.entrySet()) {

                String target = illusionist_entry.getKey();
                Map<String, Boolean> actionPlayerMap = illusionist_entry.getValue();

                // check of the "block" action --> ILLUSIONIST
                // (if the target is blocked his action must be blocked (put them to false)
                if (actionPlayerMap.get(GameRoleAction.ILLUSIONIST.getAction())) {

                    GameAction illusionistAction = getPlayerByRole(gameActions, GameRoleAction.ILLUSIONIST.getName());
                    String illusionist = illusionistAction.getPlayer();
                    String targetRole = playersRole.get(target);

                    if (targetRole.equals(GameRoleAction.KAMIKAZE.getName()))
                        isKamikazeBlocked = true;

                    //if the target of the illusionist is the kamikaze, the following variable will be null
                    GameAction targetOfTargetAction = getPlayerByRole(gameActions, targetRole);
                    //not executed when the target of the illusionist is the kamikaze
                    if (targetOfTargetAction != null) {
                        String targetOfTarget = targetOfTargetAction.getTarget();
                        Map<String, Boolean> tmp = actionsMap.get(targetOfTarget);
                        String player_action = nightAction.get(targetRole);
                        tmp.put(player_action, false);
                        insertActions.add(
                                new Action(gameID, target, currentRound, currentPhase, 0, GameRoleAction.valueOfName(targetRole).getAction(), targetOfTarget, true)
                        );

                        actionsMap.put(targetOfTarget, tmp);
                    }

                    LOGGER.info("The target " + target + " has been blocked during the night by the illusionist");
                    insertActions.add(new Action(gameID, illusionist, currentRound, currentPhase, 0, GameRoleAction.ILLUSIONIST.getAction(), target));
                    //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, illusionist, currentRound, currentPhase, 0, GameRoleAction.ILLUSIONIST.getAction(), target)).access();
                }

            }

            // for each player in the map i check the associated map. Then for each element in this map i check if the player is a target of which action
            for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

                String target = entry.getKey();
                Map<String, Boolean> actionPlayerMap = entry.getValue();
                //LOGGER.info(target + " " + actionPlayerMap.get(GameRoleAction.KNIGHT.getAction()));

                if (!deadPlayers.get(entry.getKey())) {

                    // check for the "explore" action --> EXPLORER
                    // (he can explore only once in a game, so if he decides to do it, after that he will become a normal wolf)
                    if (actionPlayerMap.get(GameRoleAction.EXPLORER.getAction())) {
                        if (!new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction())) {
                            LOGGER.info("The target " + target + " has been killed by the explorer");

                            String explorer = getPlayerByRole(gameActions, GameRoleAction.EXPLORER.getName()).getPlayer();
                            insertActions.add(new Action(gameID, explorer, currentRound, currentPhase, 0, GameRoleAction.EXPLORER.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, explorer, currentRound, currentPhase, 0, GameRoleAction.EXPLORER.getAction(), target)).access();
                            updatePlayersDeath.add(updatePlayerDeath(target));
                        }
                    }

                    // check for the "protect" action --> KNIGHT
                    // (if the current target is the same as the previous turn target, tha knight has to change target)
                    if (actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())
                            && target.equals(new LastPlayerProtectedByKnightDAO(ds.getConnection(), gameID).access().getOutputParam())) {

                        LOGGER.error("ACTION NOT POSSIBLE: you have already protected " + target + " the previous turn");
                        ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                        Message m = new Message("ACTION NOT POSSIBLE: you have already protected " + target + " the previous turn", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(ec.getHTTPCode());
                        m.toJSON(res.getOutputStream());
                        return false;

                    } else if (actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())) {

                        LOGGER.info("The knight has protect " + target);

                        String knight = getPlayerByRole(gameActions, GameRoleAction.KNIGHT.getName()).getPlayer();
                        insertActions.add(new Action(gameID, knight, currentRound, currentPhase, 0, GameRoleAction.KNIGHT.getAction(), target));
                        //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, knight, currentRound, currentPhase, 0, GameRoleAction.KNIGHT.getAction(), target)).access();

                        if (playersRole.get(target).equals(GameRoleAction.HAMSTER.getName())) {
                            LOGGER.info("The knight has protected the hamster " + target);
                            updatePlayersDeath.add(updatePlayerDeath(target));
                        }

                    }

                    // check of the "maul" action --> WOLVES
                    // (if the target is protected, or is the hamster, or is the hobbit and in the game are still alive more than 1 wolf, then the target will not die)
                    if (actionPlayerMap.get(GameRoleAction.WOLF.getAction())) {

                        String wolf = "";
                        for (GameAction gameAction : gameActions) {
                            if (gameAction.getTarget().equals(target)
                                    && (gameAction.getRole().equals(GameRoleAction.WOLF.getName())
                                    || (gameAction.getRole().equals(GameRoleAction.DORKY.getName())
                                    && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
                                    || gameAction.getRole().equals(GameRoleAction.EXPLORER.getName())
                                    || gameAction.getRole().equals(GameRoleAction.PUPPY.getName()))) {
                                wolf = gameAction.getPlayer();
                            }
                        }

                        if ((!actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())
                                && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction()))
                                && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName())) {

                            LOGGER.info("The target " + target + " has been killed by the wolves (" + wolf + ") during the night");
                            //LOGGER.info("-------------------------> Wolf: " + wolf + " " + "Target: " + target);
                            insertActions.add(new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target)).access();
                            updatePlayersDeath.add(updatePlayerDeath(target));

                        } else if (new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName()) && (number_of_wolves <= 1)) {

                            LOGGER.info("The target " + target + " has been killed by the wolves during the night (number of wolves: " + number_of_wolves + ")");
                            insertActions.add(new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, wolf, currentRound, currentPhase, 0, GameRoleAction.WOLF.getAction(), target)).access();
                            updatePlayersDeath.add(updatePlayerDeath(target));

                        }

                    }

                    // check for the "point" action --> DORKY
                    // (only if the dorky had not already pointed a wolf pack member: if the target is a member of the pack, then the dorky becomes a wolf)
                    if (!new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {
                        if (actionPlayerMap.get(GameRoleAction.DORKY.getAction())) {

                            String dorky = getPlayerByRole(gameActions, GameRoleAction.DORKY.getName()).getPlayer();
                            //add the action point to action table since the dorky is not a wolf
                            LOGGER.info("The target " + target + " has been pointed by the dorky " + dorky);
                            insertActions.add(new Action(gameID, dorky, currentRound, currentPhase, 0, GameRoleAction.DORKY.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, dorky, currentRound, currentPhase, 0, GameRoleAction.DORKY.getAction(), target)).access();
                        }
                    }

                    // check of the "investigate" action --> SEER
                    if (actionPlayerMap.get(GameRoleAction.SEER.getAction())) {

                        String seer = getPlayerByRole(gameActions, GameRoleAction.SEER.getName()).getPlayer();
                        // in case the seer sees the puppy he will see that is a good role
                        LOGGER.info("The target " + target + " has been seen during the night");
                        insertActions.add(new Action(gameID, seer, currentRound, currentPhase, 0, GameRoleAction.SEER.getAction(), target));
                        //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, seer, currentRound, currentPhase, 0, GameRoleAction.SEER.getAction(), target)).access();

                        if (playersRole.get(target).equals(GameRoleAction.HAMSTER.getName())) {
                            LOGGER.info("The seer has seen the hamster " + target);
                            updatePlayersDeath.add(updatePlayerDeath(target));
                        }

                    }

                    // check of the "shot" action --> SHERIFF
                    // (if the target is a member of the wolf pack or a victory stealer he will die, otherwise the sheriff will die)
                    if (actionPlayerMap.get(GameRoleAction.SHERIFF.getAction())) {

                        String sheriff = getPlayerByRole(gameActions, GameRoleAction.SHERIFF.getName()).getPlayer();

                        GameRoleAction player_role = GameRoleAction.valueOfName(playersRole.get(target));
                        assert player_role != null;
                        if (player_role.getRoleType().getType() == 1 || player_role.getRoleType().getType() == 2) {

                            LOGGER.info("The target " + target + " has been killed by the sheriff " + sheriff + " during the night");
                            insertActions.add(new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), target)).access();
                            updatePlayersDeath.add(updatePlayerDeath(target));

                        } else {

                            LOGGER.info("The sheriff " + sheriff + " has killed himself during the night (he has shoot " + target + ")");
                            insertActions.add(new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), sheriff));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, sheriff, currentRound, currentPhase, 0, GameRoleAction.SHERIFF.getAction(), sheriff)).access();
                            updatePlayersDeath.add(updatePlayerDeath(sheriff));
                        }

                    }

                    // check for the "blowup" action --> KAMIKAZE
                    // (if the target is the kamikaze and the action is true, the kamikaze kill himself and the wolf)
                    if (playersRole.get(target).equals(GameRoleAction.KAMIKAZE.getName())
                            && (actionPlayerMap.get(GameRoleAction.WOLF.getAction())
                            || actionPlayerMap.get(GameRoleAction.BERSERKER.getAction())
                            || actionPlayerMap.get(GameRoleAction.EXPLORER.getAction())
                            || actionPlayerMap.get(GameRoleAction.PUPPY.getAction()))) {

                        String wolf = "";
                        for (GameAction gameAction : gameActions)
                            if (gameAction.getTarget().equals(target)
                                    && (gameAction.getRole().equals(GameRoleAction.WOLF.getName())
                                    || gameAction.getRole().equals(GameRoleAction.EXPLORER.getName())
                                    || gameAction.getRole().equals(GameRoleAction.PUPPY.getName())
                                    || (gameAction.getRole().equals(GameRoleAction.DORKY.getName())
                                    && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())))
                                wolf = gameAction.getPlayer();

                        if (!isKamikazeBlocked) {
                            LOGGER.info("The target " + target + " is blown up with the wolf " + wolf);
                            insertActions.add(new Action(gameID, target, currentRound, currentPhase, 0, GameRoleAction.KAMIKAZE.getAction(), wolf));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, target, currentRound, currentPhase, 0, GameRoleAction.KAMIKAZE.getName(), wolf)).access();
                            updatePlayersDeath.add(updatePlayerDeath(wolf));
                        }
                    }

                    // check for the "plague" action --> PLAGUE SPREADER
                    if (actionPlayerMap.get(GameRoleAction.PLAGUE_SPREADER.getAction())) {

                        String plague_spreader = getPlayerByRole(gameActions, GameRoleAction.PLAGUE_SPREADER.getName()).getPlayer();
                        LOGGER.info("The target " + target + " is anointed");
                        insertActions.add(new Action(gameID, plague_spreader, currentRound, currentPhase, 0, GameRoleAction.PLAGUE_SPREADER.getAction(), target));
                        //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, plague_spreader, currentRound, currentPhase, 0, GameRoleAction.PLAGUE_SPREADER.getAction(), target)).access();
                        nightActionsResults.setPlaguedPlayer(target);
                    }

                    // check for the "rage" action --> BERSERKER
                    // he can maul two target (so in the json he will appear two time), bypassing the knight and dying after he activated his effect
                    if (actionPlayerMap.get(GameRoleAction.BERSERKER.getAction())) {

                        if (!new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, target).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction())) {

                            String berserker = getPlayerByRole(gameActions, GameRoleAction.BERSERKER.getName()).getPlayer();
                            LOGGER.info("The target " + target + " has been killed by the berserker");
                            berserker_count++;
                            insertActions.add(new Action(gameID, berserker, currentRound, currentPhase, 0, GameRoleAction.BERSERKER.getAction(), target));
                            //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, berserker, currentRound, currentPhase, 0, GameRoleAction.BERSERKER.getAction(), target)).access();

                            if (berserker_count == 2) {
                                LOGGER.info("The berserker has killed also himself during the night");
                                updatePlayersDeath.add(updatePlayerDeath(target));
                                updatePlayersDeath.add(updatePlayerDeath(berserker));
                            } else if (berserker_count == 1) {
                                updatePlayersDeath.add(updatePlayerDeath(target));
                            }

                        }

                    }

                    // check for the "look" action --> MEDIUM
                    // (he looks at the RoleType of the target that died by the stake during the previous day - it start to activate his effect from the second night)
                    if (actionPlayerMap.get(GameRoleAction.MEDIUM.getAction())
                            && !(currentRound == 1 && currentPhase == 0)) {

                        String medium = getPlayerByRole(gameActions, GameRoleAction.MEDIUM.getName()).getPlayer();
                        LOGGER.info("The target " + target + " have seen if the stake dead target is good, evil or neutral");
                        insertActions.add(new Action(gameID, medium, currentRound, currentPhase, 0, GameRoleAction.MEDIUM.getAction(), target));
                        //new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, medium, currentRound, currentPhase, 0, GameRoleAction.MEDIUM.getAction(), target)).access();

                    }

                }

            }

            for (Action action : insertActions)
                new InsertIntoActionDAO(ds.getConnection(), action).access();

            for (PlaysAsIn playsAsIn : updatePlayersDeath) {
                new UpdateDeathOfPlayerInTheGameDAO(ds.getConnection(), playsAsIn).access();
                nightActionsResults.addDeadPlayer(playsAsIn.getPlayerUsername());
            }

            nightActionsResults.setDorkyIsWolf(new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam());
            nightActionsResults.setPuppyIsWolf(new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam());

        } catch (SQLException | IOException e) {

            LOGGER.error("ERROR: something went wrong", e);
            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            Message m = new Message("ERROR: something went wrong", ec.getErrorCode(), ec.getErrorMessage());
            res.setStatus(ec.getHTTPCode());
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
     * @throws SQLException if there is an error executing the SQL statement
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
                    && new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;
            else if (playerRole.getValue().equals(GameRoleAction.DORKY.getName())
                    && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;

        return number_of_wolves;
    }

    /**
     * Checks the correctness of the actions performed during the night round. <br>
     * This method verifies the correctness of the actions performed by players during the night round.
     * It checks whether the player and target are in the game, if the player has the correct role,
     * if both the player and target are alive, and if the actions correspond to the roles' abilities.
     * Additionally, it ensures that the correct number of actions is performed by each role with an effect.
     *
     * @param gameActions the list of game actions to be checked
     * @return true if the actions are correct, false otherwise
     * @throws SQLException if a SQL exception occurs while accessing the database
     * @throws IOException  if an I/O exception occurs
     */
    private boolean correctnessOfNightActions(List<GameAction> gameActions) throws SQLException, IOException {

        Message m;
        boolean wolfActionDone = false;
        boolean hasSheriffShoot = false;
        boolean areAllAlive = true;
        int berserkerCount = 0;
        int game_id;


        for (GameAction gameAction : gameActions) {

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id != gameID) {

                LOGGER.error("ERROR: the player " + gameAction.getPlayer() + " is not in the game");
                ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
                m = new Message("ERROR: the player " + gameAction.getPlayer() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id != gameID) {

                LOGGER.error("ERROR: the target " + gameAction.getTarget() + " is not in the game");
                ErrorCode ec = ErrorCode.PLAYER_NOT_IN_GAME;
                m = new Message("ERROR: the target " + gameAction.getTarget() + " is not in the game", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

            }

            // check if the action is valid or not
            PossibleGameActions possibleGameActions = new PossibleGameActions(ds, gameID);
            m = possibleGameActions.populateList();
            if (m != null) {
                res.setStatus(Objects.requireNonNull(ErrorCode.getErrorCode(m.getErrorCode())).getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;
            }
            if (!possibleGameActions.isValidAction(gameAction, false)) {

                LOGGER.error("ERROR: the action " + gameAction.getPlayer() + " (" + gameAction.getRole() + ") -> " + gameAction.getTarget() + " is not valid");
                ErrorCode ec = ErrorCode.NOT_VALID_ACTION;
                m = new Message("ERROR: the action " + gameAction.getPlayer() + " (" + gameAction.getRole() + ") -> " + gameAction.getTarget() + " is not valid", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
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
                        res.setStatus(ec.getHTTPCode());
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
                        res.setStatus(ec.getHTTPCode());
                        m.toJSON(res.getOutputStream());
                        return false;

                    }

                }

            } else if (gameAction.getRole().equals(GameRoleAction.PUPPY.getName())
                    && !new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {

                LOGGER.error("ACTION NOT POSSIBLE: the puppy can't maul anyone since there's still some wolves alive");
                ErrorCode ec = ErrorCode.NOT_VALID_TARGET;
                m = new Message("ACTION NOT POSSIBLE: the puppy can't maul anyone since there's still some wolves alive", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

            }

            if (gameAction.getRole().equals(GameRoleAction.SHERIFF.getName())) {

                hasSheriffShoot = true;

            }

        }

        for (Map.Entry<String, Boolean> entry : deadPlayers.entrySet()) {
            if (entry.getValue()) {
                areAllAlive = false;
                break;
            }
        }

        // map with the player, his role in the game and if he has done the action (true if so, false if not)(only roles with a night active effect (e.g. kamikaze has a passive effect because he activates it only if a wolf attack him) and alive)
        // if in the game there's the berserker he can do two action
        Map<String, String> rolesWithEffect = new HashMap<>();
        for (Map.Entry<String, String> playerRoleEntry : playersRole.entrySet()) {

            GameRoleAction gameRoleAction = GameRoleAction.valueOfName(playerRoleEntry.getValue());
            assert gameRoleAction != null;
            if (gameRoleAction.getAction() != null
                    && !gameRoleAction.getName().equals(GameRoleAction.KAMIKAZE.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.PUPPY.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.SAM.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.CARPENTER.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.SHERIFF.getName())
                    && !gameRoleAction.getName().equals(GameRoleAction.MEDIUM.getName())
                    && !deadPlayers.get(playerRoleEntry.getKey())) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());
                //LOGGER.info(playerRoleEntry.getValue());

            } else if (gameRoleAction.getAction() != null
                    && gameRoleAction.getName().equals(GameRoleAction.PUPPY.getName())
                    && new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()
                    && !deadPlayers.get(playerRoleEntry.getKey())) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());
                //LOGGER.info(playerRoleEntry.getValue());

            } else if (gameRoleAction.getAction() != null
                    && gameRoleAction.getName().equals(GameRoleAction.SHERIFF.getName())
                    && hasSheriffShoot
                    && !deadPlayers.get(playerRoleEntry.getKey())) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());

            } else if (gameRoleAction.getAction() != null
                    && gameRoleAction.getName().equals(GameRoleAction.MEDIUM.getName())
                    && !deadPlayers.get(playerRoleEntry.getKey())
                    && !(currentRound == 1 && currentPhase == 0)
                    && !areAllAlive) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());
                //LOGGER.info(playerRoleEntry.getValue() + " " + areAllAlive);

            }

        }

        // check for the medium (during the first night he has not to do any action)
        //check if each role with an effect has done the action
        if (berserkerCount == 0) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 1)) {
                //LOGGER.info(gameActions.size() + " " + rolesWithEffect.size() + " " + wolfCount());
                LOGGER.error("ERROR: someone has not done his action, or has done too many actions this turn");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action, or has done too many actions this turn", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

            }
        } else if (berserkerCount == 1) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 1)) {
                //LOGGER.info(gameActions.size() + " " + rolesWithEffect.size() + " " + wolfCount());
                LOGGER.error("ERROR: someone has not done his action this turn");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action this turn", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

            }
        } else if (berserkerCount == 2) {
            if (gameActions.size() != (rolesWithEffect.size() - wolfCount() + 2)) {
                //LOGGER.info(gameActions.size() + " " + rolesWithEffect.size() + " " + wolfCount());
                LOGGER.error("ERROR: someone has not done his action, or has done too many actions this turn (berserker case)");
                ErrorCode ec = ErrorCode.NUMBER_ACTIONS_DOESNT_MATCH;
                m = new Message("ERROR: someone has not done his action, or has done too many actions this turn (berserker case)", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return false;

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
                    else {
                        tmp.put(entry1.getValue(), false);
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                    }
                } else if (entry1.getKey().equals(GameRoleAction.PUPPY.getName())) {
                    // if the puppy is the last wolf pack member alive he can start to maul
                    if (new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                } else if (entry1.getKey().equals(GameRoleAction.EXPLORER.getName())) {
                    // if the explorer has already activated his effect then he can only maul
                    if (new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {
                        tmp.put(GameRoleAction.EXPLORER.getAction(), false);
                        tmp.put(GameRoleAction.WOLF.getAction(), false);
                    } else
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
                    // if the player of the action is puppy and if he's the last wolf alive, then he can start to maul
                    if (!gameAction.getRole().equals(GameRoleAction.PUPPY.getName())) {

                        Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                        tmp.put(nightAction.get(gameAction.getRole()), true);
                        actions.put(gameAction.getTarget(), tmp);

                    } else if (new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {

                        Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                        tmp.put(nightAction.get(gameAction.getRole()), true);
                        actions.put(gameAction.getTarget(), tmp);

                    }

                }

            } else {

                LOGGER.error("ERROR, the action is null");
                ErrorCode ec = ErrorCode.NULL_ACTION;
                Message m = new Message("ERROR, the action is null", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(ec.getHTTPCode());
                m.toJSON(res.getOutputStream());
                return null;

            }

            // special cases: dorky, puppy, explorer
            if (!deadPlayers.get(gameAction.getPlayer())) {

                if (gameAction.getRole().equals(GameRoleAction.DORKY.getName())
                        && new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.DORKY.getName()), false);
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

                if (gameAction.getRole().equals(GameRoleAction.PUPPY.getName())
                        && new IsPuppyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

                // since the explorer has already explored, the explore action is set to false, while the maul action is set to true
                if (gameAction.getRole().equals(GameRoleAction.EXPLORER.getName())
                        && new IsExplorerAWolfDAO(ds.getConnection(), gameID).access().getOutputParam()) {

                    Map<String, Boolean> tmp = actions.get(gameAction.getTarget());
                    tmp.put(nightAction.get(GameRoleAction.EXPLORER.getName()), false);
                    tmp.put(nightAction.get(GameRoleAction.WOLF.getName()), true);
                    actions.put(gameAction.getTarget(), tmp);

                }

            }

        }

        return actions;

    }

    /**
     * Utility method to initialize a map representing player votes.
     *
     * @param gameActions a list of GameAction objects containing player information.
     * @return a Map where the keys represent player names and the values represent the initial vote count (0).
     */
    private Map<String, Integer> getVotesMap(List<GameAction> gameActions) {
        Map<String, Integer> votesMap = new HashMap<>();

        for (GameAction gameAction : gameActions) {
            votesMap.put(gameAction.getPlayer(), 0);
        }

        return votesMap;
    }

    /**
     * Utility method to initialize a map representing player votes.
     *
     * @param players a list of the name of the player in the ballot.
     * @return a Map where the keys represent player names and the values represent the initial vote count (0).
     */
    private Map<String, Integer> getBallotMap(List<String> players) {
        Map<String, Integer> ballotMap = new HashMap<>();

        for (String player : players) {
            ballotMap.put(player, 0);
        }

        return ballotMap;
    }

    /**
     * Updates the information about a player's death in the game.
     *
     * @param player The username of the player who died.
     * @throws SQLException if a database access error occurs.
     */
    private PlaysAsIn updatePlayerDeath(String player) throws SQLException {
        return new PlaysAsIn(player, gameID, playersRole.get(player), currentRound, currentPhase);
//        new UpdateDeathOfPlayerInTheGameDAO(ds.getConnection(), playsAsIn).access();
//        nightActionResults.addDeadPlayer(player);
    }

    /**
     * Determines if the game has reached a victory condition.
     *
     * @return a {@code VictoryMessage} indicating the result of the victory condition and the winning players:
     * <ul>
     *     <li>"The Evil roles win the game" if Evil wins.</li>
     *     <li>"The Hamster wins the game" if Hamster wins.</li>
     *     <li>"The Good and Neutral roles win the game" if Good and Neutral win.</li>
     *     <li>"The Jester wins the game" if Jester wins.</li>
     *     <li>{@code null} if no victory condition is met.</li>
     * </ul>
     * @throws SQLException if there is an error accessing the database.
     */
    private VictoryMessage isAVictory() throws SQLException {
        // Map to store the count of roles associated with each winning faction
        Map<Integer, Integer> roleTypeCardinality = new HashMap<>();

        // Map to store the players associated with each winning faction
        Map<Integer, List<String>> winnerPlayers = new HashMap<>();
        for (WinFaction wf : WinFaction.values())
            winnerPlayers.put(wf.getId(), new ArrayList<>());

        // Retrieve the list of roles from the database
        List<Role> roles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
        String hamster = "";
        String jester = "";

        // If only Giuda and the Illusionist remain alive, the good win
        int notCountedEvilRoles = 0;

        Map<String, Boolean> updatedDeadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        // Iterate through each player's role and update roleTypeCardinality and winnerPlayers accordingly
        for (Map.Entry<String, String> playerRole : playersRole.entrySet()) {
            for (Role role : roles) {
                if (role.getName().equals(playerRole.getValue())) {
                    // Increment the count of the role's associated faction
                    if (!updatedDeadPlayers.get(playerRole.getKey()))
                        roleTypeCardinality.put(role.getWith_who_wins(), roleTypeCardinality.getOrDefault(role.getWith_who_wins(), 0) + 1);
                    // Add the player to the list of players associated with the role's faction
                    winnerPlayers.get(role.getWith_who_wins()).add(playerRole.getKey());
                }
            }
            // Check if the player is the Hamster or Jester and update their respective variables
            if (playerRole.getValue().equals(GameRoleAction.HAMSTER.getName()) && !updatedDeadPlayers.get(playerRole.getKey()))
                hamster = playerRole.getKey();
            if (playerRole.getValue().equals(GameRoleAction.JESTER.getName()))
                jester = playerRole.getKey();

            if (playerRole.getValue().equals(GameRoleAction.GIUDA.getName()) && !updatedDeadPlayers.get(playerRole.getKey()))
                notCountedEvilRoles++;
            if (playerRole.getValue().equals(GameRoleAction.ILLUSIONIST.getName()) && !updatedDeadPlayers.get(playerRole.getKey()))
                notCountedEvilRoles++;
        }

        // Calculate the total number of roles in the game
        int totalRoles = 0;
        for (int number : roleTypeCardinality.values())
            totalRoles += number;

        // Check victory conditions and return the appropriate VictoryMessage

        if (!jester.isEmpty() && new IsJesterVotedOutDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
            return new VictoryMessage("The JESTER wins the game", winnerPlayers.get(WinFaction.JESTER.getId()), WinFaction.JESTER.getId());

        if (roleTypeCardinality.getOrDefault(WinFaction.WOLVES.getId(), 0) - notCountedEvilRoles == 0 && !hamster.isEmpty())
            return new VictoryMessage("The HAMSTER wins the game", winnerPlayers.get(WinFaction.HAMSTER.getId()), WinFaction.HAMSTER.getId());

        if (roleTypeCardinality.getOrDefault(WinFaction.WOLVES.getId(), 0) - notCountedEvilRoles == 0)
            return new VictoryMessage("The FARMERS pack win the game", winnerPlayers.get(WinFaction.FARMERS.getId()), WinFaction.FARMERS.getId());

        if (roleTypeCardinality.getOrDefault(WinFaction.WOLVES.getId(), 0) - notCountedEvilRoles >= totalRoles - roleTypeCardinality.getOrDefault(RoleType.EVIL.getType(), 0) || notVote)
            return new VictoryMessage("The WOLVES pack win the game", winnerPlayers.get(WinFaction.WOLVES.getId()), WinFaction.WOLVES.getId());

        // No victory condition met
        return null;
    }

    /**
     * Retrieves the game action associated with the specified role from the list of game actions.
     *
     * @param gameActions The list of game actions to search.
     * @param name        The name of the role to search for.
     * @return The game action associated with the specified role, or null if not found.
     */
    private GameAction getPlayerByRole(List<GameAction> gameActions, String name) {
        for (GameAction gameAction : gameActions) {
            if (gameAction.getRole().equals(name))
                return gameAction;
        }
        return null;
    }
}