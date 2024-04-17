package it.unipd.dei.webapp.lupus.resource;

public class StatsRole {
    private final String name;
    private final int countName;
    private final int countWins;

    public StatsRole(String name, int countName, int countWins) {
        this.name = name;
        this.countName = countName;
        this.countWins = countWins;
    }

    public String getName() {
        return name;
    }

    public int getCountName() {
        return countName;
    }

    public int getCountWins() {
        return countWins;
    }
}

