package it.unipd.dei.webapp.lupus.utils;

public enum RoleType {
    MASTER(-1, "master"),
    GOOD(0, "good"),
    EVIL(1, "evil"),
    VICTORY_STEALER(2, "victory_stealer"),
    NEUTRAL(3, "neutral");

    private final int type;
    private final String name;

    RoleType(int type, String name) {
        this.type = type;
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public String getName() {
        return name;
    }
}