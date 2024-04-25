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
    private final String playerUsername;
    private final String role;

    public GetGameInfoDAO(final Connection con, final int gameID, boolean isMaster, String playerUsername, String role){
        super(con);
        this.gameID = gameID;
        this.URIisMaster = isMaster;
        this.playerUsername = playerUsername;
        this.role = role;

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
            // otherwise I send the list of players without role, but only the role of the player who's calling
            // the request URI
            // Only exception: If the user's role is "wolf", he can see all the other players role if they are "wolf" as well
            else
            {
                while (rs.next())
                {
                    String playerRole = rs.getString("role");
                    String sentUsername = rs.getString("player_username");
                    if(! (this.playerUsername.equals(sentUsername) || (this.role.equals("wolf") && playerRole.equals("wolf"))))
                        playerRole = "";

                    join.add(new PlaysAsIn(
                            sentUsername,
                            rs.getInt("game_id"),
                            playerRole,
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