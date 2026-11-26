package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.utils.Auth;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;

import javax.sql.DataSource;
import java.io.IOException;

/**
 * Filter to manage access to the HTML pages: redirects to the login page when the user is not authenticated.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class PagesFilter implements Filter {
    /**
     * A LOGGER available for all the subclasses.
     */
    protected static final Logger LOGGER = LogManager.getLogger(PagesFilter.class,
            StringFormatterMessageFactory.INSTANCE);

    /**
     * The DataSource is not used here (the player is read by {@link Auth}); the parameter keeps the
     * call in {@code FilterConfig}.
     *
     * @param ds unused.
     */
    public PagesFilter(DataSource ds) {
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

                res.sendRedirect(req.getContextPath() + "/login");
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
