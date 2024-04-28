package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Return whether the Explorer role has already been used the action explore in the game
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class ExplorerAlreadyExploreDAO extends AbstractDAO<Boolean> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM action WHERE game_id = ? AND type_of_action = ?";

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new ExplorerAlreadyExploreDAO for search if the explorer already explore
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game.
     */
    public ExplorerAlreadyExploreDAO(Connection con, int gameID) {
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = false;

        try {
            pstmt = con.prepareStatement(STATEMENT);

            pstmt.setInt(1, gameID);
            pstmt.setString(2, GameRoleAction.EXPLORER.getAction());

            rs = pstmt.executeQuery();

            this.outputParam = rs.next();

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
    }
}
