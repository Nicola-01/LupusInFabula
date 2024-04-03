package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SelectPlayerDAO {
    private static final String STATEMENT = "SELECT * FROM player";
    private final Connection con;
//    private final Player player;

    public SelectPlayerDAO(final Connection con) {
        this.con = con;
//        this.player = player;
    }

    public List<Player> searchPlayer() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        List<Player> players = new ArrayList<Player>();

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.executeQuery();

            while (rs.next()) {
                players.add(new Player(rs.getInt("id"), rs.getString("username"),
                        rs.getString("email"), rs.getString("password"), rs.getDate("registerDate")));
            }
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
            con.close();
        }
        return players;
    }
}
