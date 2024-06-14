package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Role;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AuthenticateTokenDAO extends AbstractDAO<Player> {

    /**
     * The SQL statement to be executed for inserting a new token.
     */
    private static final String STATEMENT = "SELECT * FROM User_tokens " +
            "JOIN Player ON User_tokens.player_username = Player.username " +
            "WHERE token = ?";

    /**
     * The token to be added.
     */
    private final String token;

    public AuthenticateTokenDAO(final Connection con, String token) {
        super(con);
        this.token = token;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement ps = null;
        ResultSet rs = null;
        this.outputParam = null;

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setString(1, token);

            rs = ps.executeQuery();

            if (rs.next())
                this.outputParam = new Player(rs.getString("username"), rs.getString("email"),
                        rs.getString("password"), rs.getDate("registration_date"));
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (ps != null) {
                ps.close();
            }
        }
    }
}
