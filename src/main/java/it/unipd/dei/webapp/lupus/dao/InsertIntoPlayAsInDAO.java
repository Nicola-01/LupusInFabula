package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.PlaysAsIn;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class InsertIntoPlayAsInDAO extends AbstractDAO {

    private final static String STATEMENT = "INSERT INTO PLAYS_AS_IN VALUES(?, ?, ?)";
    private final PlaysAsIn playsAsIn;

    public InsertIntoPlayAsInDAO(final Connection con, final PlaysAsIn playsAsIn) {
        super(con);
        this.playsAsIn = playsAsIn;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, playsAsIn.getPlayerUsername());
            pstmt.setInt(2, playsAsIn.getGameId());
            pstmt.setInt(3, playsAsIn.getRoleId());

            pstmt.execute();
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            con.close();
        }
    }
}
