package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Retrieves the role associated with a particular player username in a specific game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetRoleByGameIdAndPlayerUsernameDAO extends AbstractDAO<String> {

    /**
     * The SQL statement to retrieve the role of a player by game ID and player username.
     */
    private static final String STATEMENT = "SELECT role FROM plays_as_in WHERE game_id = ? AND LOWER(player_username) = LOWER(?) ORDER BY order_in_game";

    /**
     * The game ID for which the player's role is to be retrieved.
     */
    private final int gameId;

    /**
     * The username of the player whose role is to be retrieved.
     */
    private final String playerUsername;

    /**
     * Constructs a new GetRoleByGameIdAndPlayerUsernameDAO with the specified database connection,
     * game ID, and player username.
     *
     * @param con            the database connection
     * @param gameId         the ID of the game
     * @param playerUsername the username of the player
     */
    public GetRoleByGameIdAndPlayerUsernameDAO(final Connection con, int gameId, String playerUsername) {
        super(con);
        this.playerUsername = playerUsername;
        this.gameId = gameId;
    }

    /**
     * Retrieves the role of the specified player in the specified game from the database.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String role = "";

        try {

            pstmt = con.prepareStatement(STATEMENT);
            //LOGGER.info("gameId: " + gameId + " playerUsername: " + playerUsername);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, playerUsername);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                role = rs.getString("role");
                //LOGGER.info("The player " + playerUsername + " has the role (" + role + ") in the game " + gameId);
            } else {
                LOGGER.warn("The player " + playerUsername + " has not correct role in the game " + gameId);
            }

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = role;
    }
}
