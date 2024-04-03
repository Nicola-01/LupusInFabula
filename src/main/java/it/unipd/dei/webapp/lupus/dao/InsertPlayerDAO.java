package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
public class InsertPlayerDAO {
    private static final String STATEMENT = "INSERT INTO lupusdb.Player (id, username, email, password, registerDate) VALUES (?, ?, ?, ?, ?)";
    private final Connection con;
    private final Player player;

    public InsertPlayerDAO(final Connection con, final Player player) {
        this.con = con;
        this.player = player;
    }

    public void createPlayer() throws SQLException {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, player.getId());
            pstmt.setString(2, player.getUsername());
            pstmt.setString(3, player.getEmail());
            pstmt.setString(4, player.getPassword());
            pstmt.setDate(5, player.getRegisterDate());

            pstmt.execute();
        }
        finally {
            if(pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
