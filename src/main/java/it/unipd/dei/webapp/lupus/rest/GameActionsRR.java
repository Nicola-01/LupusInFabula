package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SelectPlayersAndRolesByGameIdDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRole;
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

        for (GameRole role : GameRole.values())
            if (role.getAction() != null)
                nightAction.put(role.getName(), role.getAction());
    }

    @Override
    protected void doServe() throws IOException {

        try {
            //LOGGER.info("Handling game actions");

            List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream()); // todo da gestire throws IOException
//            for (GameAction gameAction : gameActions) {
//                LOGGER.info(gameAction.getPlayer() + " " +
//                        gameAction.getRole() + " " +
//                        gameAction.getTarget()
//                );
//            }

            // check of the correctness of the actions
            correctnessOfActions(gameActions);

            // contain all player in the game (gameID) with their role
            // first String: playerUsername , second String: role of the player
            Map<String, String> playerRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            Map<String, Map<String, Boolean>> actionsMap = getActionsMap(gameActions, playerRole);

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            int currentRound = game.getNumbers_of_round();
            int currentPhase = game.getPhase();

            if (currentPhase == GamePhase.DAY.getId()) {
                currentRound++;
                currentPhase = GamePhase.NIGHT.getId();
            } else {
                currentPhase = GamePhase.DAY.getId();
            }

            // TODO --> insert into action table

            // TODO --> update game table (last thing to do, before doing it i have to check if someone wins)

        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }

    }

    private boolean correctnessOfActions(List<GameAction> gameActions) throws SQLException {
        // TODO --> fix the Logger.info error
        Message m;

        for (GameAction gameAction : gameActions) {

            int game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id == gameID) {
                LOGGER.info("OK, the player " + gameAction.getPlayer() + " is in the game");
            } else {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                LOGGER.info("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                return false;
            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id == gameID) {
                LOGGER.info("OK, the target " + gameAction.getTarget() + " is in the game");
            } else {
                m = new Message("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                LOGGER.info("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                return false;
            }

            String playerRole = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), game_id, gameAction.getPlayer()).access().getOutputParam();
            //check if the player has the correct role in the game
            if (playerRole.equals(gameAction.getRole())) {
                LOGGER.info("OK, the player " + gameAction.getPlayer() + " has the correct role (" + gameAction.getRole() + ") in the game");
            } else {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole +") in the game");
                LOGGER.info("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole +") in the game");
                return false;
            }

        }

        return true;

    }

    private Map<String, Map<String, Boolean>> getActionsMap(List<GameAction> gameActions, Map<String, String> playerRole) throws SQLException {

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
            Map<String, Boolean> tmp = action.get(gameAction.getTarget());
            tmp.put(nightAction.get(gameAction.getRole()), true);
            action.put(gameAction.getTarget(), tmp);
        }

        return action;

    }

}

//check all the actions (e.g. wolf attacks x, but x is protected so x doesn't die) --> implementation of all the controls of lupus
//save in the table action everything that happens --> implement dao that insert data into action

/** TODO: controls to implement:
 * priority: farmer, wolf, sam, knight, seer, plague_spreader, hamster, hobbit, illusionist, jester, sheriff
 * - if berserker activate his effect he dies, but he bypass the protection of the knight
 * - if carpenter has as target himself, the bonfire won't be that night
 * - if dorky has as target a wolf he will become a wolf - if the dorky is the last evil in the game he will become a wolf
 * - if dorky has a target, the protection of the knight will be useless (this can be done only one during the game)
 * - ...
 */