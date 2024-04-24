package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class GetDeadPlayersByGameIdDAO extends AbstractDAO<Map<String, Boolean>> {

    private static final String STATEMENT = "SELECT round_of_death, player_username FROM plays_as_in WHERE game_id = ?";
    private final int gameId;

    public GetDeadPlayersByGameIdDAO(final Connection con, final int gameId) {
        super(con);
        this.gameId = gameId    ;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Map<String, Boolean> map = new HashMap<>();

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                map.put(rs.getString("player_username"), rs.getInt("round_of_death") > 0);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = map;
    }
}
