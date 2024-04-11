package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GetNameActionDAO extends AbstractDAO {
    private static final String STATEMENT = "SELECT name FROM type_action WHERE ID = ?";

    public GetNameActionDAO(final Connection con){
        super(con);
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        String name_action = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            int id = -1000;
            try {
                int index = STATEMENT.indexOf("=");
                String id_str = STATEMENT.substring(index+1);
                if (id_str.length() > 1) {
                    try {
                        id = Integer.parseInt(id_str);
                    } catch (NumberFormatException e) {

                    }
                } else {
                }
            } catch(Exception e){
                
            }


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