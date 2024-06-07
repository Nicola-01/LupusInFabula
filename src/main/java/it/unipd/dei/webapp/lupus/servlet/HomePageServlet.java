package it.unipd.dei.webapp.lupus.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Represents a servlet for handling requests related to the home page.
 * <p>
 * This servlet checks if a session exists for the user. If a session exists, it forwards the request to the home page
 * view for rendering. If no session exists, it redirects the user to the login page.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class HomePageServlet extends AbstractDatabaseServlet {

    /**
     * Handles the GET request for displaying the home page.
     * <p>
     * This method checks if a session exists for the user. If a session exists, it forwards the request to the configured
     * home page view for rendering. If no session exists, it redirects the user to the login page.
     * </p>
     *
     * @param req  the HTTP servlet request
     * @param resp the HTTP servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs while processing the request
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getSession(false) == null)
            resp.sendRedirect(req.getContextPath() + "/login");
        else
            req.getRequestDispatcher("/jsp/home.jsp").forward(req, resp);
    }
}
