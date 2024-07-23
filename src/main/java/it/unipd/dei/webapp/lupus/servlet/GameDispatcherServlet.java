package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdByPlayerUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.rest.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;

/**
 * Servlet that manages the REST calls for the game section.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameDispatcherServlet extends AbstractDatabaseServlet {

    /**
     * Represents the JSON media type with UTF-8 encoding.
     */
    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse res) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction(Actions.GAME_DISPATCHER_ACTION);
        LogContext.setUser(((Player) req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername());

        final OutputStream out = res.getOutputStream();

        try {
            // Check if the requested URL exists, and if it does, handle it
            if (processGame(req, res)) {
                return;
            }

            // if none of the above process methods succeeds, it means an unknown resource has been requested
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

    /**
     * Checks whether the request is for a game and processes it.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @return {@code true} if the request was for a game, and it has been handled;
     * {@code false} otherwise.
     * @throws Exception if any error occurs.
     */
    private boolean processGame(final HttpServletRequest req, final HttpServletResponse res) throws Exception {
        final String method = req.getMethod();

        String path = req.getRequestURI();
        Message m = null;
        res.setContentType(JSON_UTF_8_MEDIA_TYPE);

        if (!path.startsWith("/lupus/game"))
            return false;

        // supported links:
        // GET  /game/create
        // POST /game/create

        // POST /game/actions/{gameID}
        // GET /game/status/{gameID}
        // GET /game/status/{gameID}/master
        // GET /game/players/{gameID}
        // GET /game/players/{gameID}/master
        // GET /game/logs/{gameID}
        // GET /game/logs/{gameID}/master

        path = path.substring(path.lastIndexOf("/game") + 5);

        // GET  /game/create
        // POST /game/create
        // -> /setting
        if (path.equals("/create")) {
            switch (method) {
                case "GET":
                    new GameCreationGetRR(req, res, getDataSource()).serve();
                    break;
                case "POST":
                    new GameCreationPostRR(req, res, getDataSource()).serve();
                    break;
                default:
                    LOGGER.warn("Unsupported operation for URI /game/create: %s.", method);

                    ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                    m = new Message("Unsupported operation for URI /game/create.", ec.getErrorCode(),
                            String.format("Requested operation %s, but required GET or POST.", method));
                    res.setStatus(ec.getHTTPCode());

                    m.toJSON(res.getOutputStream());
            }
            return true;
        }

        // GET /lupus/game/list
        // returns the match that the logged in player is playing
        if (path.equals("/list")) {
            if (method.equals("GET")) {
                String username = ((Player) req.getSession(false).getAttribute(UserFilter.USER_ATTRIBUTE)).getUsername();
                int privateGameID = new GetGameIdByPlayerUsernameDAO(getConnection(), username).access().getOutputParam();
                new GameStatusRR(req, res, getDataSource(), privateGameID).serve();
                return true;
            } else {
                LOGGER.warn("Unsupported operation for URI /game/list: %s.", method);

                ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                m = new Message("Unsupported operation for URI /game/list.", ec.getErrorCode(),
                        String.format("Requested operation %s, but required GET.", method));
                res.setStatus(ec.getHTTPCode());

                m.toJSON(res.getOutputStream());
            }
        }

        // GET /game/actions/
        // GET  /game/status/{gameID}
        // GET  /game/status/{gameID}/master
        // GET  /game/players/{gameID}
        // GET  /game/players/{gameID}/master
        // GET  /game/logs/{gameID}
        // GET  /game/logs/{gameID}/master

        // ->
        // GET  /status/{gameID}
        // GET  /configuration/{gameID}
        // GET  /players/{gameID}
        // GET  /players/{gameID}/master
        // GET  /logs/{gameID}
        // GET  /logs/{gameID}/master

        // POST /actions/{gameID}

        String[] splitPath = path.split("/");

        if (!(splitPath.length == 3 || (splitPath.length == 4 && path.endsWith("/master"))))
            return false;

        boolean isMaster = splitPath.length == 4;

        // splitPath[0] is empty
        String requestURI = splitPath[1];
        String publicGameID = splitPath[2];

        int gameID = new GetGameIdFormPublicGameIdDAO(getConnection(), publicGameID).access().getOutputParam();
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
            if (!method.equals("GET") && !method.equals("POST")) {
                LOGGER.warn("Unsupported operation for URI /game/actions: %s.", method);

                ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                m = new Message("Unsupported operation for URI /game/actions.", ec.getErrorCode(),
                        String.format("Requested operation %s, but required GET or POST.", method));
                res.setStatus(ec.getHTTPCode());

                m.toJSON(res.getOutputStream());

                return true;
            }
            if (method.equals("GET"))
                new GameActionsGetRR(gameID, req, res, getDataSource()).serve();
            else
                new GameActionsPostRR(gameID, req, res, getDataSource()).serve();
            return true;
        }

        String[] acceptURL = {"status", "configuration", "update", "players", "logs"};
        if (!Arrays.asList(acceptURL).contains(requestURI))
            return false;

        boolean invalid = false;

        if (requestURI.equals("update")) {
            if (method.equals("PUT")){
                new GameStatusUpdateRR(req, res, getDataSource(), gameID).serve();
                return true;
            }
            invalid = true;
        }

        if (!method.equals("GET") || invalid) {
            LOGGER.warn("Unsupported operation for URI /game/%s: %s.", requestURI, method);

            ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;

            m = new Message("Unsupported operation for URI /game/" + requestURI + ".", ec.getErrorCode(),
                    String.format("Requested operation %s, but required GET.", method));
            res.setStatus(ec.getHTTPCode());

            m.toJSON(res.getOutputStream());

            return true;
        }

        Game game = new GetGameByGameIdDAO(getConnection(), gameID).access().getOutputParam();
        boolean gameIsOver = game.getWho_win() >= 0;

        switch (requestURI) {
            case "status":
                new GameStatusRR(req, res, getDataSource(), gameID).serve();
                break;
            case "configuration":
                new GameConfigurationGet(req, res, getDataSource(), gameID).serve();
                break;
            case "players":
                new GamePlayersRR(req, res, getDataSource(), gameID, isMaster || gameIsOver).serve();
                break;
            case "logs":
                new GameLogGetRR(gameID, isMaster || gameIsOver, req, res, getDataSource()).serve();
                break;
        }
        return true;
    }
}
