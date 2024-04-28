package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Search a game using the public gameID, return the private gameID
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameIdFormPublicGameIdDAO extends AbstractDAO<Integer> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT * FROM game WHERE public_ID = ?";

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

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int gameID = -1;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, publicGameId);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                gameID = rs.getInt("ID");
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
