package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Game;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Retrieves the status of a game by its game ID.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameByGameIdDAO extends AbstractDAO<Game> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM Game WHERE ID = ?";

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new GetGameByGameIdDAO for create a new game.
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game to retrieve.
     */
    public GetGameByGameIdDAO(final Connection con, int gameID) {
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws SQLException {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Game game = null;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameID);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                game = new Game(rs.getInt("ID"), rs.getString("public_ID"), rs.getDate("start"), rs.getTime("game_duration"),
                        rs.getInt("who_wins"), rs.getInt("rounds"), rs.getInt("phase"), rs.getInt("subphase"));
            }

        } finally {
            if (rs != null)
                rs.close();
            if (pstmt != null)
                pstmt.close();
        }
        this.outputParam = game;
    }

}
