package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

/**
 * Retrieves the maximum game ID (the last game) for a player.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameIdByPlayerUsernameDAO extends AbstractDAO<UUID> {

    /**
     * The SQL statement to retrieve the maximum game ID for a player username.
     */
    // MAX() does not exist for uuid; UUIDv7 sorts by creation time, so ORDER BY ... DESC LIMIT 1 gives the latest game
    private static final String STATEMENT = "SELECT pai.game_id FROM plays_as_in pai JOIN player p ON p.id = pai.player_id " +
            "WHERE LOWER(p.username) = LOWER(?) ORDER BY pai.game_id DESC LIMIT 1";

    /**
     * The player username for which the game ID is to be retrieved.
     */
    private final String playerUsername;

    /**
     * Constructs a new GetGameIdByPlayerUsernameDAO with the specified database connection and player username.
     *
     * @param con            the database connection
     * @param playerUsername the username of the player
     */
    public GetGameIdByPlayerUsernameDAO(final Connection con, final String playerUsername) {
        super(con);
        this.playerUsername = playerUsername;
    }

    /**
     * Retrieves the game ID associated with the specified player username from the database.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        UUID game_id = null;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, playerUsername);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                game_id = rs.getObject("game_id", UUID.class);
                //LOGGER.info("The player " + playerUsername + " is in the game " + game_id);
            } else {
                LOGGER.warn("The player " + playerUsername + " is not in the game");
            }

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = game_id;

    }
}
