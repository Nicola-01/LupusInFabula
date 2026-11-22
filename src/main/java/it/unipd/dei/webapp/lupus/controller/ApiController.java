package it.unipd.dei.webapp.lupus.controller;

import it.unipd.dei.webapp.lupus.dao.GetGameByGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.GetGameIdFormPublicGameIdDAO;
import it.unipd.dei.webapp.lupus.dao.SearchPlayerByUsernameDAO;
import it.unipd.dei.webapp.lupus.dao.SelectRoleByTypeDAO;
import it.unipd.dei.webapp.lupus.filter.GameMasterFilter;
import it.unipd.dei.webapp.lupus.filter.UserFilter;
import it.unipd.dei.webapp.lupus.resource.Game;
import it.unipd.dei.webapp.lupus.resource.Message;
import it.unipd.dei.webapp.lupus.resource.Player;
import it.unipd.dei.webapp.lupus.resource.Role;
import it.unipd.dei.webapp.lupus.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

/**
 * JSON endpoints that replace the request/session attributes the JSPs used to receive.
 * /api/session, /api/village/* and /api/habitant/* go through UserFilter.
 */
@RestController
public class ApiController {

    private final DataSource ds;

    public ApiController(DataSource ds) {
        this.ds = ds;
    }

    @GetMapping("/api/session")
    public void session(HttpServletRequest req, HttpServletResponse res) throws IOException {
        HttpSession session = req.getSession(false);
        Player user = session == null ? null : (Player) session.getAttribute(UserFilter.USER_ATTRIBUTE);
        if (user == null) {
            ErrorCode ec = ErrorCode.NOT_LOGGED;
            writeMessage(res, 401, new Message("Authentication required", ec.getErrorCode(), ec.getErrorMessage()));
            return;
        }

        Object gamemaster = session.getAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE);
        JSONObject body = new JSONObject()
                .put("user", new JSONObject().put("username", user.getUsername()).put("email", user.getEmail()))
                .put("gamemaster", gamemaster == null ? "" : gamemaster);
        writeJson(res, 200, body);
    }

    @GetMapping("/api/rules/roles")
    public void rolesRules(HttpServletResponse res) throws IOException {
        JSONArray roles = new JSONArray();
        try {
            for (int i = 0; i < 4; i++) {
                JSONArray byType = new JSONArray();
                for (Role r : new SelectRoleByTypeDAO(ds.getConnection(), i).access().getOutputParam()) {
                    byType.put(new JSONObject()
                            .put("name", r.getName())
                            .put("type", r.getType())
                            .put("with_who_wins", r.getWith_who_wins())
                            .put("max_number", r.getMax_number())
                            .put("description", r.getDescription()));
                }
                roles.put(byType);
            }
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            writeMessage(res, ec.getHTTPCode(), new Message("Cannot search for roles: unexpected error while accessing the database.", ec.getErrorCode(), e.getMessage()));
            return;
        }
        writeJson(res, 200, new JSONObject().put("roles", roles));
    }

    @GetMapping("/api/village/{publicId}")
    public void village(@PathVariable String publicId, HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            int privateId = new GetGameIdFormPublicGameIdDAO(ds.getConnection(), publicId).access().getOutputParam();
            Game game = new GetGameByGameIdDAO(ds.getConnection(), privateId).access().getOutputParam();
            if (game == null) {
                ErrorCode ec = ErrorCode.GAME_NOT_FOUND;
                writeMessage(res, ec.getHTTPCode(), new Message("Game " + publicId + " not found", ec.getErrorCode(), ec.getErrorMessage()));
                return;
            }

            HttpSession session = req.getSession(false);
            Object gamemaster = session == null ? null : session.getAttribute(GameMasterFilter.GAMEMASTER_ATTRIBUTE);
            JSONObject body = new JSONObject()
                    .put("publicId", game.getPublic_ID())
                    .put("isMaster", publicId.equals(gamemaster))
                    .put("gameOver", game.getWho_win() >= 0 ? game.getWho_win() : JSONObject.NULL);
            writeJson(res, 200, body);
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            writeMessage(res, ec.getHTTPCode(), new Message("Internal database error.", ec.getErrorCode(), e.getMessage()));
        }
    }

    @GetMapping("/api/habitant/{username}")
    public void habitant(@PathVariable String username, HttpServletResponse res) throws IOException {
        try {
            Player player = new SearchPlayerByUsernameDAO(ds.getConnection(), username).access().getOutputParam();
            if (player == null) {
                ErrorCode ec = ErrorCode.USER_NOT_FOUND;
                writeMessage(res, ec.getHTTPCode(), new Message("Username " + username + " not found", ec.getErrorCode(), ec.getErrorMessage()));
                return;
            }
            writeJson(res, 200, new JSONObject().put("username", player.getUsername()));
        } catch (SQLException e) {
            ErrorCode ec = ErrorCode.DATABASE_ERROR;
            writeMessage(res, ec.getHTTPCode(), new Message("Internal database error.", ec.getErrorCode(), e.getMessage()));
        }
    }

    private static void writeJson(HttpServletResponse res, int status, JSONObject body) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write(body.toString());
    }

    private static void writeMessage(HttpServletResponse res, int status, Message m) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        m.toJSON(res.getOutputStream());
    }
}
