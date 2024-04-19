package it.unipd.dei.webapp.lupus.resource;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Action extends GameAction
{
    public static final int DAY = 0;
    public static final int NIGHT = 1;

    private final int gameId;

    private int    round;
    private int    phase;
    private int    subphase;
    private String description;
    private String typeAction;

    public Action(String player, String target, int gameId, int round, int phase, int subphase, String description, String typeAction)
    {
        super(player, "", target);
        this.gameId = gameId;
        this.round = round;
        this.phase = phase;
        this.subphase = subphase;
        this.description = description;
        this.typeAction = typeAction;
    }
    public Action(ResultSet r) throws SQLException
    {
        this(r.getString("player_username"),
             r.getString("target"),
             r.getInt("game_id"),
             r.getInt("round"),
             r.getInt("phase"),
             r.getInt("subphase"),
             r.getString("description"),
             r.getString("name"));
    }

    public int    getGameId()      {return gameId;}
    public int    getRound()       {return round;}
    public int    getPhase()       {return phase;}
    public int    getSubphase()    {return subphase;}
    public String getDescription() {return description;}
    public String getTypeAction()  {return typeAction;}


    public void setRound(int round)                {this.round = round;}
    public void setPhase(int phase)                {this.phase = phase;}
    public void setSubphase(int subphase)          {this.subphase = subphase;}
    public void setDescription(String description) {this.description = description;}
    public void setTypeAction(String typeAction)   {this.typeAction = typeAction;}
}
