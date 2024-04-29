package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents the results of night actions in the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class NightActionResults extends AbstractResource {

    /**
     * The list of dead players.
     */
    private List<String> deadPlayers;

    /**
     * The player plagued by the Plague Spreader.
     */
    private String plaguedPlayer;

    /**
     * Indicates whether the Puppy has turned into a Wolf.
     */
    private boolean puppyIsWolf;

    /**
     * Indicates whether the Dorky has turned into a Wolf.
     */
    private boolean dorkyIsWolf;

    /**
     * Constructs a NightActionResults object with the specified parameters.
     *
     * @param deadPlayers   the list of dead players.
     * @param plaguedPlayer the player plagued by the Plague Spreader.
     * @param puppyIsWolf   indicates whether the Puppy has turned into a Wolf.
     * @param dorkyIsWolf   indicates whether the Dorky has turned into a Wolf.
     */
    public NightActionResults(List<String> deadPlayers, String plaguedPlayer, boolean puppyIsWolf, boolean dorkyIsWolf) {
        this.deadPlayers = deadPlayers;
        this.plaguedPlayer = plaguedPlayer;
        this.puppyIsWolf = puppyIsWolf;
        this.dorkyIsWolf = dorkyIsWolf;
    }

    /**
     * Constructs a new NightActionResults object with default values.
     */
    public NightActionResults() {
        deadPlayers = new ArrayList<>();
        plaguedPlayer = "";
        puppyIsWolf = false;
        dorkyIsWolf = false;
    }

    /**
     * Gets the list of dead players.
     *
     * @return the list of dead players.
     */
    public List<String> getDeadPlayers() {
        return deadPlayers;
    }

    /**
     * Gets the player plagued by the Plague Spreader.
     *
     * @return the plagued player.
     */
    public String getPlaguedPlayer() {
        return plaguedPlayer;
    }

    /**
     * Checks if the Puppy has turned into a Wolf.
     *
     * @return true if the Puppy has turned into a Wolf, false otherwise.
     */
    public boolean isPuppyIsWolf() {
        return puppyIsWolf;
    }

    /**
     * Checks if the Dorky has turned into a Wolf.
     *
     * @return true if the Dorky has turned into a Wolf, false otherwise.
     */
    public boolean isDorkyIsWolf() {
        return dorkyIsWolf;
    }

    /**
     * Sets the list of dead players.
     *
     * @param deadPlayers the list of dead players to set.
     */
    public void setDeadPlayers(List<String> deadPlayers) {
        this.deadPlayers = deadPlayers;
    }

    /**
     * Adds a dead player to the list.
     *
     * @param player the dead player to add.
     */
    public void addDeadPlayer(String player) {
        this.deadPlayers.add(player);
    }

    /**
     * Sets the player plagued by the Plague Spreader.
     *
     * @param plaguedPlayer the plagued player to set.
     */
    public void setPlaguedPlayer(String plaguedPlayer) {
        this.plaguedPlayer = plaguedPlayer;
    }

    /**
     * Sets whether the Puppy has turned into a Wolf.
     *
     * @param puppyIsWolf true if the Puppy has turned into a Wolf, false otherwise.
     */
    public void setPuppyIsWolf(boolean puppyIsWolf) {
        this.puppyIsWolf = puppyIsWolf;
    }

    /**
     * Sets whether the Dorky has turned into a Wolf.
     *
     * @param dorkyIsWolf true if the Dorky has turned into a Wolf, false otherwise.
     */
    public void setDorkyIsWolf(boolean dorkyIsWolf) {
        this.dorkyIsWolf = dorkyIsWolf;
    }

    /**
     * Writes the NightActionResults object to a JSON stream.
     *
     * @param out the output stream to write to.
     * @throws Exception if there is an error writing to the stream.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("nightActionResults");
        jg.writeStartObject();

        jg.writeStringField("plaguedPlayer", plaguedPlayer);
        jg.writeBooleanField("puppyIsWolf", puppyIsWolf);
        jg.writeBooleanField("dorkyIsWolf", dorkyIsWolf);

        // use ActionTarget.listToJSON to write the list of dead players to the JSON object
        ActionTarget.listToJSON(jg, deadPlayers, "deadPlayers");

        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }

    /**
     * Generates a string representation of the NightActionResults object.
     *
     * @return a string representing the NightActionResults object.
     */
    @Override
    public String toString() {

        String deads = "";
        for (String deadPlayer : deadPlayers) {
            deads = deads.concat(deadPlayer + ", ");
        }

        return "NightActionResults{" +
                "deadPlayers=" + deads +
                "; plaguedPlayer='" + plaguedPlayer +
                "; puppyIsWolf=" + puppyIsWolf +
                "; dorkyIsWolf=" + dorkyIsWolf +
                '}';
    }
}
