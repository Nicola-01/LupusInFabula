package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.util.List;

public class GameActionsRR extends AbstractRR {

    public GameActionsRR(final HttpServletRequest req, final HttpServletResponse res, Connection con) {
        super(Actions.ADD_ACTIONS, req, res, con);
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
