package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.utils.GameRoleAction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class PlayerWithPlagueInGameDAO extends AbstractDAO<String> {
    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT target FROM action WHERE game_id = ? AND round = ? AND type_of_action = ?";
    /**
     * The private ID of the game.
     */
    private final int gameID;

    /**
     * The round of the game.
     */
    private final int round;

    public PlayerWithPlagueInGameDAO(Connection con, int gameID, int round) {
        super(con);
        this.gameID = gameID;
        this.round = round;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        this.outputParam = null;
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameID);
            pstmt.setInt(2, round);
            pstmt.setString(3, GameRoleAction.PLAGUE_SPREADER.getAction());
            rs = pstmt.executeQuery();
            if (rs.next()) {
                this.outputParam = rs.getString("target");
                LOGGER.info("Player with player with the plague: " + this.outputParam);
            }
        } finally {
            if (rs != null)
                rs.close();
            if (pstmt != null)
                pstmt.close();
        }
    }
}
