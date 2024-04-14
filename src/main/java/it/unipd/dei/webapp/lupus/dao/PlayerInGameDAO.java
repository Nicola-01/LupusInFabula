package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

public class PlayerInGameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "SELECT g.id FROM game g join public.plays_as_in pai on g.id = pai.game_id " +
            "where g.number_of_rounds IS NULL and player_username = ?";

    private final String user;

    public PlayerInGameDAO(final Connection con, final String user) {
        super(con);
        this.user = user;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        int gameId = -1;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                gameId = rs.getInt("id");
                LOGGER.info("Player " + user + " found in a gameID: " + gameId);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = gameId;
    }
}
