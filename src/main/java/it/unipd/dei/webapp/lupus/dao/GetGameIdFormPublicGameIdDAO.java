package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

/**
 * Search a game using the public gameID, return the private gameID
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameIdFormPublicGameIdDAO extends AbstractDAO<UUID> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT id FROM game WHERE public_ID = ?";

    /**
     * The public gameID to search
     */
    private final String publicGameId;


    /**
     * Creates a new object to search for the private game ID using the public game ID.
     *
     * @param con           The connection to the database.
     * @param publicGameId  The public game ID to search for.
     */
    public GetGameIdFormPublicGameIdDAO(final Connection con, final String publicGameId) {
        super(con);
        this.publicGameId = publicGameId;
    }

    /**
     * Executes the DAO operation to search for the private game ID using the public game ID.
     *
     * @throws Exception if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        UUID gameID = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, publicGameId);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                gameID = rs.getObject("id", UUID.class);
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = gameID;

    }
}
