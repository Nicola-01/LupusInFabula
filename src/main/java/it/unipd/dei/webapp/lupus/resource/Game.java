package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.sql.Date;
import java.sql.Time;

public class Game extends AbstractResource {
    private final int id;
    private final String public_ID;
    private Time game_duration;
    private int who_win;
    private int number_of_rounds;
    private final Date start;

    public Game(final int id, final String public_ID, final Time game_duration, final int who_win,
                final int number_of_rounds, final Date start) {
        this.id = id;
        this.public_ID = public_ID;
        this.game_duration = game_duration;
        this.who_win = who_win;
        this.number_of_rounds = number_of_rounds;
        this.start = start;
    }

    public Game(int id, String public_ID, Date start) {
        this.id = id;
        this.public_ID = public_ID;
        this.start = start;
    }

    public final int getId() {
        return id;
    }

    public final String getPublic_ID() {
        return public_ID;
    }

    public final Time getDuration() {
        return game_duration;
    }

    public final int getWho_win() {
        return who_win;
    }

    public final int getNumbers_of_round() {
        return number_of_rounds;
    }

    public final Date getGameDate() {
        return start;
    }

    /**
     * @param out the stream to which the JSON representation of the {@code Resource} has to be written.
     * @throws Exception
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("game");
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
