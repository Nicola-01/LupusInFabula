package it.unipd.dei.webapp.lupus.resource;

import java.sql.Date;
import java.sql.Timestamp;

public class Game {
    private final int id;
    private final Timestamp game_duration;
    private final String who_win;
    private final int number_of_rounds;
    private final Date start;

    public Game(final int id, final Timestamp game_duration, final String who_win,
                final int number_of_rounds, final Date start) {
        this.id = id;
        this.game_duration = game_duration;
        this.who_win = who_win;
        this.number_of_rounds = number_of_rounds;
        this.start = start;
    }

    public final int getId() {
        return id;
    }

    public final Timestamp getDuration() {
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
