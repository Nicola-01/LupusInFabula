package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.rest.*;
import it.unipd.dei.webapp.lupus.rest.DeleteFriendRR;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Represents a servlet responsible for dispatching requests related to user resources in the Lupus web application.
 * <p>
 * This servlet handles various HTTP methods (GET, PUT, DELETE) for user-related operations, such as retrieving user information, updating user profiles, managing friends, and
 * accessing user logs and statistics. It parses the incoming requests and delegates them to specific REST resources
 * (Request Resources - RR) based on the requested URI and HTTP method. If the requested URI or method is not supported,
 * it returns an appropriate error response.
 * </p>
 * Supported URIs:
 * <ul>
 *     <li>/user/me: Operations related to the current user's profile</li>
 *     <li>/user/me/friend: Operations related to managing the current user's friends</li>
 *     <li>/user/{username}/logs: Operations related to accessing logs for a specific user</li>
 *     <li>/user/{username}/statistic: Operations related to accessing statistics for a specific user</li>
 *     <li>/user/{username}: Operations related to accessing profile information of a specific user</li>
 * </ul>
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class UserDispatcherServlet extends AbstractDatabaseServlet {

    /**
     * Represents the JSON media type with UTF-8 encoding.
     */
    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    /**
     * Processes incoming HTTP requests and dispatches them to specific REST resources based on the requested URI
     * and HTTP method.
     *
     * @param req  the HTTP servlet request
     * @param resp the HTTP servlet response
     * @throws IOException if an I/O error occurs while processing the request
     */
    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse resp) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction(Actions.USER_DISPATCHER_ACTION);
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

        final OutputStream out = resp.getOutputStream();

        try {
            // if the requested resource was a Game, delegate its processing and return
            if (processUser(req, resp)) {
                return;
            }

            // if none of the above process methods succeeds, it means an unknown resource has been requested
            LOGGER.warn("Unknown resource requested: %s.", req.getRequestURI());

            ErrorCode ec = ErrorCode.UNKNOWN_RESOURCE;
            final Message m = new Message("Unknown resource requested.", ec.getErrorCode(),
                    String.format("Requested resource is %s.", req.getRequestURI()));
            resp.setStatus(ec.getHTTPCode());

            resp.setContentType(JSON_UTF_8_MEDIA_TYPE);
            m.toJSON(out);

        } catch (Throwable t) {

            LOGGER.error("Unexpected error while processing the REST resource.", t);

            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            final Message m = new Message("Unexpected error.", ec.getErrorCode(), t.getMessage());
            resp.setStatus(ec.getHTTPCode());
            m.toJSON(resp.getOutputStream());

        } finally {

            // ensure to always flush and close the output stream
            if (out != null) {
                out.flush();
                out.close();
            }

            LogContext.removeAction();
            LogContext.removeIPAddress();
            LogContext.removeUser();
        }
    }

    /**
     * Processes user-related requests based on the requested URI and HTTP method and delegates them to specific REST
     * resources (Request Resources - RR).
     * <p>
     * This method examines the requested URI and method to determine the type of user-related operation being
     * requested. It then delegates the request to the appropriate REST resource (RR) for further processing. If the
     * requested URI or method is not supported, it returns an appropriate error response.
     * </p>
     *
     * @param req  the HTTP servlet request
     * @param resp the HTTP servlet response
     * @return {@code true} if the request was successfully processed and dispatched, {@code false} otherwise
     * @throws Exception if an error occurs while processing the request
     */
    private boolean processUser(final HttpServletRequest req, final HttpServletResponse resp) throws Exception {

        //take the method and the URI of the request
        final String method = req.getMethod();
        String uri = req.getRequestURI();
        Message m;

        //check if the url contains "/user". If not, return false because this method doesn't handle that uri
        if (!uri.contains("/user"))
            return false;

        //save the path /user/... into a variable
        String path = uri.substring(uri.lastIndexOf("/lupus/user") + 11);

        //possible URIs: /user/me , /user/me/{username} , /user/me/friend
        if (path.contains("/me")) {

            //manage the URI /user/me
            if (path.equals("/me")) {

                switch (method) {
                    case "GET":
                        String username = ((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                        LOGGER.info("GET with /me");
                        new UserUsernameGetRR(username, req, resp, getDataSource()).serve();
                        break;
                    case "PUT":
                        new UserMePutRR(req, resp, getDataSource()).serve();
                        break;
                    case "DELETE":
                        new UserMeDeleteRR(req, resp, getDataSource()).serve();
                        break;
                    default:
                        LOGGER.warn("Unknown method: %s.", method);

                        ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                        m = new Message("Unsuported operation for URI /user/me.", ec.getErrorCode(),  String.format("Requested operation %s, but required PUT or DELETE.", method));
                        resp.setStatus(ec.getHTTPCode());
                        m.toJSON(resp.getOutputStream());
                        break;
                }

            }
            //manage the URI: /user/me/friend
            else if (path.contains("/friend")) {

                switch (method) {
                    case "GET":
                        new ListFriendsRR(req, resp, getDataSource()).serve();
                        LOGGER.info("Getting user's friend");
                        break;
                    case "POST":
                        new AddFriendRR(req, resp, getDataSource()).serve();
                        LOGGER.info("Posting user's friend");
                        break;
                    case "DELETE":
                        new DeleteFriendRR(req, resp, getDataSource()).serve();
                        LOGGER.info("Deleting user's friend");
                        break;
                    default:
                        LOGGER.warn("Unknown method: %s.", method);

                        ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                        m = new Message("Unsuported operation for URI /user/me/friend.", ec.getErrorCode(),  String.format("Requested operation %s, but required GET, POST or DELETE.", method));
                        resp.setStatus(ec.getHTTPCode());
                        m.toJSON(resp.getOutputStream());
                        break;
                }

            } else {
                ErrorCode ec = ErrorCode.UNKNOWN_RESOURCE;
                LOGGER.warn("Unknown URI: %s.", uri);
                m = new Message("Unknown URI", ec.getErrorCode(), String.format("This is URI (%s) isn't supported", uri));
                resp.setStatus(ec.getHTTPCode());
                m.toJSON(resp.getOutputStream());

            }

        }
        //possible URIs: /user/{username}/logs , /user/{username}/statistic
        else if (path.contains("/logs") || path.contains("/statistic")) {
            //takes username from the URI
            String username = uri.split("/")[3];

            if (path.contains("/logs") && method.equals("GET")) {

                new UserLogsGetRR(username,req, resp, getDataSource()).serve();
                LOGGER.info("Getting user's logs");

            } else if (path.contains("/statistic") && method.equals("GET")) {

                new UserStatisticGetRR(username, req, resp, getDataSource()).serve();
                LOGGER.info("Getting user's statistic");

            } else {
                LOGGER.warn("Unknown method: %s.", method);

                ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                m = new Message("Unsuported operation for URI /user/*/logs or /user/*/statistic.", ec.getErrorCode(), String.format("Requested operation %s, but required GET.", method));
                resp.setStatus(ec.getHTTPCode());
                m.toJSON(resp.getOutputStream());

            }

        }
        else if (path.contains("/search/")){
            if (method.equals("GET")) {
                String username =  uri.substring(uri.lastIndexOf("/") + 1);
                new SearchPlayerRR(username, req, resp, getDataSource()).serve();

            } else {
                LOGGER.warn("Unknown method: %s.", method);

                ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                m = new Message("Unsupported operation for URI /search/{username}.", ec.getErrorCode(), String.format("Requested operation %s, but required GET.", method));
                resp.setStatus(ec.getHTTPCode());
                m.toJSON(resp.getOutputStream());
            }
        }
        //possible URI: /user/{username}
        else if (new SearchPlayerByUsernameDAO(getConnection(), uri.substring(uri.lastIndexOf("/") + 1)).access().getOutputParam() != null) {

            if (method.equals("GET")) {

                String username =  uri.substring(uri.lastIndexOf("/") + 1);
                new UserUsernameGetRR(username, req, resp, getDataSource()).serve();
                LOGGER.info("GET without /me ");

            } else {
                LOGGER.warn("Unknown method: %s.", method);

                ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                m = new Message("Unsupported operation for URI /user/{username}.", ec.getErrorCode(), String.format("Requested operation %s, but required GET.", method));
                resp.setStatus(ec.getHTTPCode());
                m.toJSON(resp.getOutputStream());

            }

        } else
            return false;

        return true;

    }

}
