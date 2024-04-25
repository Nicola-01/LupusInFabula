package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class to get the last round in a game
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameRoundDAO extends AbstractDAO<Integer>
{
    /**
     * query to fill with the id of game
     * */
    private static final String STATEMENT = "SELECT rounds FROM Game WHERE ID = ?";
    /**
     * numeric identifier for the game
     * */
    private final String idPart;

    /**
     * Constructor for the class
     *
     * @param  con  connection with the database
     * @param  idPart numeric identifier for the game
     */
    public GetGameRoundDAO(final Connection con, final String idPart)
    {
        super(con);
        this.idPart = idPart;
    }

    /**
     * function to exec the query on db
     */
    @Override
    protected void doAccess() throws SQLException
    {
        PreparedStatement q = null;
        ResultSet rs = null;
        Integer r = null;

        try
        {
            q = con.prepareStatement(STATEMENT);
            q.setString(1, idPart);

            rs = q.executeQuery();
            r = rs.getInt("rounds");
        }
        finally
        {
            if(rs != null) rs.close();
            if(q != null) q.close();
        }
        this.outputParam = r;
    }
}