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

public class IsDorkyAWolfDAO extends AbstractDAO<Boolean> {

    private static final String STATEMENT = "SELECT player_username FROM action WHERE game_id = ? AND type_of_action = 'point'";
    private final int gameId;
    private final DataSource ds;

    private Map<String, String> wolfMap;

    public IsDorkyAWolfDAO(final Connection con, DataSource ds, int gameId) {
        super(con);
        this.gameId = gameId;

        this.ds = ds;
        this.wolfMap = new HashMap<>();
    }

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
                playersList.add(rs.getString("player_username"));
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
