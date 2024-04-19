package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UpdateEmailByUsernameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "UPDATE player SET email = ? WHERE LOWER(username) = LOWER(?) AND email = ?";
    private final String newEmail;
    private final String oldEmail;
    private final String username;

    public UpdateEmailByUsernameDAO(final Connection con, final String username, final String oldEmail, final String newEmail) {
        super(con);
        this.username = username;
        this.oldEmail = oldEmail;
        this.newEmail = newEmail;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = con.prepareStatement(STATEMENT);
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
