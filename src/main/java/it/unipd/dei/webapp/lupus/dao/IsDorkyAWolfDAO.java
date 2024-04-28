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
    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND type_of_action = 'point'";

    /**
     * The ID of the game to check.
     */
    private final int gameId;

    /**
     * The data source used for obtaining connections.
     */
    private final DataSource ds;

    /**
     * A map containing player names as keys and their corresponding roles as values.
     */
    private Map<String, String> wolfMap;

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
        this.wolfMap = new HashMap<>();
    }

    /**
     * Executes the query to determine whether the player named "Dorky" is a wolf in the specified game.
     *
     * @throws Exception
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<String> playersList = new ArrayList<>();
        boolean result = false;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                playersList.add(rs.getString("target"));
            }

            wolfMap = new SelectPlayersAndRolesByGameIdDAO(ds.getConnection(), gameId).access().getOutputParam();

            for (String player : playersList) {
                if (wolfMap.get(player).equals(GameRoleAction.WOLF.getName())
                        || wolfMap.get(player).equals(GameRoleAction.GIUDA.getName())
                        || wolfMap.get(player).equals(GameRoleAction.EXPLORER.getName())
                        || wolfMap.get(player).equals(GameRoleAction.BERSERKER.getName())
                        || wolfMap.get(player).equals(GameRoleAction.PUPPY.getName())) {

                    result = true;

                }
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = result;
    }
}
