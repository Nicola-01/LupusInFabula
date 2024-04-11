package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SearchPlayerByUsernameDAO extends AbstractDAO<Player>{
    private static final String STATEMENT = "SELECT * FROM player WHERE LOWER(username) = LOWER(?)";

    private final String user;

    public SearchPlayerByUsernameDAO(final Connection con, final String user) {
        super(con);
        this.user = user;
    }

    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        Player player = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                player = new Player(rs.getInt("id"), rs.getString("username"),
                        rs.getString("email"), rs.getString("password"), rs.getDate("registration_date"));
                LOGGER.info("Player found: " + rs.getString("username") + " " + rs.getString("email"));
            } else {
                LOGGER.info("No record found for player " + user);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = player;
    }
}
