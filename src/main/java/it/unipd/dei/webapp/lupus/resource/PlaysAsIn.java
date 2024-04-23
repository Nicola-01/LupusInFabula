package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;

public class PlaysAsIn extends AbstractResource {

    private final String playerUsername;
    private final int gameId;
    private final String role;
    private int roundOfDeath;
    private int phaseOfDeath;
    private float durationOfLife;

    public PlaysAsIn(final String playerUsername, final int gameId, final String role,
                     final int roundOfDeath, final int phaseOfDeath, final float durationOfLife) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.role = role;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
    }

    public PlaysAsIn(final String playerUsername, final int gameId, final String role) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.role = role;
    }

    @Override
    protected void writeJSON(final OutputStream out) throws IOException {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();

        jg.writeFieldName("playsAsIn");
        jg.writeStartObject();

        jg.writeStringField("username", this.playerUsername); // Write the username field
        jg.writeNumberField("gameID", this.gameId);
        jg.writeStringField("role", this.role);
        jg.writeBooleanField("isDead", this.roundOfDeath > 0);

        jg.writeEndObject();

        jg.writeEndObject();

        jg.flush();
    }

    public String getPlayerUsername() {
        return playerUsername;
    }

    public int getGameId() {
        return gameId;
    }

    public String getRole() {
        return role;
    }

    public int getRoundOfDeath() {
        return roundOfDeath;
    }

    public int getPhaseOfDeath() {
        return phaseOfDeath;
    }

    public float getDurationOfLife() {
        return durationOfLife;
    }
}
