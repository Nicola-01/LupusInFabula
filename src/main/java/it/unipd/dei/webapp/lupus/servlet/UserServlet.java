package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.postgresql.core.Utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.Map;
import java.util.logging.Logger;


public class UserServlet extends AbstractDatabaseServlet{

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        String username = req.getRequestURI();
        //I take the substring after the last /
        username = username.substring(username.lastIndexOf('/') + 1);
        Player player = null;
        Message m;

        try {

            player = new SearchPlayerByUsernameDAO(getConnection(), username).access().getOutputParam();

            if (player != null) {

                LOGGER.info("Username successfully found");

                req.setAttribute("player", player);
                // TODO insert the jsp file linked to this servlet
                req.getRequestDispatcher("/jsp/...").forward(req, resp);

            } else {

                m = new Message("Username not found");
                LOGGER.info("Username not found");

                req.setAttribute("m", m);
                // TODO --> insert the jsp file linked to this servlet (the jsp for the error)
                req.getRequestDispatcher("/jsp/...").forward(req, resp);

            }

        } catch (SQLException e) {

            m = new Message("Username not found", "E200", e.getMessage());
            LOGGER.info("Username not found");

        } catch (Exception e) {

            LOGGER.error("Unable to send response", e);
            throw e;

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

    @Override
    public void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            HttpSession session = req.getSession();
            String username = ((Player) session.getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
            LOGGER.info("Username: " + username + " --> trying to delete the account");
            int result = new DeletePlayerDAO(getConnection(), username).access().getOutputParam();

            if (result == 1) {

                LOGGER.info("Player successfully deleted");
                // TODO --> add the page linked to this servlet (for successfully deleted player)
                req.getRequestDispatcher("/jsp/...").forward(req, resp);

            } else {

                m = new Message("Player not found");
                LOGGER.info("Player not found");
                req.setAttribute("m", m);
                // TODO --> add the page linked to this servlet (for the player not found)
                req.getRequestDispatcher("/jsp/...").forward(req, resp);
            }

        } catch (SQLException e) {

            m = new Message("Player not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);

        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;

        try {

            HttpSession session = req.getSession();
            String username = ((Player) session.getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
            LOGGER.info("Username: " + username + " --> trying to update the account");

            boolean prova = req.getParameterMap().containsKey("oldPassword") && req.getParameterMap().containsKey("newPassword") && req.getParameterMap().containsKey("repeatNewPassword");
            LOGGER.info("Debug: " + prova + ", the req.getParameter(oldPassword) is: " + req.getParameter("oldPassword"));

            if (req.getParameterMap().containsKey("oldPassword") && req.getParameterMap().containsKey("newPassword") && req.getParameterMap().containsKey("repeatNewPassword")) {

                String oldPassword = req.getParameter("oldPassword");
                String newPassword = req.getParameter("newPassword");
                String repeatNewPassword = req.getParameter("repeatNewPassword");
                LOGGER.info("Username: " + username + " --> trying to update the password");

                if (newPassword.equals(repeatNewPassword)) {
                    int rs = new UpdatePasswordByUsernameDAO(getConnection(), username, oldPassword, newPassword).access().getOutputParam();
                    LOGGER.info("The new password and the repeatNewPassword are the same");

                    if (rs == 1) {

                        LOGGER.info("Player " + username + "'s successfully updated the password");
                        // TODO --> add the page linked to this servlet (for successfully updated password)
                        req.getRequestDispatcher("/jsp/...").forward(req, resp);

                    } else {

                        m = new Message("Player " + username + " was not found");
                        LOGGER.info("Player " + username + " was not found");
                        req.setAttribute("m", m);
                        // TODO --> add the page linked to this servlet (for not successfully updated password)
                        req.getRequestDispatcher("/jsp/...").forward(req, resp);

                    }
                } else {

                    m = new Message("New password and repeatNewPassword do not match");
                    LOGGER.info("New password and repeatNewPassword do not match");
                    req.setAttribute("m", m);
                    // TODO --> add the page linked to this servlet (for not successfully updated password)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);

                }

            } else if (req.getParameterMap().containsKey("oldEmail") && req.getParameterMap().containsKey("newEmail")) {

                String oldEmail = req.getParameter("oldEmail");
                String newEmail = req.getParameter("newEmail");
                LOGGER.info("Username: " + username + " --> trying to update the email");
                int rs = new UpdateEmailByUsernameDAO(getConnection(), username, oldEmail, newEmail).access().getOutputParam();

                if (rs == 1) {

                    LOGGER.info("Player " + username + "'s successfully updated the old email " + oldEmail + " to the new one " + newEmail);
                    // TODO --> add the page linked to this servlet (for successfully updated email)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);

                } else {
                    m = new Message("Impossible to update email");
                    LOGGER.info("Impossible to update the old email to the new one");
                    req.setAttribute("m", m);
                    // TODO --> add the page linked to this servlet (for not successfully updated email)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);
                }

            }

//            LOGGER.info("Something went wrong");

        } catch (SQLException e) {
            LOGGER.error("Unable to send response", e);
        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
