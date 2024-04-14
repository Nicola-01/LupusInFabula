package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UpdateUsernameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "UPDATE player SET username = ? WHERE LOWER(username) = LOWER(?)";
    private final String newUsername;
    private final String oldUsername;

    public UpdateUsernameDAO(final Connection con, final String oldUsername, final String newUsername) {
        super(con);
        this.newUsername = newUsername;
        this.oldUsername = oldUsername;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = con.prepareStatement(STATEMENT);
        int result = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, newUsername);
            pstmt.setString(2, oldUsername);

            Player player = new SearchPlayerByUsernameDAO(con, newUsername).access().getOutputParam();

            if (player != null && player.getUsername().equals(newUsername)) {
                LOGGER.info("Impossible to update the username because the new username already exists");
            } else {

                result = pstmt.executeUpdate();

                if (result == 1) {
                    LOGGER.info("Updated the user with old username " + oldUsername + " to " + newUsername);
                } else {
                    LOGGER.info("Failed to update the user with old username " + oldUsername + " to " + newUsername);
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
