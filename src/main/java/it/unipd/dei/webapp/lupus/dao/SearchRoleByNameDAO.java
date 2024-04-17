package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SearchRoleByNameDAO extends AbstractDAO<Role> {

    private final static String STATEMENT = "SELECT * FROM role WHERE LOWER(name) = lower(?)";
    private final String name;

    public SearchRoleByNameDAO(final Connection con, final String type) {
        super(con);
        this.name = type;
    }

    @Override
    public final void doAccess() throws SQLException {

        PreparedStatement ps = null;
        ResultSet rs = null;
        Role role = null;

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setString(1, name);
            rs = ps.executeQuery();

            while (rs.next()) {
                role = new Role(rs.getInt("id"), rs.getString("name"), rs.getInt("type"),
                        rs.getInt("with_who_wins"), rs.getInt("max_number"), rs.getString("description"));
            }

            LOGGER.info("Role %s found", name);
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (ps != null) {
                ps.close();
            }
        }
        this.outputParam = role;
    }

}
