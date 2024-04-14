package it.unipd.dei.webapp.lupus.resource;

public class PlaysAsIn {

    private final String playerUsername;
    private final int gameId;
    private final int roleId;
    private int roundOfDeath;
    private String phaseOfDeath;
    private float durationOfLife;

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId,
                     final int roundOfDeath, final String phaseOfDeath, final float durationOfLife) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
        this.roundOfDeath = roundOfDeath;
        this.phaseOfDeath = phaseOfDeath;
        this.durationOfLife = durationOfLife;
    }

    public PlaysAsIn(final String playerUsername, final int gameId, final int roleId) {
        this.playerUsername = playerUsername;
        this.gameId = gameId;
        this.roleId = roleId;
    }

    public String getPlayerUsername() {
        return playerUsername;
    }

    public int getGameId() {
        return gameId;
    }

    public int getRoleId() {
        return roleId;
    }

    public int getRoundOfDeath() {
        return roundOfDeath;
    }

    public String getPhaseOfDeath() {
        return phaseOfDeath;
    }

    public float getDurationOfLife() {
        return durationOfLife;
    }
}
