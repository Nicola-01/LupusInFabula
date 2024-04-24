package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.sql.Date;
import java.sql.Time;

/**
 * Represents a game entity.
 * This class contains information about a game, such as its ID, public ID, duration, winner, number of rounds, and start date.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Game extends AbstractResource {

    /**
     * The JSON field name for role cardinality.
     */
    private static final String JSON_NAME = "game";

    /**
     * The private ID of the game.
     */
    private final int id;

    /**
     * The public ID of the game.
     */
    private final String public_ID;

    /**
     * The duration of the game.
     */
    private Time game_duration;

    /**
     * The ID of the winning team or player.
     */
    private int who_win;

    /**
     * The number of rounds played in the game.
     */
    private int rounds;

    /**
     * The start date of the game.
     */
    private final Date start;

    /**
     * The phase of the game.
     */
    private final int phase;

    /**
     * The subphase of the game.
     */
    private final int subphase;

    /**
     * Constructs a new Game object with the specified parameters.
     *
     * @param id            The private ID of the game.
     * @param public_ID     The public ID of the game.
     * @param game_duration The duration of the game.
     * @param who_win       The ID of the winning team or player.
     * @param rounds        The number of rounds played in the game.
     * @param start         The start date of the game.
     * @param phase         The phase of the game.
     * @param subphase      The subphase of the game.
     */
    public Game(final int id, final String public_ID, final Date start, final Time game_duration,
                final int who_win, final int rounds, final int phase, final int subphase) {
        this.id = id;
        this.public_ID = public_ID;
        this.start = start;
        this.game_duration = game_duration;
        this.who_win = who_win;
        this.rounds = rounds;
        this.phase = phase;
        this.subphase = subphase;
    }

    /**
     * Gets the ID of the game.
     *
     * @return The ID of the game.
     */
    public final int getId() {
        return id;
    }

    /**
     * Gets the public ID of the game.
     *
     * @return The public ID of the game.
     */
    public final String getPublic_ID() {
        return public_ID;
    }

    /**
     * Gets the duration of the game.
     *
     * @return The duration of the game.
     */
    public final Time getDuration() {
        return game_duration;
    }

    /**
     * Gets the ID of the winning team or player.
     *
     * @return The ID of the winning team or player.
     */
    public final int getWho_win() {
        return who_win;
    }

    /**
     * Gets the number of rounds played in the game.
     *
     * @return The number of rounds played in the game.
     */
    public final int getRounds() {
        return rounds;
    }

    /**
     * Gets the start date of the game.
     *
     * @return The start date of the game.
     */
    public final Date getGameDate() {
        return start;
    }

    /**
     * Gets the phase of the game.
     *
     * @return The phase of the game.
     */
    public final int getPhase() {
        return phase;
    }

    /**
     * Gets the subphase of the game.
     *
     * @return The subphase of the game.
     */
    public final int getSubphase() {
        return subphase;
    }

    /**
     * Writes JSON representation of the object to the output stream.
     *
     * @param out The output stream to write JSON to.
     * @throws Exception If an error occurs while writing JSON.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName(JSON_NAME);
        jg.writeStartObject();

        jg.writeNumberField("id", id); // Write the username field
        jg.writeStringField("public_ID", public_ID);
        jg.writeStringField("start", start.toString());

        String duration = game_duration != null ? game_duration.toString() : "";
        jg.writeStringField("game_duration", duration);

        jg.writeNumberField("who_win", who_win);
        jg.writeNumberField("rounds", rounds);
        jg.writeNumberField("phase", phase);
        jg.writeNumberField("subphase", subphase);

        jg.writeEndObject();
        jg.writeEndObject();

        jg.flush();

    }
}
