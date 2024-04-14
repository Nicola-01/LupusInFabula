package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;


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

            String username = req.getRequestURI();
            username = username.substring(username.lastIndexOf('/') + 1);
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
    public void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        Message m;
        HttpSession session = req.getSession();
        String username = ((Player) session.getAttribute("player")).getUsername();

        try {

            String uri = req.getRequestURI();

            if (req.getParameterMap().containsKey("oldPassword") && req.getParameterMap().containsKey("newPassword")) {

                String oldPassword = req.getParameter("oldPassword");
                String newPassword = req.getParameter("newPassword");
                int rs = new UpdatePasswordByUsernameDAO(getConnection(), username, oldPassword, newPassword).access().getOutputParam();

                if (rs == 1) {

                    LOGGER.info("Player " + username + "'s successfully updated the password");
                    // TODO --> add the page linked to this servlet (for successfully updated password)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);

                } else {

                    m = new Message("Player " + username + " was not found");
                    LOGGER.info("Player " + username + " was not found");

                }

            } else if (req.getParameterMap().containsKey("oldUsername") && req.getParameterMap().containsKey("newUsername")) {

                String oldUsername = req.getParameter("oldUsername");
                String newUsername = req.getParameter("newUsername");
                int rs = new UpdateUsernameDAO(getConnection(), oldUsername, newUsername).access().getOutputParam();

                if (rs == 1) {

                    LOGGER.info("Player " + newUsername + "'s successfully updated the username");
                    // TODO --> add the page linked to this servlet (for successfully updated username)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);

                } else {

                    m = new Message("Impossible to update the username");
                    LOGGER.info("Impossible to update the old username to the new one");

                }

            } else if (req.getParameterMap().containsKey("oldEmail") && req.getParameterMap().containsKey("newEmail")) {

                String oldEmail = req.getParameter("oldEmail");
                String newEmail = req.getParameter("newEmail");
                int rs = new UpdateEmailByUsernameDAO(getConnection(), username, oldEmail, newEmail).access().getOutputParam();

                if (rs == 1) {

                    LOGGER.info("Player " + username + "'s successfully updated the old email " + oldEmail + " to the new one " + newEmail);
                    // TODO --> add the page linked to this servlet (for successfully updated email)
                    req.getRequestDispatcher("/jsp/...").forward(req, resp);

                } else {
                    m = new Message("Impossible to update email");
                    LOGGER.info("Impossible to update the old email to the new one");
                }

            }

        } catch (SQLException e) {
            LOGGER.error("Unable to send response", e);
        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
