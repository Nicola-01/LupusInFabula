package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.dao.GetLogsDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.PlaysJoinGame;
import it.unipd.dei.webapp.lupus.resource.ResourceList;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class UserLogsGetRR extends AbstractRR {


    private final String username;

//    public UserLogsGetRR(String action, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
    public UserLogsGetRR(String username, HttpServletRequest req, HttpServletResponse res, DataSource ds) {
        super(Actions.GET_LOGS_USER, req, res, ds);
        this.username = username;
    }

    @Override
    protected void doServe() throws IOException {


        //SONO DENTRO IL LOGS QUINDI TOGLIERE
        String op = req.getRequestURI();
        String username = op.split("/")[3]; //[3]; //recupero username


        String operation_type = op.split("/")[4];//[4]; //recupero operation_type



        LOGGER.info("Access to %s of Player %s", operation_type, username);

        Message m = null;
        List<PlaysJoinGame> logs = null; // =new ArrayList<>();

        try {
            // logs.add(new GetLogsDAO(getConnection(), username).access().getOutputParam());
            logs = new GetLogsDAO(ds.getConnection(), username).access().getOutputParam();

            String temp = "Logs successfully for user: " + username;
            m = new Message(temp);
            LOGGER.info("Logs successfully for user: %s", username);
            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());

        } catch (SQLException e) {
            String error = "Cannot search logs for user " + username + ": unexpected error while accessing the database.";
            m = new Message(error, "E200", e.getMessage());
            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());

            LOGGER.info(error, e);
        }

        try {
            int size = 0;

            if (logs != null) {
                size = logs.size();
            }

            String infos = "logs of the player " + username + " has played " + size + " games.";
            m = new Message(infos);
            LOGGER.info(infos);


            res.setStatus(HttpServletResponse.SC_OK);
            m.toJSON(res.getOutputStream());


            res.setStatus(HttpServletResponse.SC_OK);
            new ResourceList<PlaysJoinGame>(logs).toJSON(res.getOutputStream());
        } catch (Exception e) {
            m = new Message("Logs not found", "E200", e.getMessage());
            LOGGER.error("Unable to send response when creating the logs list", e);
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(res.getOutputStream());

            throw e;
        } finally {
        }

    }
}
