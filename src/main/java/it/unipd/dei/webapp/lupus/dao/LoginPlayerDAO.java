package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.PasswordHash;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

/**
 * Search if a user exists by username/email and password.
 * A legacy (unsalted MD5) password is upgraded to the current hash on successful login.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class LoginPlayerDAO extends AbstractDAO<Player> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM player WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)";

    /**
     * Replaces the stored hash only if it is still the one that was verified
     */
    private static final String UPDATE_PASSWORD = "UPDATE Player SET password = ? WHERE id = ? AND password = ?";

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

    /**
     * Executes the DAO operation to search for a player by username/email and password.
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
            pstmt.setString(1, user);
            pstmt.setString(2, user);
            rs = pstmt.executeQuery();

            // username of one account may equal the email of another: take the first row whose password matches
            boolean found = false;
            while (player == null && rs.next()) {
                found = true;
                String stored = rs.getString("password");
                if (!PasswordHash.verify(password, stored)) {
                    continue;
                }
                String username = rs.getString("username");
                UUID id = rs.getObject("id", UUID.class);
                String email = rs.getString("email");
                String current = stored;

                if (PasswordHash.needsRehash(stored)) {
                    current = PasswordHash.hash(password);
                    try (PreparedStatement upd = con.prepareStatement(UPDATE_PASSWORD)) {
                        upd.setString(1, current);
                        upd.setObject(2, id);
                        upd.setString(3, stored);
                        upd.executeUpdate();
                    }
                    LOGGER.info("Upgraded password hash for player " + username);
                }

                player = new Player(id, username, email, current, rs.getDate("registration_date"));
                LOGGER.info("Player found: " + username + " " + email);
            }

            // unknown user: spend the same PBKDF2 time, so the response time does not reveal whether it exists
            if (!found)
                PasswordHash.hash(password);
            if (player == null) {
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
