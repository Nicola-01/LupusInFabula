package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class GetRoleByGameIdAndPlayerUsernameDAO extends AbstractDAO<String> {

    private static final String STATEMENT = "SELECT role FROM plays_as_in WHERE game_id = ? AND player_username = LOWER(?)";
    private final int gameId;
    private final String playerUsername;

    public GetRoleByGameIdAndPlayerUsernameDAO(final Connection con, int gameId, String playerUsername) {
        super(con);
        this.playerUsername = playerUsername;
        this.gameId = gameId;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String role = "";

        try {

            pstmt = con.prepareStatement(STATEMENT);
            //LOGGER.info("gameId: " + gameId + " playerUsername: " + playerUsername);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, playerUsername);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                role = rs.getString("role");
                LOGGER.info("The player " + playerUsername + " has the role (" + role + ") in the game " + gameId);
            } else {
                LOGGER.info("The player " + playerUsername + " has not correct role in the game " + gameId);
            }

        }finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = role;
    }
}
