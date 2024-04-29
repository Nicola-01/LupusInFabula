package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

/**
 * Represents the potential targets for a player action in the game..<br>
 * The targets can be specified either based on a role, in which case a list of players with that role is also needed,
 * or for a single player.
 * It is utilized in the {@link it.unipd.dei.webapp.lupus.rest.GameActionsGetRR} class.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class ActionTarget extends AbstractResource {

    /**
     * The player performing the action.
     */
    private String player;

    /**
     * The role associated with the action.
     */
    private String role;

    /**
     * The list of players associated with the action.
     */
    private List<String> players;

    /**
     * The type of action being performed.
     */
    private final String action;

    /**
     * The list of potential targets for the action.
     */
    private final List<String> targets;

    /**
     * Constructs an ActionTarget object based on a role.
     *
     * @param role    The role for which the action target is defined.
     * @param players The list of players associated with the role.
     * @param action  The action for which the target is defined.
     * @param targets The possible targets for the action.
     */
    public ActionTarget(String role, List<String> players, String action, List<String> targets) {
        this.role = role;
        this.players = players;
        this.action = action;
        this.targets = targets;
    }

    /**
     * Constructs an ActionTarget object for a specific player.
     *
     * @param player  The player for whom the action target is defined.
     * @param action  The action for which the target is defined.
     * @param targets The possible targets for the action.
     */
    public ActionTarget(String player, String action, List<String> targets) {
        this.player = player;
        this.action = action;
        this.targets = targets;
    }

    /**
     * Retrieves the player associated with the action target.
     *
     * @return The player associated with the action target, or null if not specified.
     */
    public String getPlayer() {
        return player;
    }

    /**
     * Retrieves the list of players associated with the role for the action target.
     *
     * @return The list of players associated with the role.
     */
    public List<String> getPlayers() {
        return players;
    }

    /**
     * Retrieves the action for which the target is defined.
     *
     * @return The action for which the target is defined.
     */
    public String getAction() {
        return action;
    }

    /**
     * Retrieves the possible targets for the action.
     *
     * @return The list of possible targets for the action.
     */
    public List<String> getTargets() {
        return targets;
    }

    /**
     * Writes JSON representation of the action target to the output stream.
     *
     * @param out The output stream to write JSON to.
     * @throws Exception If an error occurs while writing JSON.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("actionTarget");
        jg.writeStartObject();

        // if the player is set the action is for a single player
        if (player != null)
            jg.writeStringField("player", player);
        // else the action is for a role, i.e. multiple players
        else {
            jg.writeStringField("role", role);
            listToJSON(jg, players, "players");
        }

        jg.writeStringField("action", action);
        listToJSON(jg, targets, "possibleTargets");

        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();

    }

    /**
     * Converts a list of players into JSON format.
     *
     * @param jg        The JSON generator.
     * @param list      The list of players.
     * @param fieldName The field name to use in the JSON.
     * @throws IOException If an I/O error occurs during JSON writing.
     */
    static void listToJSON(JsonGenerator jg, List<String> list, String fieldName) throws IOException {
        jg.writeFieldName(fieldName);
        jg.writeStartArray();
        jg.flush();

        boolean firstElement = true;

        for (final String player : list) {
            if (firstElement) {

                jg.writeStartObject();
                jg.writeStringField("player", player);
                jg.writeEndObject();
                jg.flush();

                jg.flush();
                firstElement = false;
            } else {
//                jg.writeRaw(',');
                jg.flush();

                jg.writeStartObject();
                jg.writeStringField("player", player);
                jg.writeEndObject();
//                jg.flush();

                jg.flush();
            }
        }
        jg.writeEndArray();
    }

}
