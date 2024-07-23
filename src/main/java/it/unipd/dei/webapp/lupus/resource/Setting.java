package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * The Setting class represents a setting with a name and description.
 * It extends the AbstractResource class and provides functionality to
 * serialize its data to JSON format.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Setting extends AbstractResource {

    /**
     * The JSON field name for role Setting.
     */
    private static final String JSON_NAME = "gameSettings";

    /**
     * The name of the setting.
     */
    private final String setting_name;

    /**
     * A description of the setting.
     */
    private String description;

    /**
     * The status of the setting (enable/disable).
     */
    private boolean enable;

    /**
     * Constructs a Setting object with the specified name and description.
     *
     * @param setting_name the name of the setting
     * @param description  the description of the setting
     */
    public Setting(String setting_name, String description) {
        this.setting_name = setting_name;
        this.description = description;
    }

    /**
     * Constructs a Setting object with the specified name and description.
     *
     * @param setting_name the name of the setting
     * @param enable       the status of the setting
     */
    public Setting(String setting_name, Boolean enable) {
        this.setting_name = setting_name;
        this.enable = enable;
    }

    /**
     * Returns the name of the setting.
     *
     * @return the name of the setting
     */
    public String getSetting_name() {
        return setting_name;
    }

    /**
     * Returns the description of the setting.
     *
     * @return the description of the setting
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns the status of the setting.
     *
     * @return if the setting is enable
     */
    public boolean isEnable() {
        return enable;
    }

    /**
     * Writes the JSON representation of the Setting object to the specified OutputStream.
     *
     * @param out the OutputStream to write the JSON data to
     * @throws Exception if an error occurs during JSON generation
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);
        jg.writeStartObject();
        jg.writeFieldName("setting");
        jg.writeStartObject();
        jg.writeStringField("setting_name", setting_name);
        jg.writeStringField("description", description);
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }

    /**
     * Parses Setting objects from JSON input stream.
     *
     * @param in The input stream containing JSON data.
     * @return A list of RoleCardinality objects parsed from JSON.
     * @throws IOException If an error occurs while parsing JSON.
     */
    public static List<Setting> fromJSON(final InputStream in) throws IOException {
        List<Setting> settings = new ArrayList<>();

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
                    settings.add(handleGameSettingJSON(jp));
                }
            } else
                settings.add(handleGameSettingJSON(jp));

            return settings;

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
    private static Setting handleGameSettingJSON(JsonParser jp) throws IOException {
        String jSetting = null;
        boolean jStatus = false;

        while (jp.nextToken() != JsonToken.END_OBJECT) {
            if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                switch (jp.getCurrentName()) {
                    case "setting":
                        jp.nextToken();
                        jSetting = jp.getText();
                        break;
                    case "status":
                        jp.nextToken();
                        jStatus = jp.getBooleanValue();
                        break;
                    default:
                        // Handle unexpected fields if needed
                        break;
                }
            }
        }
        if (jSetting == null) {
            throw new IOException("Unable to parse JSON: GameSetting contains null value.");
        }

        return new Setting(jSetting, jStatus);
    }
}
