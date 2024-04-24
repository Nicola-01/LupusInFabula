package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.rest.*;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Servlet that manages the REST calls for the game section.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameDispatcherServlet extends AbstractDatabaseServlet {

    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse res) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction(Actions.GAME_DISPATCHER_ACTION);

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

        if (!path.startsWith("/lupus/game"))
            return false;

        // supported links:
        // GET  /game/settings
        // POST /game/settings

        // POST /game/actions/{gameID}
        // GET /game/status/{gameID}
        // GET /game/status/{gameID}/master
        // GET /game/players/{gameID}
        // GET /game/players/{gameID}/master
        // GET /game/logs/{gameID}
        // GET /game/logs/{gameID}/master

        path = path.substring(path.lastIndexOf("/game") + 5);

        // GET  /game/settings
        // POST /game/settings
        // -> /setting
        if (path.equals("/settings")) {
            switch (method) {
                case "GET":
                    new GameSettingsGetRR(req, res, getDataSource()).serve();
                    break;
                case "POST":
                    new GameSettingsPostRR(req, res, getDataSource()).serve();
                    break;
                default:
                    LOGGER.warn("Unsupported operation for URI /game/settings: %s.", method);

                    ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;
                    m = new Message("Unsupported operation for URI /game/settings.", ec.getErrorCode(),
                            String.format("Requested operation %s, but required GET or POST.", method));
                    res.setStatus(ec.getHTTPCode());

                    m.toJSON(res.getOutputStream());
            }
            return true;
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
        // GET  /status/{gameID}/master
        // GET  /players/{gameID}
        // GET  /players/{gameID}/master
        // GET  /logs/{gameID}
        // GET  /logs/{gameID}/master

        // POST /actions/{gameID}

        String[] splittedPath = path.split("/");

        if (!(splittedPath.length == 3 || (splittedPath.length == 4 && splittedPath[3].equals("master"))))
            return false;

        boolean isMaster = splittedPath.length == 4;

        // splittedPath[0] is empty
        String requestURI = splittedPath[1];
        String publicGameID = splittedPath[2];
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
                new GameActionsRR(gameID, req, res, getDataSource()).serve();
            return true;
        }

        if (!(requestURI.equals("status") || requestURI.equals("players") || requestURI.equals("logs"))) {
            return false;
        }

        if (!method.equals("GET")) {
            LOGGER.warn("Unsupported operation for URI /game/%s: %s.", requestURI, method);

            ErrorCode ec = ErrorCode.METHOD_NOT_ALLOWED;

            m = new Message("Unsupported operation for URI /game/" + requestURI + ".", ec.getErrorCode(),
                    String.format("Requested operation %s, but required GET.", method));
            res.setStatus(ec.getHTTPCode());

            m.toJSON(res.getOutputStream());

            return true;
        }

        switch (requestURI) {
            case "status":
                new GameInfoRR(req, res, getDataSource(), gameID, isMaster).serve();
                break;
            case "players":
                // new GamePlayersRR(gameID, isMaster, req, res, getDataSource()).serve();
                break;
            case "logs":
                // new GameLogRR(gameID, isMaster, req, res, getDataSource(), gameID).serve();
                break;
        }
        return true;
    }
}
