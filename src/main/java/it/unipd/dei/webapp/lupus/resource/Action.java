package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;
import it.unipd.dei.webapp.lupus.utils.GamePhase;
import jakarta.servlet.http.HttpServlet;

import java.io.OutputStream;
import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * class to manage the row of table action in database
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Action extends AbstractResource
{
    /**
     * Represents a JSON file name.
     */
    public static final String JSON_NAME = "Action";

    /**
     * Represents a vote action.
     */
    public final static String VOTE = "vote";

    /**
     * Numeric identifier for the game.
     */
    private final int gameId;

    /**
     * Player who performed the action.
     */
    private final String player;

    /**
     * Round in which the action occurred.
     */
    private final int round;

    /**
     * Phase in which the action occurred.
     */
    private final int phase;

    /**
     * Subphase in which the action occurred.
     */
    private final int subphase;

    /**
     * Represents the type of action.
     */
    private final String typeAction;

    /**
     * Player who is the target of the action.
     */
    private final String target;


    /**
     * Constructor for the class
     *
     * @param  typeAction  rapresent the name of the type of action
     * @param  subphase subphase where it was the action
     * @param  phase  phase where it was the action
     * @param  round  round where it was the action
     * @param  player player that make the action
     * @param  target player that suffers the action
     * @param  gameId numeric identifier for the game
     */
    public Action(int gameId, String player, int round, int phase, int subphase , String typeAction, String target)
    {
        this.gameId = gameId;
        this.player = player;
        this.round = round;
        this.phase = phase;
        this.subphase = subphase;
        this.typeAction = typeAction;
        this.target = target;
    }
    /**
     * Constructor for the class that use a result of a query
     *
     * @param  r  represent the result of a query exe in the db
     */
    public Action(ResultSet r) throws SQLException
    {
        this(r.getInt("game_id"),
             r.getString("player_username"),
             r.getInt("round"),
             r.getInt("phase"),
             r.getInt("subphase"),
             r.getString("type_of_action"),
             r.getString("target"));
    }

    /**
     * Functions to get the gameId.
     *
     * @return The gameId.
     */
    public int getGameId() { return gameId; }

    /**
     * Functions to get the player.
     *
     * @return The player.
     */
    public String getPlayer() { return player; }

    /**
     * Functions to get the round.
     *
     * @return The round.
     */
    public int getRound() { return round; }

    /**
     * Functions to get the phase.
     *
     * @return The phase.
     */
    public int getPhase() { return phase; }

    /**
     * Functions to get the subphase.
     *
     * @return The subphase.
     */
    public int getSubphase() { return subphase; }

    /**
     * Functions to get the typeAction.
     *
     * @return The typeAction.
     */
    public String getTypeAction() { return typeAction; }

    /**
     * Functions to get the target.
     *
     * @return The target.
     */
    public String getTarget() { return target; }



    /**
     * Performs the actual writing of JSON.
     *
     * @param out the stream to which the JSON representation of the {@code Resource} has to be written.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception
    {
        JsonGenerator jg = JSON_FACTORY.createGenerator(out);
        jg.writeStartObject();
        jg.writeFieldName(JSON_NAME);
        jg.writeStartObject();

        for(Field i : this.getClass().getDeclaredFields())
            if(!i.getName().equals("JSON_NAME") && !i.getName().equals("VOTE"))
                if(i.getName().equals("phase"))
                    jg.writeObjectField(i.getName(), GamePhase.getById(i.getInt(this)).getName());
                else
                    jg.writeObjectField(i.getName(), i.get(this));

        jg.writeEndObject();
        jg.flush();
    }
}
