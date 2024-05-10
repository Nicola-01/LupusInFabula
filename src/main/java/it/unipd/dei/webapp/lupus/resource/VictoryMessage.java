package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.util.List;

/**
 * Represents a message indicating the result of a victory condition in the game.
 * Extends AbstractResource for JSON serialization.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class VictoryMessage extends AbstractResource {
    /**
     * The message describing the victory outcome.
     */
    private final String message;
    /**
     * The list of players involved in the victory.
     */
    private final List<String> players;
    /**
     * The faction associated with the victory.
     */
    private final int faction;


    /**
     * Constructs a VictoryMessage with the specified message, players, and faction.
     *
     * @param message the message describing the victory outcome
     * @param players the list of players involved in the victory
     * @param faction the faction associated with the victory
     */
    public VictoryMessage(String message, List<String> players, int faction) {
        this.message = message;
        this.players = players;
        this.faction = faction;
    }

    /**
     * Gets the message describing the victory outcome.
     *
     * @return the message describing the victory outcome
     */
    public String getMessage() {
        return message;
    }

    /**
     * Gets the list of players involved in the victory.
     *
     * @return the list of players involved in the victory
     */
    public List<String> getPlayers() {
        return players;
    }

    /**
     * Gets the faction associated with the victory.
     *
     * @return the faction associated with the victory
     */
    public int getFaction() {
        return faction;
    }

    /**
     * Writes the VictoryMessage object to a JSON output stream.
     *
     * @param out the output stream to write JSON to
     * @throws Exception if there is an error during JSON writing
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("gameWin");
        jg.writeStartObject();

        jg.writeStringField("message", message);
        jg.writeNumberField("winnerFaction", faction);

        ActionTarget.listToJSON(jg, players, "players");

        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
}
