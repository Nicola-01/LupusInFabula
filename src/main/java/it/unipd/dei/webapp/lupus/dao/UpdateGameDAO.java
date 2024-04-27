package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
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
     * The SQL statement to update game information.
     */
    private static final String STATEMENT = "UPDATE game SET game_duration = ?, who_wins = ?, rounds = ?, phase = ? WHERE id = ?";

    /**
     * The game duration to be updated.
     */
    private Time game_duration;

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
     * @param con            the database connection
     * @param gameId         the ID of the game to be updated
     * @param phase          the current phase of the game
     * @param rounds         the number of rounds in the game
     * @param who_wins       the player who wins the game
     * @param game_duration  the duration of the game
     */
    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds, int who_wins, Time game_duration) {
        super(con);
        this.gameId = gameId;
        this.phase = phase;
        this.rounds = rounds;
        this.who_wins = who_wins;
        this.game_duration = game_duration;
    }

    /**
     * Constructs a new UpdateGameDAO with the specified database connection, game ID, phase, and rounds.
     * This constructor is used when updating only the phase and number of rounds of a game that is still running.
     *
     * @param con     the database connection
     * @param gameId  the ID of the game to be updated
     * @param phase   the current phase of the game
     * @param rounds  the number of rounds in the game
     */
    public UpdateGameDAO(final Connection con, final int gameId, int phase, int rounds) {
        this(con, gameId, phase, rounds, -1, null);
    }


    /**
     * Updates the game information in the database.
     *
     * @throws Exception
     */
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
            //LOGGER.info("Update of game");
            rs = pstmt.executeUpdate();
            //LOGGER.info("Update of game ok");
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }

    }
}
