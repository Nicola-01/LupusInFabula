package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
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
     * The SQL statement to update the player's password.
     */
    private static final String STATEMENT = "UPDATE player SET password = md5(?) WHERE LOWER(username) = LOWER(?) AND password = md5(?)";

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
     *
     * @throws SQLException if there is an error executing the SQL statement
     */
    @Override
    public final void doAccess() throws SQLException {

        PreparedStatement pstmt = null;
        int rs = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, newPassword);
            pstmt.setString(2, username);
            pstmt.setString(3, oldPassword);
            rs = pstmt.executeUpdate();

            if (rs == 1) {
                LOGGER.info("Updated player " + username + "'s password");
            } else {
                LOGGER.info("No player found with username = " + username);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = rs;
    }
}
