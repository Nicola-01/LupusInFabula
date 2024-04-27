package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Updates a player's role in a game in the database based on their username and the game ID.
 * The roles that has to be updated are:
 * - Explorer (after its action resolved)
 * - Dorky (after it guesses a wolf pack member)
 * - Puppy (when it's the last wolf pack member)
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UpdateRoleInPlayAsInByUsernameAndGameIdDAO extends AbstractDAO {

    /**
     * The SQL statement to update the player's role in a game.
     */
    private static final String STATEMENT = "UPDATE plays_as_in SET role = ? WHERE game_id = ? AND player_username = ?";

    /**
     * The new role to be updated.
     */
    private final String role;

    /**
     * The game ID of the game where the player's role is to be updated.
     */
    private final int gameId;

    /**
     * The username of the player whose role is to be updated.
     */
    private final String playerUsername;

    /**
     * Constructs a new UpdateRoleInPlayAsInByUsernameAndGameIdDAO with the specified database connection,
     * role, game ID, and player username.
     *
     * @param con            the database connection
     * @param role           the new role to be updated
     * @param gameId         the game ID where the player's role is to be updated
     * @param playerUsername the username of the player whose role is to be updated
     */
    public UpdateRoleInPlayAsInByUsernameAndGameIdDAO(final Connection con, String role, int gameId, String playerUsername) {
        super(con);
        this.role = role;
        this.gameId = gameId;
        this.playerUsername = playerUsername;
    }

    /**
     * Updates the player's role in the specified game in the database.
     *
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, role);
            pstmt.setInt(2, gameId);
            pstmt.setString(3, playerUsername);
            pstmt.executeUpdate();

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
    }
}
