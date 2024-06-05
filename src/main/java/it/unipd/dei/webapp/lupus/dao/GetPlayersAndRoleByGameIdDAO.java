package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Gat all player in a game with their role
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetPlayersAndRoleByGameIdDAO extends AbstractDAO<Map<String, String>>
{
    /**
     * The SQL statement to retrieve dead players by game ID.
     */
    private static final String STATEMENT = "SELECT role, player_username FROM plays_as_in WHERE game_id = ?";

    /**
     * The game ID for which dead players are to be retrieved.
     */
    private final int gameId;

    /**
     * Constructs a new GetDeadPlayersByGameIdDAO with the specified database connection and game ID.
     *
     * @param con    the connection to the database
     * @param gameId the ID of the game
     */
    public GetPlayersAndRoleByGameIdDAO(final Connection con, final int gameId)
    {
        super(con);
        this.gameId = gameId;
    }

    /**
     * Retrieves dead players information from the database based on the game ID.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception
    {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Map<String, String> r = new HashMap();


        try
        {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            rs = pstmt.executeQuery();

            while (rs.next())
                r.put(rs.getString("player_username"),
                      rs.getString("role"));
        }
        finally
        {
            if (pstmt != null) pstmt.close();
            if (rs != null)    rs.close();
        }
        this.outputParam = r;
    }
}
