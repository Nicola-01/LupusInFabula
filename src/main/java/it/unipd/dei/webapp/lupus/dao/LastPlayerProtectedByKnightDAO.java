package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class LastPlayerProtectedByKnightDAO extends AbstractDAO<String> {

    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND type_of_action = ? ORDER BY round DESC";

    private final int gameId;

    public LastPlayerProtectedByKnightDAO(final Connection con, int gameId) {
        super(con);
        this.gameId = gameId;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String target = null;

        try {

            pstmt = con.prepareStatement(STATEMENT);

            pstmt.setInt(1, gameId);
            pstmt.setString(2, GameRoleAction.KNIGHT.getAction());


            rs = pstmt.executeQuery();

            if (rs.next()) {
                target = rs.getString("target");
            } else {
                LOGGER.warn("No player protected by the Knight");
            }

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = target;
    }
}
