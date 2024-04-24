package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetGameRoundDAO extends AbstractDAO<Integer>
{
    private static final String STATEMENT = "SELECT rounds FROM Game WHERE ID = ?";
    private final String gameID;

    public GetGameRoundDAO(final Connection con, final String gameID)
    {
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws SQLException
    {
        PreparedStatement q = null;
        ResultSet rs = null;
        Integer r = null;

        try
        {
            q = con.prepareStatement(STATEMENT);
            q.setString(1, gameID);

            rs = q.executeQuery();
            r = rs.getInt("rounds");
        }
        finally
        {
            if(rs != null) rs.close();
            if(q != null) q.close();
        }

        LOGGER.error(r);

        this.outputParam = r;
    }
}