package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class GetGameIdByPlayerUsernameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "SELECT MAX(game_id) as game_id FROM plays_as_in WHERE player_username = LOWER(?)";
    private final String playerUsername;

    public GetGameIdByPlayerUsernameDAO(final Connection con, final String playerUsername) {
        super(con);
        this.playerUsername = playerUsername;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int game_id = -1;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, playerUsername);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                game_id = rs.getInt("game_id");
                //LOGGER.info("The player " + playerUsername + " is in the game " + game_id);
            } else {
                LOGGER.warn("The player " + playerUsername + " is not in the game");
            }

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = game_id;

    }
}
