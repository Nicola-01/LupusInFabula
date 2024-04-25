package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class GetNumberOfRolesByGameIdAndRoleNameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "SELECT COUNT(*) AS number_of_role FROM plays_as_in WHERE game_id = ? AND role = ?";
    private final int gameId;
    private final String roleName;

    public GetNumberOfRolesByGameIdAndRoleNameDAO(final Connection con, int gameId, String roleName) {
        super(con);
        this.gameId = gameId;
        this.roleName = roleName;
    }

    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int number_of_role = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, roleName);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                number_of_role = rs.getInt("number_of_role");
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = number_of_role;
    }
}
