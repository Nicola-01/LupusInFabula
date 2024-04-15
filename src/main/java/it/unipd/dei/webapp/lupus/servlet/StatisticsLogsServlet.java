package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.LoginPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;

public class StatisticsLogsServlet extends AbstractDatabaseServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String op = req.getRequestURI();
        String username = op.split("/")[3]; //recupero username
        String operation_type = op.split("/")[4]; //recupero operation_type

        LOGGER.info("Access to %s of Player %s", operation_type, username);

        switch (op) {
            case "signup":
                logs(req, resp, username);
                break;
            case "login":
                statistics(req, resp, username);
                break;
        }
    }

    public void logs(HttpServletRequest request, HttpServletResponse response, String username) throws IOException {

    }

    public void statistics(HttpServletRequest request, HttpServletResponse response,  String username) throws IOException {

    }

}
