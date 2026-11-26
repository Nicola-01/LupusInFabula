package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GamePhase;
import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

/**
 * Determines whether the Jester role was voted out but not killed by Sam.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class IsJesterVotedOutDAO extends AbstractDAO<Boolean> {

    /**
     * SQL statement to check if the Jester role was voted out and died.
     */
    private static final String STATEMENT_JESTER_DEAD = "SELECT * FROM plays_as_in WHERE game_id = ? and role = ? and phase_of_death = ?";

    /**
     * SQL statement to check if a role was killed by Sam.
     */
    private static final String STATEMENT_ROLE_KILLED_BY_SAM = "SELECT pai.role FROM plays_as_in pai JOIN public.action a on " +
            "(pai.game_id = a.game_id AND pai.player_id = a.target_id) " +
            "WHERE pai.game_id = ? and a.type_of_action = ?";


    /**
     * SQL statement to check if a role was killed by Plague Spreader.
     */
    private static final String STATEMENT_ROLE_KILLED_BY_PLAGUE_SPREADER = "SELECT pai.role FROM plays_as_in pai JOIN public.action a on " +
            "(pai.game_id = a.game_id AND pai.player_id = a.target_id) " +
            "WHERE pai.game_id = ? and a.type_of_action = ?";
    /**
     * To connect to the database
     */
    private final DataSource ds;

    /**
     * The ID of the game to retrieve
     */
    private final UUID gameID;

    /**
     * Constructs a new IsJesterVotedOut to determine if the Jester was voted out during the day.
     *
     * @param con    the connection to the database.
     * @param ds     the data source for obtaining connections
     * @param gameID the ID of the game to retrieve.
     */
    public IsJesterVotedOutDAO(final Connection con, final DataSource ds, UUID gameID) {
        super(con);
        this.ds = ds;
        this.gameID = gameID;
    }

    /**
     * Executes the DAO operation to determine if the Jester was voted out but not killed by Sam.
     *
     * @throws Exception if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = false;

        try {
            pstmt = con.prepareStatement(STATEMENT_JESTER_DEAD);

            pstmt.setObject(1, gameID);
            pstmt.setString(2, GameRoleAction.JESTER.getName());
            pstmt.setInt(3, GamePhase.DAY.getId());

            rs = pstmt.executeQuery();

            if(rs.next()){ // jester is dead during the day
                pstmt = ds.getConnection().prepareStatement(STATEMENT_ROLE_KILLED_BY_SAM);

                pstmt.setObject(1, gameID);
                pstmt.setString(2, GameRoleAction.SAM.getAction());

                rs = pstmt.executeQuery();

                if(rs.next())
                    this.outputParam = !rs.getString("role").equals(GameRoleAction.JESTER.getName());
                else {
                    pstmt = ds.getConnection().prepareStatement(STATEMENT_ROLE_KILLED_BY_PLAGUE_SPREADER);

                    pstmt.setObject(1, gameID);
                    pstmt.setString(2, GameRoleAction.PLAGUE_SPREADER.getAction());

                    rs = pstmt.executeQuery();

                    this.outputParam = true;

                    while (rs.next())
                        if(rs.getString("role").equals(GameRoleAction.JESTER.getName())) {
                            this.outputParam = false;
                            break;
                        }
                }

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
