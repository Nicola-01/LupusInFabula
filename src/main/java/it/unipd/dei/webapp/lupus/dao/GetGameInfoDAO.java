package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Search the list of players playing in a game using the private gameID, returns such list
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameInfoDAO extends AbstractDAO<List<PlaysAsIn>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT * FROM plays_as_in WHERE plays_as_in.game_id = ?";
    /**
     * The private ID of the game.
     */
    private final int gameID;
    /**
     * Whether the URI contained a /master at the end.
     */
    private final boolean URIisMaster;
    /**
     * The username of the player who made the request.
     */
    private final String playerUsername;
    /**
     * The role of the player who made the request.
     */
    private final String role;

    /**
     * Creates a new object to list all the players in a game using the private gameID.
     *
     * @param con           The connection to the database.
     * @param gameID        The private gameID used to find the game.
     * @param isMaster      Whether the URI contained a /master at the end.
     * @param playerUsername    The username of the player who made the request
     * @param role          The role of the player who made the request
     */
    public GetGameInfoDAO(final Connection con, final int gameID, boolean isMaster, String playerUsername, String role){
        super(con);
        this.gameID = gameID;
        this.URIisMaster = isMaster;
        this.playerUsername = playerUsername;
        this.role = role;

    }

    /**
     * Handles the query to list all the players and their roles playing in game = gameID
     * @throws SQLException in case of errors during the query
     */
    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<PlaysAsIn> join = new ArrayList<PlaysAsIn>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameID);

            rs = pstmt.executeQuery();

            // if the request uri is /game/status/{gameID}/master
            // I can send all the info about the game (username and roles)
            if(URIisMaster)
            {
                while (rs.next())
                {
                    join.add(new PlaysAsIn(
                            rs.getString("player_username"),
                            rs.getInt("game_id"),
                            rs.getString("role"),
                            rs.getInt("round_of_death"),
                            rs.getInt("phase_of_death"),
                            rs.getFloat("duration_of_life")
                    ));
                }
            }
            // otherwise I send the list of players without role, but only the role of the player
            // who made the request
            // Only exception: If the user's role is "wolf", he can see all the other players role if they are "wolf" as well
            else
            {
                while (rs.next())
                {
                    String playerRole = rs.getString("role");
                    String sentUsername = rs.getString("player_username");
                    if(! (this.playerUsername.equals(sentUsername) || (this.role.equals("wolf") && playerRole.equals("wolf"))))
                        playerRole = "";

                    join.add(new PlaysAsIn(
                            sentUsername,
                            rs.getInt("game_id"),
                            playerRole,
                            rs.getInt("round_of_death"),
                            rs.getInt("phase_of_death"),
                            rs.getFloat("duration_of_life")
                    ));
                }
            }
            String infos = "Game "+gameID+" contains " + join.size() + " players";
            LOGGER.info(infos);
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = join;
    }
}