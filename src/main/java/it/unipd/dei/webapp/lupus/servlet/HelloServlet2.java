package it.unipd.dei.webapp.lupus.servlet;

import java.io.*;
import java.sql.*;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

// @WebServlet(name = "helloServlet2", value = "/hello-servlet2")
public class HelloServlet2 extends HttpServlet {

    private String message;

    public void init() {
        message = "Hello World! 2";
    }


    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html; charset=utf-8");
        PrintWriter out = response.getWriter();

        // Connessione al database
        String url = "jdbc:postgresql://db:5432/postgres";

        String usernameSQL = "postgres";
        String passwordSQL = "postgres";

        out.println("<h1>TEST SQL</h1>");

        try {
            out.println("Try to connect");
            Connection connection = DriverManager.getConnection(url, usernameSQL, passwordSQL);

            // Query per recuperare l'utente
            String query = "SELECT * FROM player;";
            out.println(query);
            PreparedStatement statement = connection.prepareStatement(query);
//            out.println(query);
            // Esecuzione della query
            ResultSet resultSet = statement.executeQuery();

            out.println("ESEGUITA");
            out.println("<html><body>");

            if (resultSet.next()) {
                // Recupera i valori dalla riga del risultato
                String username = resultSet.getString("username");
                String email = resultSet.getString("email");
                String password = resultSet.getString("password");

                // Stampa i dettagli dell'utente
                out.println("<h1>User Details</h1>");
                out.println("<p>Username: " + username + "</p>");
                out.println("<p>Email: " + email + "</p>");
                // Non si consiglia di stampare la password direttamente in un'applicazione reale
            } else {
                out.println("<h1>User not found</h1>");
            }

            out.println("</body></html>");

            // Chiusura delle risorse
            resultSet.close();
            statement.close();
            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
            out.println("ERROR");
            out.println(e);
        }
    }

    public void destroy() {
    }
}
