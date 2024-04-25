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

    private static final String STATEMENT = "INSERT INTO IS_FRIEND_WITH VALUES (?,?,?) RETURNING *";

    private final String player_username;
    private final String friend_username;
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
        Friend f = null;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player_username);
            pstmt.setString(2, friend_username);
            pstmt.setDate(3, date);

            rs = pstmt.executeQuery();
            if (rs.next()) {
                f = new Friend(rs.getString("friend_username"), rs.getDate("date"));
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
