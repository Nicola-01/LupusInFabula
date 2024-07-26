package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Setting;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Add the settings of a game to the database
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class AddGameSettingDAO extends AbstractDAO {
    /**
     * The SQL statement to be executed for inserting a new token.
     */
    private static final String STATEMENT = "INSERT INTO settings_in_game VALUES (?,?,?)";

    /**
     * The private ID of the game.
     */
    private final int gameID;

    /**
     * The setting to add
     */
    private final Setting setting;

    /**
     * Creates a new object to add a setting.
     *
     * @param gameID  the private gameID used to find the game.
     * @param con     the connection to the database.
     * @param setting the setting to be added.
     */
    public AddGameSettingDAO(final Connection con, int gameID, Setting setting) {
        super(con);
        this.gameID = gameID;
        this.setting = setting;
    }

    @Override
    protected void doAccess() throws SQLException {
        PreparedStatement ps = null;

        try {
            ps = con.prepareStatement(STATEMENT);
            ps.setInt(1, gameID);
            ps.setString(2, setting.getSettingName());
            ps.setBoolean(3, setting.isEnable());

            ps.executeUpdate();
        } finally {
            if (ps != null)
                ps.close();

            con.close();
        }
    }
}
