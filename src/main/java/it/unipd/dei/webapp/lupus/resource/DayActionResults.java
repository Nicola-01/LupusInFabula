package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;

/**
 * Represents the results of day actions in the game.
 * This includes the player who was voted, the Carpenter's ability, and the target of the Seer Apprentice's scan.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class DayActionResults extends AbstractResource {

    /**
     * The player who was voted during the day.
     */
    private String votedPlayer;

    /**
     * Indicates whether the Carpenter's ability was used during the day.
     */
    private boolean carpenterAbility;

    /**
     * The player targeted by the Seer Apprentice's scan during the day.
     */
    private String samTarget;

    /**
     * Constructs a DayActionResults object with the specified parameters.
     *
     * @param votedPlayer      the player who was voted during the day.
     * @param carpenterAbility indicates whether the Carpenter's ability was used during the day.
     * @param samTarget        the player targeted by the Seer Apprentice's scan during the day.
     */
    public DayActionResults(String votedPlayer, boolean carpenterAbility, String samTarget) {
        this.votedPlayer = votedPlayer;
        this.carpenterAbility = carpenterAbility;
        this.samTarget = samTarget;
    }

    /**
     * Constructs a new DayActionResults object with default values.
     */
    public DayActionResults() {
        this("", false, "");
    }

    /**
     * Sets the player who was voted during the day.
     *
     * @param votedPlayer the player who was voted.
     */
    public void setVotedPlayer(String votedPlayer) {
        this.votedPlayer = votedPlayer;
    }

    /**
     * Checks if the Carpenter's ability was used during the day.
     *
     * @return true if the Carpenter's ability was used, false otherwise.
     */
    public boolean isCarpenterAbility() {
        return carpenterAbility;
    }

    /**
     * Sets whether the Carpenter's ability was used during the day.
     *
     * @param carpenterAbility true if the Carpenter's ability was used, false otherwise.
     */
    public void setCarpenterAbility(boolean carpenterAbility) {
        this.carpenterAbility = carpenterAbility;
    }

    /**
     * Gets the player targeted by the Seer Apprentice's scan during the day.
     *
     * @return the player targeted by the Seer Apprentice's scan.
     */
    public String getSamTarget() {
        return samTarget;
    }

    /**
     * Sets the player targeted by the Seer Apprentice's scan during the day.
     *
     * @param samTarget the player targeted by the Seer Apprentice's scan.
     */
    public void setSamTarget(String samTarget) {
        this.samTarget = samTarget;
    }

    /**
     * Writes the DayActionResults object to a JSON stream.
     *
     * @param out the output stream to write to.
     * @throws Exception if there is an error writing to the stream.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("dayActionResults");
        jg.writeStartObject();

        jg.writeStringField("votedPlayer", votedPlayer);
        jg.writeBooleanField("carpenterAbility", carpenterAbility);
        jg.writeStringField("samTarget", samTarget);

        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }

    /**
     * Generates a string representation of the DayActionResults object.
     *
     * @return a string representing the DayActionResults object.
     */
    @Override
    public String toString() {

        return "DayActionResults{" +
                "; votedPlayer='" + votedPlayer +
                "; carpenterAbility=" + carpenterAbility +
                "; samTarget=" + samTarget +
                '}';
    }
}
