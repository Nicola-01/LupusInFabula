package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.DeletePlayerDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.UserUpdate;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;

public class UserMeDeleteRR extends AbstractRR {

    public UserMeDeleteRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.DELETE_USER, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            // TODO --> implement the password verification of the user
            String username = ((Player) req.getSession().getAttribute("user")).getUsername();
            LOGGER.info("Username: " + username + " --> trying to delete the account");

            // Implementation of user confirmation password before deleting the account
            InputStream stream = req.getInputStream();
            UserUpdate user_update = UserUpdate.fromJSON(stream);
            String confirmation_password = user_update.getOldPassword();
            Player player = new LoginPlayerDAO(ds.getConnection(), username, confirmation_password).access().getOutputParam();

            if (player != null) {

                int result = new DeletePlayerDAO(ds.getConnection(), username).access().getOutputParam();

                if (result == 1) {

                    req.getSession().invalidate(); // maybe logout is better
                    m = new Message("User successfully deleted");
                    LOGGER.info("User successfully deleted");
                    res.setStatus(HttpServletResponse.SC_OK);
                    m.toJSON(res.getOutputStream());
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                } else {

                    m = new Message("User not found");
                    LOGGER.info("User not found");
                    res.setStatus(HttpServletResponse.SC_NOT_FOUND); //check
                    m.toJSON(res.getOutputStream());
                    //req.getRequestDispatcher("/jsp/...").forward(req, res);

                }

            } else {

                m = new Message("Password incorrect");
                LOGGER.info("Password incorrect");
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED); //check
                m.toJSON(res.getOutputStream());
                //req.getRequestDispatcher("/jsp/...").forward(req, res);

            }

        } catch (SQLException e) {

            // TODO --> check the error code
            m = new Message("User not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } catch (Exception e) {

            // TODO --> check the error code
            m = new Message("Unable to delete the account", "E200", e.getMessage());
            LOGGER.info("Unable to delete the account", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
