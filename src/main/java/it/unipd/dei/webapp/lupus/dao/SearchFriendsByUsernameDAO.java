package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Friend;
import it.unipd.dei.webapp.lupus.resource.Is_Friend_With;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SearchFriendsByUsernameDAO extends AbstractDAO<List<Friend>> {

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

        final List<Friend> friendList = new ArrayList<>();

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                //Friend friend = new Friend(rs.getString("friend_username"), rs.getDate("date"));
                friendList.add(new Friend(rs.getString("friend_username"), rs.getDate("date")));
                //LOGGER.info("Friend found: " + friend.getUsername() + " " + friend.getFriendshipDate().toString());
                LOGGER.info("Friend found: " + rs.getString("friend_username") + " " + rs.getDate("date"));
                for(Friend f : friendList)
                    LOGGER.info(f.getUsername());
            }
            if (friendList.isEmpty()){
                LOGGER.info("No friend found " + user);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        for(Friend f : friendList)
            LOGGER.info(f.getUsername());
        this.outputParam = friendList;
    }
}
