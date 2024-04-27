package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Retrieves count the occurrences of a given role associated with a given game ID.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetNumberOfRolesByGameIdAndRoleNameDAO extends AbstractDAO<Integer> {

    /**
     * The SQL statement to retrieve the number of players with a specific role by game ID and role name.
     */
    private static final String STATEMENT = "SELECT COUNT(*) AS number_of_role FROM plays_as_in WHERE game_id = ? AND role = ?";

    /**
     * The game ID for which the number of roles is to be retrieved.
     */
    private final int gameId;

    /**
     * The role name for which the number of occurrences is to be retrieved.
     */
    private final String roleName;

    /**
     * Constructs a new GetNumberOfRolesByGameIdAndRoleNameDAO with the specified database connection,
     * game ID, and role name.
     *
     * @param con      the database connection
     * @param gameId   the ID of the game
     * @param roleName the name of the role
     */
    public GetNumberOfRolesByGameIdAndRoleNameDAO(final Connection con, int gameId, String roleName) {
        super(con);
        this.gameId = gameId;
        this.roleName = roleName;
    }

    /**
     * Retrieves the number of players with the specified role in the specified game from the database.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int number_of_role = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, roleName);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                number_of_role = rs.getInt("number_of_role");
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = number_of_role;
    }
}
