package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;


/**
 * Class to get all the action associate to a game join with the name of the action and order by round, phase and subphase
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetActionByIdGameDAO extends AbstractDAO<ArrayList<Action>> {
    /**
     * The SQL statement to be executed
     */
    private static final String STATEMENT = "SELECT * " +
            "FROM  action a " +
            "WHERE a.game_id = ? and a.blocked = false " +
            "ORDER BY a.round ASC, a.phase DESC, a.subphase ASC";
    /**
     * The ID of the game to retrieve
     */
    private final int gameID;

    /**
     * Constructor for the class
     *
     * @param con    the connection to the database.
     * @param gameID the ID of the game to retrieve.
     */
    public GetActionByIdGameDAO(final Connection con, final int gameID) {
        super(con);
        this.gameID = gameID;
    }

    /**
     * Executes the DAO operation to retrieve actions associated with the specified game ID.
     *
     * @throws SQLException if there is an error executing the SQL statement
     */
    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement query = null;
        ResultSet rs = null;
        ArrayList<Action> r = new ArrayList<>();

        try {
            query = con.prepareStatement(STATEMENT);
            query.setInt(1, gameID);

            rs = query.executeQuery();

            while (rs.next()) r.add(new Action(rs));
        } finally {
            if (query != null) query.close();
            if (rs != null) rs.close();
        }
        LOGGER.info(String.format("Found for game with id %d, %d logs.", gameID, r.size()));
        this.outputParam = r;
    }
}