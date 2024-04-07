package it.unipd.dei.webapp.lupus.resource;

public class Role {

    private final String name;
    private final String wins_with;
    private final String description;

    public Role(String name, String wins_with, String description) {
        this.name = name;
        this.wins_with = wins_with;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getWins_with() {
        return wins_with;
    }

    public String getDescription() {
        return description;
    }
}
