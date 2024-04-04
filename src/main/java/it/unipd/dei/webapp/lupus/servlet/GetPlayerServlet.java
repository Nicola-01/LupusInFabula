package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SelectPlayerDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public final class GetPlayerServlet extends AbstractDatabaseServlet {

    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<Player> players = null;
        Message m = null;

        res.setContentType("text/html; charset=utf-8");

        PrintWriter out = res.getWriter();

        //out.printf("<table>%n");
        try {
            players = new SelectPlayerDAO(getConnection()).access().getOutputParam();
            m = new Message("Players found");

            out.printf("<!DOCTYPE html>%n");
            out.printf("<head>%n");
            out.printf("<meta charset=\"utf-8\">%n");
            out.printf("<title>LUPUS</title>%n");
            out.printf("</head>%n");
            out.printf("<body>%n");
            //out.printf("<table>%n");
            if(m.isError()) {

                out.printf("<ul>%n");
                out.printf("<li>error code: %s</li>%n", m.getErrorCode());
                out.printf("<li>message: %s</li>%n", m.getMessage());
                out.printf("<li>details: %s</li>%n", m.getErrorDetails());
                out.printf("</ul>%n");

            } else {

                out.printf("<p>%s</p>%n", m.getMessage());
                out.printf("<table>%n");
                out.printf("<tr>%n");
                out.printf("<td>email</td>%n");
                out.printf("</tr>%n");
                for (Player p : players) {
                    out.printf("<tr>%n");
                    out.printf("<td>%s</td>", p.getEmail());
                    out.printf("</tr>%n");
                }
                out.printf("</table>%n");

            }
            //out.printf("</table>%n");
        } catch (SQLException e) {
            m = new Message("Error SQLException", "E200", e.getMessage());
        } catch (NumberFormatException e) {
            m = new Message("Error NumberFormatException", "E200", e.getMessage());
        }
        //out.printf("</table>%n");
//        out.printf(m.getMessage());
//        out.println("<br>");
//        out.printf(m.getErrorDetails());

        out.println("</body></html>");

        out.flush();
        out.close();
    }
}
