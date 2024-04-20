package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Searches for a role by its name in the database.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class SearchRoleByNameDAO extends AbstractDAO<Role> {

    /**
     * The SQL statement to be executed
     */
    private final static String STATEMENT = "SELECT * FROM role WHERE LOWER(name) = lower(?)";

    /**
     * The name of the role.
     */
    private final String name;

    /**
     * Creates a new object for search a role by the name.
     *
     * @param con  the connection to the database.
     * @param type the name of the role to search for.
     */
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
