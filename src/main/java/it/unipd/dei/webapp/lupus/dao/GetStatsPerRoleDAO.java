package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.StatsRole;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetStatsPerRoleDAO extends  AbstractDAO<List<StatsRole>>{
    private static final String STATEMENT = "SELECT name, COUNT(*) AS games_played_as, COUNT(*) FILTER (WHERE with_who_wins = who_wins) AS wins FROM plays_as_in JOIN public.game g on g.id = plays_as_in.game_id join public.role r on plays_as_in.role = r.name WHERE lower(player_username) = lower(?) GROUP BY name";
    private final String username;

    public GetStatsPerRoleDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<StatsRole> join = new ArrayList<>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);

            rs = pstmt.executeQuery();

            while (rs.next()) {
                join.add(new StatsRole(
                        rs.getString("name"),
                        rs.getInt("games_played_as"),
                        rs.getInt("wins")
                ));
            }
            String infos = "Roles played are " + join.size();
            LOGGER.info(infos);//join.get(i++));
            //if (!rs.next()) {
            //  throw new RuntimeException("username specified is not present in the database.");
            //}

        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = join;
    }

}
