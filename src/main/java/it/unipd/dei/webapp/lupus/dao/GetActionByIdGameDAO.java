package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class GetActionByIdGameDAO extends AbstractDAO<Actions> {
    private static final String STATEMENT = "SELECT * FROM action WHERE game = ?";

    private final String idPart;

    public GetActionByIdGameDAO(final Connection con, final String idPart)
    {
        super(con);
        this.idPart = idPart;
    }

    @Override
    public final void doAccess() throws SQLException
    {
        PreparedStatement query = null;
        ResultSet rs = null;
        ArrayList<LogContext> r  = new ArrayList<>();

        try
        {
            query = con.prepareStatement(STATEMENT);
            query.setString(1, idPart);
            rs = query.executeQuery();

            while(rs.next())


        }
        finally
        {
            if (query != null) query.close();
            if (rs != null)    rs.close();
        }
        this.outputParam = player;
    }
}
