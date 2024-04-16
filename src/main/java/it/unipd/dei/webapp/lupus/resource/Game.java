package it.unipd.dei.webapp.lupus.resource;

import java.sql.Date;
import java.sql.Time;

public class Game {
    private final int id;
    private final String public_ID;
    private final Time game_duration;
    private String who_win;
    private int number_of_rounds;
    private Date start;

    public Game(final int id, final String public_ID, final Time game_duration, final String who_win,
                final int number_of_rounds, final Date start) {
        this.id = id;
        this.public_ID = public_ID;
        this.game_duration = game_duration;
        this.who_win = who_win;
        this.number_of_rounds = number_of_rounds;
        this.start = start;
    }

    public Game(int id, String public_ID, Time game_duration) {
        this.id = id;
        this.public_ID = public_ID;
        this.game_duration = game_duration;
    }

    public final int getId() {
        return id;
    }

    public final String getPublic_ID() {
        return public_ID;
    }

    public final Time getDuration() {
        return game_duration;
    }

    public final String getWho_win() {
        return who_win;
    }

    public final int getNumbers_of_round() {
        return number_of_rounds;
    }

    public final Date getGameDate() {
        return start;
    }
}
