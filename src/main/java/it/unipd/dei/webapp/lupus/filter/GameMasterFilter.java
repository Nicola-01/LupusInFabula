package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetMasterFromIdGameDAO;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Base64;

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
     * The Base64 Decoder
     */
    private static final Base64.Decoder DECODER = Base64.getDecoder();

    /**
     * The name of the user attribute in the session
     */
    public static final String GAMEMASTER_ATTRIBUTE = "gamemaster";

    /**
     * The configuration for the filter
     */
    private FilterConfig config = null;

    /**
     * The connection pool to the database.
     */
    private DataSource ds;


    @Override
    public void init(final FilterConfig config) throws ServletException {

        if (config == null) {
            LOGGER.error("Filter configuration cannot be null.");
            throw new ServletException("Filter configuration cannot be null.");
        }
        this.config = config;

        // the JNDI lookup context
        InitialContext cxt;

        try {
            cxt = new InitialContext();
            ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/lupusdb");
        } catch (NamingException e) {
            ds = null;

            LOGGER.error("Unable to acquire the connection pool to the database.", e);
            throw new ServletException("Unable to acquire the connection pool to the database", e);
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


            LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

            LOGGER.info("request URL =  %s", req.getRequestURL());
            String path = req.getRequestURI();

            // this filter accept only request that start with /game/* and end with /master
            if (path.startsWith("/lupus/game") && (path.endsWith("/master") || path.contains("/actions/")) ) {
                // if the path contain /master check if the user is the master in the game

                final HttpSession session = req.getSession(false);


                // if the session not exists
                if (session == null) {
                    LOGGER.warn("Authentication required to access resource %s with method %s.", req.getRequestURI(),
                            req.getMethod());

                    ErrorCode ec = ErrorCode.NOT_LOGGED;
                    res.setStatus(ec.getHTTPCode());
                    Message m = new Message("Authentication required, not logged in", ec.getErrorCode(), ec.getErrorMessage());

                    m.toJSON(res.getOutputStream());
                    return; // in this case the master is not even logged in
                } else {
                    // n.b there isn't a check if the URL is correct, since the GameDispatcherServlet does that job.

                    path = path.replace("/master", "");
                    final String publicGame = path.substring(path.lastIndexOf("/") + 1);
                    LogContext.setGame(publicGame);

                    LOGGER.info("Pubblic GameId found on URL: " + publicGame);
                    int gameID = new GetGameIdFormPublicGameIdDAO(ds.getConnection(), publicGame).access().getOutputParam();

                    final Object gmAttribute = session.getAttribute(GAMEMASTER_ATTRIBUTE);

                    // there might exist a session but without any master in it
                    if (gmAttribute == null) {

                        LOGGER.warn(
                                "Authentication required to access resource %s with method %s. Session %s exists but no GameID found in session.",
                                req.getRequestURI(), req.getMethod(), session.getId());

                        // Attempt to authenticate the master even if they don't have the "gamemaster" session attribute.
                        // This filter is executed after the UserFilter, so the login session attribute is already valid.
                        Player currentPlayer = (Player) session.getAttribute(UserFilter.USER_ATTRIBUTE); // master's username
                        LOGGER.info("Trying to authenticate the currentPlayer %s as a gamemaster in the game %d", currentPlayer.getUsername(), gameID);

                        String masterOfGame = new GetMasterFromIdGameDAO(ds.getConnection(), gameID).access().getOutputParam();

                        if (masterOfGame == null) {
                            LOGGER.warn("There is no game with id %s", publicGame);

                            ErrorCode ec = ErrorCode.NO_GAME_SESSION;
                            res.setStatus(ec.getHTTPCode());
                            Message m = new Message("There is no game with id " + publicGame, ec.getErrorCode(), ec.getErrorMessage());

                            m.toJSON(res.getOutputStream());
//                            res.sendRedirect(req.getContextPath() + "/jsp/home.jsp");
                            return;
                        } else if (!masterOfGame.equals(currentPlayer.getUsername())) {
                            LOGGER.warn("%s is not the gamemaster in game %s", currentPlayer.getUsername(), publicGame);

                            ErrorCode ec = ErrorCode.NOT_MASTER;
                            res.setStatus(ec.getHTTPCode());
                            Message m = new Message("You are not the gamemaster in game \'" + publicGame + "\'.", ec.getErrorCode(), ec.getErrorMessage());

                            m.toJSON(res.getOutputStream());
//                            res.sendRedirect(req.getContextPath() + "/jsp/home.jsp");
                            return;
                        } else {
                            // the player is the master in the game
                            session.setAttribute(GAMEMASTER_ATTRIBUTE, gameID);
                        }

                    } else {
                        int sessionGameID = (int) gmAttribute;
                        // check if it's the same game
                        if (sessionGameID != gameID) {
                            LOGGER.warn("Different gameID");

                            ErrorCode ec = ErrorCode.DIFFERENT_GAME_SESSION;
                            res.setStatus(ec.getHTTPCode());

                            Message m = new Message("You are not the game master of the game \'" + publicGame + "\'.", ec.getErrorCode(), ec.getErrorMessage());
                            LOGGER.warn("Different gameID founded: %d != %d", sessionGameID, gameID);

                            m.toJSON(res.getOutputStream());
//                            res.sendRedirect(req.getContextPath() + "/jsp/home.jsp");
                            return;
                        }
                        // else the player is the master in the game
                    }
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
        config = null;
        ds = null;
    }

}
