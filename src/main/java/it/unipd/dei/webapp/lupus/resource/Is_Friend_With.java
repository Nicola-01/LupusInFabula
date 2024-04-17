package it.unipd.dei.webapp.lupus.resource;

import java.sql.Date;

public class Is_Friend_With {

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
}
