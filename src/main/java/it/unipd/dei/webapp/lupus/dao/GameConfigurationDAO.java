package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Role;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for retrieving the game configuration.
 * This DAO is responsible for querying the database to get the roles
 * and their details for a specific game, excluding the master role.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameConfigurationDAO extends AbstractDAO<List<Role>> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT pai.role, r.type, r.with_who_wins, r.description, count(pai.role) " +
            "FROM plays_as_in pai join role r on r.name = pai.role " +
            "WHERE game_id = ? and role != ? " +
            "GROUP BY pai.role, r.type, r.with_who_wins, r.description " +
            "ORDER BY r.type, pai.role";

    /**
     * The type of roles to be retrieved.
     */
    private final int gameID;

    /**
     * Creates a new object to return all roles.
     *
     * @param con the connection to the database.
     */
    public GameConfigurationDAO(final Connection con, final int gameID) {
        super(con);
        this.gameID = gameID;
    }

    @Override
    public final void doAccess() throws Exception {
        PreparedStatement ps = null;
        ResultSet rs = null;
        final List<Role> roles = new ArrayList<Role>();

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setInt(1, gameID);
            ps.setString(2, GameRoleAction.MASTER.getName());

            rs = ps.executeQuery();

            while (rs.next()) {
                roles.add(new Role(rs.getString("role"), rs.getInt("type"), rs.getInt("with_who_wins"),
                        rs.getInt("count"), rs.getString("description")));
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
