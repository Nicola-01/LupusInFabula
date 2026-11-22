package it.unipd.dei.webapp.lupus.controller;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Actions;
import it.unipd.dei.webapp.lupus.resource.Game;
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
 * REST controller for the game section (formerly {@code GameDispatcherServlet}).
 * <p>
 * Supported routes (context path {@code /lupus}):
 * <ul>
 *     <li>GET, POST {@code /game/create}</li>
 *     <li>GET {@code /game/settings}</li>
 *     <li>GET {@code /game/list}</li>
 *     <li>GET, POST {@code /game/actions/{gameID}[/master]}</li>
 *     <li>GET {@code /game/status/{gameID}[/master]}</li>
 *     <li>GET {@code /game/configuration/{gameID}[/master]}</li>
 *     <li>GET {@code /game/players/{gameID}[/master]}</li>
 *     <li>GET {@code /game/logs/{gameID}[/master]}</li>
 *     <li>GET {@code /game/settings/{gameID}[/master]}</li>
 *     <li>PUT {@code /game/update/{gameID}[/master]}</li>
 * </ul>
 * Any other URL under {@code /game} is answered with the UNKNOWN_RESOURCE error.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/game")
public class GameController {

    /**
     * A LOGGER available for this controller.
     */
    private static final Logger LOGGER = LogManager.getLogger(GameController.class,
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
    public GameController(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * A game route: returns {@code true} if the request has been handled, {@code false} if the caller
     * must answer with the UNKNOWN_RESOURCE error.
     */
    @FunctionalInterface
    private interface Route {
        boolean run() throws Exception;
    }

    @RequestMapping("/create")
    public void create(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> {
            switch (req.getMethod()) {
                case "GET":
                    new GameRolesGetRR(req, res, dataSource).serve();
                    break;
                case "POST":
                    new GameCreationPostRR(req, res, dataSource).serve();
                    break;
                default:
                    return methodNotAllowed(req, res, "/game/create", "GET or POST");
            }
            return true;
        });
    }

    @RequestMapping("/settings")
    public void settings(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> {
            if (req.getMethod().equals("GET")) {
                new GameSettingsGetRR(req, res, dataSource).serve();
                return true;
            }
            return methodNotAllowed(req, res, "/game/settings", "GET");
        });
    }

    /**
     * Returns the match that the logged in player is playing.
     */
    @RequestMapping("/list")
    public void list(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> {
            if (req.getMethod().equals("GET")) {
                String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                int privateGameID = new GetGameIdByPlayerUsernameDAO(dataSource.getConnection(), username).access().getOutputParam();
                new GameStatusRR(req, res, dataSource, privateGameID).serve();
                return true;
            }
            // kept from the original: the 405 is written and then the caller also writes UNKNOWN_RESOURCE
            methodNotAllowed(req, res, "/game/list", "GET");
            return false;
        });
    }

    @RequestMapping({"/actions/{publicGameID}", "/actions/{publicGameID}/master"})
    public void actions(final HttpServletRequest req, final HttpServletResponse res,
                        @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "actions", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/status/{publicGameID}", "/status/{publicGameID}/master"})
    public void status(final HttpServletRequest req, final HttpServletResponse res,
                       @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "status", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/configuration/{publicGameID}", "/configuration/{publicGameID}/master"})
    public void configuration(final HttpServletRequest req, final HttpServletResponse res,
                              @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "configuration", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/update/{publicGameID}", "/update/{publicGameID}/master"})
    public void update(final HttpServletRequest req, final HttpServletResponse res,
                       @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "update", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/players/{publicGameID}", "/players/{publicGameID}/master"})
    public void players(final HttpServletRequest req, final HttpServletResponse res,
                        @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "players", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/logs/{publicGameID}", "/logs/{publicGameID}/master"})
    public void logs(final HttpServletRequest req, final HttpServletResponse res,
                     @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "logs", publicGameID, isMaster(req)));
    }

    @RequestMapping({"/settings/{publicGameID}", "/settings/{publicGameID}/master"})
    public void gameSettings(final HttpServletRequest req, final HttpServletResponse res,
                             @PathVariable final String publicGameID) throws IOException {
        dispatch(req, res, () -> gameRoute(req, res, "settings", publicGameID, isMaster(req)));
    }

    /**
     * Fallback for every other URL under {@code /game}: UNKNOWN_RESOURCE error.
     */
    @RequestMapping("/**")
    public void unknown(final HttpServletRequest req, final HttpServletResponse res) throws IOException {
        dispatch(req, res, () -> false);
    }

    /**
     * Handles the routes that take a public game id, after the path has been matched.
     *
     * @return {@code true} if handled, {@code false} for UNKNOWN_RESOURCE.
     */
    private boolean gameRoute(final HttpServletRequest req, final HttpServletResponse res, final String requestURI,
                              final String publicGameID, final boolean isMaster) throws Exception {
        final String method = req.getMethod();
        Message m;

        int gameID = new GetGameIdFormPublicGameIdDAO(dataSource.getConnection(), publicGameID).access().getOutputParam();
        if (gameID == -1) {
            LOGGER.warn("Invalid gameID, the game %s doesn't exists.", publicGameID);

            ErrorCode ec = ErrorCode.GAME_NOT_FOUND;
            m = new Message("Invalid game, the game \'" + publicGameID + "\' doesn't exists.", ec.getErrorCode(),
                    String.format("Requested operation %s, but required GET or POST.", method));
            res.setStatus(ec.getHTTPCode());

            m.toJSON(res.getOutputStream());
            return true;
        }

        if (requestURI.equals("actions")) {
            if (!method.equals("GET") && !method.equals("POST"))
                return methodNotAllowed(req, res, "/game/actions", "GET or POST");
            if (method.equals("GET"))
                new GameActionsGetRR(gameID, req, res, dataSource).serve();
            else
                new GameActionsPostRR(gameID, req, res, dataSource).serve();
            return true;
        }

        if (requestURI.equals("update")) {
            if (method.equals("PUT")) {
                new GameStatusUpdateRR(req, res, dataSource, gameID).serve();
                return true;
            }
            return methodNotAllowed(req, res, "/game/update", "GET");
        }

        if (!method.equals("GET"))
            return methodNotAllowed(req, res, "/game/" + requestURI, "GET");

        Game game = new GetGameByGameIdDAO(dataSource.getConnection(), gameID).access().getOutputParam();
        boolean gameIsOver = game.getWho_win() >= 0;

        switch (requestURI) {
            case "status":
                new GameStatusRR(req, res, dataSource, gameID).serve();
                break;
            case "configuration":
                new GameConfigurationGet(req, res, dataSource, gameID).serve();
                break;
            case "players":
                new GamePlayersRR(req, res, dataSource, gameID, isMaster || gameIsOver).serve();
                break;
            case "logs":
                new GameLogGetRR(gameID, isMaster || gameIsOver, req, res, dataSource).serve();
                break;
            case "settings":
                new SettingsOfGameGetRR(req, res, dataSource, gameID).serve();
                break;
        }
        return true;
    }

    /**
     * Writes the METHOD_NOT_ALLOWED error for the given resource.
     *
     * @return {@code true}, the error has been written.
     */
    private static boolean methodNotAllowed(final HttpServletRequest req, final HttpServletResponse res,
                                            final String resource, final String required) throws IOException {
        LOGGER.warn("Unsupported operation for URI %s: %s.", resource, req.getMethod());

        ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
        Message m = new Message("Unsupported operation for URI " + resource + ".", ec.getErrorCode(),
                String.format("Requested operation %s, but required %s.", req.getMethod(), required));
        res.setStatus(ec.getHTTPCode());

        m.toJSON(res.getOutputStream());
        return true;
    }

    private static boolean isMaster(final HttpServletRequest req) {
        return req.getRequestURI().endsWith("/master");
    }

    /**
     * Same logic as the original {@code service()} of the dispatcher servlet: LogContext handling, UNKNOWN_RESOURCE
     * when the route is not handled, INTERNAL_ERROR on any failure, flush and close of the output stream.
     */
    private void dispatch(final HttpServletRequest req, final HttpServletResponse res, final Route route)
            throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction(Actions.GAME_DISPATCHER_ACTION);
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

        final OutputStream out = res.getOutputStream();

        try {
            res.setContentType(JSON_UTF_8_MEDIA_TYPE);

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

            ErrorCode ec = ErrorCode.INTERNAL_ERROR;
            LOGGER.error("Unexpected error while processing the REST resource %s.", req.getRequestURI(), t);
            final Message m = new Message("Unexpected error.", ec.getErrorCode(), t.getMessage());
            res.setStatus(ec.getHTTPCode());

            m.toJSON(out);
        } finally {

            // ensure to always flush and close the output stream
            if (out != null) {
                out.flush();
                out.close();
            }

            LogContext.removeIPAddress();
            LogContext.removeAction();
            LogContext.removeUser();
        }
    }
}
