package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GetNameActionDAO extends AbstractDAO {
    private static final String STATEMENT = "SELECT name FROM type_action WHERE ID = ?";
    private final int id;
    public GetNameActionDAO(final Connection con, final int id){
        super(con);
        this.id = id;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        String name_action = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, id);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                name_action = rs.getString("name");
            } else {
                throw new RuntimeException("ID specified is not present in the database.");
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = name_action;
    }

}