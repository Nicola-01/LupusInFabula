package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.sql.Time;
import java.sql.Timestamp;

/**
 * Represents a joined entity containing information about a game and a player's participation.
 * This class contains information about the game ID, start timestamp, game duration, number of rounds,
 * player name, and whether the player has won the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class PlaysJoinGame extends AbstractResource {
    /**
     * The ID of the game.
     */
    private final int game_id;

    /**
     * The public ID of the game.
     */
    private final String public_id;

    /**
     * The start timestamp of the game.
     */
    private final Timestamp start;

    /**
     * The duration of the game.
     */
    private final Time game_duration;

    /**
     * The number of rounds played in the game.
     */
    private final int number_of_rounds;

    /**
     * The name of the player.
     */
    private final String name;

    /**
     * Indicates whether the player has won the game.
     */
    private final boolean has_won;

    /**
     * Indicates whether the game is finished.
     */
    private final boolean is_game_finished;

    /**
     * Constructs a new PlaysJoinGame object with the specified parameters.
     *
     * @param game_id          The ID of the game.
     * @param public_id   The public ID of the game.
     * @param start            The start timestamp of the game.
     * @param game_duration    The duration of the game.
     * @param number_of_rounds The number of rounds played in the game.
     * @param name             The name of the player.
     * @param with_who_wins    The ID of the winning team or player.
     * @param who_wins         The ID of the player who wins.
     */
    public PlaysJoinGame(int game_id, String public_id, Timestamp start, Time game_duration, int number_of_rounds, String name, int with_who_wins, int who_wins) {
        this.game_id = game_id;
        this.public_id = public_id;
        this.start = start;
        this.game_duration = game_duration;
        this.number_of_rounds = number_of_rounds;
        this.name = name;
        this.has_won = with_who_wins == who_wins;
        this.is_game_finished = who_wins != -1;
    }

    /**
     * Gets the ID of the game.
     *
     * @return The ID of the game.
     */
    public int getGameId() {
        return game_id;
    }

    /**
     * Gets the public ID of the game.
     *
     * @return The public ID of the game.
     */
    public String getPublicGameId() {
        return public_id;
    }

    /**
     * Gets the start timestamp of the game.
     *
     * @return The start timestamp of the game.
     */
    public Timestamp getStart() {
        return start;
    }

    /**
     * Gets the duration of the game.
     *
     * @return The duration of the game.
     */
    public Time getGameDuration() {
        return game_duration;
    }

    /**
     * Gets the number of rounds played in the game.
     *
     * @return The number of rounds played in the game.
     */
    public int getNumberOfRounds() {
        return number_of_rounds;
    }

    /**
     * Gets the name of the player.
     *
     * @return The name of the player.
     */
    public String getName() {
        return name;
    }

    /**
     * Indicates whether the player has won the game.
     *
     * @return true if the player has won the game, false otherwise.
     */
    public boolean getHasWon() {
        return has_won;
    }

    /**
     * Indicates whether the is finished.
     *
     * @return true if the game is finished, false otherwise.
     */
    public boolean getIsGameFinished() {
        return is_game_finished;
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
        jg.writeFieldName("PlaysJoinGame");
        jg.writeStartObject();
        jg.writeNumberField("game_id", game_id);
        jg.writeStringField("public_id", public_id);
        jg.writeStringField("start", start.toString());
        String duration = game_duration != null ? game_duration.toString() : "";
        jg.writeStringField("game_duration", duration);
        jg.writeNumberField("number_of_rounds", number_of_rounds);
        jg.writeStringField("name", name);
        jg.writeBooleanField("has_won", has_won);
        jg.writeBooleanField("is_game_finished", is_game_finished);
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
}
