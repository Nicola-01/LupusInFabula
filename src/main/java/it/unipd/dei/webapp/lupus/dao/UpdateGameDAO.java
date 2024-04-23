package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Time;

public class UpdateGameDAO extends AbstractDAO {

    private static final String STATEMENT = "UPDATE game SET game_duration = ?, who_wins = ?, rounds = ?, phase = ? WHERE id = ?";
    private Time game_duration;
    private int who_wins;
    private int rounds;
    private int phase;
    private final int gameId;

    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds, int who_wins, Time game_duration) {
        super(con);
        this.gameId = gameId;
        this.phase = phase;
        this.rounds = rounds;
        this.who_wins = who_wins;
        this.game_duration = game_duration;
    }

    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds) {
        this(con, gameId, phase, rounds, -1, null);
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        int rs;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setTime(1, game_duration);
            pstmt.setInt(2, who_wins);
            pstmt.setInt(3, rounds);
            pstmt.setInt(4, phase);
            pstmt.setInt(5, gameId);
            LOGGER.info("Update of game");
            rs = pstmt.executeUpdate();
            LOGGER.info("Update of game ok");
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }

    }
}
