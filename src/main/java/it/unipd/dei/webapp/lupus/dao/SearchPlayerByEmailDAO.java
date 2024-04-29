package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Search a user by email
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SearchPlayerByEmailDAO extends AbstractDAO<Player> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM player WHERE LOWER(email) = LOWER(?)";

    /**
     * The email to search
     */
    private final String email;

    /**
     * Creates a new object for searching player by email.
     *
     * @param con   the connection to the database.
     * @param email the email of the player.
     */
    public SearchPlayerByEmailDAO(final Connection con, final String email) {
        super(con);
        this.email = email;
    }

    /**
     * Executes the DAO operation to search for a player by email.
     *
     * @throws SQLException if there is an error executing the SQL query
     */
    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        Player player = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, email);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                player = new Player(rs.getString("username"), rs.getString("email"),
                        rs.getString("password"), rs.getDate("registration_date"));
                LOGGER.info("Player found: " + rs.getString("username") + " " + rs.getString("email"));
            } else {
                LOGGER.info("No record found for player " + email);
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
