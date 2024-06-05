package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Returns if the role of Puppy has become a Wolf
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class IsPuppyAWolfDAO extends AbstractDAO<Boolean> {

    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * FROM plays_as_in WHERE game_id = ? AND role IN (?, ?, ?, ?) and round_of_death IS NULL";

    /**
     * The data source used for obtaining connections.
     */
    private final DataSource ds;

    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructs a new IsPuppyAWolfDAO for search if the Puppy is become a wolf
     *
     * @param con    the connection to the database.
     * @param ds     the data source for obtaining connections
     * @param gameID the ID of the game.
     */
    public IsPuppyAWolfDAO(Connection con, DataSource ds, int gameID) {
        super(con);
        this.ds = ds;
        this.gameID = gameID;
    }

    /**
     * Executes the DAO operation to determine if the Puppy has become a Wolf.
     *
     * @throws SQLException if there is an error executing the SQL statement
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = false;

        try {
            pstmt = con.prepareStatement(STATEMENT);

            pstmt.setInt(1, gameID);
            pstmt.setString(2, GameRoleAction.WOLF.getName());
            pstmt.setString(3, GameRoleAction.BERSERKER.getName());
            pstmt.setString(4, GameRoleAction.DORKY.getName());
            pstmt.setString(5, GameRoleAction.EXPLORER.getName());

            rs = pstmt.executeQuery();

            int wolfAlive = 0;

            while (rs.next()) {
                if (rs.getString("role").equals(GameRoleAction.DORKY.getName())) {
                    if (new IsDorkyAWolfDAO(ds.getConnection(), ds, gameID).access().getOutputParam())
                        wolfAlive++;
                } else
                    wolfAlive++;
            }

            // If there aren't any wolves left in the wolf pack, meaning all the other wolves are dead
            // and the dorky is not a wolf, the puppy becomes a wolf.
            this.outputParam = (wolfAlive == 0);

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
