package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class RoleCardinality extends AbstractResource {

    private static final String JSON_NAME = "roleCardinality";

    private final String role;
    private final int carnality;


    public RoleCardinality(String role, int carnality) {
        this.role = role;
        this.carnality = carnality;
    }

    public String getRole() {
        return role;
    }

    public int getCarnality() {
        return carnality;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {
    }

    public static List<RoleCardinality> fromJSON(final InputStream in) throws IOException {
        List<RoleCardinality> roleCardinalities = new ArrayList<>();

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) { //TODO controllare il nome

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

    private static RoleCardinality handleGameSettingJSON(JsonParser jp) throws IOException {
        String jRole = null;
        int jCarnality = -1;

        while (jp.nextToken() != JsonToken.END_OBJECT) {
            if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                switch (jp.getCurrentName()) {
                    case "role":
                        jp.nextToken();
                        jRole = jp.getText();
                        break;
                    case "cardinality":
                        jp.nextToken();
                        jCarnality = jp.getIntValue();
                        break;
                    default:
                        // Handle unexpected fields if needed
                        break;
                }
            }
        }
//        LOGGER.info("roleCardinality: " + jRole + " " + jCarnality);
        if (jRole == null || jCarnality == -1) {
            throw new IOException("Unable to parse JSON: GameSetting contains null value.");
        }

        return new RoleCardinality(jRole, jCarnality);
    }
}
