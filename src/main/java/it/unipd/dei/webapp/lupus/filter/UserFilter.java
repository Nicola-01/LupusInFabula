package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.resource.*;
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

/**
 * Filter to manage access to the protected resources: the user is authenticated by the JWT cookie.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserFilter implements Filter {
    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(UserFilter.class,
            StringFormatterMessageFactory.INSTANCE);

    /**
     * The name of the request attribute that holds the authenticated {@link Player}.
     */
    public static final String USER_ATTRIBUTE = "user";

    /**
     * The DataSource is not used here (the player is read by {@link Auth}); the parameter keeps the
     * call in {@code FilterConfig}.
     *
     * @param ds unused.
     */
    public UserFilter(DataSource ds) {
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
        LogContext.setAction(Actions.AUTHENTICATE_USER);

        try {
            if (!(servletRequest instanceof HttpServletRequest req) || !(servletResponse instanceof HttpServletResponse res)) {
                LOGGER.error("Only HTTP requests/responses are allowed.");
                throw new ServletException("Only HTTP requests/responses are allowed.");
            }

            LOGGER.info("request URL =  %s", req.getRequestURL());

            if (Auth.currentPlayer(req) == null) {
                LOGGER.warn("Authentication required to access resource %s with method %s.", req.getRequestURI(),
                        req.getMethod());

                ErrorCode ec = ErrorCode.NOT_LOGGED;
                res.setStatus(ec.getHTTPCode());
                Message m = new Message("Authentication required", ec.getErrorCode(), ec.getErrorMessage());

                m.toJSON(res.getOutputStream());
                return;
            }

            // the user is properly authenticated, continue the processing
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
        // nothing to release
    }
}
