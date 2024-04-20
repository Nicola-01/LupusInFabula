package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.List;

public class GameActionsRR extends AbstractRR {

    public GameActionsRR(int gameID, final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
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
}
