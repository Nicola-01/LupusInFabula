package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.UpdateEmailByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.UpdatePasswordByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

public class UserMePutRR extends AbstractRR {

    public UserMePutRR(final HttpServletRequest req, final HttpServletResponse res, Connection con) {
        super(Actions.UPDATE_USER, req, res, con);
    }

    @Override
    protected void doServe() throws IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            String username = ((Player) req.getSession().getAttribute("user")).getUsername();
            LOGGER.info("Username: " + username + " --> trying to update the account");
            //Debugging:
            //boolean prova = req.getParameterMap().containsKey("oldPassword") && req.getParameterMap().containsKey("newPassword") && req.getParameterMap().containsKey("repeatNewPassword");
            //LOGGER.info("Debug: " + prova + ", the req.getParameter(oldPassword) is: " + req.getParameter("oldPassword"));


            if (req.getParameterMap().containsKey("oldPassword") && req.getParameterMap().containsKey("newPassword") && req.getParameterMap().containsKey("repeatNewPassword")) {

                String oldPassword = req.getParameter("oldPassword");
                String newPassword = req.getParameter("newPassword");
                String repeatNewPassword = req.getParameter("repeatNewPassword");
                LOGGER.info("Username: " + username + " --> trying to update the password");

                if (newPassword.equals(repeatNewPassword)) {

                    int rs = new UpdatePasswordByUsernameDAO(con, username, oldPassword, newPassword).access().getOutputParam();
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

            } else if (req.getParameterMap().containsKey("oldEmail") && req.getParameterMap().containsKey("newEmail")) {

                String oldEmail = req.getParameter("oldEmail");
                String newEmail = req.getParameter("newEmail");
                LOGGER.info("Username: " + username + " --> trying to update the email");
                int rs = new UpdateEmailByUsernameDAO(con, username, oldEmail, newEmail).access().getOutputParam();

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

//            LOGGER.info("Something went wrong");

        } catch (SQLException e) {
            m = new Message("Unable to update the account");
            LOGGER.info("Unable to update the account");
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());
        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }
}
