package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import it.unipd.dei.webapp.lupus.rest.GameActionsPostRR;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a game action performed by a player.<br>
 * This class is used to store information about an action of a player with a role towards a target.
 * It is utilized in the {@link GameActionsPostRR} class.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class GameAction extends AbstractResource {

    /**
     * The JSON field name for role cardinality.
     */
    private static final String JSON_NAME = "gameAction";

    /**
     * The player who performed the action.
     */
    private final String player;

    /**
     * The role of the player who performed the action.
     */
    private final String role;

    /**
     * The target of the action performed by the player.
     */
    private final String target;

    /**
     * Constructs a GameAction object.
     *
     * @param player The player who performed the action.
     * @param role   The role of the player.
     * @param target The target of the action.
     */
    public GameAction(String player, String role, String target) {
        this.player = player;
        this.role = role;
        this.target = target;
    }

    /**
     * Gets the player who performed the action.
     *
     * @return The player who performed the action.
     */
    public String getPlayer() {
        return player;
    }

    /**
     * Gets the role of the player who performed the action.
     *
     * @return The role of the player.
     */
    public String getRole() {
        return role;
    }

    /**
     * Gets the target of the action.
     *
     * @return The target of the action.
     */
    public String getTarget() {
        return target;
    }

    /**
     * Writes JSON representation of the object to the output stream.
     *
     * @param out The output stream to write JSON to.
     * @throws UnsupportedOperationException If the method is not implemented.
     */
    @Override
    protected void writeJSON(OutputStream out) throws UnsupportedOperationException {
        throw new UnsupportedOperationException("writeJSON method is not yet implemented.");
    }

    /**
     * Parses a JSON input stream to create a list of GameAction objects.
     *
     * @param in The input stream containing JSON data.
     * @return A list of GameAction objects parsed from the JSON input stream.
     * @throws IOException If an error occurs while parsing JSON.
     */
    public static List<GameAction> fromJSON(final InputStream in) throws IOException {
        List<GameAction> gameActions = new ArrayList<>();

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) {

                // there are no more events
                if (jp.nextToken() == null) {
                    LOGGER.error("No GameAction object found in the stream.");
                    throw new EOFException("Unable to parse JSON: no GameAction object found.");
                }
            }

            jp.nextToken();
            if (jp.getCurrentToken() == JsonToken.START_ARRAY) {
                while (jp.nextToken() != JsonToken.END_ARRAY) {
                    gameActions.add(handleGameAction(jp));
                }
            } else
                gameActions.add(handleGameAction(jp));

            return gameActions;

        } catch (IOException e) {
            LOGGER.error("Unable to parse an GameAction object from JSON.", e);
            throw e;
        }
    }

    /**
     * Handles parsing of a JSON representation of a game action.
     *
     * @param jp The JSON parser containing the data to parse.
     * @return A GameAction object representing the parsed game action.
     * @throws IOException If an error occurs during parsing.
     */
    private static GameAction handleGameAction(final JsonParser jp) throws IOException {

        String jPlayer = null;
        String jRole = null;
        String jTarget = null;

        while (jp.nextToken() != JsonToken.END_OBJECT) {
            if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                switch (jp.getCurrentName()) {
                    case "player":
                        jp.nextToken();
                        jPlayer = jp.getText();
                        break;
                    case "role":
                        jp.nextToken();
                        jRole = jp.getText();
                        break;
                    case "target":
                        jp.nextToken();
                        jTarget = jp.getText();
                        break;
                    default:
                        // Handle unexpected fields if needed
                        break;
                }
            }

        }
        if (jPlayer == null || jRole == null || jTarget == null) {
            throw new IOException("Unable to parse JSON: GameAction contains null value.");
        }

        return new GameAction(jPlayer, jRole, jTarget);
    }
}
