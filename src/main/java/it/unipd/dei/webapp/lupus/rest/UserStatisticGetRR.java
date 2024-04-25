package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetStatsPerRoleDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;


public class UserStatisticGetRR extends AbstractRR {

    private final String username;

    public UserStatisticGetRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_STATS_USER, req, res, ds);
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
            m = new Message(infos);

            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());


            res.setStatus(HttpServletResponse.SC_OK);
            new ResourceList<StatsRole>(stats).toJSON(res.getOutputStream());

        } catch (Exception e) {

            LOGGER.error("Unable to send response when creating the logs list", e);
            throw e;
        } finally {
        }
    }




}
