package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Action;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.GameAction;
import it.unipd.dei.webapp.lupus.resource.LogContext;

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
public class GetActionByIdGameDAO extends AbstractDAO<ArrayList<Action>>
{
    private static final String STATEMENT = "SELECT * "                                                     +
                                            "FROM  action a "+
                                            "WHERE a.game_id = ? "                                          +
                                            "ORDER BY a.round, a.phase, a.subphase";

    private final int idPart;

    /**
     * Constructor for the class
     *
     * @param  con  connection with the database
     * @param  idPart numeric identifier for the game
     */
    public GetActionByIdGameDAO(final Connection con, final int idPart)
    {
        super(con);
        this.idPart = idPart;
    }

    /**
     * function to exec the query on db
     */
    @Override
    public final void doAccess() throws SQLException
    {
        PreparedStatement query = null;
        ResultSet rs = null;
        ArrayList<Action> r  = new ArrayList<>();

        try
        {
            query = con.prepareStatement(STATEMENT);
            query.setInt(1, idPart);

            rs = query.executeQuery();

            while (rs.next()) r.add(new Action(rs));
        }
        finally
        {
            if (query != null) query.close();
            if (rs != null)    rs.close();
        }
        this.outputParam = r;
    }
}