package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;
import it.unipd.dei.webapp.lupus.utils.PossibleGameActions;
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
     * Object that contains all possible actions of the specific game
     */
    private final PossibleGameActions possibleGameActions;

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

        possibleGameActions = new PossibleGameActions(ds,gameID);
    }

    @Override
    protected void doServe() throws IOException, SQLException {
        Message m = possibleGameActions.populateList();
        if (m != null) {
            res.setStatus(Objects.requireNonNull(ErrorCode.getErrorCode(m.getErrorCode())).getHTTPCode());
            m.toJSON(res.getOutputStream());
        }
        else {
            res.setStatus(HttpServletResponse.SC_OK);
            new ResourceList<>(possibleGameActions.getListOfActions()).toJSON(res.getOutputStream());
        }
    }


}