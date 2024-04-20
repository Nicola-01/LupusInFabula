package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.rest.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;

public class GameDispatcherServlet extends AbstractDatabaseServlet {

    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse res) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());
        LogContext.setAction("DISPATCH_GAME");

        final OutputStream out = res.getOutputStream();

        try {

            // todo sistemare error code

            // if the requested resource was a Game, delegate its processing and return
            if (processGame(req, res)) {
                return;
            }

            // if none of the above process methods succeeds, it means an unknown resource has been requested
            LOGGER.warn("Unknown resource requested: %s.", req.getRequestURI());

            final Message m = new Message("Unknown resource requested.", "E4A6",
                    String.format("Requested resource is %s.", req.getRequestURI()));
            res.setStatus(HttpServletResponse.SC_NOT_FOUND);
            res.setContentType(JSON_UTF_8_MEDIA_TYPE);
            m.toJSON(out);
        } catch (Throwable t) {
            LOGGER.error("Unexpected error while processing the REST resource.", t);

            final Message m = new Message("Unexpected error.", "E5A1", t.getMessage());
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
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
     * Checks whether the request is and processes it.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     * @return {@code true} if the request was for an {@code game}; {@code false} otherwise.
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
                    LOGGER.warn("Unsupported operation for URI /game/settings: %s.", method); // TODO cambiare errore

                    m = new Message("Unsupported operation for URI /game/settings.", "E4A5", // TODO cambiare errore
                            String.format("Requested operation %s, but required GET or POST.", method));
                    res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
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

        String[] splitedPath = path.split("/");

        if (!(splitedPath.length == 3 || (splitedPath.length == 4 && splitedPath[3].equals("master"))))
            return false;

        boolean isMaster = splitedPath.length == 4;

        // splitedPath[0] is empty
        String requestURI = splitedPath[1];
        String publicGameID = splitedPath[2];
        int gameID = new GetGameIdFormPublicGameIdDAO(getConnection(), publicGameID).access().getOutputParam();

        if (gameID == -1) {
            LOGGER.warn("Invalid gameID, the game %s not exists.", publicGameID);

            // todo CAMBIARE ERROR
            m = new Message("Invalid game, the game \'" + publicGameID + "\' not exists.", "E4A5", // TODO cambiare errore
                    String.format("Requested operation %s, but required GET or POST.", method));
            res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            m.toJSON(res.getOutputStream());

            return true;
        }

        if (requestURI.equals("actions")) {
            if (!method.equals("POST")) {
                LOGGER.warn("Unsupported operation for URI /game/actions: %s.", method); // TODO cambiare errore

                m = new Message("Unsupported operation for URI /game/actions.", "E4A5", // TODO cambiare errore
                        String.format("Requested operation %s, but required POST.", method));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
                return true;
            }
            new GameActionsRR(gameID, req, res, getDataSource()).serve();
            return true;
        }

        if (!method.equals("GET")) {
            LOGGER.warn("Unsupported operation: %s.", method); // TODO cambiare errore

            m = new Message("Unsupported operation.", "E4A5", // TODO cambiare errore
                    String.format("Requested operation %s, but required GET.", method));
            res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            m.toJSON(res.getOutputStream());
            return true;
        }

        return switch (requestURI) {
            case "status" ->
                // new GameStatusRR(gameID, isMaster, req, res, getDataSource()).serve();
                    true;
            case "players" ->
                // new GamePlayersRR(gameID, isMaster, req, res, getDataSource()).serve();
                    true;
            case "logs" ->
                // new GameLogRR(gameID, isMaster, req, res, getDataSource(), gameID).serve();
                    true;
            default -> false;
        };
    }
}
