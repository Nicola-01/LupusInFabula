package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DeletePlayerDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "DELETE FROM player WHERE LOWER(username) = LOWER(?)";
    private final String player_username;

    public DeletePlayerDAO(final Connection con, final String player_username) {
        super(con);
        this.player_username = player_username;
    }

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
