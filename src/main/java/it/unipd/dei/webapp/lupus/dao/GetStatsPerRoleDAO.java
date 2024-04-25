package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.StatsRole;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO class to retrieve statistics per role for a specific player.
 * Retrieves statistics of roles played by the specified player from the database,
 * including the number of games played as each role and the number of wins as each role.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetStatsPerRoleDAO extends AbstractDAO<List<StatsRole>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT name, COUNT(*) AS games_played_as, " +
            "COUNT(*) FILTER (WHERE with_who_wins = who_wins) AS wins " +
            "FROM plays_as_in " +
            "JOIN public.game g ON g.id = plays_as_in.game_id " +
            "JOIN public.role r ON plays_as_in.role = r.name " +
            "WHERE lower(player_username) = lower(?) " +
            "GROUP BY name";

    /**
     * The username of the player whose statistics are to be retrieved.
     */
    private final String username;

    /**
     * Creates a new object for retrieving statistics per role of a player.
     *
     * @param con      the connection to the database.
     * @param username the username of the player.
     */
    public GetStatsPerRoleDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<StatsRole> statsRoles = new ArrayList<>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);

            rs = pstmt.executeQuery();
            while (rs.next()) {
                statsRoles.add(new StatsRole(
                        rs.getString("name"),
                        rs.getInt("games_played_as"),
                        rs.getInt("wins")
                ));
            }
            LOGGER.info("Stats of player %s contains %d roles.", username, statsRoles.size());

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = statsRoles;
    }
}
