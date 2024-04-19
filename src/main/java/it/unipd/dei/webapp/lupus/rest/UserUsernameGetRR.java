package it.unipd.dei.webapp.lupus.rest;

import it.unipd.dei.webapp.lupus.resource.Actions;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.tomcat.jdbc.pool.DataSource;

import java.io.IOException;

public class UserUsernameGetRR extends AbstractRR {

    public UserUsernameGetRR(final HttpServletRequest req, final HttpServletResponse res, DataSource ds) {
        super(Actions.GET_USERNAME, req, res, ds);
    }

    @Override
    protected void doServe() throws IOException {
        // TODO --> after logs and statistic are finished
    }
}
