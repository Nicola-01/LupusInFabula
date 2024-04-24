package it.unipd.dei.webapp.lupus.resource;

import jakarta.servlet.http.HttpServlet;

import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Action extends AbstractResource{

    public final static String VOTE = "vote";

    private final int gameId;
    private final String player;
    private final int round;
    private final int phase;
    private final int subphase;
    //private final String description;
    private final String typeAction;
    private final String target;

    public Action(int gameId, String player, int round, int phase, int subphase /**,String description*/, String typeAction, String target) {
        this.gameId = gameId;
        this.player = player;
        this.round = round;
        this.phase = phase;
        this.subphase = subphase;
        //this.description = description;
        this.typeAction = typeAction;
        this.target = target;
    }

    public Action(ResultSet r) throws SQLException {
        this(r.getInt("game_id"),
                r.getString("player_username"),
                r.getInt("round"),
                r.getInt("phase"),
                r.getInt("subphase"),
                //r.getString("description"),
                r.getString("typeAction"),
                r.getString("target"));
    }

    public int getGameId() {
        return gameId;
    }

    public String getPlayer() {
        return player;
    }

    public int getRound() {
        return round;
    }

    public int getPhase() {
        return phase;
    }

    public int getSubphase() {
        return subphase;
    }

//    public String getDescription() {
//        return description;
//    }

    public String getTypeAction() {
        return typeAction;
    }

    public String getTarget() {
        return target;
    }

    // TODO --> to implement
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

    }
}
