package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Role;
import it.unipd.dei.webapp.lupus.utils.GameRole;

import javax.sql.DataSource;
import java.sql.*;
import java.util.List;
import java.util.Objects;
import java.util.Random;

/**
 * Create a new game into the database
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class CreateGameDAO extends AbstractDAO<Game> {
    /**
     * SQL statement for creating a new game record in the database.
     */
    private static final String STATEMENT_CREATE_GAME = "INSERT INTO game (public_ID, start) VALUES (?, NOW())";

    /**
     * SQL statement for searching for a game record in the database by its public ID.
     */
    private static final String STATEMENT_SEARCH_GAME = "SELECT * FROM game WHERE public_ID = ?";

    /**
     * List of all roles used to create the new public gameID, i.e., a combination of three roles.
     */
    private final DataSource ds;

    /**
     * Constructs a new CreateGameDAO for create a new game.
     *
     * @param con the connection to the database.
     * @param ds  the connection pool to the database.
     */
    public CreateGameDAO(final Connection con, DataSource ds) {
        super(con);
        this.ds = ds;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        String publicID = null;

        try {
            List<Role> roles = new SelectRoleDAO(ds.getConnection()).access().getOutputParam();
            roles.removeIf(role -> Objects.equals(role.getName(), GameRole.MASTER.getName()));
            publicID = generatePublicID(roles);

            pstmt = con.prepareStatement(STATEMENT_CREATE_GAME);
            pstmt.setString(1, publicID);
            pstmt.execute();

            pstmt = con.prepareStatement(STATEMENT_SEARCH_GAME);
            pstmt.setString(1, publicID);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                this.outputParam = new Game(rs.getInt("ID"), rs.getString("public_ID"), rs.getDate("start"));
            }
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
    }

    /**
     * Generates a unique public gameID using a combination of three randomly selected roles.
     *
     * @param roles A list of roles to use for generating the public game ID.
     * @return The generated unique public game ID.
     * @throws SQLException If a SQL exception occurs.
     */
    private String generatePublicID(List<Role> roles) throws SQLException {
        // Initialize random number generator
        Random rand = new Random();
        rand.setSeed(System.currentTimeMillis());

        String randomID = null;

        boolean repeat = true;

        // Loop until a unique public game ID is generated
        do {
            // Generate random indices for three roles
            int role1 = rand.nextInt(roles.size());
            int role2 = rand.nextInt(roles.size());
            int role3 = rand.nextInt(roles.size());

            // Ensure no repetition of the same role
            if (role1 == role2 || role1 == role3 || role2 == role3) continue;

            // Concatenate role names to form the public game ID
            randomID = roles.get(role1).getName() + "-" +
                    roles.get(role2).getName() + "-" +
                    roles.get(role3).getName();

            // Remove spaces from the role names, if any
            randomID = randomID.replaceAll(" ", "");

            repeat = (new GetGameIdFormPublicGameIdDAO(ds.getConnection(), randomID).access().getOutputParam() != -1);

        } while (repeat);

        return randomID;
    }
}
