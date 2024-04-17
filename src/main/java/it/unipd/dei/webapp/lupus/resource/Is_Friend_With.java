package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;
import java.sql.Date;

public class Is_Friend_With extends AbstractResource{

    private final String player_username;
    private final String friend_username;
    private final Date date;

    public Is_Friend_With(String player_username, String friend_username, Date date) {
        this.player_username = player_username;
        this.friend_username = friend_username;
        this.date = date;
    }

    public final String getPlayer_username() {return player_username;}

    public final String getFriend_username() {return friend_username;}

    public final Date getDate() {return date;}


    @Override
    protected void writeJSON(OutputStream out) throws Exception {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("isFriendWith");
        jg.writeStartObject();
        jg.writeStringField("player_username", player_username);
        jg.writeStringField("friend_username", friend_username);
        jg.writeStringField("date", date.toString());
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
}
