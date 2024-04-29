package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Time;

/**
 * Updates game-related information in the database, such as the game duration,
 * who wins the game, the number of rounds, and the current phase of the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UpdateGameDAO extends AbstractDAO {

    /**
     * The SQL statement to update game information if the game is not finished.
     */
    private static final String STATEMENT_NOT_FINISHED = "UPDATE game SET rounds = ?, phase = ? WHERE id = ?";

    /**
     * The SQL statement to update game information if the game is finished.
     */
    private static final String STATEMENT_FINISHED = "UPDATE game SET rounds = ?, phase = ?, who_wins = ?, game_duration = now() - start WHERE id = ?";


    /**
     * The player who wins the game.
     */
    private int who_wins;

    /**
     * The number of rounds in the game.
     */
    private int rounds;

    /**
     * The current phase of the game.
     */
    private int phase;

    /**
     * The ID of the game to be updated.
     */
    private final int gameId;

    /**
     * Constructs a new UpdateGameDAO with the specified database connection, game ID, phase, rounds, who wins,
     * and game duration.
     *
     * @param con      the database connection
     * @param gameId   the ID of the game to be updated
     * @param phase    the current phase of the game
     * @param rounds   the number of rounds in the game
     * @param who_wins the player who wins the game
     */
    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds, int who_wins) {
        super(con);
        this.gameId = gameId;
        this.phase = phase;
        this.rounds = rounds;
        this.who_wins = who_wins;
    }

    /**
     * Constructs a new UpdateGameDAO with the specified database connection, game ID, phase, and rounds.
     * This constructor is used when updating only the phase and number of rounds of a game that is still running.
     *
     * @param con    the database connection
     * @param gameId the ID of the game to be updated
     * @param phase  the current phase of the game
     * @param rounds the number of rounds in the game
     */
    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds) {
        this(con, gameId, phase, rounds, -1);
    }


    /**
     * Updates the game information in the database depending on whether the game is finished or not.
     *
     * @throws Exception if an error occurs while accessing the database.
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;

        try {
            if (who_wins == -1) {
                pstmt = con.prepareStatement(STATEMENT_NOT_FINISHED);

                pstmt.setInt(1, rounds);
                pstmt.setInt(2, phase);
                pstmt.setInt(3, gameId);
            } else {
                pstmt = con.prepareStatement(STATEMENT_FINISHED);

                pstmt.setInt(1, rounds);
                pstmt.setInt(2, phase);
                pstmt.setInt(3, who_wins);
                pstmt.setInt(4, gameId);
            }

            pstmt.executeUpdate();
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }

    }
}
