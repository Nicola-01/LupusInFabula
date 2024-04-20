package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetGameInfoDAO extends AbstractDAO<List<PlaysAsIn>> {
    private static final String STATEMENT = "SELECT plays_as_in.*, role.name FROM plays_as_in JOIN role ON plays_as_in.role_id = role.id WHERE plays_as_in.game_id = ?";

    private final int gameID;

    public GetGameInfoDAO(final Connection con, final int gameID){
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        final List<PlaysAsIn> join = new ArrayList<PlaysAsIn>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameID);

            rs = pstmt.executeQuery();

            while (rs.next()) {
                join.add(new PlaysAsIn(
                        rs.getString("player_username"),
                        rs.getInt("game_id"),
                        rs.getInt("role_id"),
                        rs.getInt("round_of_death"),
                        rs.getInt("phase_of_death"),
                        rs.getFloat("duration_of_life"),
                        rs.getString("name")
                ));
            }
            String infos = "logs contains " + join.size() + " plays_as_in";
            LOGGER.info(infos);
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