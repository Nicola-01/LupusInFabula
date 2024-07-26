package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Setting;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * Search the list of settings in a game using the private gameID, returns such list
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GetGameSettingsDAO extends AbstractDAO<List<Setting>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT * FROM settings_in_game WHERE game_id = ?";

    /**
     * The private ID of the game.
     */
    private final int gameID;

    /**
     * Creates a new DAO object.
     *
     * @param con    the connection to be used for accessing the database.
     * @param gameID The private gameID used to find the game.
     */
    public GetGameSettingsDAO(Connection con, int gameID) {
        super(con);
        this.gameID = gameID;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<Setting> settings = new ArrayList<>();
        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setInt(1, gameID);
            rs = pstmt.executeQuery();
            while (rs.next())
                settings.add(new Setting(rs.getString("setting"), rs.getBoolean("enable")));
        } finally {
            if (rs != null)
                rs.close();
            if (pstmt != null)
                pstmt.close();
        }
        this.outputParam = settings;

    }
}
