package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO class to retrieve logs of a specific player.
 * Retrieves logs of games played by the specified player from the database.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetLogsDAO extends AbstractDAO<List<PlaysJoinGame>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT game_id, start, game_duration, round_of_death AS number_of_rounds_alive, name, with_who_wins, who_wins " +
            "FROM plays_as_in " +
            "JOIN public.game g " +
            "on g.id = plays_as_in.game_id join " +
            "public.role r " +
            "on plays_as_in.role = r.name " +
            "WHERE lower(player_username) = lower(?)";

    /**
     * The username of the player whose logs are to be retrieved.
     */
    private final String username;

    /**
     * Creates a new object for retrieving logs of a player.
     *
     * @param con      the connection to the database.
     * @param username the username of the player.
     */
    public GetLogsDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<PlaysJoinGame> join = new ArrayList<>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);

            rs = pstmt.executeQuery();
            while (rs.next()) {
                join.add(new PlaysJoinGame(
                        rs.getInt("game_id"),
                        rs.getTimestamp("start"),
                        rs.getTime("game_duration"),
                        rs.getInt("number_of_rounds_alive"),
                        rs.getString("name"),
                        rs.getInt("with_who_wins"),
                        rs.getInt("who_wins")
                ));
            }
            LOGGER.info("Logs of player %s contains %d games", username, join.size());

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
