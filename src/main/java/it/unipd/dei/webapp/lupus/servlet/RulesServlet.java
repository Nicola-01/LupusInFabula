package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SelectRoleByTypeDAO;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Role;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a servlet for handling requests related to displaying game rules.
 * <p>
 * This servlet handles GET requests initiated to display game rules by retrieving role information from the database
 * based on their types. It retrieves role information for each role type and forwards it to the rules.jsp view for
 * rendering. If an error occurs during the retrieval process, an appropriate error message is sent to the client.
 * </p>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public final class RulesServlet extends AbstractDatabaseServlet {

    /**
     * Handles the GET request for displaying game rules.
     * <p>
     * This method processes the GET request sent by the client to display game rules. It retrieves role information
     * from the database for each role type and forwards it to the rules.jsp view for rendering. If an error occurs
     * during the retrieval process, an appropriate error message is sent to the client.
     * </p>
     *
     * @param req  the HTTP servlet request
     * @param resp the HTTP servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs while processing the request
     */
    public void doGet(final HttpServletRequest req, final HttpServletResponse resp) throws ServletException, IOException {

        //LogContext.setIPAddress(req.getRemoteAddr());
        //LogContext.setAction(Actions.SELECT_ROLE_BY_TYPE);
        List<List<Role>> roles = new ArrayList<>();
        Message m = null;

        try {

            for (int i = 0; i < 4; i++) {
                roles.add(new SelectRoleByTypeDAO(getConnection(), i).access().getOutputParam());
                LOGGER.info("Roles successfully selected by type: %d", i);
            }
            m = new Message("Roles successfully selected");
            LOGGER.info("Roles successfully selected by type");

        } catch (SQLException e) {
            m = new Message("Cannot search for roles: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for roles: unexpected error while accessing the database.", e);
        }

        try {
            req.setAttribute("roles", roles);
            req.setAttribute("m", m);
            req.getRequestDispatcher("/jsp/rules.jsp").forward(req, resp);
        } catch (Exception e) {
            LOGGER.error("Unable to send response when creating the roles list", e);
            throw e;
        } finally {
            //LogContext.removeIPAddress()
            //LogContext.removeAction();
            //LogContext.removeUser();
        }

    }

}
