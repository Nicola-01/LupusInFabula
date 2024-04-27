package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.DeletePlayerDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

/**
 * Represents a REST resource handler for handling DELETE requests related to the current user's account.
 * <p>
 * This class handles DELETE requests initiated by the current user to delete their account. It verifies the
 * user's identity by checking their session information and confirms the deletion operation by verifying the
 * user's password provided in the request payload.
 * </p>
 * <p>
 * If the user's password is correct and the account deletion is successful, an appropriate success message is
 * returned. If the password is incorrect, or the user is not found, corresponding error messages are returned.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserMeDeleteRR extends AbstractRR {

    /**
     * Constructs a new UserMeDeleteRR object with the specified HTTP request, response, and data source.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @param ds  the data source
     */
    public UserMeDeleteRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.DELETE_USER, req, res, ds);
    }

    /**
     * Handles the DELETE request for deleting the current user's account.
     * <p>
     * This method verifies the user's identity, checks the provided confirmation password,
     * and initiates the account deletion operation. It returns appropriate success or error messages
     * based on the outcome of the deletion operation.
     * </p>
     *
     * @throws IOException if an I/O error occurs while processing the request or sending the response
     */
    @Override
    protected void doServe() throws IOException {

        String username = ((Player) req.getSession().getAttribute("user")).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());

        LOGGER.info("Username: " + username + " --> trying to delete the account");

        try {

            // TODO --> implement the password verification of the user

            // Implementation of user confirmation password before deleting the account
            InputStream stream = req.getInputStream();
            UserUpdate user_update = UserUpdate.fromJSON(stream);
            String confirmation_password = user_update.getOldPassword();
            Player player = new LoginPlayerDAO(ds.getConnection(), username, confirmation_password).access().getOutputParam();

            if (player != null) {

                int result = new DeletePlayerDAO(ds.getConnection(), username).access().getOutputParam();
                Message m;

                if (result == 1) {

                    req.getSession().invalidate(); // maybe logout is better
                    m = new Message("User successfully deleted");
                    LOGGER.info("User successfully deleted");
                    res.setStatus(HttpServletResponse.SC_OK);
                    m.toJSON(res.getOutputStream());
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                } else {

                    LOGGER.error("User not found");

                    ErrorCode ec = ErrorCode.USER_NOT_FOUND;
                    m = new Message("User " + username + "not found", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    m.toJSON(res.getOutputStream());
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                }

            } else {

                LOGGER.error("Password incorrect");

                ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                Message m = new Message("Password incorrect", ec.getErrorCode(), ec.getErrorMessage());
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                m.toJSON(res.getOutputStream());
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            }

        } catch (SQLException e) {

            LOGGER.info("Unable to send response", e);

            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("User not found", ec.getErrorCode(), e.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());

        } finally {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
        }

    }

}
