package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Friend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * DAO (Data Access Object) for deleting a friend relationship from the database.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class DeleteFriendDAO extends AbstractDAO<Friend> {

    private static final String DELETE_STATEMENT = "DELETE FROM IS_FRIEND_WITH WHERE LOWER(player_username) = LOWER(?) AND LOWER(friend_username) = LOWER(?) RETURNING *";

    /**
     * The player username
     */
    private final String player_username;

    /**
     * The username of the fiend to add
     */
    private final String friend_username;

    /**
     * Constructs a new DeleteFriendDAO with the given database connection, player username, and friend username.
     *
     * @param con             the database connection
     * @param player_username the username of the player
     * @param friend_username the username of the friend to be deleted
     */
    public DeleteFriendDAO(final Connection con, final String player_username, final String friend_username) {
        super(con);
        this.player_username = player_username;
        this.friend_username = friend_username;
    }

    /**
     * Executes the DAO operation to delete a friend relationship.
     *
     * @throws SQLException if a database access error occurs
     */
    @Override
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        Friend f = null;

        try {
            pstmt = con.prepareStatement(DELETE_STATEMENT);
            pstmt.setString(1, player_username);
            pstmt.setString(2, friend_username);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                f = new Friend(rs.getString("friend_username"), rs.getDate("date"));
                LOGGER.info("Delete friend %s", f.getUsername());
            } else {
                LOGGER.info("No friend found", friend_username);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = f;
    }
}
