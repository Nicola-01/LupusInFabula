package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a role and its associated cardinality.<br>
 * Is used to store information about a role and its cardinality, used in {@link it.unipd.dei.webapp.lupus.rest.GameSettingsPostRR}.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class RoleCardinality extends AbstractResource {

    /**
     * The JSON field name for role cardinality.
     */
    private static final String JSON_NAME = "roleCardinality";

    /**
     * The name of the role.
     */
    private final String role;

    /**
     * The cardinality of the role.
     */
    private final int cardinality;

    /**
     * Constructs a new RoleCardinality object with the specified role name and cardinality
     *
     * @param role        The name of the role.
     * @param cardinality The cardinality of the role.
     */
    public RoleCardinality(String role, int cardinality) {
        this.role = role;
        this.cardinality = cardinality;
    }

    /**
     * Gets the name of the role.
     *
     * @return The name of the role.
     */
    public String getRole() {
        return role;
    }

    /**
     * Gets the cardinality of the role.
     *
     * @return The cardinality of the role.
     */
    public int getCardinality() {
        return cardinality;
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
     * Parses RoleCardinality objects from JSON input stream.
     *
     * @param in The input stream containing JSON data.
     * @return A list of RoleCardinality objects parsed from JSON.
     * @throws IOException If an error occurs while parsing JSON.
     */
    public static List<RoleCardinality> fromJSON(final InputStream in) throws IOException {
        List<RoleCardinality> roleCardinalities = new ArrayList<>();

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) {

                // there are no more events
                if (jp.nextToken() == null) {
                    LOGGER.error("No " + JSON_NAME + " object found in the stream.");
                    throw new EOFException("Unable to parse JSON: no " + JSON_NAME + " object found.");
                }
            }

            jp.nextToken();
            if (jp.getCurrentToken() == JsonToken.START_ARRAY) {
                while (jp.nextToken() != JsonToken.END_ARRAY) {
                    roleCardinalities.add(handleGameSettingJSON(jp));
                }
            } else
                roleCardinalities.add(handleGameSettingJSON(jp));

            return roleCardinalities;

        } catch (IOException e) {
            LOGGER.error("Unable to parse an " + JSON_NAME + " object from JSON.", e);
            throw e;
        }
    }

    /**
     * Parses a RoleCardinality object from JSON input using a JsonParser.
     *
     * @param jp The JsonParser object to parse JSON data.
     * @return The parsed RoleCardinality object.
     * @throws IOException If an error occurs while parsing JSON.
     */
    private static RoleCardinality handleGameSettingJSON(JsonParser jp) throws IOException {
        String jRole = null;
        int jCardinality = -1;

        while (jp.nextToken() != JsonToken.END_OBJECT) {
            if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                switch (jp.getCurrentName()) {
                    case "role":
                        jp.nextToken();
                        jRole = jp.getText();
                        break;
                    case "cardinality":
                        jp.nextToken();
                        jCardinality = jp.getIntValue();
                        break;
                    default:
                        // Handle unexpected fields if needed
                        break;
                }
            }
        }
        if (jRole == null || jCardinality == -1) {
            throw new IOException("Unable to parse JSON: GameSetting contains null value.");
        }

        return new RoleCardinality(jRole, jCardinality);
    }
}
