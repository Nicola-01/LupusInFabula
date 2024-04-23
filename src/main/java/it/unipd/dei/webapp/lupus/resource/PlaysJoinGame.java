package it.unipd.dei.webapp.lupus.resource;

import java.sql.Time;
import java.sql.Timestamp;

public class PlaysJoinGame {
    private final int game_id;
    private final Timestamp start;
    private final Time game_duration;
    private final int rounds;
    private final String name;
    private final boolean has_won;
    //    private final int with_who_wins;
  //  private final int who_wins;

    public PlaysJoinGame(int game_id, Timestamp start, Time game_duration, int rounds, String name, int with_who_wins, int who_wins) {
        this.game_id = game_id;
        this.start = start;
        this.game_duration = game_duration;
        this.rounds = rounds;
        this.name = name;
        this.has_won = with_who_wins == who_wins;
    }

    public int getGameId() {
        return game_id;
    }

    public Timestamp getStart() {
        return start;
    }

    public Time getGameDuration() {
        return game_duration;
    }

    public int getRounds() {
        return rounds;
    }

    public String getName() {
        return name;
    }

    public boolean getHasWon() {
        return has_won;
    }

    /*
    public int getWithWhoWins() {
        return with_who_wins;
    }

    public int getWhoWins() {
        return who_wins;
    }

     */
}


