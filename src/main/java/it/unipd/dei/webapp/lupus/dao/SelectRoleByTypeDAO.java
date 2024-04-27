package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Retrieves roles based on their type.
 * The retrieved roles are encapsulated as Role objects and stored in a list.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SelectRoleByTypeDAO extends AbstractDAO<List<Role>> {

    /**
     * The SQL statement to select roles by type.
     */
    private final static String STATEMENT = "SELECT * FROM role WHERE type = ?";

    /**
     * The type of roles to be retrieved.
     */
    private final int type;

    /**
     * Constructs a new SelectRoleByTypeDAO with the specified database connection and role type.
     *
     * @param con  the database connection
     * @param type the type of roles to be retrieved
     */
    public SelectRoleByTypeDAO(final Connection con, final int type) {
        super(con);
        this.type = type;
    }

    /**
     * Retrieves roles of the specified type from the database.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    public final void doAccess() throws Exception {

        PreparedStatement ps = null;
        ResultSet rs = null;
        final List<Role> roles = new ArrayList<Role>();

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setInt(1, type);
            rs = ps.executeQuery();

            while (rs.next()) {
                roles.add(new Role(rs.getString("name"), rs.getInt("type"), rs.getInt("with_who_wins"),
                        rs.getInt("max_number"), rs.getString("description")));
            }
            //LOGGER.info("Role(s) with type = %s found", type);
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
