package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.GameAction;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.RoleCardinality;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.util.List;

public class GameSettingsPostRR extends AbstractRR {

    public GameSettingsPostRR(final HttpServletRequest req, final HttpServletResponse res, Connection con) {
        super(Actions.ADD_ACTIONS, req, res, con);
    }

    @Override
    protected void doServe() throws IOException {

        LOGGER.info("Handling game settings");
        InputStream inputStream = req.getInputStream();

        try {
            List<RoleCardinality> roleCardinalities = RoleCardinality.fromJSON(req.getInputStream());
            for (RoleCardinality roleCardinality : roleCardinalities) {
                LOGGER.info(roleCardinality.getRole() + " " +
                        roleCardinality.getCarnality()
                );
            }
        } catch (IOException e) {
            // todo da gestire throws IOException)
        }

        try {
            List<String> players = Player.fromJSON(req.getInputStream());
            for (String player : players) {
                LOGGER.info(player);
            }
        } catch (IOException e) {
            // todo da gestire throws IOException)
        }
    }
}
