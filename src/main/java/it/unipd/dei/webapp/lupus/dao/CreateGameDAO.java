package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Role;

import java.sql.*;
import java.util.List;
import java.util.Random;

public class CreateGameDAO extends AbstractDAO<Game> {
    private static final String STATEMENT_CREATE_GAME = "INSERT INTO game (public_ID, start) VALUES (?, NOW())";
    private static final String STATEMENT_SEARCH_GAME = "SELECT * FROM game WHERE public_ID = ?";
    private static final String STATEMENT_CHECK_PUBLICID = "SELECT * FROM game WHERE public_id = ?";

    private final List<Role> roles;

    public CreateGameDAO(final Connection con, List<Role> roles) {
        super(con);
        this.roles = roles;
    }

    @Override
    protected void doAccess() throws Exception {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        String publicID = null;

        try {
            publicID = generatePublicID(roles);
            LOGGER.info("Generated public id " + publicID);

            pstmt = con.prepareStatement(STATEMENT_CREATE_GAME);
            pstmt.setString(1, publicID);
            pstmt.execute();

            pstmt = con.prepareStatement(STATEMENT_SEARCH_GAME);
            pstmt.setString(1, publicID);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                this.outputParam = new Game(rs.getInt("ID"), rs.getString("public_ID"), rs.getTime("start"));
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

    private String generatePublicID(List<Role> roles) throws SQLException {
        Random rand = new Random();
        rand.setSeed(System.currentTimeMillis());
        String randomID = null;

        PreparedStatement pstmt = null;
        ResultSet rs = null;

        do {
            int role1 = rand.nextInt(roles.size());
            int role2 = rand.nextInt(roles.size());
            int role3 = rand.nextInt(roles.size());

            // no repetition of same word
            if(role1 == role2 || role1 == role3 || role2 == role3)
                continue;

            randomID = roles.get(role1).getName() + "-" +
                    roles.get(role2).getName() + "-" +
                    roles.get(role3).getName();

            LOGGER.info(STATEMENT_CHECK_PUBLICID + ": " + randomID);

            pstmt = con.prepareStatement(STATEMENT_CHECK_PUBLICID);
            pstmt.setString(1, randomID);

            rs = pstmt.executeQuery();
        } while (rs.next());

        return randomID;
    }
}
