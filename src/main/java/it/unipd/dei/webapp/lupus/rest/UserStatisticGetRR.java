package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetLogsDAO;
import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.resource.StatsRole;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;


public class UserStatisticGetRR extends AbstractRR {

    private final String username;
    public UserStatisticGetRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_LOGS_USER, req, res, ds);
        this.username = username;
    }



    @Override
    protected void doServe() throws IOException {
        Message m = null;
        List<StatsRole> stats = null;
        try {
            // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
            stats = new GetStatsPerRoleDAO(ds.getConnection(), username).access().getOutputParam();
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
            req.setAttribute("stats", stats);
            req.setAttribute("m", m);
            ///////////////////

            List<PlaysJoinGame> logs = null; // =new ArrayList<>();

            try {
                // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
                logs = new GetLogsDAO(ds.getConnection(), username).access().getOutputParam();
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
                req.setAttribute("logs", logs);
            } catch (Exception e) {
                LOGGER.error("Unable to send response when creating the logs list", e);
                throw e;
            } finally {
            }

            ////////////////////////
            req.getRequestDispatcher("/jsp/stats.jsp").forward(req, res);

        } catch (Exception e) {
            LOGGER.error("Unable to send response when creating the logs list", e);

            throw e;
        } finally {
        }
    }




}
