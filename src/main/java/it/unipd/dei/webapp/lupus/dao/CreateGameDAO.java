package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Player;

import java.sql.*;

public class CreateGameDAO extends AbstractDAO<Integer> {
//    private static final String STATEMENT = "INSERT INTO game (start) VALUES (?)";
    private static final String STATEMENT = "INSERT INTO game (start) VALUES (NOW())";

//    private final Timestamp start;
    private ResultSet generatedKeys;

    public CreateGameDAO(final Connection con) { //, final Timestamp start) {
        super(con);
//
//        if (start == null) {
//            LOGGER.error("The timestamp cannot be null.");
//            throw new NullPointerException("The timestamp  cannot be null.");
//        }
//        this.start = start;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT, Statement.RETURN_GENERATED_KEYS);

            pstmt.execute();
            generatedKeys = pstmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                this.outputParam = generatedKeys.getInt(1);
            }
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
