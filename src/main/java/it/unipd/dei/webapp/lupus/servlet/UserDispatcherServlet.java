package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;

public class UserDispatcherServlet extends AbstractDatabaseServlet {

    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse resp) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        final OutputStream out = resp.getOutputStream();

        try {
            // if the requested resource was a Game, delegate its processing and return
            if (processUser(req, resp)) {
                return;
            }

            // if none of the above process methods succeeds, it means an unknown resource has been requested
            LOGGER.warn("Unknown resource requested: %s.", req.getRequestURI());

            final Message m = new Message("Unknown resource requested.", "E4A6",
                    String.format("Requested resource is %s.", req.getRequestURI()));
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.setContentType(JSON_UTF_8_MEDIA_TYPE);
            m.toJSON(out);

        } catch (Throwable t) {
            LOGGER.error("Unexpected error while processing the REST resource.", t);

            final Message m = new Message("Unexpected error.", "E5A1", t.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            m.toJSON(out);
        } finally {

            // ensure to always flush and close the output stream
            if (out != null) {
                out.flush();
                out.close();
            }

            LogContext.removeIPAddress();
        }
    }

    private boolean processUser(final HttpServletRequest req, final HttpServletResponse resp) throws Exception {

        //take the method and the URI of the request
        final String method = req.getMethod();
        String uri = req.getRequestURI();
        Message m;

        //check if the url contains "/user". If not, return false because this method doesn't handle that uri
        if (!uri.contains("/user"))
            return false;

        //save the path /user/... into a variable
        String path = uri.substring(uri.lastIndexOf("/user") + 5);

        //possible URIs: /user/me , /user/me/{username} , /user/me/friend
        if (path.contains("/me")) {

            //manage the URI /user/me
            if (path.equals("/me")) {

                switch (method) {
                    case "PUT":
                        //new UserMePutRR(req, resp, getConnection()).serve(); // TODO: Jacopo
                        LOGGER.info("Updating user");
                        break;
                    case "DELETE":
                        //new UserMeDeleteRR(req, resp, getConnection()).serve(); // TODO: Jacopo
                        LOGGER.info("Deleting user");
                        break;
                    default:
                        LOGGER.warn("Unknown method: %s.", method);
                        m = new Message("Unsuported operation for URI /user/me.", "E4A5",  String.format("Requested operation %s, but required PUT or DELETE.", method));
                        resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                        m.toJSON(resp.getOutputStream());
                        break;
                }

            }
            //manage the URI: /user/me/friend
            else if (path.contains("/friend")) {

                switch (method) {
                    case "GET":
                        //new UserMeFriendGetRR(req, resp, getConnection()).serve();
                        LOGGER.info("Getting user's friend");
                        break;
                    case "POST":
                        //new UserMeFriendPostRR(req, resp, getConnection()).serve();
                        LOGGER.info("Posting user's friend");
                        break;
                    case "DELETE":
                        //new UserMeFriendDeleteRR(req, resp, getConnection()).serve();
                        LOGGER.info("Deleting user's friend");
                        break;
                    default:
                        LOGGER.warn("Unknown method: %s.", method);
                        m = new Message("Unsuported operation for URI /user/me/friend.", "E4A5",  String.format("Requested operation %s, but required GET, POST or DELETE.", method));
                        resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                        m.toJSON(resp.getOutputStream());
                        break;
                }

            }

        }
        //possible URIs: /user/{username}/logs , /user/{username}/statistic
        else if (path.contains("/logs") || path.contains("/statistic")) {

            if (path.contains("/logs") && method.equals("GET")) {
                //new UserLogsGetRR(req, resp, getConnection()).serve();
                LOGGER.info("Getting user's logs");
            } else if (path.contains("/statistic") && method.equals("GET")) {
                //new UserStatisticGetRR(req, resp, getConnection()).serve();
                LOGGER.info("Getting user's statistic");
            } else {

                LOGGER.warn("Unknown method: %s.", method);
                m = new Message("Unsuported operation for URI /user/*/logs or /user/*/statistic}.", "E4A5", String.format("Requested operation %s, but required GET.", method));
                resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(resp.getOutputStream());

            }

        }
        //possible URI: /user/{username}
        else if (new SearchPlayerByUsernameDAO(getConnection(), uri.substring(uri.lastIndexOf("/") + 1)).access().getOutputParam() != null) {
            //new UserUsernameGetRR(req, resp, getConnection()).serve(); // TODO: Jacopo
            LOGGER.info("Getting username (uri: /user/username)");
        } else {

            LOGGER.warn("Unknown URI: %s.", uri);
            m = new Message("Unknown URI", "E4A5", String.format("This is URI (%s) isn't supported", uri));
            resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            m.toJSON(resp.getOutputStream());

        }

        return true;
    }

}
