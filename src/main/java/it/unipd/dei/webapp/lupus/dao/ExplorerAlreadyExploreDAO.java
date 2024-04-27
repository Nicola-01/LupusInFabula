package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ExplorerAlreadyExploreDAO extends AbstractDAO<Boolean> {

    private static final String STATEMENT = "SELECT * FROM action WHERE game_id = ? AND type_of_action = ?";

    private final int gameId;

    public ExplorerAlreadyExploreDAO(Connection con, int gameId) {
        super(con);
        this.gameId = gameId;
    }

    /**
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = false;

        try {

            pstmt = con.prepareStatement(STATEMENT);

            pstmt.setInt(1, gameId);
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
