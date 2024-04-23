package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRole;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class SelectPlayersAndRolesByGameIdDAO extends AbstractDAO<Map<String,String>> {

    private static final String STATEMENT = "SELECT player_username, r.name FROM plays_as_in JOIN role r on plays_as_in.role_id = r.id WHERE game_id = ? AND r.name != ?";
    private final int gameId;

    public SelectPlayersAndRolesByGameIdDAO(final Connection con, int gameId) {
        super(con);
        this.gameId = gameId;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Map<String,String> map =  new HashMap<String, String>();

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, GameRole.MASTER.getName());
            rs = pstmt.executeQuery();

            while (rs.next()) {
                map.put(rs.getString("player_username"), rs.getString("name"));
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
