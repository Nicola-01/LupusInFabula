package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

/**
 * Retrieves the usernames of players along with their roles for a given game ID.
 * It excludes the role of "MASTER" from the results.
 * The retrieved data is stored in a map where the keys represent player usernames,
 * and the values represent the roles associated with each player.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SelectPlayersAndRolesByGameIdDAO extends AbstractDAO<Map<String,String>> {

    /**
     * The SQL statement to select players and roles by game ID, excluding the "MASTER" role.
     */
    private static final String STATEMENT = "SELECT player_username, r.name FROM plays_as_in JOIN role r on plays_as_in.role = r.name WHERE game_id = ? AND r.name != ?";

    /**
     * The game ID for which players and roles are to be retrieved.
     */
    private final int gameId;

    /**
     * Constructs a new SelectPlayersAndRolesByGameIdDAO with the specified database connection
     * and game ID.
     *
     * @param con    the database connection
     * @param gameId the ID of the game
     */
    public SelectPlayersAndRolesByGameIdDAO(final Connection con, int gameId) {
        super(con);
        this.gameId = gameId;
    }

    /**
     * Retrieves the players and their roles for the specified game ID from the database,
     * excluding the "MASTER" role.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Map<String,String> map =  new HashMap<String, String>();

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, GameRoleAction.MASTER.getName());
            rs = pstmt.executeQuery();

            while (rs.next()) {
                map.put(rs.getString("player_username"), rs.getString("name"));
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = map;
    }
}
