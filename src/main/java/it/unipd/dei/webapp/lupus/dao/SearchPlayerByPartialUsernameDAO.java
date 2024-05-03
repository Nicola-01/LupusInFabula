package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Search a user by partial username
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SearchPlayerByPartialUsernameDAO extends AbstractDAO<List<Player>> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM player WHERE LOWER(username) LIKE LOWER(CONCAT('%', ?, '%')) ORDER BY username";

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
    public SearchPlayerByPartialUsernameDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    /**
     * Executes the DAO operation to search for a player by username.
     *
     * @throws SQLException if there is an error executing the SQL query
     */
    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        List<Player> players = new ArrayList<>();

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);
            rs = pstmt.executeQuery();

            while (rs.next())
                players.add(new Player(rs.getString("username")));


        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = players;
    }
}
