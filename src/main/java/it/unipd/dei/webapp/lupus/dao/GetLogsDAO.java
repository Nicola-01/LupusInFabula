package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetLogsDAO extends AbstractDAO<List<PlaysJoinGame>> {
    //private static final String STATEMENT = "SELECT * FROM GAME INNER JOIN PLAYS_AS_IN ON LOWER(GAME.id) = LOWER(PLAYS_AS_IN.id) WHERE LOWER(PLAYS_AS_IN.username) = LOWER(?)";
    private static final String STATEMENT = "SELECT game_id, start, game_duration, number_of_rounds, name, with_who_wins, who_wins" +
            "FROM plays_as_in" +
            "JOIN public.game g" +
            "on g.id = plays_as_in.game_id join" +
            "public.role r" +
            "on plays_as_in.role_id = r.id" +
            "        WHERE lower(player_username) = lower(?)";
    private final String username;

    public GetLogsDAO(final Connection con, final String username) {
        super(con);
        this.username = username;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<PlaysJoinGame> join = new ArrayList<PlaysJoinGame>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, username);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                join.add(new PlaysJoinGame(
                        rs.getInt("game_id"),
                        rs.getTimestamp("start"),
                        rs.getTime("game_duration"),
                        rs.getInt("number_of_rounds"),
                        rs.getString("name"),
                        rs.getInt("with_who_wins"),
                        rs.getInt("who_wins")
                ));
            } else {
                throw new RuntimeException("username specified is not present in the database.");
            }
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
