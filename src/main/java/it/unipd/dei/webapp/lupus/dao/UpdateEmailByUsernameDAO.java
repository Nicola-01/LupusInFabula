package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * updates the email address of a player in the database from their old email address to a new email address,
 * based on the specified username and old email. It also checks whether the new email address is already associated
 * with another player in the database before performing the update operation.
 *
 * The output parameter of this DAO is set to an integer value representing the result of the update operation:
 *  - 1 if the update was successful,
 *  - 0 if the update failed.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UpdateEmailByUsernameDAO extends AbstractDAO<Integer> {

    /**
     * The SQL statement to update the email address of a player.
     */
    private static final String STATEMENT = "UPDATE player SET email = ? WHERE LOWER(username) = LOWER(?) AND email = ?";

    /**
     * The new email address to be updated.
     */
    private final String newEmail;

    /**
     * The old email address to be updated.
     */
    private final String oldEmail;

    /**
     * The username of the player whose email is to be updated.
     */
    private final String username;

    /**
     * Constructs a new UpdateEmailByUsernameDAO with the specified database connection, username,
     * old email, and new email.
     *
     * @param con       the database connection
     * @param username  the username of the player
     * @param oldEmail  the old email address of the player
     * @param newEmail  the new email address to be updated
     */
    public UpdateEmailByUsernameDAO(final Connection con, final String username, final String oldEmail, final String newEmail) {
        super(con);
        this.username = username;
        this.oldEmail = oldEmail;
        this.newEmail = newEmail;
    }

    /**
     * Updates the email address of the specified player in the database.
     *
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        int result = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, newEmail);
            pstmt.setString(2, username);
            pstmt.setString(3, oldEmail);

            LOGGER.info("Searching for an already existing user with the new email: " + newEmail);
            Player player = new SearchPlayerByEmailDAO(con, newEmail).access().getOutputParam();

            if (player != null) {
                LOGGER.info("Impossible to update the email because the new email already exists");
            } else {

                result = pstmt.executeUpdate();

                if (result == 1) {
                    LOGGER.info("Successfully updated the old email" + oldEmail + " with the new email " + newEmail);
                } else {
                    LOGGER.info("Failed to update the old email" + oldEmail + " with the new email " + newEmail);
                }

            }
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = result;
    }
}
