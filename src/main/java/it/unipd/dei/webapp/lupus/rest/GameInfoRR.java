package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetGameInfoDAO;
import it.unipd.dei.webapp.lupus.dao.GetRoleByGameIdAndPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class GameInfoRR extends AbstractRR {

    private final int gameID;
    private final boolean URIisMaster;

    public GameInfoRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds, int gameID, boolean URIisMaster) {
        super(Actions.ADD_ACTIONS, req, res, ds);
        this.gameID = gameID;
        this.URIisMaster = URIisMaster;
    }

    @Override
    protected void doServe() throws IOException {

        List<PlaysAsIn> el = null;
        Message m = null;

        try {
            // The professor take a parameter as input like this
            //String path = req.getRequestURI();
            //path = path.substring(path.lastIndexOf("gameID") + 8);
            //final int gameID = Integer.parseInt(path.substring(1));
            String username = ((Player) req.getSession().getAttribute("user")).getUsername();
            String role = new GetRoleByGameIdAndPlayerUsernameDAO(ds.getConnection(), gameID, username).access().getOutputParam();
            el = new GetGameInfoDAO(ds.getConnection(), gameID, URIisMaster, username, role).access().getOutputParam();

            if (el != null) {
                LOGGER.info("Players successfully listed.");

                res.setStatus(HttpServletResponse.SC_OK);
                new ResourceList<PlaysAsIn>(el).toJSON(res.getOutputStream());

            } else { // it should not happen
                LOGGER.error("Fatal error while listing players.");

                m = new Message("Cannot list players: unexpected error.", "E5A1", null);
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                m.toJSON(res.getOutputStream());
            }
        } catch (SQLException ex) {
            LOGGER.error("Cannot list players: unexpected database error.", ex);

            m = new Message("Cannot list players: unexpected database error.", "E5A1", ex.getMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
        }
    }
}
