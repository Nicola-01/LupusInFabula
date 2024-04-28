package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Return the last player protected by the Knight in the game
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class LastPlayerProtectedByKnightDAO extends AbstractDAO<String> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND type_of_action = ? ORDER BY round DESC";

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new LastPlayerProtectedByKnightDAO for search the last protected player by the Knight
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game.
     */
    public LastPlayerProtectedByKnightDAO(final Connection con, int gameID) {
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String target = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);

            pstmt.setInt(1, gameID);
            pstmt.setString(2, GameRoleAction.KNIGHT.getAction());


            rs = pstmt.executeQuery();

            if (rs.next()) {
                target = rs.getString("target");
            } else {
                LOGGER.warn("No player protected by the Knight");
            }

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = target;
    }
}
