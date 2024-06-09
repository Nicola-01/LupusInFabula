package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.ResetGameToDAO;
import it.unipd.dei.webapp.lupus.dao.UpdateGameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.utils.WinFaction;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import org.json.JSONObject;

/*
 * Handles the game settings update REST request.
 * This class is responsible for handling HTTP requests that update game settings,
 * such as ending the game or reverting to the previous round.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameSettingsUpdateRR extends AbstractRR {

    /**
     * The ID of the game.
     */
    private final int gameID;

    /**
     * Creates a new GameSettingsPost REST resource.
     *
     * @param req    the HTTP request.
     * @param res    the HTTP response.
     * @param ds     the dataSource for the connection.
     * @param gameID the ID of the game
     */
    public GameSettingsUpdateRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds, int gameID) {
        super(Actions.GET_GAME_CONFIGURATION, req, res, ds);

        this.gameID = gameID;
    }

    /**
     * Handles the HTTP request to update game settings.
     * The method reads the request body to determine the action to be performed (e.g., end game or previous round)
     * and processes the request accordingly.
     *
     * @throws IOException   if an I/O error occurs while reading the request or writing the response.
     * @throws SQLException  if a database access error occurs.
     */
    @Override
    protected void doServe() throws IOException, SQLException {
        String JSON = new String(req.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        JSONObject jsonObject = new JSONObject(JSON);
        String value = jsonObject.getString("settings");
        LOGGER.info("The value is: " + value);

        res.setStatus(HttpServletResponse.SC_OK);

        switch (value) {
            case "endGame":
                if (!endGame()) {
                    Message message = new Message("Game already ended", "ERR", "");
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    message.toJSON(res.getOutputStream());
                }

                break;
            case "previousRound":
                if (!previousRound()) {
                    Message message = new Message("Game already ended or just started", "ERR", "");
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    message.toJSON(res.getOutputStream());
                }
                break;
            default:
                Message message = new Message("Invalid setting", "ERR", "");
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                message.toJSON(res.getOutputStream());
                break;
        }
    }

    /**
     * Ends the game by updating the game state in the database.
     * This method checks the current phase of the game and sets it to a draw if the game is still active.
     *
     * @return {@code true} if the game was successfully ended; {@code false} otherwise.
     * @throws SQLException if a database access error occurs.
     */
    private boolean endGame() throws SQLException {
        Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        int currentRound = game.getRounds() == 0 ? 1 : game.getRounds();
        int currentPhase = game.getPhase();

        if (game.getPhase() > 0)
            return false;

        new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound, WinFaction.DRAW.getId()).access();
        return true;
    }

    /**
     * Reverts the game to the previous round.
     * This method updates the game state in the database to reflect the previous round,
     * resetting the game phase and round accordingly.
     *
     * @return {@code true} if the game was successfully reverted to the previous round; {@code false} otherwise.
     * @throws SQLException if a database access error occurs.
     */
    private boolean previousRound() throws SQLException {
        Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        int phase = game.getPhase() - 1;
        int round = game.getRounds() == 0 ? 1 : game.getRounds();
        if (phase < 0) {
            round--;
            phase = 1;
        }

        if (game.getPhase() > 0 || (round == 1 && phase == 0))
            return false;

        new UpdateGameDAO(ds.getConnection(), gameID, phase, round).access();
        new ResetGameToDAO(ds.getConnection(), ds, gameID, phase, round).access();
        return true;
    }

}
