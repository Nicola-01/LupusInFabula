package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Returns if the role of Dorky has become a Wolf pointing at an evil role.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class IsDorkyAWolfDAO extends AbstractDAO<Boolean> {

    /**
     * The SQL statement for selecting targets of "point" action in a game.
     */
    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND type_of_action = ?";

    /**
     * The ID of the game to check.
     */
    private final int gameId;

    /**
     * The data source used for obtaining connections.
     */
    private final DataSource ds;

    /**
     * Constructs a new IsDorkyAWolfDAO with the specified database connection, data source, and game ID.
     *
     * @param con    the database connection
     * @param ds     the data source for obtaining connections
     * @param gameId the ID of the game to check
     */
    public IsDorkyAWolfDAO(final Connection con, DataSource ds, int gameId) {
        super(con);
        this.gameId = gameId;

        this.ds = ds;
    }

    /**
     * Executes the query to determine whether the player named "Dorky" is a wolf in the specified game.
     *
     * @throws Exception if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<String> targetedPlayers = new ArrayList<>();

        this.outputParam = false;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            pstmt.setString(2, GameRoleAction.DORKY.getAction());
            rs = pstmt.executeQuery();

            while (rs.next()) {
                targetedPlayers.add(rs.getString("target"));
            }

            Map<String, String> playerRole = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameId).access().getOutputParam();
            Map<String, Boolean> deadPlayers = new GetDeadPlayersByGameIdDAO(ds.getConnection(), gameId).access().getOutputParam();

            int wolfAlive = 0;

            // check if the dorky pointed a member of wolf pack
            for (String player : targetedPlayers) {
                if (playerRole.get(player).equals(GameRoleAction.WOLF.getName())
                        || playerRole.get(player).equals(GameRoleAction.PUPPY.getName())
                        || playerRole.get(player).equals(GameRoleAction.EXPLORER.getName())
                        || playerRole.get(player).equals(GameRoleAction.BERSERKER.getName())) {
                    this.outputParam = true;
                    return;
                }
            }

            // get the number of live wolves
            for (Map.Entry<String, String> pr : playerRole.entrySet()) {
                String player = pr.getKey();
                if (!deadPlayers.get(player) && (playerRole.get(player).equals(GameRoleAction.WOLF.getName())
                        || playerRole.get(player).equals(GameRoleAction.PUPPY.getName())
                        || playerRole.get(player).equals(GameRoleAction.EXPLORER.getName())
                        || playerRole.get(player).equals(GameRoleAction.BERSERKER.getName()))) {
                    wolfAlive++;
                }
            }

            // if all the wolves are dead the Dorky is a wolf
            this.outputParam = (wolfAlive == 0);

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }

    }
}
