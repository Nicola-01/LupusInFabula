package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;

public class LoginFilter extends AbstractFilter {

    final static Logger LOGGER = LogManager.getLogger(LoginFilter.class);

    @Override
    public void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {

        HttpSession session = req.getSession(false);

//        LOGGER.info("Filtering session");

        if (session != null && session.getAttribute("user") != null) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            chain.doFilter(req, res); // User is logged in, just continue request.
//            LOGGER.info("Filtering session : " + ((Player) session.getAttribute("player")).getUsername());
        } else {
            res.sendRedirect(req.getContextPath() + "/jsp/login.jsp"); // Not logged in, show login page.
        }

    }

}
