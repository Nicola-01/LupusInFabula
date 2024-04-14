package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
public class SingupPlayerDAO extends AbstractDAO{
    private static final String STATEMENT = "INSERT INTO player VALUES (?, LOWER(?), md5(?), CURRENT_DATE)";

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
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player.getUsername());
            pstmt.setString(2, player.getEmail());
            pstmt.setString(3, player.getPassword());

            pstmt.execute();
        }
        finally {
            if(pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
