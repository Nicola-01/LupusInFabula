package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SelectRoleDAO extends AbstractDAO<List<Role>>{

    private static final String STATEMENT = "SELECT * FROM role";

    public SelectRoleDAO(final Connection con) {
        super(con);
    }

    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        final List<Role> roles = new ArrayList<Role>();

        try {
            ps = con.prepareStatement(STATEMENT);
            rs = ps.executeQuery();

            while (rs.next()) {
                roles.add(new Role(rs.getString("name"), rs.getString("with_who_wins"),
                        rs.getString("type"), rs.getString("description")));
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (ps != null) {
                ps.close();
            }
        }
        this.outputParam = roles;
    }
}
