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
    private int number_of_rounds;

    /**
     * The start date of the game.
     */
    private final Date start;

    /**
     * Constructs a new Game object with the specified parameters.
     *
     * @param id               The private ID of the game.
     * @param public_ID        The public ID of the game.
     * @param game_duration    The duration of the game.
     * @param who_win          The ID of the winning team or player.
     * @param number_of_rounds The number of rounds played in the game.
     * @param start            The start date of the game.
     */
    public Game(final int id, final String public_ID, final Time game_duration, final int who_win,
                final int number_of_rounds, final Date start) {
        this.id = id;
        this.public_ID = public_ID;
        this.game_duration = game_duration;
        this.who_win = who_win;
        this.number_of_rounds = number_of_rounds;
        this.start = start;
    }

    /**
     * Constructs a new Game object with the private ID, public ID, and start date.
     *
     * @param id        The private ID of the game.
     * @param public_ID The public ID of the game.
     * @param start     The start date of the game.
     */
    public Game(int id, String public_ID, Date start) {
        this.id = id;
        this.public_ID = public_ID;
        this.start = start;
        who_win = -1;
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
    public final int getNumbers_of_round() {
        return number_of_rounds;
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

        String duration = game_duration != null ? game_duration.toString() : "";
        jg.writeStringField("game_duration", duration);

        jg.writeNumberField("who_win", who_win);
        jg.writeNumberField("number_of_rounds", number_of_rounds);
        jg.writeStringField("start", start.toString());

        jg.writeEndObject();
        jg.writeEndObject();

        jg.flush();

    }
}
