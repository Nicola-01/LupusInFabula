package it.unipd.dei.webapp.lupus.utils;

public enum GameRole {
    MASTER(1, "master"),
    WOLF(16, "wolf");

    private final int id;
    private final String name;

    GameRole(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
