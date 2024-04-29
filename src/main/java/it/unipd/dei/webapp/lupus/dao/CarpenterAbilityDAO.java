package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * DAO (Data Access Object) class for retrieving the carpenter's ability status from the database.
 * This class extends AbstractDAO, where Boolean represents the result of the carpenter's ability check.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class CarpenterAbilityDAO extends AbstractDAO<Boolean>{
    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND type_of_action = 'last chance'";

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new IsPuppyAWolfDAO for search if the Puppy is become a wolf
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game.
     */
    public CarpenterAbilityDAO(Connection con, int gameID) {
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

            rs = pstmt.executeQuery();

            this.outputParam = !(rs.next());

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

