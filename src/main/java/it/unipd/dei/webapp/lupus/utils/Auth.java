package it.unipd.dei.webapp.lupus.utils;

import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetMasterFromIdGameDAO;
import it.unipd.dei.webapp.lupus.dao.PlayerInGameDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Player;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.context.support.WebApplicationContextUtils;
import java.util.UUID;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.time.Duration;

/**
 * Authentication helpers: the login state is a JWT in the {@link #COOKIE} cookie, no HTTP session.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public final class Auth {

    private static final Logger LOGGER = LogManager.getLogger(Auth.class);

    /** Name of the cookie that holds the JWT. */
    public static final String COOKIE = "lupusToken";

    private static final long KEEP_LOGGED_SECONDS = Duration.ofDays(30).getSeconds();
    private static final long SESSION_SECONDS = Duration.ofHours(12).getSeconds();

    private Auth() {
    }

    /**
     * Returns the authenticated player. Uses the request attribute set by {@link UserFilter}, or else checks the
     * cookie and loads the player from the database (and stores it in the request attribute).
     *
     * @param req the current request.
     * @return the player, or null if not authenticated (also when the database fails or the account is deleted).
     */
    public static Player currentPlayer(HttpServletRequest req) {
        Object attribute = req.getAttribute(UserFilter.USER_ATTRIBUTE);
        if (attribute instanceof Player p)
            return p;

        String username = null;
        Cookie[] cookies = req.getCookies();
        if (cookies != null)
            for (Cookie c : cookies)
                if (COOKIE.equals(c.getName()))
                    username = Jwt.verify(c.getValue());
        if (username == null)
            return null;

        try {
            DataSource ds = WebApplicationContextUtils.getRequiredWebApplicationContext(req.getServletContext())
                    .getBean(DataSource.class);
            Player p = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();
            // a deleted account has its username equal to its email (see LoginSignupController)
            if (p == null || p.getUsername().equals(p.getEmail()))
                return null;

            req.setAttribute(UserFilter.USER_ATTRIBUTE, p);
            return p;
        } catch (SQLException e) {
            LOGGER.error("Unable to load the authenticated player", e);
            return null;
        }
    }

    /**
     * Returns the public id of the game in progress where the user is the master.
     *
     * @param ds       the connection pool.
     * @param username the user.
     * @return the public game id, or an empty string if the user is not the master of a game in progress.
     * @throws SQLException if a database access error occurs.
     */
    public static String masterGame(DataSource ds, String username) throws SQLException {
        UUID gameID = new GetGameIdByPlayerUsernameDAO(ds.getConnection(), username).access().getOutputParam();
        if (gameID == null)
            return "";

        String master = new GetMasterFromIdGameDAO(ds.getConnection(), gameID).access().getOutputParam();
        if (!username.equals(master))
            return "";

        String publicGameID = new PlayerInGameDAO(ds.getConnection(), username).access().getOutputParam();
        return publicGameID == null ? "" : publicGameID;
    }

    /**
     * Sets the login cookie for the user.
     *
     * @param req        the current request (for the Secure flag).
     * @param res        the response.
     * @param username   the user who logged in.
     * @param keepLogged true for a 30 days cookie with Max-Age, false for a 12 hours token in a browser session cookie.
     */
    public static void setCookie(HttpServletRequest req, HttpServletResponse res, String username, boolean keepLogged) {
        long ttl = keepLogged ? KEEP_LOGGED_SECONDS : SESSION_SECONDS;
        ResponseCookie.ResponseCookieBuilder builder = cookie(req, Jwt.issue(username, ttl));
        if (keepLogged)
            builder.maxAge(Duration.ofSeconds(ttl));
        res.addHeader(HttpHeaders.SET_COOKIE, builder.build().toString());
    }

    /**
     * Removes the login cookie from the browser.
     *
     * @param req the current request (for the Secure flag).
     * @param res the response.
     */
    public static void clearCookie(HttpServletRequest req, HttpServletResponse res) {
        res.addHeader(HttpHeaders.SET_COOKIE, cookie(req, "").maxAge(Duration.ZERO).build().toString());
    }

    /**
     * Reads the username from a raw {@code Cookie} header (used by the WebSocket handshake).
     *
     * @param cookieHeader the value of the Cookie header, may be null.
     * @return the username, or null if the cookie is missing or not valid.
     */
    public static String usernameFromCookieHeader(String cookieHeader) {
        if (cookieHeader == null)
            return null;

        for (String part : cookieHeader.split(";")) {
            String[] nameValue = part.trim().split("=", 2);
            if (nameValue.length == 2 && COOKIE.equals(nameValue[0]))
                return Jwt.verify(nameValue[1]);
        }
        return null;
    }

    private static ResponseCookie.ResponseCookieBuilder cookie(HttpServletRequest req, String value) {
        boolean secure = req.isSecure() || "https".equalsIgnoreCase(req.getHeader("X-Forwarded-Proto"));
        return ResponseCookie.from(COOKIE, value)
                .httpOnly(true)
                .path("/")
                .sameSite("Lax")
                .secure(secure);
    }
}
