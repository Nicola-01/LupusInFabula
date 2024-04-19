package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class GetGameIdFormPubblicGameIdDAO extends AbstractDAO<Integer> {
    private static final String STATEMENT = "SELECT * FROM game WHERE public_ID = ?";
    private final String pubblicGameId;

    public GetGameIdFormPubblicGameIdDAO(final Connection con, final String pubblicGameId){
        super(con);
        this.pubblicGameId = pubblicGameId;
    }

    /**
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int gameID = -1;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, pubblicGameId);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                gameID = rs.getInt("ID");
            }
            LOGGER.info(String.format("Found ID %d, from pubblicGame %s", gameID, pubblicGameId));
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
