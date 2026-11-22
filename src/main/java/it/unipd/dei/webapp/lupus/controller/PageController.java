package it.unipd.dei.webapp.lupus.controller;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Page routes (replaces HomePageServlet, UserPageServlet, NewGameServlet, CurrentGameServlet, RulesServlet).
 * Every page is rendered by the React app: the handler forwards to /index.html instead of a JSP.
 * Access checks are done by PagesFilter / UserFilter.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
@Controller
public class PageController {

    private static final Logger LOGGER = LogManager.getLogger(PageController.class,
            StringFormatterMessageFactory.INSTANCE);

    private static final String INDEX = "/index.html";

    private final DataSource ds;

    public PageController(DataSource ds) {
        this.ds = ds;
    }

    @GetMapping("/home")
    public void home(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        req.getRequestDispatcher(INDEX).forward(req, res);
    }

    @GetMapping({"/rules"})
    public void rules(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        // roles are loaded by the React page from GET /api/rules/roles
        req.getRequestDispatcher(INDEX).forward(req, res);
    }

    @GetMapping({"/newVillage", "/newvillage"})
    public void newVillage(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        req.getRequestDispatcher(INDEX).forward(req, res);
    }

    @GetMapping({"/habitant", "/habitant/**"})
    public void habitant(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        if (req.getSession(false) == null || req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE) == null) {
            res.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        String uri = req.getRequestURI();
        if (uri.endsWith("/me")) {
            req.getRequestDispatcher(INDEX).forward(req, res);
            return;
        }

        String username = uri.substring(req.getContextPath().length() + "/habitant/".length());
        if (username.isEmpty()) {
            String requested = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
            res.sendRedirect(req.getContextPath() + "/habitant/" + requested);
            return;
        }

        try {
            Player player = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();
            if (player == null) {
                res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                req.getRequestDispatcher(INDEX).forward(req, res);
                return;
            }
            if (!username.equals(player.getUsername())) {
                res.sendRedirect(req.getContextPath() + "/habitant/" + player.getUsername());
                return;
            }
        } catch (SQLException e) {
            res.setStatus(ErrorCode.INTERNAL_ERROR.getHTTPCode());
            LOGGER.error("stacktrace:", e);
            return;
        }

        req.getRequestDispatcher(INDEX).forward(req, res);
    }

    @GetMapping({"/village", "/village/**"})
    public void village(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        // if the user isn't logged in, redirect to login page
        if (req.getSession(false) == null) {
            res.sendRedirect(req.getContextPath() + "/login");
            return;
        }

        String gameMaster = (String) req.getSession().getAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE);
        String[] urlParts = req.getRequestURI().substring(req.getContextPath().length()).split("/");

        // /village without public game ID: redirect to the user's game, or to the homepage
        if (urlParts.length == 2) {
            String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
            try {
                int privateGameID = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), username).access().getOutputParam();
                Game game = new GetGameByGameIdDAO(ds.getConnection(), privateGameID).access().getOutputParam();
                if (game == null)
                    res.sendRedirect(req.getContextPath() + "/home");
                else
                    res.sendRedirect(req.getContextPath() + "/village/" + game.getPublic_ID());
                return;
            } catch (SQLException e) {
                res.setStatus(ErrorCode.INTERNAL_ERROR.getHTTPCode());
                LOGGER.info("Internal error");
                return;
            }
        }

        String gameId = req.getRequestURI().endsWith("/master")
                ? urlParts[urlParts.length - 2]
                : urlParts[urlParts.length - 1];

        try {
            int privateGameID = new GetGameIdFormPublicGameIdDAO(ds.getConnection(), gameId).access().getOutputParam();
            Game game = new GetGameByGameIdDAO(ds.getConnection(), privateGameID).access().getOutputParam();
            if (game == null) {
                res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                req.getRequestDispatcher(INDEX).forward(req, res);
                return;
            }
        } catch (SQLException e) {
            res.setStatus(ErrorCode.INTERNAL_ERROR.getHTTPCode());
            LOGGER.info("Internal error");
        }

        // master page / user page: redirect to the right mode
        if (!req.getRequestURI().endsWith("/master") && gameId.equals(gameMaster)) {
            res.sendRedirect(req.getRequestURI() + "/master");
            return;
        }
        if (req.getRequestURI().endsWith("/master") && !gameId.equals(gameMaster)) {
            res.sendRedirect(req.getRequestURI().replace("/master", ""));
            return;
        }
        req.getRequestDispatcher(INDEX).forward(req, res);
    }
}
