package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Objects;

public class IsJesterVotedOut extends AbstractDAO<Boolean> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT_JESTER_DEAD = "SELECT * FROM plays_as_in WHERE game_id = ? and role = ? and phase_of_death = ?";

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT_ROLE_KILLED_BY_SAM = "SELECT role FROM plays_as_in JOIN public.action a on " +
            "(plays_as_in.game_id = a.game_id AND plays_as_in.player_username = a.target) " +
            "WHERE plays_as_in.game_id = ? and type_of_action = ?";

    /**
     * To connect to the database
     */
    private final DataSource ds;

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new GetGameByGameIdDAO for search if the Jester was voted out by the votes.
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game to retrieve.
     */
    public IsJesterVotedOut(final Connection con, final DataSource ds, int gameID) {
        super(con);
        this.ds = ds;
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = false;

        try {
            pstmt = con.prepareStatement(STATEMENT_JESTER_DEAD);

            pstmt.setInt(1, gameID);
            pstmt.setString(2, GameRoleAction.JESTER.getName());
            pstmt.setInt(3, GamePhase.DAY.getId());

            rs = pstmt.executeQuery();

            if(rs.next()){ // jester is dead during the day
                pstmt = ds.getConnection().prepareStatement(STATEMENT_ROLE_KILLED_BY_SAM);

                pstmt.setInt(1, gameID);
                pstmt.setString(2, GameRoleAction.SAM.getAction());

                rs = pstmt.executeQuery();

                if(rs.next())
                    this.outputParam = !rs.getString("role").equals(GameRoleAction.JESTER.getName());
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
        }
    }
}