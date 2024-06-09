package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.UpdateGameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.utils.PossibleGameActions;
import it.unipd.dei.webapp.lupus.utils.WinFaction;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import org.json.JSONObject;

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

    @Override
    protected void doServe() throws IOException, SQLException {
        String JSON = new String(req.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        JSONObject jsonObject = new JSONObject(JSON);
        String value = jsonObject.getString("settings");
        LOGGER.info("The value is: " + value);

        res.setStatus(HttpServletResponse.SC_OK);

        switch (value) {
            case "endGame":
                endGame();
                break;
            case "previousRound":
                previousRound();
                break;
            default:
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                break;
        }
    }

    private void endGame() throws SQLException {
        Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        int currentRound = game.getRounds() == 0 ? 1 : game.getRounds();
        int currentPhase = game.getPhase();
        new UpdateGameDAO(ds.getConnection(), gameID, currentPhase, currentRound, WinFaction.DRAW.getId()).access();
    }

    private void previousRound() throws SQLException {
        Game game = new GetGameByGameIdDAO(ds.getConnection(), gameID).access().getOutputParam();
        int phase = game.getPhase() - 1;
        int round = game.getRounds() == 0 ? 1 : game.getRounds();
        if (phase < 0)
            round--;

//        new ResetGameToDAO(ds.getConnection(), gameID, phase, round).access();
    }

}
