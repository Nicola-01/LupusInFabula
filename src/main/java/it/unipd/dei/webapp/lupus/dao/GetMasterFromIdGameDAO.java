package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

/**
 * Retrieves the username of the master of a game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetMasterFromIdGameDAO extends AbstractDAO<String> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT p.username FROM plays_as_in pai JOIN player p ON p.id = pai.player_id WHERE pai.game_id = ? AND pai.role = ?";

    /**
     * The ID of the game to retrieve
     */
    private final UUID gameId;

    /**
     * Constructs a new GetMasterFromIdGameDAO for create a new game.
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game to retrieve.
     */
    public GetMasterFromIdGameDAO(final Connection con, UUID gameID) {
        super(con);
        this.gameId = gameID;
    }

    /**
     * Executes the DAO operation to retrieve the master player's username from the specified game ID.
     *
     * @throws Exception if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String master = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setObject(1, gameId);
            pstmt.setString(2, GameRoleAction.MASTER.getName());

            rs = pstmt.executeQuery();

            if (rs.next()) {
                master = rs.getString("username");
            }
            LOGGER.info(String.format("Found master %s in game %s", master, gameId));
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = master;

    }
}
