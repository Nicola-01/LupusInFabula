package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.Auth;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Filter to manage access to Master protected resources.<br>
 * This filter allows access to certain resources only to the game master,
 * such as returning all information when the game is not yet finished.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameMasterFilter implements Filter {
    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(GameMasterFilter.class,
            StringFormatterMessageFactory.INSTANCE);

    /**
     * The name of the (former session) attribute with the public id of the game the user masters.
     * Not stored anymore: the value is computed by {@link Auth#masterGame}.
     */
    public static final String GAMEMASTER_ATTRIBUTE = "gamemaster";

    /**
     * The connection pool to the database.
     */
    private DataSource ds;

    /**
     * Creates the filter with the Spring-managed DataSource.
     *
     * @param ds the connection pool to the database.
     */
    public GameMasterFilter(DataSource ds) {
        this.ds = ds;
    }

    @Override
    public void init(final FilterConfig config) throws ServletException {
        if (config == null) {
            LOGGER.error("Filter configuration cannot be null.");
            throw new ServletException("Filter configuration cannot be null.");
        }
    }

    @Override
    public void doFilter(final ServletRequest servletRequest, final ServletResponse servletResponse, final FilterChain chain) throws
            IOException, ServletException {

        LogContext.setIPAddress(servletRequest.getRemoteAddr());
        LogContext.setAction(Actions.AUTHENTICATE_MASTER);

        try {
            if (!(servletRequest instanceof HttpServletRequest req) || !(servletResponse instanceof HttpServletResponse res)) {
                LOGGER.error("Only HTTP requests/responses are allowed.");
                throw new ServletException("Only HTTP requests/responses are allowed.");
            }

            Player player = Auth.currentPlayer(req);
            if (player != null)
                LogContext.setUser(player.getUsername());

            LOGGER.info("request URL =  %s", req.getRequestURL());
            String path = req.getRequestURI();
            path = path.substring(req.getContextPath().length());

            // this filter accept only request that start with /game/* and end with /master
            if (path.startsWith("/game") && (path.endsWith("/master"))) {
                // if the path contain /master check if the user is the master in the game

                if (player == null) {
                    LOGGER.warn("Authentication required to access resource %s with method %s.", req.getRequestURI(),
                            req.getMethod());

                    ErrorCode ec = ErrorCode.NOT_LOGGED;
                    res.setStatus(ec.getHTTPCode());
                    Message m = new Message("Authentication required, not logged in", ec.getErrorCode(), ec.getErrorMessage());

                    m.toJSON(res.getOutputStream());
                    return; // in this case the master is not even logged in
                }

                // n.b. there isn't a check if the URL is correct, since the GameDispatcherServlet does that job.
                path = path.replace("/master", "");
                final String publicGame = path.substring(path.lastIndexOf("/") + 1);
                LogContext.setGame(publicGame);

                LOGGER.info("Public GameId found on URL: " + publicGame);

                // the game the user masters, empty if none: it must be the game of the URL
                if (!publicGame.equals(Auth.masterGame(ds, player.getUsername()))) {
                    LOGGER.warn("%s is not the game master of game %s", player.getUsername(), publicGame);

                    ErrorCode ec = ErrorCode.DIFFERENT_GAME_SESSION;
                    res.setStatus(ec.getHTTPCode());

                    Message m = new Message("You are not the game master of the game \'" + publicGame + "\'.", ec.getErrorCode(), ec.getErrorMessage());
                    m.toJSON(res.getOutputStream());
                    return;
                }
            }

            // the user is properly authenticated and in session, continue the processing
            chain.doFilter(servletRequest, servletResponse);
        } catch (SQLException ex) {
            throw new RuntimeException(ex);
        } catch (Exception e) {
            LOGGER.error("Unable to perform the protected resource filtering.", e);
            throw e;
        } finally {
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeGame();
        }
    }

    @Override
    public void destroy() {
        ds = null;
    }
}
