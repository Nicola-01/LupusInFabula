package it.unipd.dei.webapp.lupus.servlet;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;

public abstract class AbstractDatabaseServlet extends HttpServlet {

    /**
     * The connection pool to the database.
     */
    private DataSource ds;
    Logger logger;


    public void init(ServletConfig config) throws ServletException {

        // the JNDI lookup context
        InitialContext cxt;
        super.init(config);
        logger = LogManager.getLogger(this.getClass());

        try {
            cxt = new InitialContext();
            ds = (DataSource) cxt.lookup("java:/comp/env/jdbc/lupusdb");
        } catch (NamingException e) {
            ds = null;

            throw new ServletException(
                    String.format("Impossible to access the connection pool to the database: %s",
                            e.getMessage()));
        }
    }

    /**
     * Releases the {@code DataSource} for managing the connection pool to the database.
     */
    public void destroy() {
        ds = null;
    }

    /**
     * Returns the {@code DataSource} for managing the connection pool to the database.
     *
     * @return the {@code DataSource} for managing the connection pool to the database
     */
    protected final DataSource getDataSource() {
        return ds;
    }

//    public void writeError(HttpServletResponse res, ErrorCode ec) throws IOException {
//        res.setStatus(ec.getHTTPCode());
//        res.getWriter().write(ec.toJSON().toString());
//    }


}

