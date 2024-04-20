package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.UpdateEmailByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.UpdatePasswordByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.UserUpdate;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;

public class UserMePutRR extends AbstractRR {

    public UserMePutRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.UPDATE_USER, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            InputStream stream = req.getInputStream();
            UserUpdate user_update = UserUpdate.fromJSON(stream);
            String username = ((Player) req.getSession().getAttribute("user")).getUsername();
            LOGGER.info("Username: " + username + " --> trying to update the account");

            //Debugging:
            LOGGER.info(user_update.getOldPassword() + " " + user_update.getNewPassword() + " " + user_update.getRepeatNewPassword());
            LOGGER.info(user_update.getOldEmail() + " " + user_update.getNewEmail());

            if (!user_update.getOldPassword().isEmpty() && !user_update.getNewPassword().isEmpty() && !user_update.getRepeatNewPassword().isEmpty() &&
                    user_update.getOldEmail().isEmpty() && user_update.getNewEmail().isEmpty()) {

                String oldPassword = user_update.getOldPassword();
                String newPassword = user_update.getNewPassword();
                String repeatNewPassword = user_update.getRepeatNewPassword();
                LOGGER.info("Username: " + username + " --> trying to update the password");

                if (newPassword.equals(repeatNewPassword)) {

                    int rs = new UpdatePasswordByUsernameDAO(ds.getConnection(), username, oldPassword, newPassword).access().getOutputParam();
                    //LOGGER.info("The new password and the repeatNewPassword are the same");

                    if (rs == 1) {

                        m = new Message("User has successfully updated the password");
                        LOGGER.info("User " + username + " has successfully updated the password");
                        res.setStatus(HttpServletResponse.SC_OK);
                        m.toJSON(res.getOutputStream());
                        // TODO --> add the page linked to this servlet (for successfully updated password)
                        //req.getRequestDispatcher("/jsp/...").forward(req, res);

                    } else {

                        m = new Message("User " + username + " was not found");
                        LOGGER.info("User " + username + " was not found");
                        res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        m.toJSON(res.getOutputStream());
                        // TODO --> add the page linked to this servlet (for not successfully updated password)
                        //req.getRequestDispatcher("/jsp/...").forward(req, resp);

                    }
                } else {

                    m = new Message("New password and repeatNewPassword do not match");
                    LOGGER.info("New password and repeatNewPassword do not match");
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    m.toJSON(res.getOutputStream());
                    // TODO --> add the page linked to this servlet (for not successfully updated password)
                    //req.getRequestDispatcher("/jsp/...").forward(req, resp);

                }

            } else if (user_update.getOldPassword().isEmpty() && user_update.getNewPassword().isEmpty() && user_update.getRepeatNewPassword().isEmpty() &&
                    !user_update.getOldEmail().isEmpty() && !user_update.getNewEmail().isEmpty()) {

                String oldEmail = user_update.getOldEmail();
                String newEmail = user_update.getNewEmail();
                LOGGER.info("Username: " + username + " --> trying to update the email");
                int rs = new UpdateEmailByUsernameDAO(ds.getConnection(), username, oldEmail, newEmail).access().getOutputParam();

                if (rs == 1) {

                    m = new Message("User has successfully updated the email");
                    LOGGER.info("Player " + username + "'s successfully updated the old email " + oldEmail + " to the new one " + newEmail);
                    res.setStatus(HttpServletResponse.SC_OK);
                    m.toJSON(res.getOutputStream());
                    // TODO --> add the page linked to this servlet (for successfully updated email)
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                } else {

                    m = new Message("Impossible to update email");
                    LOGGER.info("Impossible to update the old email to the new one");
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    m.toJSON(res.getOutputStream());
                    // TODO --> add the page linked to this servlet (for not successfully updated email)
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                }

            }

            //LOGGER.info("Something went wrong");

        } catch (SQLException e) {

            // TODO --> check the error code
            m = new Message("User not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } catch (Exception e) {

            // TODO --> check the error code
            m = new Message("Unable to update the account", "E200", e.getMessage());
            LOGGER.info("Unable to update the account", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }
}
