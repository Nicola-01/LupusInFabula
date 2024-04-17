package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;

public class PlaysAsIn extends AbstractResource {

    private final String playerUsername;
    private final int gameId;
    private final int roleId;
    private int roundOfDeath;
    private String phaseOfDeath;
    private float durationOfLife;

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId,
                     final int roundOfDeath, final String phaseOfDeath, final float durationOfLife) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
    }

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
    }

    @Override
    protected void writeJSON(final OutputStream out) throws IOException {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();

        jg.writeFieldName("user");
        jg.writeStartObject();

        jg.writeStringField("username", this.playerUsername); // Write the username field
        jg.writeStringField("gameID", Integer.toString(this.gameId));
        jg.writeStringField("roleID", Integer.toString(this.roleId));

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

    public int getRoleId() {
        return roleId;
    }

    public int getRoundOfDeath() {
        return roundOfDeath;
    }

    public String getPhaseOfDeath() {
        return phaseOfDeath;
    }

    public float getDurationOfLife() {
        return durationOfLife;
    }
}
