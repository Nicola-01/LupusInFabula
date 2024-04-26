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
import java.sql.Time;
import java.util.*;

public class GameActionsPostRR extends AbstractRR {

    // Contain the role name and his action
    private static final Map<String, String> nightAction = new HashMap<>();
    private final Map<String, Boolean> deadPlayers;
    private final Map<String, String> playersRole;
    private final int gameID;

    int currentRound, currentPhase;

    public GameActionsPostRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) throws SQLException {
        super(Actions.ADD_ACTIONS, req, res, ds);
        this.gameID = gameID;

        for (GameRoleAction role : GameRoleAction.values())
            if (role.getAction() != null)
                nightAction.put(role.getName(), role.getAction());

        deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        playersRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
    }

    @Override
    protected void doServe() throws IOException {
        try {

            List<GameAction> gameActions = GameAction.fromJSON(req.getInputStream()); // todo to handle throws IOException

            // check of the correctness of the actions
            if (!correctnessOfActions(gameActions))
                return;

            LOGGER.info("correctness of actions done");
            // contain all player in the game (gameID) with their role
            // first String: playerUsername , second String: role of the player

            Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
            currentRound = game.getRounds();
            currentPhase = game.getPhase();

            if (currentPhase == GamePhase.NIGHT.getId()) {
                if (handleNightPhase(gameActions))
                    return;
            } else if (handleDayPhase())
                return;

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

            LOGGER.info("Checked all actions");

            // updatePlayerDeath(username); // TODO --> update player death


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

        Map<String, Map<String, Boolean>> actionsMap = getActionsMap(gameActions, playersRole);

        if (actionsMap == null)
            return false;

        // check of the actions
        if (!actionCheck(actionsMap, playersRole))
            return false;

        // count of wolves still alive for some effects
        int number_of_wolves = 0;
        Map<String, Boolean> deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        for (Map.Entry<String, String> playerRole : playersRole.entrySet())
            if((playerRole.getValue().equals(GameRoleAction.WOLF.getName())
                    || playerRole.getValue().equals(GameRoleAction.BERSERKER.getName())
                    || playerRole.getValue().equals(GameRoleAction.EXPLORER.getName())
                    || playerRole.getValue().equals(GameRoleAction.PUPPY.getName())
                    || playerRole.getValue().equals(GameRoleAction.DORKY.getName()))
                    && !deadPlayers.get(playerRole.getKey()))
                number_of_wolves++;

        LOGGER.info("Number of wolves in the game " + number_of_wolves);

        // for each player in the map i check the associated map. Then for each element in this map i check if the player is a target of which action
        for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

            String player = entry.getKey();
            Map<String, Boolean> actionPlayerMap = entry.getValue();

            // check for the "explore" action --> EXPLORER
            // (he can explore only once in a game, so if he decides to do it, after that he will become a normal wolf)
            if (actionPlayerMap.get(GameRoleAction.EXPLORER.getAction())) {
                LOGGER.info("The player " + player + " has been killed by the explorer");

                String explorer = "";
                for (GameAction gameAction : gameActions)
                    if (gameAction.getTarget().equals(player))
                        explorer = gameAction.getPlayer();

                new UpdateRoleInPlayAsInByUsernameAndGameIdDAO(ds.getConnection(), GameRoleAction.WOLF.getName(), gameID, explorer).access();
                //LOGGER.info("The explorer " + explorer + " has been demoted to wolf");
            }

            // check of the "block" action --> ILLUSIONIST
            // (if the player is blocked his action must be blocked (put them to false)
            if (actionPlayerMap.get(GameRoleAction.ILLUSIONIST.getAction())) {

                String playerTarget = "";
                String player_role = "";
                for (GameAction gameAction : gameActions)
                    if (gameAction.getPlayer().equals(player)) {
                        playerTarget = gameAction.getTarget();
                        player_role = gameAction.getRole();
                    }

                Map<String, Boolean> tmp = actionsMap.get(playerTarget);
                String player_action = nightAction.get(player_role);
                tmp.put(player_action, false);
                actionsMap.put(playerTarget, tmp);

                LOGGER.info("The player " + player + " has been blocked during the night");
            }

            // check of the "maul" action --> WOLVES
            // (if the player is protected, or is the hamster, or is the hobbit and in the game are still alive more than 1 wolf, then the player will not die)
            if (actionPlayerMap.get(GameRoleAction.WOLF.getAction())) {
                //LOGGER.info(!actionPlayerMap.get(GameRoleAction.KNIGHT.getAction()) + " " + !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction()));
                //LOGGER.info(new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName()) + " " + (number_of_wolves <= 1));
                if ((!actionPlayerMap.get(GameRoleAction.KNIGHT.getAction())
                        && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam().equals(GameRoleAction.HAMSTER.getAction()))
                        && !new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName())) {

                    LOGGER.info("The player " + player + " has been killed by the wolves during the night");

                } else if (new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, player).access().getOutputParam().equals(GameRoleAction.HOBBIT.getName()) && (number_of_wolves <= 1)) {
                    LOGGER.info("The player " + player + " has been killed by the wolves during the night (number of wolves: " + number_of_wolves + ")");
                }

            }

            // check of the "investigate" action --> SEER
            if (actionPlayerMap.get(GameRoleAction.SEER.getAction())) {
                // in case the seer sees the puppy he will see that is a good role
                LOGGER.info("The player " + player + " has been seen during the night");
            }

            // check of the "shot" action --> SHERIFF
            // (if the player is a member of the wolf pack or a victory stealer he will die, otherwise the sheriff will die)
            if (actionPlayerMap.get(GameRoleAction.SHERIFF.getAction())) {

                GameRoleAction player_role = GameRoleAction.valueOfName(playersRole.get(player));
                assert player_role != null;
                if (player_role.getRoleType().getType() == 1 || player_role.getRoleType().getType() == 2) {
                    LOGGER.info("The player " + player + " has been killed by the sheriff during the night");
                } else {
                    String sheriff = "";
                    for (GameAction gameAction : gameActions)
                        if (gameAction.getTarget().equals(player))
                            sheriff = gameAction.getPlayer();

                    LOGGER.info("The sheriff " + sheriff + " has killed himself during the night");
                }

            }

            // check for the "blowup" action --> KAMIKAZE
            // if the player is the kamikaze and the action is true, the kamikaze kill himself and the wolf
            if (playersRole.get(player).equals(GameRoleAction.KAMIKAZE.getName()) && actionPlayerMap.get(GameRoleAction.WOLF.getAction())) {
                String wolf = "";
                for (GameAction gameAction : gameActions)
                    if (gameAction.getTarget().equals(player))
                        wolf = gameAction.getPlayer();

                LOGGER.info("The player " + player + " is blown up with the wolf " + wolf);
            }

            // check for the "plague" action --> PLAGUE SPREADER
            if (actionPlayerMap.get(GameRoleAction.PLAGUE_SPREADER.getAction())) {
                LOGGER.info("The player " + player + " is anointed");
            }

            // check for the "point" action --> DORKY
            // (if the target player is a member of the pack, then the dorky becomes a wolf)
            if (actionPlayerMap.get(GameRoleAction.DORKY.getAction())) {
                String dorky = "";
                GameRoleAction player_role = GameRoleAction.valueOfName(playersRole.get(player));
                for (GameAction gameAction : gameActions)
                    if (gameAction.getTarget().equals(player))
                        dorky = gameAction.getPlayer();

                assert player_role != null;
                // TODO --> to fix the number of wolves
                if (player_role.getRoleType().getType() == 1 || number_of_wolves == 0) {
                    // update of the role of dorky into wolf (update the database)
                    new UpdateRoleInPlayAsInByUsernameAndGameIdDAO(ds.getConnection(), GameRoleAction.WOLF.getName(), gameID, dorky).access();
                    LOGGER.info("The dorky " + dorky + " has been promoted to wolf");
                }
            }

            // check for the "rage" action --> BERSERKER
            // he can maul two target (so in the json he will appear two time), bypassing the knight and dying after he activated his effect
            if (actionPlayerMap.get(GameRoleAction.BERSERKER.getAction())) {

                LOGGER.info("The player " + player + " has been killed by the berserker");

            }

        }

        return true;
    }

    private boolean correctnessOfActions(List<GameAction> gameActions) throws SQLException, IOException {
        // TODO --> fix the Logger.info error
        Message m;
        Boolean wolfActionDone = false;
        int berserkerCount = 2;

        for (GameAction gameAction : gameActions) {

            int game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getPlayer()).access().getOutputParam();
            //check if the player is in the game
            if (game_id != gameID) {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                LOGGER.warn("ERROR, the player " + gameAction.getPlayer() + " is not in the game");
                m.toJSON(res.getOutputStream());
                return false;
            }

            game_id = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), gameAction.getTarget()).access().getOutputParam();
            //check if target is in the game
            if (game_id != gameID) {
                m = new Message("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                LOGGER.warn("ERROR, the target " + gameAction.getTarget() + " is not in the game");
                m.toJSON(res.getOutputStream());
                return false;
            }

            String playerRole = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), game_id, gameAction.getPlayer()).access().getOutputParam();
            //check if the player has the correct role in the game
            if (!playerRole.equals(gameAction.getRole())) {
                m = new Message("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole + ") in the game");
                LOGGER.warn("ERROR, the player " + gameAction.getPlayer() + " has not the correct role (" + gameAction.getRole() + " != " + playerRole + ") in the game");
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
                        m = new Message("ERROR, the wolves has already done their action this night");
                        LOGGER.warn("ERROR, the wolves has already done their action this night");
                        m.toJSON(res.getOutputStream());
                        return false;
                    }
                } else {
                    if (!wolfActionDone) {
                        switch (berserkerCount) {
                            case 2:
                                berserkerCount--;
                                break;
                            case 1:
                                berserkerCount--;
                                wolfActionDone = true;
                                break;
                        }
                    } else {
                        m = new Message("ERROR, there's too many action for the wolf pack");
                        LOGGER.warn("ERROR, there's too many action for the wolf pack");
                        m.toJSON(res.getOutputStream());
                        return false;
                    }
                }
            }
        }

        //map with the player and his role in the game (only roles with a night active effect (e.g. kamikaze has a passive effect because he activates it only if a wolf attack him))
        //if in the game there's the berserker he can do two action
        Map<String, String> rolesWithEffect = new HashMap<>();
        for (Map.Entry<String, String> playerRoleEntry : playersRole.entrySet()) {
            GameRoleAction gameRoleAction = GameRoleAction.valueOfName(playerRoleEntry.getValue());
            assert gameRoleAction != null;
            if (gameRoleAction.getAction() != null
                    && (!rolesWithEffect.containsValue(GameRoleAction.WOLF.getName())
                            || !rolesWithEffect.containsValue(GameRoleAction.EXPLORER.getName())
                            || !rolesWithEffect.containsValue(GameRoleAction.BERSERKER.getName()))
                    && !gameRoleAction.getName().equals(GameRoleAction.KAMIKAZE.getName())) {

                rolesWithEffect.put(playerRoleEntry.getKey(), playerRoleEntry.getValue());
                //LOGGER.info("prova " + playerRoleEntry.getKey() + " " + playerRoleEntry.getValue());
            }
        }

        //check if each role with an effect has done the action
//        if (rolesWithEffect.size() != gameActions.size()) {
//            m = new Message("ERROR, someone has not done his action this turn");
//            LOGGER.warn("ERROR, someone has not done his action this turn");
//            m.toJSON(res.getOutputStream());
//            return false;
//        }

        return true;
    }

    private Map<String, Map<String, Boolean>> getActionsMap(List<GameAction> gameActions, Map<String, String> playerRole) throws IOException {

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

        if (actionsMap == null)
            return false;

        // for all targeted players
        for (Map.Entry<String, Map<String, Boolean>> entry : actionsMap.entrySet()) {

            String player = entry.getKey();
            String roleOfPlayer = playerRole.get(player);
            Map<String, Boolean> actionTarget = entry.getValue();

            if (deadPlayers.get(player)) {
                // Todo -> to change
                LOGGER.warn("The player " + player + " is dead");
                Message m = new Message("The player " + player + " is dead");
                m.toJSON(res.getOutputStream());
                //nope --> log - Error
                return false;
            }

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
                        LOGGER.warn("Error, the target of " + action + " is not a valid target");
                        Message m = new Message("Error, the target of " + action + " is not a valid target");
                        m.toJSON(res.getOutputStream());
                        //nope --> log - Error
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private void updatePlayerDeath(String player) throws SQLException {
        PlaysAsIn playsAsIn = new PlaysAsIn(player, gameID, playersRole.get(player), currentRound, currentPhase);
        new UpdateDeathOfPlayerInTheGameDAO(ds.getConnection(), playsAsIn).access();
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