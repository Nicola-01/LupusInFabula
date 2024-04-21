package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Date;

public class Friend extends AbstractResource {
    private static String username;
    private static Date friendship_date;


    public Friend(final String username, final Date friendship_date){
        this.username = username;
        this.friendship_date = friendship_date;
    }

    public String getUsername() {
        return username;
    }

    public Date getFriendshipDate() {
        return friendship_date;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();

        jg.writeFieldName("friend");

        jg.writeStartObject();

        jg.writeStringField("username", username);

        jg.writeStringField("friendship_date", friendship_date.toString());

        jg.writeEndObject();

        jg.writeEndObject();

        jg.flush();
    }

    public static Friend fromJSON(final InputStream in) throws IOException {

        // the fields read from JSON
        String jUsername = null;
        String jFriendship_date = null;

        try {
            final JsonParser jp = JSON_FACTORY.createParser(in);

            // while we are not on the start of an element or the element is not
            // a token element, advance to the next element (if any)
            while (jp.getCurrentToken() != JsonToken.FIELD_NAME || !"friend".equals(jp.getCurrentName())) {

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
            LOGGER.error("Unable to parse an Friend object from JSON.", e);
            throw e;
        }

        return new Friend(jUsername, Date.valueOf(jFriendship_date));
    }
}
