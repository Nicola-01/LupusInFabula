package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.UpdateEmailByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.UpdatePasswordByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.regex.Pattern;

/**
 * Represents a REST resource handler for handling PUT requests related to updating the current user's account.
 * <p>
 * This class handles PUT requests initiated by the current user to update their account information, including
 * password and email address. It verifies the user's identity by checking their session information and ensures
 * the validity of the requested updates.
 * </p>
 * <p>
 * If the update operation is successful, appropriate success messages are returned. If there are any errors, such
 * as incorrect password or inability to update the email, corresponding error messages are returned.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserMePutRR extends AbstractRR {

    /**
     * Represents the regular expression pattern to validate email addresses.
     * The email address must have the format local_part@domain.
     * It must contain at least one character before the "@" symbol,
     * followed by the "@" symbol, and then the domain name with at least one dot.
     */
    String emailRegex = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$";

    /**
     * The compiled pattern for validating email addresses.
     */
    Pattern emailRegexPattern = Pattern.compile(emailRegex);

    /**
     * Represents the regular expression pattern to validate passwords.
     * Passwords must be between 8 and 16 characters long and contain at least one uppercase letter,
     * one lowercase letter, one number, and one special character.
     */
    String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,16}$";

    /**
     * The compiled pattern for validating passwords.
     */
    Pattern passwordRegexPattern = Pattern.compile(passwordRegex);

    /**
     * Constructs a new UserMePutRR object with the specified HTTP request, response, and data source.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @param ds  the data source
     */
    public UserMePutRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.UPDATE_USER, req, res, ds);
    }

    /**
     * Handles the PUT request for updating the current user's account.
     * <p>
     * This method processes the update request sent by the user, including changes to the password or email address.
     * It verifies the user's identity, validates the requested updates, and performs the corresponding database
     * operations. It returns appropriate success or error messages based on the outcome of the update operation.
     * </p>
     *
     * @throws IOException if an I/O error occurs while processing the request or sending the response
     */
    @Override
    protected void doServe() throws IOException {

        String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
        LogContext.setUser(username);
        LogContext.setIPAddress(req.getRemoteAddr());

        try {

            InputStream stream = req.getInputStream();
            UserUpdate user_update = UserUpdate.fromJSON(stream);
            String user = ((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
            LOGGER.info("Username: " + user + " --> is trying to update the account");

            if (!user_update.getOldPassword().isEmpty() && !user_update.getNewPassword().isEmpty() && !user_update.getRepeatNewPassword().isEmpty() &&
                    user_update.getOldEmail().isEmpty() && user_update.getNewEmail().isEmpty()) {

                String oldPassword = user_update.getOldPassword();
                String newPassword = user_update.getNewPassword();
                String repeatNewPassword = user_update.getRepeatNewPassword();
                //LOGGER.info("Username: " + user + " --> is trying to update the password");
                Message m;

                if (passwordRegexPattern.matcher(newPassword).matches()) {

                    if (newPassword.equals(repeatNewPassword)) {

                        int rs = new UpdatePasswordByUsernameDAO(ds.getConnection(), user, oldPassword, newPassword).access().getOutputParam();
                        //LOGGER.info("The new password and the repeatNewPassword are the same");

                        if (rs == 1) {

                            m = new Message("User has successfully updated the password");
                            LOGGER.info("User " + user + " has successfully updated the password");
                            res.setStatus(HttpServletResponse.SC_OK);
                            m.toJSON(res.getOutputStream());

                        } else {

                            LOGGER.error("Update password failed");

                            ErrorCode ec = ErrorCode.UPDATE_NOT_SUCCESSFUL;
                            m = new Message("User " + user + " failed to update the password", ec.getErrorCode(), ec.getErrorMessage());
                            res.setStatus(ec.getHTTPCode());
                            m.toJSON(res.getOutputStream());

                        }

                    } else {

                        LOGGER.error("New password and repeatNewPassword do not match");

                        ErrorCode ec = ErrorCode.PASSWORD_NOT_MATCH;
                        m = new Message("New password and repeatNewPassword do not match", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(ec.getHTTPCode());
                        m.toJSON(res.getOutputStream());

                    }

                } else {

                    LOGGER.error("Passwords not complex enough");

                    ErrorCode ec = ErrorCode.INVALID_PASSWORD_FORMAT;
                    m = new Message("Passwords not complex enough", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());

                }

            } else if (user_update.getOldPassword().isEmpty() && user_update.getNewPassword().isEmpty() && user_update.getRepeatNewPassword().isEmpty() &&
                    !user_update.getOldEmail().isEmpty() && !user_update.getNewEmail().isEmpty()) {

                String oldEmail = user_update.getOldEmail();
                String newEmail = user_update.getNewEmail();
                //LOGGER.info("Username: " + user + " --> trying to update the email");
                int rs = new UpdateEmailByUsernameDAO(ds.getConnection(), user, oldEmail, newEmail).access().getOutputParam();
                Message m;

                if (emailRegexPattern.matcher(newEmail).matches()) {

                    if (rs == 1) {

                        m = new Message("User has successfully updated the email");
                        LOGGER.info("Player " + user + "'s successfully updated the old email " + oldEmail + " to the new one " + newEmail);
                        res.setStatus(HttpServletResponse.SC_OK);
                        m.toJSON(res.getOutputStream());

                    } else {

                        LOGGER.error("Impossible to update the old email to the new one");

                        ErrorCode ec = ErrorCode.EMAIL_ALREADY_USED;
                        m = new Message("Impossible to update the old email to the new one", ec.getErrorCode(), ec.getErrorMessage());
                        res.setStatus(ec.getHTTPCode());
                        m.toJSON(res.getOutputStream());

                    }

                } else {

                    LOGGER.error("Email not valid");

                    ErrorCode ec = ErrorCode.INVALID_EMAIL_FORMAT;
                    m = new Message("Email not valid", ec.getErrorCode(), ec.getErrorMessage());
                    res.setStatus(ec.getHTTPCode());
                    m.toJSON(res.getOutputStream());

                }

            }

        } catch (SQLException e) {

            LOGGER.error("Unable to send response: unexpected database error", e);

            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            Message m = new Message("Unable to send response: unexpected database error", ec.getErrorCode(), e.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());

        } finally {
            LogContext.removeAction();
            LogContext.removeUser();
            LogContext.removeIPAddress();
        }

    }

}
