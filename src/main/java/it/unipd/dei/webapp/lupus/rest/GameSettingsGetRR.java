package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.RoleCardinality;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class GameSettingsGetRR extends AbstractRR {

    public GameSettingsGetRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.ADD_ACTIONS, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {

        
    }
}
