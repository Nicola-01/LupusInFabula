package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Is_Friend_With;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SearchFriendsByUsernameDAO extends AbstractDAO<List<Is_Friend_With>> {

    private static final String STATEMENT = "SELECT * FROM Is_Friend_With WHERE LOWER(player_username) = LOWER(?)";

    private final String user;

    public SearchFriendsByUsernameDAO(final Connection con, final String user) {
        super(con);
        this.user = user;
    }

    @Override
    public final void doAccess() throws SQLException{
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        List<Is_Friend_With> friendship = new ArrayList<>();

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Is_Friend_With friend = new Is_Friend_With(rs.getString("player_username"),
                        rs.getString("friend_username"), rs.getDate("date"));
                friendship.add(friend);
                LOGGER.info("Friend found: " + rs.getString("friend_username") + " " + rs.getDate("date"));
            }
            if (friendship.isEmpty()){
                LOGGER.info("No record found for player " + user);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        this.outputParam = friendship;
    }
}
