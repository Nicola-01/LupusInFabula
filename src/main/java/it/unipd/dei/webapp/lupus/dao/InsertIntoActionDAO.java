package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Action;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class InsertIntoActionDAO extends AbstractDAO{

    private static final String STATEMENT = "INSERT INTO ACTION VALUES (?, ?, ?, ?, ?, ?, ?)";
    private final Action action;

    public InsertIntoActionDAO(final Connection con, final Action action) {
        super(con);
        this.action = action;
    }

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
