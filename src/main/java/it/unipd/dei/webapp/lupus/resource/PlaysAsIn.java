package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.Time;

/**
 * Represents an entity containing information about a player inside a game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class PlaysAsIn extends AbstractResource {

    /**
     * the username of the player
     */
    private final String playerUsername;
    /**
     * the ID of the game
     */
    private final int gameId;
    /**
     * the role of the player in this game
     */
    private final String role;
    /**
     * if the player died, the round in which this happened
     */
    private int roundOfDeath;
    /**
     * if the player died, the phase in which this happened (day or night)
     */
    private int phaseOfDeath;
    /**
     * total amount of time the player has lived
     */
    private Time durationOfLife;

    /**
     * Creates a new PlaysAsIn object with the specified parameters
     *
     * @param playerUsername the username of the player
     * @param gameId         the id of the game
     * @param role           the role of the player in this game
     * @param roundOfDeath   the round during which the player died
     * @param phaseOfDeath   the phase during which the player died
     * @param durationOfLife the total amount of time the player has lived
     */
    public PlaysAsIn(final String playerUsername, final int gameId, final String role,
                     final int roundOfDeath, final int phaseOfDeath, final Time durationOfLife) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.role = role;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
    }

    /**
     * Creates a new PlaysAsIn object with the specified parameters
     *
     * @param playerUsername the username of the player
     * @param gameId         the id of the game
     * @param role           the role of the player in this game
     */
    public PlaysAsIn(final String playerUsername, final int gameId, final String role) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.role = role;
    }

    /**
     * Creates a new PlaysAsIn object with the specified parameters
     *
     * @param playerUsername the username of the player
     * @param gameId         the id of the game
     * @param role           the role of the player in this game
     * @param roundOfDeath   the round during which the player died
     * @param phaseOfDeath   the phase during which the player died
     */
    public PlaysAsIn(final String playerUsername, final int gameId, final String role, final int roundOfDeath, final int phaseOfDeath) {
        this(playerUsername, gameId, role, roundOfDeath, phaseOfDeath, null);
    }

    /**
     * Method to represent this object through JSON
     *
     * @param out the stream to which the JSON representation of the {@code Resource} has to be written.
     * @throws IOException if there is an error executing the SQL statement
     */
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

    /**
     * Gets the username of the player.
     *
     * @return The username of the player.
     */
    public String getPlayerUsername() {
        return playerUsername;
    }

    /**
     * Gets the ID of the game.
     *
     * @return The ID of the game.
     */
    public int getGameId() {
        return gameId;
    }

    /**
     * Gets the role of the player in this game.
     *
     * @return The role of the player in this game.
     */
    public String getRole() {
        return role;
    }

    /**
     * Gets the round during which the player died.
     *
     * @return The round during which the player died.
     */
    public int getRoundOfDeath() {
        return roundOfDeath;
    }

    /**
     * Gets the phase during which the player died.
     *
     * @return The phase during which the player died.
     */
    public int getPhaseOfDeath() {
        return phaseOfDeath;
    }

    /**
     * Gets the total amount of time the player has lived.
     *
     * @return The total amount of time the player has lived.
     */
    public Time getDurationOfLife() {
        return durationOfLife;
    }
}
