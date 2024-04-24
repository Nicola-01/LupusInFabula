package it.unipd.dei.webapp.lupus.resource;

import java.sql.Time;
import java.sql.Timestamp;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.OutputStream;


public class PlaysJoinGame extends AbstractResource {
    private final int game_id;
    private final Timestamp start;
    private final Time game_duration;
    private final int number_of_rounds;
    private final String name;
    private final boolean has_won;
    //    private final int with_who_wins;
    //  private final int who_wins;

    public PlaysJoinGame(int game_id, Timestamp start, Time game_duration, int number_of_rounds, String name, int with_who_wins, int who_wins) {
        this.game_id = game_id;
        this.start = start;
        this.game_duration = game_duration;
        this.number_of_rounds = number_of_rounds;
        this.name = name;
        this.has_won = with_who_wins == who_wins;
    }

    public int getGameId() {
        return game_id;
    }

    public Timestamp getStart() {
        return start;
    }

    public Time getGameDuration() {
        return game_duration;
    }

    public int getNumberOfRounds() {
        return number_of_rounds;
    }

    public String getName() { return name; }

    public boolean getHasWon() {
        return has_won;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("PlaysJoinGame");
        jg.writeStartObject();
        jg.writeNumberField("game_id", game_id);
        jg.writeStringField("start", start.toString());
        jg.writeStringField("game_duration", game_duration.toString());
        jg.writeNumberField("number_of_rounds", number_of_rounds);
        jg.writeStringField("name", name);
        jg.writeBooleanField("has_won", has_won);
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
    /*
    public int getWithWhoWins() {
        return with_who_wins;
    }

    public int getWhoWins() {
        return who_wins;
    }

     */
}


