package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

/**
 * Retrieves the dead players in a game by its game ID.
 * The retrieved data is stored in a map where the keys represent player usernames, and
 * the values indicate whether the player is dead or alive in the game, based on the
 * round of death. If the round of death is greater than 0, it means the player is dead;
 * otherwise, they are considered alive.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetDeadPlayersByGameIdDAO extends AbstractDAO<Map<String, Boolean>> {

    /**
     * The SQL statement to retrieve dead players by game ID.
     */
    private static final String STATEMENT = "SELECT round_of_death, player_username FROM plays_as_in WHERE game_id = ?";

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
    public GetDeadPlayersByGameIdDAO(final Connection con, final int gameId) {
        super(con);
        this.gameId = gameId;
    }

    /**
     * Retrieves dead players information from the database based on the game ID.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Map<String, Boolean> map = new HashMap<>();

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                map.put(rs.getString("player_username"), rs.getInt("round_of_death") > 0);
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
