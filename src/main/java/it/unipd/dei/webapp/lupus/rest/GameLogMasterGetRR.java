package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.SelectRoleDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.ResourceList;
import it.unipd.dei.webapp.lupus.resource.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GameLogMasterGetRR extends AbstractRR
{

    public GameLogMasterGetRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {super(Actions.ADD_ACTIONS, req, res, ds);}

    @Override
    protected void doServe() throws IOException
    {

    }
}
