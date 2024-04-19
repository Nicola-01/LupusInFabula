package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.dao.*;
import it.unipd.dei.webapp.lupus.resource.*;
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
import java.util.Base64;

public class UserFilter implements Filter {
    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(UserFilter.class,
            StringFormatterMessageFactory.INSTANCE);


    /**
     * The Base64 Decoder
     */
    private static final Base64.Decoder DECODER = Base64.getDecoder();

    /**
     * The name of the user attribute in the session
     */
    public static final String USER_ATTRIBUTE = "user";

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

        /*
        Here we could pass configuration parameters to the filter, if needed.
         */

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

        try {
            if (!(servletRequest instanceof HttpServletRequest) || !(servletResponse instanceof HttpServletResponse)) {
                LOGGER.error("Only HTTP requests/responses are allowed.");
                throw new ServletException("Only HTTP requests/responses are allowed.");
            }

            // Safe to downcast at this point.
            final HttpServletRequest req = (HttpServletRequest) servletRequest;
            final HttpServletResponse res = (HttpServletResponse) servletResponse;

            LOGGER.info("request URL =  %s", req.getRequestURL());

            final HttpSession session = req.getSession(false);

            // if we do not have a session, try to authenticate the user
            if (session == null) {

                LOGGER.warn("Authentication required to access resource %s with method %s.", req.getRequestURI(),
                        req.getMethod());

                if (!authenticateUser(req, res)) {
                    return;
                }
            } else {

                final Player player = (Player) session.getAttribute(USER_ATTRIBUTE);

                // there might exist a session but without any user in it
                if (player == null) {

                    // invalidate the session
                    session.invalidate();

                    LOGGER.warn(
                            "Authentication required to access resource %s with method %s. Session %s exists but no user found in session. Session invalidated.",
                            req.getRequestURI(), req.getMethod(), session.getId());


                    // try to authenticate the user
                    if (!authenticateUser(req, res)) {
                        return;
                    }

                }
            }

            // the user is properly authenticated and in session, continue the processing
            chain.doFilter(servletRequest, servletResponse);
        } catch (Exception e) {
            LOGGER.error("Unable to perform the protected resource filtering.", e);
            throw e;
        } finally {
            LogContext.removeUser();
            LogContext.removeIPAddress();
            LogContext.removeAction();
        }
    }

    @Override
    public void destroy() {
        config = null;
        ds = null;
    }

    /**
     * Authenticates the user.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @return {@code true} if the user has been successfully authenticated; {@code false otherwise}.
     */
    private boolean authenticateUser(HttpServletRequest req, HttpServletResponse res) {

        LogContext.setAction(Actions.AUTHENTICATE_USER);
        LOGGER.info("Trying to authenticate the user");

        try {
            // get the authorization information
            final String auth = req.getHeader("Authorization");

            // if there is no authorization information, send the authentication challenge again
            if (auth == null || auth.isBlank()) {

                LOGGER.info("No authorization header sent by the client.");

                sendAuthenticationChallenge(res);

                return false;
            }

            // if it is not HTTP Basic authentication, send the authentication challenge again
            if (!auth.toUpperCase().startsWith("BASIC ")) {

                LOGGER.warn("Basic authentication is expected. Clients sent instead: %s", auth);

                sendAuthenticationChallenge(res);

                return false;
            }

            // perform Base64 decoding
            final String pair = new String(DECODER.decode(auth.substring(6)));

            // userDetails[0] is the username; userDetails[1] is the password
            final String[] userDetails = pair.split(":", 2);

            // if the user is successfully authenticated, create a Session and store the user there
            Player player = new LoginPlayerDAO(ds.getConnection(), userDetails[0], userDetails[1]).access().getOutputParam();
            if (player != null) {
                // create a  new session
                HttpSession session = req.getSession(true);

                session.setAttribute(USER_ATTRIBUTE, player);

                return true;
            }

            // as a fallback, always send the authentication challenge again
            sendAuthenticationChallenge(res);
        } catch (Exception e) {
            LOGGER.error("Unable to authenticate the user.", e);
        } finally {
            LogContext.removeAction();
        }

        return false;
    }

    /**
     * Sends the authentication challenge.
     *
     * @param res the HTTP servlet response.
     * @throws IOException if anything goes wrong while sending the authentication challenge.
     */
    private void sendAuthenticationChallenge(HttpServletResponse res) throws IOException {

        try {
            res.setHeader("WWW-Authenticate", "Basic realm=Player");

            res.sendError(HttpServletResponse.SC_UNAUTHORIZED);

            LOGGER.info("Basic Authentication Challenge sent.");
        } catch (Exception e) {
            LOGGER.error("Unable to send authentication challenge.", e);
            throw e;
        }
    }

}
