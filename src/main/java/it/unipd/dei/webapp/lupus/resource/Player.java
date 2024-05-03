package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a player in the system.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Player extends AbstractResource {

    /**
     * The JSON field name for role cardinality.
     */
    private static final String JSON_NAME = "player";

    /**
     * The username of the player.
     */
    private final String username;

    /**
     * The email address of the player.
     */
    private final String email;

    /**
     * The password of the player.
     */
    private final String password;

    /**
     * The registration date of the player.
     */
    private Date registration_date;

    /**
     * Constructs a Player object with the specified username, email, password, and registration date.
     *
     * @param username          The username of the player.
     * @param email             The email address of the player.
     * @param password          The password of the player.
     * @param registration_date The registration date of the player.
     */
    public Player(final String username, final String email,
                  final String password, final Date registration_date) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.registration_date = registration_date;
    }

    /**
     * Constructs a Player object with the specified username, email, and password.
     *
     * @param username The username of the player.
     * @param email    The email address of the player.
     * @param password The password of the player.
     */
    public Player(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    /**
     * Constructs a Player object.
     *
     * @param username The username of the player.
     */
    public Player(String username) {
        this(username, null, null, null);
    }

    /**
     * Gets the username of the player.
     *
     * @return The username of the player.
     */
    public final String getUsername() {
        return username;
    }

    /**
     * Gets the email address of the player.
     *
     * @return The email address of the player.
     */
    public final String getEmail() {
        return email;
    }

    /**
     * Gets the password of the player.
     *
     * @return The password of the player.
     */
    public final String getPassword() {
        return password;
    }

    /**
     * Gets the registration date of the player.
     *
     * @return The registration date of the player.
     */
    public final Date getRegistration_date() {
        return registration_date;
    }

    /**
     * Writes JSON representation of the player to the output stream.
     *
     * @param out The output stream to write JSON to.
     * @throws Exception If an error occurs while writing JSON.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName(JSON_NAME);
        jg.writeStartObject();

        jg.writeStringField("username", username); // Write the username field
        if (email != null)
            jg.writeStringField("email", email);
        if (registration_date != null)
            jg.writeStringField("registration_date", registration_date.toString());

        jg.writeEndObject();
        jg.writeEndObject();

        jg.flush();
    }

    /**
     * Parses JSON input stream and returns a list of player usernames.
     *
     * @param in The input stream containing JSON data.
     * @return A list of player usernames.
     * @throws IOException If an error occurs while parsing JSON.
     */
    public static List<String> fromJSON(final InputStream in) throws IOException {
        List<String> players = new ArrayList<>();

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) {

                // there are no more events
                if (jp.nextToken() == null) {
                    LOGGER.error("No Player object found in the stream.");
                    throw new EOFException("Unable to parse JSON: no Player object found.");
                }
            }

            jp.nextToken();
            if (jp.getCurrentToken() == JsonToken.START_ARRAY) {
                while (jp.nextToken() != JsonToken.END_ARRAY) {
                    players.add(handlePlayerJSON(jp));
                }
            } else
                players.add(handlePlayerJSON(jp));

            return players;

        } catch (IOException e) {
            LOGGER.error("Unable to parse an Player object from JSON.", e);
            throw e;
        }
    }

    /**
     * Handles parsing of a JSON representation of a player and returns the username.
     *
     * @param jp The JSON parser containing the data to parse.
     * @return The username of the parsed player.
     * @throws IOException If an error occurs during parsing.
     */
    private static String handlePlayerJSON(JsonParser jp) throws IOException {

        String jUsername = null;
//        String jEmail;
//        String jPassword;
//        Date jRegistration_date;

        while (jp.nextToken() != JsonToken.END_OBJECT) {
            if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                switch (jp.getCurrentName()) {
                    case "username":
                        jp.nextToken();
                        jUsername = jp.getText();
                        break;
                    default:
                        // Handle unexpected fields if needed
                        break;
                }
            }

        }
        if (jUsername == null) {
            throw new IOException("Unable to parse JSON: Player contains null value.");
        }

        return jUsername;
    }
}
