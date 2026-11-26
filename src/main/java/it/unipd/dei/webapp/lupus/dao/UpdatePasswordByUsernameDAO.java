package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.PasswordHash;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Updates a player's password in the database from their old password to a new password,
 * based on the specified username and old password.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UpdatePasswordByUsernameDAO extends AbstractDAO<Integer> {

    /**
     * The SQL statement to read the stored password of the player.
     */
    private static final String SELECT_PASSWORD = "SELECT password FROM player WHERE LOWER(username) = LOWER(?)";

    /**
     * The SQL statement to update the player's password. The stored value is the guard, so a concurrent change
     * makes the update a no-op.
     */
    private static final String UPDATE = "UPDATE player SET password = ? WHERE LOWER(username) = LOWER(?) AND password = ?";

    /**
     * The new password to be updated.
     */
    private final String newPassword;

    /**
     * The old password to be updated.
     */
    private final String oldPassword;

    /**
     * The username of the player whose password is to be updated.
     */
    private final String username;

    /**
     * Constructs a new UpdatePasswordByUsernameDAO with the specified database connection, username,
     * old password, and new password.
     *
     * @param con         the database connection
     * @param username    the username of the player
     * @param oldPassword the old password of the player
     * @param newPassword the new password to be updated
     */
    public UpdatePasswordByUsernameDAO(final Connection con, final String username, final String oldPassword, final String newPassword) {
        super(con);
        this.newPassword = newPassword;
        this.oldPassword = oldPassword;
        this.username = username;
    }

    /**
     * Updates the password of the specified player in the database.
     * The output is the number of updated rows: 0 if the username does not exist or the old password is wrong.
     *
     * @throws SQLException if there is an error executing the SQL statement
     */
    @Override
    public final void doAccess() throws SQLException {

        String stored = null;
        try (PreparedStatement pstmt = con.prepareStatement(SELECT_PASSWORD)) {
            pstmt.setString(1, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    stored = rs.getString("password");
                }
            }
        }

        int updated = 0;
        if (stored != null && PasswordHash.verify(oldPassword, stored)) {
            try (PreparedStatement pstmt = con.prepareStatement(UPDATE)) {
                pstmt.setString(1, PasswordHash.hash(newPassword));
                pstmt.setString(2, username);
                pstmt.setString(3, stored);
                updated = pstmt.executeUpdate();
            }
        }

        if (updated == 1) {
            LOGGER.info("Updated player " + username + "'s password");
        } else {
            LOGGER.info("No player found with username = " + username + " and matching old password");
        }

        this.outputParam = updated;
    }
}
