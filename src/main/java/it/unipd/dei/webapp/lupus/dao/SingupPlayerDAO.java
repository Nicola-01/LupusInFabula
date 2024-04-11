package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
public class SingupPlayerDAO extends AbstractDAO{
    private static final String STATEMENT = "INSERT INTO player (username, email, password, registerDate) VALUES (?, LOWER(?), md5(?), ?)";

    private static final String STATEMENT = "INSERT INTO player (username, email, password, registerDate) VALUES (?, ?, ?, ?)";
    private final Player player;

    public SingupPlayerDAO(final Connection con, final Player player) {
        super(con);

        if (player == null) {
            LOGGER.error("The player cannot be null.");
            throw new NullPointerException("The player cannot be null.");
        }
        this.player = player;
    }

    @Override
    protected void doAccess() throws SQLException {
        try (PreparedStatement ps = con.prepareStatement(STATEMENT)) {
            ps.setString(1, player.getUsername());
            ps.setString(2, player.getEmail());
            ps.setString(3, player.getPassword());
            ps.setDate(4, player.getRegisterDate());

            ps.execute();
        } finally {
            con.close();
        }
    }
}