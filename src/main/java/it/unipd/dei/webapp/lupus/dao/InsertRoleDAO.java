package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertRoleDAO extends AbstractDAO {

    private static final String STATEMENT = "INSERT INTO role (name, type, with_who_wins, description) VALUES (?, ?, ?, ?)";
    private final Role role;

    public InsertRoleDAO(final Connection con, final Role role) {
        super(con);

        if (role == null) {
            LOGGER.error("The role cannot be null");
            throw new IllegalArgumentException("Role cannot be null");
        }

        this.role = role;
    }

    @Override
    protected void doAccess() throws SQLException {

        try (PreparedStatement ps = con.prepareStatement(STATEMENT)) {
            ps.setString(1, role.getName());
            ps.setString(2, role.getType());
            ps.setString(3, role.getWith_who_wins());
            ps.setString(4, role.getDescription());
            ps.execute();
        } finally {
            con.close();
        }
    }
}