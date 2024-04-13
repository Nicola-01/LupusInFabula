package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.DeletePlayerDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
            m =  new Message("Username found");
            LOGGER.info("Username successfully found");

        } catch (SQLException e) {
            m = new Message("Username not found", "E200", e.getMessage());
            LOGGER.info("Username not found");
        }

        try {

            req.setAttribute("player", player);
            req.setAttribute("m", m);
            req.getRequestDispatcher("/jsp/").forward(req, resp);

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

        Message m;

        try {

            String username = req.getRequestURI();
            username = username.substring(username.lastIndexOf('/') + 1);
            Integer result = new DeletePlayerDAO(getConnection(), username).access().getOutputParam();

            if (result == 1) {
                m = new Message("Player successfully deleted");
                LOGGER.info("Player successfully deleted");
            } else {
                m = new Message("Player not found");
                LOGGER.info("Player not found");
            }

        } catch (SQLException e) {
            m = new Message("Player not found", "E200", e.getMessage());
            LOGGER.info("Unable to send response", e);
        }

    }

    // TODO --> do the doPut and the DAO for it

}
