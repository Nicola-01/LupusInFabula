package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class IsPuppyAWolfDAO extends AbstractDAO<Boolean>{


    private static final String STATEMENT = "SELECT round_of_death FROM plays_as_in WHERE game_id = ? AND role = ? and round_of_death IS NULL";

    private final int gameId;

    public IsPuppyAWolfDAO(Connection con, int gameId) {
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
            pstmt.setString(2, GameRoleAction.WOLF.getName());

            rs = pstmt.executeQuery();

            // if the query returns an empty ResultSet, then there are no living wolves
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
