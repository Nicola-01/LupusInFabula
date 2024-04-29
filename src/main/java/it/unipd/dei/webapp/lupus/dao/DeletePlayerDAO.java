package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Deletion of a player record from the database based on the player's username.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class DeletePlayerDAO extends AbstractDAO<Integer> {

    /**
     * The SQL statement for deleting a player record from the database.
     */
    private static final String STATEMENT = "DELETE FROM player WHERE LOWER(username) = LOWER(?)";

    /**
     * The username of the player to be deleted.
     */
    private final String player_username;

    /**
     * Constructs a new DeletePlayerDAO with the specified database connection and player username.
     *
     * @param con             the database connection
     * @param player_username the username of the player to be deleted
     */
    public DeletePlayerDAO(final Connection con, final String player_username) {
        super(con);
        this.player_username = player_username;
    }

    /**
     * Executes the deletion operation to delete the player record from the database.
     *
     * @throws SQLException if there is an error executing the SQL statement
     */
    @Override
    public final void doAccess() throws SQLException {

        PreparedStatement pstmt = null;
        int result = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player_username);
            result = pstmt.executeUpdate();

            if (result == 1) {
                LOGGER.info("Deleted player %s from database", player_username);
            } else {
                LOGGER.info("Failed to delete player %s from database", player_username);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = result;
    }
}
