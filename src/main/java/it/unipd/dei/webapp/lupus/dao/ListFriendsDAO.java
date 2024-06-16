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
    private static final String STATEMENT = "SELECT * FROM IS_FRIEND_WITH WHERE LOWER(player_username) = LOWER(?) ORDER BY LOWER(friend_username)";

    /**
     * The SQL statement to calculate the common game.
     */
    private static final String GAME_STATEMENT = "SELECT COUNT(*) AS num_games FROM plays_as_in p1 JOIN plays_as_in p2 ON p1.game_id = p2.game_id WHERE p1.player_username = ? AND p2.player_username = ? AND p1.player_username != p2.player_username";

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
        PreparedStatement pstmt1 = null;
        ResultSet rs1 = null;

        final List<Friend> friendList = new ArrayList<>();
        int commonGame;
        String friend_username;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, user);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                friend_username = rs.getString("friend_username");
                pstmt1 = con.prepareStatement(GAME_STATEMENT);
                pstmt1.setString(1,user);
                pstmt1.setString(2,friend_username);
                rs1 = pstmt1.executeQuery();
                if(rs1.next()) {
                    commonGame = rs1.getInt("num_games");
                }else{
                    commonGame = -1;
                    LOGGER.error("Error while calculating the number of common games");
                }
                friendList.add(new Friend(friend_username, commonGame, rs.getDate("date")));
                LOGGER.info("Friend found: " + rs.getString("friend_username") + " " + commonGame + " " + rs.getDate("date"));
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
            if (pstmt1 != null) {
                pstmt1.close();
            }
            if (rs1 != null) {
                rs1.close();
            }
        }
        this.outputParam = friendList;
    }
}
