package it.unipd.dei.webapp.lupus.dao;

import java.sql.*;

public class AddFriendDAO extends AbstractDAO<Integer>{
    private static final String STATEMENT = "INSERT INTO Is_Friend_With (player_username, friend_username, date) VALUE(?,?,?)";

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
    public final void doAccess() throws SQLException {
        PreparedStatement pstmt = null;
        int rs = 0;

        try {
            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, player_username);
            pstmt.setString(2, friend_username);
            pstmt.setDate(3, date);

            rs = pstmt.executeUpdate();
            if(rs == 1){
                LOGGER.info("friend added");

            }else{
                LOGGER.info("friend NOT added");

            }

        } finally {

            if (pstmt != null) {
                pstmt.close();
            }

            con.close();
        }

        this.outputParam = rs;

    }
}
