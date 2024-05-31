package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Friend;

import java.sql.*;

/**
 * DAO (Data Access Object) for adding a friend relationship to the database.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class AddFriendDAO extends AbstractDAO<Friend> {

    /**
     * The SQL statement to add a friend relationship in the database.
     */
    private static final String STATEMENT = "INSERT INTO IS_FRIEND_WITH VALUES (?,?,?) RETURNING *";

    /**
     * The username of the player who initiates the friend request.
     */
    private final String player_username;

    /**
     * The SQL statement to calculate the common game.
     */
    private static final String GAME_STATEMENT = "SELECT COUNT(*) AS num_games FROM plays_as_in p1 JOIN plays_as_in p2 ON p1.game_id = p2.game_id WHERE p1.player_username = ? AND p2.player_username = ? AND p1.player_username != p2.player_username";

    /**
     * The username of the friend to be added.
     */
    private final String friend_username;

    /**
     * The date of the friendship.
     */
    private final Date date;

    /**
     * Constructs a new AddFriendDAO with the given database connection, player username, friend username, and date.
     *
     * @param con             the database connection
     * @param player_username the username of the player
     * @param friend_username the username of the friend to be added
     * @param date            the date of the friendship
     */
    public AddFriendDAO(final Connection con, final String player_username, final String friend_username, final Date date) {
        super(con);
        this.player_username = player_username;
        this.friend_username = friend_username;
        this.date = date;
    }

    /**
     * Executes the DAO operation to add a friend relationship.
     *
     * @throws SQLException if a database access error occurs
     */
    @Override
    public void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        PreparedStatement pstmt1 = null;
        ResultSet rs1 = null;
        Friend f = null;
        int commonGame;

        try {
            pstmt1 = con.prepareStatement(GAME_STATEMENT);
            pstmt1.setString(1,player_username);
            pstmt1.setString(2,friend_username);
            rs1 = pstmt1.executeQuery();
            if(rs1.next()) {
                commonGame = rs1.getInt("num_games");
            }else{
                commonGame = -1;
                LOGGER.error("Error while calculating the number of common games");
            }
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player_username);
            pstmt.setString(2, friend_username);
            pstmt.setDate(3, date);

            rs = pstmt.executeQuery();
            if (rs.next()) {
                f = new Friend(rs.getString("friend_username"), commonGame, rs.getDate("date"));
                LOGGER.info("friend %s added", f.getUsername());

            } else {
                LOGGER.info("friend NOT added");

            }

        } finally {

            if (pstmt != null) {
                pstmt.close();
            }

            con.close();
        }

        this.outputParam = f;

    }
}
