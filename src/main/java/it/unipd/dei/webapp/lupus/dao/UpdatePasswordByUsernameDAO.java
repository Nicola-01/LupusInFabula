package it.unipd.dei.webapp.lupus.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdatePasswordByUsernameDAO extends AbstractDAO<Integer> {

    private static final String STATEMENT = "UPDATE player SET password = ? WHERE LOWER(username) = LOWER(?) AND password = ?";
    private final String newPassword;
    private final String oldPassword;
    private final String username;

    public UpdatePasswordByUsernameDAO(final Connection con, final String username, final String oldPassword, final String newPassword) {
        super(con);
        this.newPassword = newPassword;
        this.oldPassword = oldPassword;
        this.username = username;
    }

    @Override
    public final void doAccess() throws SQLException {

        PreparedStatement pstmt = null;
        int rs = 0;

        try {

            pstmt = con.prepareStatement(STATEMENT);
            pstmt.setString(1, newPassword);
            pstmt.setString(2, username);
            pstmt.setString(3, oldPassword);
            rs = pstmt.executeUpdate();

            if (rs == 1) {
                LOGGER.info("Updated player " + username + "'s password");
            } else {
                LOGGER.info("No player found with username = " + username);
            }

        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        this.outputParam = rs;
    }
}
