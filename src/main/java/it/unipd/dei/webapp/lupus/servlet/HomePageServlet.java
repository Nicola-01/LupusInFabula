package it.unipd.dei.webapp.lupus.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class HomePageServlet extends AbstractDatabaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getSession(false) == null)
            resp.sendRedirect(req.getContextPath() + "/login");
        else
            req.getRequestDispatcher("/jsp/home.jsp").forward(req, resp);
    }
}
