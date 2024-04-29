package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Adds a new record indicating the role a player has in a game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0E
 */
public class UpdateDeathOfPlayerInTheGameDAO extends AbstractDAO {

    /**
     * The SQL statement to be executed.
     */
    private final static String STATEMENT = "UPDATE plays_as_in SET round_of_death = ?, phase_of_death = ?, duration_of_life = (SELECT game.start FROM game where game.id = ?) - NOW() " +
            "where game_id = ? AND player_username = ?";

    /**
     * The PlaysAsIn object containing information about the player's role and death in the game
     */
    private final PlaysAsIn playsAsIn;

    /**
     * Constructs a new UpdateDeathOfPlayerInTheGameDAO with PlaysAsIn object
     *
     * @param con        The database connection
     * @param playsAsIn  The PlaysAsIn object containing information about the player's role and death in the game
     */
    public UpdateDeathOfPlayerInTheGameDAO(final Connection con, final PlaysAsIn playsAsIn) {
        super(con);
        this.playsAsIn = playsAsIn;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, playsAsIn.getRoundOfDeath());
            pstmt.setInt(2, playsAsIn.getPhaseOfDeath());
            pstmt.setInt(3, playsAsIn.getGameId());

            pstmt.setInt(4, playsAsIn.getGameId());
            pstmt.setString(5, playsAsIn.getPlayerUsername());

            //LOGGER.info("Executing updateDeathOfPlayerInTheGameDAO");

            pstmt.execute();
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
