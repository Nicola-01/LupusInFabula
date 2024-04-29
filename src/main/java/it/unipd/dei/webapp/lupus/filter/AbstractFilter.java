package it.unipd.dei.webapp.lupus.filter;

import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;

/**
 * Abstract base class for HTTP filters providing common functionality.
 * <p>
 * Subclasses can use the {@code logger} field for logging purposes.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class AbstractFilter extends HttpFilter {

    /**
     * The logger for this filter.
     */
    protected Logger logger;

    @Override
    public void init(FilterConfig config) throws ServletException {
        // If you have any <init-param> in web.xml, then you could get them
        // here by config.getInitParameter("name") and assign it as field.
        logger = LogManager.getLogger(this.getClass());

    }

    @Override
    public void destroy() {
        // If you have assigned any expensive resources as field of
        // this Filter class, then you could clean/close them here.
    }

    /**
     * Writes an error response with the specified error code.
     *
     * @param res the HTTP servlet response.
     * @param ec  the error code to be written.
     * @throws IOException if an I/O error occurs while writing the response.
     */
    public void writeError(HttpServletResponse res, ErrorCode ec) throws IOException {
        res.setStatus(ec.getHTTPCode());
//        res.getWriter().write(ec.toJSON().toString());
    }
}
