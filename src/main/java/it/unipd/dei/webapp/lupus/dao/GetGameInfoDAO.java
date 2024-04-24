package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetGameInfoDAO extends AbstractDAO<List<PlaysAsIn>> {
    private static final String STATEMENT = "SELECT * FROM plays_as_in WHERE plays_as_in.game_id = ?";

    private final int gameID;
    private final boolean URIisMaster;

    public GetGameInfoDAO(final Connection con, final int gameID, boolean isMaster){
        super(con);
        this.gameID = gameID;
        this.URIisMaster = isMaster;
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

            // if the request uri is /game/status/{gameID}/master
            // I can send all the info about the game (username and roles)
            if(URIisMaster)
            {
                while (rs.next())
                {
                    join.add(new PlaysAsIn(
                            rs.getString("player_username"),
                            rs.getInt("game_id"),
                            rs.getString("role"),
                            rs.getInt("round_of_death"),
                            rs.getInt("phase_of_death"),
                            rs.getFloat("duration_of_life")
                    ));
                }
            }
            // otherwise I send the list of players but only the role of the player who's calling
            // the request URI
            else
            {
                while (rs.next())
                {
                    join.add(new PlaysAsIn(
                            rs.getString("player_username"),
                            rs.getInt("game_id"),
                            rs.getString("role"),
                            rs.getInt("round_of_death"),
                            rs.getInt("phase_of_death"),
                            rs.getFloat("duration_of_life")
                    ));
                }
            }
            String infos = "Game "+gameID+" contains " + join.size() + " players";
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