package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameActionsRR extends AbstractRR {

    // Contain the role name and his action
    private static final Map<String, String> nightAction = new HashMap<>();

    private final int gameID;

    public GameActionsRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
        this.gameID = gameID;

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null)
                nightAction.put(role.getName(), role.getAction());
    }

    @Override
    protected void doServe() throws IOException {
        try {

            List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream()); // todo da gestire throws IOException

            // check of the correctness of the actions
            if (!correctnessOfActions(gameActions))
                return;

            LOGGER.info("correctness of actions done");
            // contain all player in the game (gameID) with their role
            // first String: playerUsername , second String: role of the player

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            int currentRound = game.getRounds();
            int currentPhase = game.getPhase();

            if (currentRound != 0) {
                if (currentPhase == GamePhase.DAY.getId()) {
                    currentRound++;
                    currentPhase = GamePhase.NIGHT.getId();
                } else {
                    currentPhase = GamePhase.DAY.getId();
                }
            } else {
                currentRound = 1;
                currentPhase = GamePhase.NIGHT.getId();
            }

            if (currentPhase == GamePhase.NIGHT.getId()) {
                if (handleNightPhase(gameActions)) return;
            } else if (handleDayPhase()) return;

            LOGGER.info("Checked all actions");


            // TODO --> update game table (last thing to do, before doing it i have to check if someone wins)

            for (GameAction gameAction : gameActions) {
                if (nightAction.get(gameAction.getRole()) != null) {
                    new InsertIntoActionDAO(ds.getConnection(), new Action(gameID, gameAction.getPlayer(), currentRound, currentPhase, 0,
                            currentPhase == GamePhase.NIGHT.getId() ? nightAction.get(gameAction.getRole()) : Action.VOTE, gameAction.getTarget())
                    ).access();
                }
            }

            LOGGER.info("updating round " + currentRound + " phase " + currentPhase);
            new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound).access();
            LOGGER.info("updating game");
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }

    }

    // TODO
    private boolean handleDayPhase() {
        return true;
    }

    // TODO
    private boolean handleNightPhase(List<GameAction> gameActions) throws SQLException, IOException {

        Map<String, String> playerRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        Map<String, Map<String, Boolean>> actionsMap = getActionsMap(gameActions, playerRole);

        if (actionsMap == null)
            return false;

        // check of the actions
        if (!actionCheck(actionsMap, playerRole))
            return false;

        return true;
    }

    private boolean correctnessOfActions(List<GameAction> gameActions) throws SQLException, IOException {
        // TODO --> fix the Logger.info error
        // TODO --> check if every role with an effect has done its action, and if are alive or dead
        Message m;

        for (GameAction gameAction : gameActions) {

            int game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id != gameID) {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                LOGGER.info("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                m.toJSON(res.getOutputStream());
                return false;
            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id != gameID) {
                m = new Message("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                LOGGER.info("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                m.toJSON(res.getOutputStream());
                return false;
            }

            String playerRole = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), game_id, gameAction.getPlayer()).access().getOutputParam();
            //check if the player has the correct role in the game
            if (!playerRole.equals(gameAction.getRole())) {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole + ") in the game");
                LOGGER.info("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole + ") in the game");
                m.toJSON(res.getOutputStream());
                return false;
            }
        }

        return true;
    }

    private Map<String, Map<String, Boolean>> getActionsMap(List<GameAction> gameActions, Map<String, String> playerRole) throws SQLException, IOException {

        // first String: playerUsername , second String: action , boolean: if playerUsername is the target of action
        Map<String, Map<String, Boolean>> action = new HashMap<>();

        for (Map.Entry<String, String> entry : playerRole.entrySet()) {

            Map<String, Boolean> tmp = new HashMap<>();
            // take each action in nightAction and put it in tmp
            for (Map.Entry<String, String> entry1 : nightAction.entrySet())
                tmp.put(entry1.getValue(), false);

            // take each playerUsername and the map tmp and put them into action
            action.put(entry.getKey(), tmp);

        }

        for (GameAction gameAction : gameActions) {
            // take the map relative to the target in gameAction, update the value into true and then update action with the new tmp
            if (nightAction.get(gameAction.getRole()) != null) {

                Map<String, Boolean> tmp = action.get(gameAction.getTarget());
                tmp.put(nightAction.get(gameAction.getRole()), true);
                action.put(gameAction.getTarget(), tmp);

            } else {
                LOGGER.warn("ERROR, the action is null");
                // todo --> to change
                // ErrorCode ec = ErrorCode.
                Message m = new Message("ERROR, the action is null");
                m.toJSON(res.getOutputStream());
                return null;
            }

        }

        return action;

    }

    private boolean actionCheck(Map<String, Map<String, Boolean>> actionsMap, Map<String, String> playerRole) throws SQLException, IOException {

        //example: key: "user1" , value: (key1: maul , value1: true)
        Map<String, Boolean> areDead = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();

        // for all targeted players
        for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

            String player = entry.getKey();
            // i can use the map nightAction
            String roleOfPlayer = playerRole.get(player);
            Map<String, Boolean> actionTarget = entry.getValue();

            if (areDead.get(player)) {
                // Todo -> to change
                LOGGER.warn("The player " + player + " is dead");
                Message m = new Message("The player " + player + " is dead");
                //nope --> log - Error
                return false;
            }

            for (Map.Entry<String, Boolean> entry1 : actionTarget.entrySet()) {
                String action = entry1.getKey();
                Boolean target = entry1.getValue();
                LOGGER.info("The action " + action + " is " + target + " " + player + " " + roleOfPlayer);
                if (target) {
                    LOGGER.info(nightAction.get(roleOfPlayer) + " " + action + " " + player + " " + roleOfPlayer);
                    //check if player can be a target of the action
                    if (nightAction.get(roleOfPlayer) != null
                            && nightAction.get(roleOfPlayer).equals(action)
                            && !roleOfPlayer.equals(GameRoleAction.KNIGHT.getName())
                            && !roleOfPlayer.equals(GameRoleAction.PLAGUE_SPREADER.getName())) {
                        LOGGER.warn("Errror, the target of " + action + " is not a valid target");
                        Message m = new Message("Errror, the target of " + action + " is not a valid target");
                        m.toJSON(res.getOutputStream());
                        //nope --> log - Error
                        return false;
                    }
                } else {
                    //nothing
                }
            }

        }

        return true;
    }

}

//check all the actions (e.g. wolf attacks x, but x is protected so x doesn't die) --> implementation of all the controls of lupus
//save in the table action everything that happens --> implement dao that insert data into action

/**
 * TODO: controls to implement:
 * priority: farmer, wolf, sam, knight, seer, plague_spreader, hamster, hobbit, illusionist, jester, sheriff
 * - if berserker activate his effect he dies, but he bypass the protection of the knight
 * - if carpenter has as target himself, the bonfire won't be that night
 * - if dorky has as target a wolf he will become a wolf - if the dorky is the last evil in the game he will become a wolf
 * - if dorky has a target, the protection of the knight will be useless (this can be done only one during the game)
 * - ...
 */