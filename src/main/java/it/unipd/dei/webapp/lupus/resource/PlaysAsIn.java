package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;

public class PlaysAsIn extends AbstractResource {

    private final String playerUsername;
    private final int gameId;
    private final int roleId;
    private int roundOfDeath;
    private int phaseOfDeath;
    private float durationOfLife;
    private String rolename;

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId,
                     final int roundOfDeath, final int phaseOfDeath, final float durationOfLife) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
    }

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId,
                     final int roundOfDeath, final int phaseOfDeath, final float durationOfLife, final String rolename) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
        this.rolename = rolename;
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

        jg.writeFieldName("playsAsIn");
        jg.writeStartObject();

        jg.writeStringField("username", this.playerUsername); // Write the username field
        jg.writeNumberField("gameID", this.gameId);
        jg.writeNumberField("roleID", this.roleId);
        jg.writeStringField("roleName", this.rolename);
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

    public int getRoleId() {
        return roleId;
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
