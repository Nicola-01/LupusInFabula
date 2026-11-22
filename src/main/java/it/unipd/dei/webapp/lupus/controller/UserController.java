package it.unipd.dei.webapp.lupus.controller;

import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.LogContext;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.rest.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.StringFormatterMessageFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.OutputStream;

/**
 * REST controller for the user section (formerly {@code UserDispatcherServlet}).
 * <p>
 * Supported routes (context path {@code /lupus}):
 * <ul>
 *     <li>GET, PUT, DELETE {@code /user/me}</li>
 *     <li>GET, POST, DELETE {@code /user/me/friend}</li>
 *     <li>GET {@code /user/{username}/logs}</li>
 *     <li>GET {@code /user/{username}/statistic}</li>
 *     <li>GET {@code /user/search/{username}}</li>
 *     <li>GET {@code /user/{username}}</li>
 * </ul>
 * Any other URL under {@code /user} is answered with the UNKNOWN_RESOURCE error.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/user")
public class UserController {

    /**
     * A LOGGER available for this controller.
     */
    private static final Logger LOGGER = LogManager.getLogger(UserController.class,
            StringFormatterMessageFactory.INSTANCE);

    /**
     * Represents the JSON media type with UTF-8 encoding.
     */
    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    /**
     * The connection pool to the database.
     */
    private final DataSource dataSource;

    /**
     * Creates the controller.
     *
     * @param dataSource the connection pool to the database.
     */
    public UserController(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * A user route: returns {@code true} if the request has been handled, {@code false} if the caller
     * must answer with the UNKNOWN_RESOURCE error.
     */
    @FunctionalInterface
    private interface Route {
        boolean run() throws Exception;
    }

    @RequestMapping("/me")
    public void me(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> {
            switch (req.getMethod()) {
                case "GET":
                    String username = ((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                    LOGGER.info("GET with /me");
                    new UserUsernameGetRR(username, req, res, dataSource).serve();
                    break;
                case "PUT":
                    new UserMePutRR(req, res, dataSource).serve();
                    break;
                case "DELETE":
                    new UserMeDeleteRR(req, res, dataSource).serve();
                    break;
                default:
                    return methodNotAllowed(req, res, "Unsuported operation for URI /user/me.", "PUT or DELETE");
            }
            return true;
        });
    }

    @RequestMapping("/me/friend")
    public void meFriend(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> {
            switch (req.getMethod()) {
                case "GET":
                    new ListFriendsRR(req, res, dataSource).serve();
                    LOGGER.info("Getting user's friend");
                    break;
                case "POST":
                    new AddFriendRR(req, res, dataSource).serve();
                    LOGGER.info("Posting user's friend");
                    break;
                case "DELETE":
                    new DeleteFriendRR(req, res, dataSource).serve();
                    LOGGER.info("Deleting user's friend");
                    break;
                default:
                    return methodNotAllowed(req, res, "Unsuported operation for URI /user/me/friend.", "GET, POST or DELETE");
            }
            return true;
        });
    }

    @RequestMapping("/{username}/logs")
    public void logs(final HttpServletRequest req, final HttpServletResponse res,
                     @PathVariable final String username) throws IOException {
        dispatch(req, res, () -> {
            if (req.getMethod().equals("GET")) {
                new UserLogsGetRR(username, req, res, dataSource).serve();
                LOGGER.info("Getting user's logs");
                return true;
            }
            return methodNotAllowed(req, res, "Unsuported operation for URI /user/*/logs or /user/*/statistic.", "GET");
        });
    }

    @RequestMapping("/{username}/statistic")
    public void statistic(final HttpServletRequest req, final HttpServletResponse res,
                          @PathVariable final String username) throws IOException {
        dispatch(req, res, () -> {
            if (req.getMethod().equals("GET")) {
                new UserStatisticGetRR(username, req, res, dataSource).serve();
                LOGGER.info("Getting user's statistic");
                return true;
            }
            return methodNotAllowed(req, res, "Unsuported operation for URI /user/*/logs or /user/*/statistic.", "GET");
        });
    }

    // "/search/" (empty username) lists every player: the frontend uses it to check friends' availability
    @RequestMapping({"/search/{username}", "/search/"})
    public void search(final HttpServletRequest req, final HttpServletResponse res,
                       @PathVariable(required = false) final String username) throws IOException {
        dispatch(req, res, () -> {
            if (req.getMethod().equals("GET")) {
                new SearchPlayerRR(username == null ? "" : username, req, res, dataSource).serve();
                return true;
            }
            return methodNotAllowed(req, res, "Unsupported operation for URI /search/{username}.", "GET");
        });
    }

    /**
     * Profile of a user. Only if the user exists, otherwise UNKNOWN_RESOURCE (checked before the method).
     */
    @RequestMapping("/{username}")
    public void profile(final HttpServletRequest req, final HttpServletResponse res,
                        @PathVariable final String username) throws IOException {
        dispatch(req, res, () -> {
            if (new SearchPlayerByUsernameDAO(dataSource.getConnection(), username).access().getOutputParam() == null)
                return false;

            if (req.getMethod().equals("GET")) {
                new UserUsernameGetRR(username, req, res, dataSource).serve();
                LOGGER.info("GET without /me ");
                return true;
            }
            return methodNotAllowed(req, res, "Unsupported operation for URI /user/{username}.", "GET");
        });
    }

    /**
     * Fallback for every other URL under {@code /user}: UNKNOWN_RESOURCE error.
     */
    @RequestMapping("/**")
    public void unknown(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> false);
    }

    /**
     * Writes the METHOD_NOT_ALLOWED error with the given message.
     *
     * @return {@code true}, the error has been written.
     */
    private static boolean methodNotAllowed(final HttpServletRequest req, final HttpServletResponse res,
                                            final String message, final String required) throws IOException {
        LOGGER.warn("Unknown method: %s.", req.getMethod());

        ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
        Message m = new Message(message, ec.getErrorCode(),
                String.format("Requested operation %s, but required %s.", req.getMethod(), required));
        res.setStatus(ec.getHTTPCode());

        m.toJSON(res.getOutputStream());
        return true;
    }

    /**
     * Same logic as the original {@code service()} of the dispatcher servlet: LogContext handling, UNKNOWN_RESOURCE
     * when the route is not handled, INTERNAL_ERROR on any failure, flush and close of the output stream.
     */
    private void dispatch(final HttpServletRequest req, final HttpServletResponse res, final Route route)
            throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction(Actions.USER_DISPATCHER_ACTION);
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

        final OutputStream out = res.getOutputStream();

        try {
            if (route.run()) {
                return;
            }

            // if none of the routes succeeds, it means an unknown resource has been requested
            LOGGER.warn("Unknown resource requested: %s.", req.getRequestURI());

            ErrorCode ec = ErrorCode.UNKNOWN_RESOURCE;
            final Message m = new Message("Unknown resource requested.", ec.getErrorCode(),
                    String.format("Requested resource is %s.", req.getRequestURI()));
            res.setStatus(ec.getHTTPCode());

            res.setContentType(JSON_UTF_8_MEDIA_TYPE);
            m.toJSON(out);

        } catch (Throwable t) {

            LOGGER.error("Unexpected error while processing the REST resource.", t);

            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            final Message m = new Message("Unexpected error.", ec.getErrorCode(), t.getMessage());
            res.setStatus(ec.getHTTPCode());
            m.toJSON(res.getOutputStream());

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
}
