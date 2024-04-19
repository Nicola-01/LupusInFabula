package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Search if a user exists by username/email and password
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class LoginPlayerDAO extends AbstractDAO<Player> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM player WHERE (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)) AND password = md5(?)";

    /**
     * The username/email and password to search in the database
     */
    private final String user, password;

    /**
     * Creates a new object for search the player into the database by username or email and password.
     *
     * @param con      the connection to the database.
     * @param user     the username or email of the player that want to log in.
     * @param password the password for that account.
     */
    public LoginPlayerDAO(final Connection con, final String user, final String password) {
        super(con);
        this.user = user;
        this.password = password;
    }

    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        Player player = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            pstmt.setString(2, user);
            pstmt.setString(3, password);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                player = new Player(rs.getString("username"),
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
