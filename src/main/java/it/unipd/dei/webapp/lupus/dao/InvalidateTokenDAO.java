package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;


/**
 * Data Access Object (DAO) for invalidating (deleting) a user token.
 * This DAO is responsible for removing a token from the `User_tokens` table
 * to log the user out and invalidate the session.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class InvalidateTokenDAO extends AbstractDAO {

    /**
     * The SQL statement to be executed for inserting a new token.
     */
    private static final String STATEMENT = "DELETE FROM User_tokens WHERE token = ?";

    /**
     * The token to be added.
     */
    private final String token;

    public InvalidateTokenDAO(final Connection con, String token) {
        super(con);
        this.token = token;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement ps = null;

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setString(1, token);

            ps.executeUpdate();
        } finally {
            if (ps != null)
                ps.close();

            con.close();
        }
    }
}
