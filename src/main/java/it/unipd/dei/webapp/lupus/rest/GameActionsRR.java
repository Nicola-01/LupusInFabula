package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class GameActionsRR extends AbstractRR {

    private final int gameID;

    public GameActionsRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
        this.gameID = gameID;
    }

    @Override
    protected void doServe() throws IOException {

        LOGGER.info("Handling game actions");

        List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream()); // todo da gestire throws IOException
        for (GameAction gameAction : gameActions) {
            LOGGER.info(gameAction.getPlayer() + " " +
                    gameAction.getRole() + " " +
                    gameAction.getTarget()
            );
        }



    }

    private boolean actionControl(List<GameAction> gameActions) throws SQLException {

        Message m;

        for (GameAction gameAction : gameActions) {

            int game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id == gameID) {
                LOGGER.info("OK, the player " + gameAction.getPlayer() + " is in the game");
            } else {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                LOGGER.info(m.toString());
                return false;
            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id == gameID) {
                LOGGER.info("OK, the target " + gameAction.getTarget() + " is in the game");
            } else {
                m = new Message("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                LOGGER.info(m.toString());
                return false;
            }

            String playerRole = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer(), gameID).access().getOutputParam();
            //check if the player has the correct role in the game
            if (playerRole.equals(gameAction.getRole())) {
                LOGGER.info("OK, the player " + gameAction.getPlayer() + " has the correct role (" + gameAction.getRole() + ") in the game");
            } else {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                LOGGER.info(m.toString());
                return false;
            }

        }

        return true;

    }

}

//controls about the correctness of the action that is sent
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