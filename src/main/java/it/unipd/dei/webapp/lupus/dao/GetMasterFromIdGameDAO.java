package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRole;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class GetMasterFromIdGameDAO extends AbstractDAO<String> {
    private static final String STATEMENT = "SELECT player_username from plays_as_in where game_id = ? and role_id = ?";

    private final int gameId;

    public GetMasterFromIdGameDAO(final Connection con, int gameId) {
        super(con);
        this.gameId = gameId;
    }

    /**
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String master = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setInt(2, GameRole.MASTER.getId());

            rs = pstmt.executeQuery();

            if (rs.next()) {
                master = rs.getString("player_username");
            }
            LOGGER.info(String.format("Found master %s in game %d", master, gameId));
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = master;

    }
}
