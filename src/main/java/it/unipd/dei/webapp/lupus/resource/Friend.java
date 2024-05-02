package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Date;

/**
 * Represents a friend of a user.
 * It is utilized in the {@link it.unipd.dei.webapp.lupus.rest.ListFriendsRR},
 * {@link it.unipd.dei.webapp.lupus.rest.AddFriendRR} and
 * {@link it.unipd.dei.webapp.lupus.rest.DeleteFriendRR} classes.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Friend extends AbstractResource {

    /**
     * The JSON field name for friend.
     */
    private static final String JSON_NAME = "friend";

    /**
     * The username of the friend
     */
    private final String username;

    /**
     * The date when the friendship was established
     */
    private final Date friendship_date;

    /**
     * Constructor for the Friend class.
     *
     * @param username       the username of the friend
     * @param friendship_date the date when the friendship was established
     */
    public Friend(final String username, final Date friendship_date){
        this.username = username;
        this.friendship_date = friendship_date;
    }

    /**
     * Returns the username of the friend.
     *
     * @return the username of the friend
     */
    public String getUsername() {
        return username;
    }

    /**
     * Returns the date when the friendship was established.
     *
     * @return the friendship date
     */
    public Date getFriendshipDate() {
        return friendship_date;
    }

    /**
     * Method to write the Friend object in JSON format.
     *
     * @param out the OutputStream to write the JSON object to
     * @throws Exception if an error occurs during JSON writing
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();

        jg.writeFieldName(JSON_NAME);

        jg.writeStartObject();

        jg.writeStringField("username", username);

        jg.writeStringField("friendship_date", friendship_date.toString());

        jg.writeEndObject();

        jg.writeEndObject();

        jg.flush();
    }

    /**
     * Static method to create a Friend object from JSON input.
     *
     * @param in the InputStream to read the JSON input from
     * @return the Friend object read from JSON
     * @throws IOException if an error occurs during JSON reading
     */
    public static Friend fromJSON(final InputStream in) throws IOException {

        // the fields read from JSON
        String jUsername = null;
        String jFriendship_date = null;

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !JSON_NAME.equals(jp.getCurrentName())) {

                // there are no more events
                if (jp.nextToken() == null) {
                    LOGGER.error("No Friend object found in the stream.");
                    throw new EOFException("Unable to parse JSON: no Friend object found.");
                }
            }

            while (jp.nextToken() != JsonToken.END_OBJECT) {

                if (jp.getCurrentToken() == JsonToken.FIELD_NAME) {

                    switch (jp.getCurrentName()) {
                        case "username":
                            jp.nextToken();
                            jUsername = jp.getText();
                            break;
                        case "friendship_date":
                            jp.nextToken();
                            jFriendship_date = jp.getText();
                            break;
                    }
                }
            }
        } catch(IOException e) {
            LOGGER.error("Unable to parse a Friend object from JSON.", e);
            throw e;
        }

        return new Friend(jUsername, jFriendship_date == null ? null: Date.valueOf(jFriendship_date));
    }
}
