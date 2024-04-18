package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

public class Player extends AbstractResource {

    private static final String JSON_NAME = "player";

    private final String username;
    private final String email;
    private final String password;
    private Date registration_date;

    public Player(final String username, final String email,
                  final String password, final Date registration_date) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.registration_date = registration_date;
    }

    public Player(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public final String getUsername() {
        return username;
    }

    public final String getEmail() {
        return email;
    }

    public final String getPassword() {
        return password;
    }

    public final Date getRegistration_date() {
        return registration_date;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        // TODO: probabilmente da implementare
    }

    public static List<String> fromJSON(final InputStream in) throws IOException {
        List<String> players = new ArrayList<>();

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) { //TODO controllare il nome

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

    // TODO forse deve diventare un array di Player
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
