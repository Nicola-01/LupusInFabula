package it.unipd.dei.webapp.lupus.dao;

import it.unipd.dei.webapp.lupus.resource.Friend;

import java.sql.*;

public class AddFriendDAO extends AbstractDAO<Friend>{
    private static final String STATEMENT = "INSERT INTO IS_FRIEND_WITH VALUES (?,?,?) RETURNING *";

    private final String player_username;
    private final String friend_username;
    private final Date date;

    public AddFriendDAO(final Connection con, final String player_username, final String friend_username, final Date date) {
        super(con);
        this.player_username = player_username;
        this.friend_username = friend_username;
        this.date = date;
    }

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
            if(rs.next()){
                f = new Friend(rs.getString("friend_username"), rs.getDate("date"));
                LOGGER.info("friend %s added", f.getUsername());

            }else{
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
