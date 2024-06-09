package it.unipd.dei.webapp.lupus.dao;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Data Access Object (DAO) for resetting game state to a specific phase and round.
 * This DAO is responsible for deleting actions and updating player status in the game
 * based on the specified phase and round.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class ResetGameToDAO extends AbstractDAO {

    /**
     * SQL statement to delete actions from the database for the given game ID where the round and phase
     * exceed the specified values.
     */
    private static final String STATEMENT_ACTION = "DELETE FROM action WHERE game_id = ? AND (round > ?) OR (round = ? AND phase >= ?)";


    /**
     * SQL statement to update player status in the game, setting the death-related fields to null for the specified game ID
     * where the round of death and phase of death exceed the specified values.
     */
    private static final String STATEMENT_PLAYS_AS_IN = "UPDATE plays_as_in SET round_of_death = null, phase_of_death = null, duration_of_life = null WHERE game_id = ? AND (round_of_death > ?) OR (round_of_death = ? AND phase_of_death >= ?)";

    /**
     * The data source used for obtaining connections.
     */
    private final DataSource ds;

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
    private final int gameID;

    /**
     * Creates a new DAO object.
     *
     * @param con    the database connection
     * @param ds     the data source for obtaining connections
     * @param gameID the ID of the game to be updated
     * @param phase  the current phase of the game
     * @param rounds the number of rounds in the game
     */
    public ResetGameToDAO(Connection con, DataSource ds, int gameID, int phase, int rounds) {
        super(con);
        this.ds = ds;
        this.gameID = gameID;
        this.phase = phase;
        this.rounds = rounds;
    }

    /**
     * Executes the database operations to reset the game state.
     * Deletes actions and updates player statuses to reflect the specified phase and round.
     *
     * @throws Exception if an error occurs during the database access.
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt_action = null;
        PreparedStatement pstmt_psi = null;

        try {
            pstmt_action = con.prepareStatement(STATEMENT_ACTION);
            pstmt_psi = con.prepareStatement(STATEMENT_PLAYS_AS_IN);

            pstmt_action.setInt(1, gameID);
            pstmt_action.setInt(2, rounds);
            pstmt_action.setInt(3, rounds);
            pstmt_action.setInt(4, phase);

            pstmt_psi.setInt(1, gameID);
            pstmt_psi.setInt(2, rounds);
            pstmt_psi.setInt(3, rounds);
            pstmt_psi.setInt(4, phase);


            pstmt_action.execute();
            pstmt_psi.execute();

        } finally {
            if (pstmt_action != null)
                pstmt_action.close();
            if (pstmt_psi != null)
                pstmt_psi.close();
        }

    }
}
