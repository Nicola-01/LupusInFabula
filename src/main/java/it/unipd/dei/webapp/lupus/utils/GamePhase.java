package it.unipd.dei.webapp.lupus.utils;

public enum GamePhase {
    NIGHT(0, "night"),
    DAY(1, "day");

    private final int id;
    private final String name;

    GamePhase(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public static GamePhase getById(int id) {
        for (GamePhase phase : GamePhase.values())
            if (phase.getId() == id)
                return phase;
        return null;
    }

}
