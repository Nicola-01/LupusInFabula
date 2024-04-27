package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Action;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Inserts a new Action record into the database, storing information such as the game ID, player, round, phase, subphase, type of action, and target.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class InsertIntoActionDAO extends AbstractDAO{

    /**
     * The SQL statement to insert an Action into the database.
     */
    private static final String STATEMENT = "INSERT INTO ACTION VALUES (?, ?, ?, ?, ?, ?, ?)";

    /**
     * The Action object to be inserted into the database.
     */
    private final Action action;

    /**
     * Constructs a new InsertIntoActionDAO with the specified database connection and Action object.
     *
     * @param con    the database connection
     * @param action the Action object to be inserted
     */
    public InsertIntoActionDAO(final Connection con, final Action action) {
        super(con);
        this.action = action;
    }

    /**
     * Inserts the Action object into the database.
     *
     * @throws Exception if an error occurs during database access
     */
    @Override
    protected void doAccess() throws Exception {

        PreparedStatement pstmt = null;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, action.getGameId());
            pstmt.setString(2, action.getPlayer());
            pstmt.setInt(3, action.getRound());
            pstmt.setInt(4, action.getPhase());
            pstmt.setInt(5, action.getSubphase());
            //pstmt.setString(6, action.getDescription());
            pstmt.setString(6, action.getTypeAction());
            pstmt.setString(7, action.getTarget());
            LOGGER.info("Insert into action");
            pstmt.execute();
            LOGGER.info("Insert into action ok");

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (con != null) {
                con.close();
            }
        }

    }
}
