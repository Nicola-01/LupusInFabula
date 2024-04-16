package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleByTypeDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.resource.StatsRole;
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
        String username = op.split("/")[3]; //[3]; //recupero username
        String operation_type = op.split("/")[4];//[4]; //recupero operation_type

        LOGGER.info("Access to %s of Player %s", operation_type, username);

        switch (operation_type) {
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
        List<PlaysJoinGame> logs = null; // =new ArrayList<>();

        try {
            // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
            logs = new GetLogsDAO(getConnection(), username).access().getOutputParam();
            LOGGER.info("Logs successfully for user: %s", username);

        } catch (SQLException e) {
            String error = "Cannot search logs for user " + username + ": unexpected error while accessing the database.";
            m = new Message(error, "E200", e.getMessage());
            LOGGER.info(error, e);
        }

        try {
            int size = 0;

            if (logs != null) {
                size = logs.size();
            }

            String infos = "logs of the player " + username + " has played " + size + " games.";

            LOGGER.info(infos);
            request.setAttribute("logs", logs);
            request.setAttribute("m", m);
            request.getRequestDispatcher("/jsp/logs.jsp").forward(request, response);

        } catch (Exception e) {
            LOGGER.error("Unable to send response when creating the logs list", e);
            throw e;
        } finally {
        }
    }

    public void statistics(HttpServletRequest request, HttpServletResponse response, String username) throws IOException, ServletException {
        Message m = null;
        List<StatsRole> stats = null;
        try {
            // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
            stats = new GetStatsPerRoleDAO(getConnection(), username).access().getOutputParam();
            LOGGER.info("Stats successfully for user: %s", username);

        } catch (SQLException e) {
            String error = "Cannot search stats for user " + username + ": unexpected error while accessing the database.";
            m = new Message(error, "E200", e.getMessage());
            LOGGER.info(error, e);
        }

        try {
            int size = 0;

            if (stats != null) {
                size = stats.size();
            }

            String infos = "stats of the player " + username + " that has played " + size + " different roles.";

            LOGGER.info(infos);
            request.setAttribute("stats", stats);
            request.setAttribute("m", m);
            ///////////////////

            List<PlaysJoinGame> logs = null; // =new ArrayList<>();

            try {
                // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
                logs = new GetLogsDAO(getConnection(), username).access().getOutputParam();
                LOGGER.info("Logs successfully for user: %s", username);

            } catch (SQLException e) {
                String error = "Cannot search logs for user " + username + ": unexpected error while accessing the database.";
                m = new Message(error, "E200", e.getMessage());
                LOGGER.info(error, e);
            }

            try {
                int size1 = 0;

                if (logs != null) {
                    size1 = logs.size();
                }

                String infos1 = "logs of the player " + username + " has played " + size + " games.";

                LOGGER.info(infos1);
                request.setAttribute("logs", logs);
            } catch (Exception e) {
                LOGGER.error("Unable to send response when creating the logs list", e);
                throw e;
            } finally {
            }

            ////////////////////////
            request.getRequestDispatcher("/jsp/stats.jsp").forward(request, response);

        } catch (Exception e) {
            LOGGER.error("Unable to send response when creating the logs list", e);
            throw e;
        } finally {
        }
    }

}
