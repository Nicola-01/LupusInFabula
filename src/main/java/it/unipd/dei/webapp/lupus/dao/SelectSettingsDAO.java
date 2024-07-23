package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Setting;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * SelectSettingsDAO retrieves all settings from the database.
 * It extends the AbstractDAO class which handles the connection and output parameters.
 * The settings are retrieved from the 'game_settings' table.
 *
 * @version 1.0
 * @since 1.0
 */
public class SelectSettingsDAO extends AbstractDAO<List<Setting>> {

    /**
     * The SQL statement to be executed to retrieve all settings.
     */
    private static final String STATEMENT = "SELECT * FROM game_settings";

    /**
     * Creates a new SelectSettingsDAO object to retrieve all settings.
     *
     * @param con the connection to the database.
     */
    public SelectSettingsDAO(Connection con) {
        super(con);
    }

    /**
     * Executes the SQL query to retrieve all settings from the database.
     * Populates the outputParam with a list of Setting objects.
     *
     * @throws Exception if an error occurs while accessing the database.
     */
    @Override
    protected void doAccess() throws Exception {
        PreparedStatement ps = null;
        ResultSet rs = null;
        final List<Setting> settings = new ArrayList<Setting>();

        try {
            ps = con.prepareStatement(STATEMENT);
            rs = ps.executeQuery();

            while (rs.next()) {
                settings.add(new Setting(rs.getString("setting_name"), rs.getString("description")));
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (ps != null) {
                ps.close();
            }
        }
        this.outputParam = settings;
    }
}