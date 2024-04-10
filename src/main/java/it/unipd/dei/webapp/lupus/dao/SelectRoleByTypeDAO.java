package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SelectRoleByTypeDAO extends AbstractDAO<List<Role>> {

    private final static String STATEMENT = "SELECT * FROM role WHERE type = ?";
    private final int type;

    public SelectRoleByTypeDAO(final Connection con, final int type) {
        super(con);
        this.type = type;
    }

    @Override
    public final void doAccess() throws SQLException {

        PreparedStatement ps = null;
        ResultSet rs = null;
        final List<Role> roles = new ArrayList<Role>();

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setInt(1, type);
            rs = ps.executeQuery();

            while (rs.next()) {
                roles.add(new Role(rs.getString("name"), rs.getInt("type"),
                        rs.getString("with_who_wins"), rs.getString("description")));
            }

            LOGGER.info("Role(s) with type = %s found", type);
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
