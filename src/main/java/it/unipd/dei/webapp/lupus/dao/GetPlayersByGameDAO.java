package it.unipd.dei.webapp.lupus.dao;


import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;
import it.unipd.dei.webapp.lupus.rest.GameActionsGetRR;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * DAO class to retrieve a list of players by game ID.
 * This class handles the database query to list all the players and their roles playing in a specified game.
 */
public class GetPlayersByGameDAO extends AbstractDAO<List<String>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT p.username AS player_username FROM plays_as_in pai JOIN player p ON p.id = pai.player_id " +
            "WHERE pai.game_id = ? AND pai.role != ? ORDER BY pai.order_in_game";

    /**
     * The private ID of the game.
     */
    private final UUID gameID;

    /**
     * Creates a new object to list all the players in a game using the private gameID.
     *
     * @param con    The connection to the database.
     * @param gameID The private gameID used to find the game.
     */
    public GetPlayersByGameDAO(Connection con, UUID gameID) {
        super(con);
        this.gameID = gameID;
    }

    /**
     * Handles the query to list all the players and their roles playing in game = gameID
     *
     * @throws SQLException in case of errors during the query
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<String> players = new ArrayList<>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setObject(1, gameID);
            pstmt.setString(2, GameRoleAction.MASTER.getName());
            rs = pstmt.executeQuery();
            while (rs.next())
                players.add(rs.getString("player_username"));
        } finally {
            if (rs != null)
                rs.close();
            if (pstmt != null)
                pstmt.close();
        }
        this.outputParam = players;
    }
}
