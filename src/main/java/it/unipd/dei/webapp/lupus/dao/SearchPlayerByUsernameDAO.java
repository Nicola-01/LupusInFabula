package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Search a user by username
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SearchPlayerByUsernameDAO extends AbstractDAO<Player> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM player WHERE LOWER(username) = LOWER(?)";

    /**
     * The username to search
     */
    private final String username;

    /**
     * Creates a new object for searching player by email.
     *
     * @param con      the connection to the database.
     * @param username the username of the player.
     */
    public SearchPlayerByUsernameDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        Player player = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                player = new Player(rs.getString("username"), rs.getString("email"),
                        rs.getString("password"), rs.getDate("registration_date"));
//                LOGGER.info("Player found: " + rs.getString("username") + " " + rs.getString("email"));
            } else {
                LOGGER.info("No record found for player " + username);
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
