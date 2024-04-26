package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UpdateRoleInPlayAsInByUsernameAndGameIdDAO extends AbstractDAO {

    private static final String STATEMENT = "UPDATE plays_as_in SET role = ? WHERE game_id = ? AND player_username = ?";
    private final String role;
    private final int gameId;
    private final String playerUsername;

    public UpdateRoleInPlayAsInByUsernameAndGameIdDAO(final Connection con, String role, int gameId, String playerUsername) {
        super(con);
        this.role = role;
        this.gameId = gameId;
        this.playerUsername = playerUsername;
    }

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
