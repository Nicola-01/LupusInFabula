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

public final class RulesServlet extends AbstractDatabaseServlet {

    public void doGet(final HttpServletRequest request, final HttpServletResponse response) throws ServletException, IOException {

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


        } catch (SQLException e) {
            m = new Message("Cannot search for roles: unexpected error while accessing the database.", "E200",
                    e.getMessage());
            LOGGER.info("Cannot search for roles: unexpected error while accessing the database.", e);
        }

        try {
            request.setAttribute("roles", roles);
            request.setAttribute("m", m);
            request.getRequestDispatcher("/jsp/rules.jsp").forward(request, response);
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
