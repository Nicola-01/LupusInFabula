package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Friend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO (Data Access Object) for retrieving a list of friends for a given user from the database.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class ListFriendsDAO extends AbstractDAO<List<Friend>> {

    /**
     * The SQL statement to be executed.
     */
    private static final String STATEMENT = "SELECT * FROM IS_FRIEND_WITH WHERE LOWER(player_username) = LOWER(?)";

    /**
     * The username of the player
     */
    private final String user;

    /**
     * Constructs a new ListFriendsDAO with the given database connection and user.
     *
     * @param con  the database connection
     * @param user the username of the user whose friends are to be retrieved
     */
    public ListFriendsDAO(final Connection con, final String user) {
        super(con);
        this.user = user;
    }

    /**
     * Executes the DAO operation to retrieve the list of friends.
     *
     * @throws SQLException if a database access error occurs
     */
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
                friendList.add(new Friend(rs.getString("friend_username"), rs.getDate("date")));
                LOGGER.info("Friend found: " + rs.getString("friend_username") + " " + rs.getDate("date"));
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
        this.outputParam = friendList;
    }
}
