package it.unipd.dei.webapp.lupus.servlet;

import it.unipd.dei.webapp.lupus.resource.*;
import it.unipd.dei.webapp.lupus.rest.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;

public class GameDispatcherServlet extends AbstractDatabaseServlet{

    private static final String JSON_UTF_8_MEDIA_TYPE = "application/json; charset=utf-8";

    @Override
    protected void service(final HttpServletRequest req, final HttpServletResponse res) throws IOException {

        LogContext.setIPAddress(req.getRemoteAddr());

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
        }
    }

    /**
     * Checks whether the request is and processes it.
     *
     * @param req the HTTP request.
     * @param res the HTTP response.
     *
     * @return {@code true} if the request was for an {@code Employee}; {@code false} otherwise.
     *
     * @throws Exception if any error occurs.
     */
    private boolean processGame(final HttpServletRequest req, final HttpServletResponse res) throws Exception {
        final String method = req.getMethod();

        String path = req.getRequestURI();
        Message m = null;

        if (!path.contains("/game"))
            return false;

        // /game/settings/dada
        path = path.substring(path.lastIndexOf("/game") + 5);


        // /game/settings
        if(path.equals("/settings")){
            switch(method){
                case "GET":
                    // new GameSettingsGetRR(req, res, getConnection()).serve();
                    break;
                case "POST":
                    new GameSettingsPostRR(req, res, getConnection()).serve();
                    break;
                default:
                    LOGGER.warn("Unsupported operation for URI /game/settings: %s.", method); // TODO cambiare errore

                    m = new Message("Unsupported operation for URI /game/settings.", "E4A5", // TODO cambiare errore
                            String.format("Requested operation %s, but required GET or POST.", method));
                    res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                    m.toJSON(res.getOutputStream());
                    break;
            }
        }
        // /game/actions
        else if(path.equals("/actions")){
            if (!req.getMethod().equals("POST")) {
                LOGGER.warn("Unsupported operation for URI /game/actions: %s.", method); // TODO cambiare errore

                m = new Message("Unsupported operation for URI /game/actions.", "E4A5", // TODO cambiare errore
                        String.format("Requested operation %s, but required POST.", method));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
            }
            else
                new GameActionsRR(req, res, getConnection()).serve();
        }
        // /game/log/{gameID}
        // /game/log/{gameID}/master
        else if(path.contains("/log")){
            path = path.substring(path.lastIndexOf("/log/") + 5); // {gameID} or {gameID}/master
            if (!req.getMethod().equals("GET")) {
                LOGGER.warn("Unsupported operation for URI /game/log/{gameID} or URI /game/log/{gameID}/master.", method); // TODO cambiare errore

                m = new Message("Unsupported operation for URI /game/log/{gameID} or URI /game/log/{gameID}/master.", "E4A5", // TODO cambiare errore
                        String.format("Requested operation %s, but required GET.", method));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
            }
            else if (path.contains("/") && !path.endsWith("/master")) {
                LOGGER.warn("Wrong format for URI /game/log/{gameID}/master: URI doesn't end with /master.", path);

                m = new Message("Wrong format for URI /game/log/{gameID}/master.", "E4A5", // TODO cambiare errore
                        String.format("Requested URI %s, but required /game/log/{gameID}/master", req.getRequestURI()));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
            }
            else if(path.endsWith("/master"))
                ; // new GameLogRR(req, res, getConnection()).serve();
            else
                ; // new GameLogMasterRR(req, res, getConnection()).serve();

        }
        // /game/{gameID}
        // /game/{gameID}/master
        else{
            path = path.substring(path.indexOf("/") + 1);
            if (!req.getMethod().equals("GET")) {
                LOGGER.warn("Unsupported operation for URI /game/{gameID} or URI /game/{gameID}/master: %s.", method);

                m = new Message("Unsupported operation for URI /game/{gameID} or URI /game/{gameID}/master.", "E4A5", // TODO cambiare errore
                        String.format("Requested operation %s, but required GET.", method));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
            }
            else if (path.contains("/") && !path.endsWith("/master")) {
                LOGGER.warn("Wrong format for URI /game/{gameID}/master: URI doesn't end with /master.");

                m = new Message("Wrong format for URI /game/{gameID}/master.", "E4A5", // TODO cambiare errore
                        String.format("Requested URI %s, but required /game/{gameID}/master", req.getRequestURI()));
                res.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                m.toJSON(res.getOutputStream());
            }
            else if(path.endsWith("/master"))
                ; // new GameStatusRR(req, res, getConnection()).serve();
            else
                ; // new GameStatusMasterRR(req, res, getConnection()).serve();
        }
        return true;
    }
}
