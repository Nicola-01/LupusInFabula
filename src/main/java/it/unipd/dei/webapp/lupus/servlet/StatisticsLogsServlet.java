package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleByTypeDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.unipd.dei.webapp.lupus.dao.GetLogsDAO;

public class StatisticsLogsServlet extends AbstractDatabaseServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String op = req.getRequestURI();
        String username = op.split("/")[3]; //recupero username
        String operation_type = op.split("/")[4]; //recupero operation_type

        LOGGER.info("Access to %s of Player %s", operation_type, username);

        switch (op) {
            case "logs":
                try {
                    logs(req, resp, username);
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
                break;
            case "statistics":
                statistics(req, resp, username);
                break;
        }
    }

    public void logs(HttpServletRequest request, HttpServletResponse response, String username) throws IOException, SQLException, ServletException {
        Message m = null;
        List<PlaysJoinGame> logs = null;
        try {
            logs = new GetLogsDAO(getConnection(), username).access().getOutputParam();
            LOGGER.info("Logs successfully for user: %s", username);

        } catch (SQLException e) {
            String error = "Cannot search logs for user "+ username +": unexpected error while accessing the database.";
            m = new Message( error, "E200", e.getMessage());
            LOGGER.info(error, e);
        }

        try {
            request.setAttribute("logs",logs);
            request.setAttribute("m", m);
            request.getRequestDispatcher("/jsp/rules.jsp").forward(request, response);
        } catch (Exception e) {
            LOGGER.error("Unable to send response when creating the logs list", e);
            throw e;
        } finally {
        }
    }

    public void statistics(HttpServletRequest request, HttpServletResponse response, String username) throws IOException {

    }

}
