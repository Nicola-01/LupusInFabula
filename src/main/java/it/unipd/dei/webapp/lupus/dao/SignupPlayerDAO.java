package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Insert the user into the database
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SignupPlayerDAO extends AbstractDAO {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "INSERT INTO player VALUES (?, LOWER(?), md5(?), CURRENT_DATE)";

    /**
     * The player to be inserted in the database
     */
    private final Player player;

    /**
     * Creates a new object for insert the player into the database.
     *
     * @param con    the connection to the database.
     * @param player the username of the player.
     */
    public SignupPlayerDAO(final Connection con, final Player player) {
        super(con);
        this.player = player;
    }

    /**
     * Executes the DAO operation to insert a new player into the database.
     *
     * @throws SQLException if there is an error executing the SQL query
     */
    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player.getUsername());
            pstmt.setString(2, player.getEmail());
            pstmt.setString(3, player.getPassword());

            pstmt.execute();
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
