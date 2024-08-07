package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Adds a new record indicating the role a player has in a game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class InsertIntoPlayAsInDAO extends AbstractDAO {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "INSERT INTO PLAYS_AS_IN VALUES(?, ?, ?, ?)";

    /**
     * The PlaysAsIn object representing the player's role in a game.
     */
    private final PlaysAsIn playsAsIn;

    /**
     * Represents the order of the player in the game.
     */
    private final int orderInGame;

    /**
     * Creates a new object for ad PlaysAsIn into database
     *
     * @param con       the connection to the database.
     * @param playsAsIn the PlaysAsIn object representing the player's role in a game.
     * @param orderInGame the order of the player in the game.
     */
    public InsertIntoPlayAsInDAO(final Connection con, final PlaysAsIn playsAsIn, int orderInGame) {
        super(con);
        this.playsAsIn = playsAsIn;
        this.orderInGame = orderInGame;
    }

    /**
     * Executes the DAO operation to insert a new record into the PLAYS_AS_IN table.
     *
     * @throws Exception if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, playsAsIn.getPlayerUsername());
            pstmt.setInt(2, playsAsIn.getGameId());
            pstmt.setString(3, playsAsIn.getRole());
            pstmt.setInt(4, orderInGame);

            pstmt.execute();
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
