package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Data Access Object (DAO) for adding a user token.
 * This DAO is responsible for inserting a new token into the `user_tokens` table
 * to allow persistent login for the user.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class AddUserTokenDAO extends AbstractDAO {

    /**
     * The SQL statement to be executed for inserting a new token.
     */
    private static final String STATEMENT = "INSERT INTO user_tokens VALUES (?,?)";

    /**
     * The username of the user.
     */
    private final String username;

    /**
     * The token to be added.
     */
    private final String token;


    /**
     * Creates a new object to add a user token.
     *
     * @param con the connection to the database.
     * @param username the username of the user.
     * @param token the token to be added.
     */
    public AddUserTokenDAO(final Connection con, String username, String token) {
        super(con);
        this.username = username;
        this.token = token;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement ps = null;

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setString(1, token);
            ps.setString(2, username);

            ps.executeUpdate();
        } finally {
            if (ps != null)
                ps.close();

            con.close();
        }
    }
}
