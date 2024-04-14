package it.unipd.dei.webapp.lupus.utils;

public enum RoleId {
    MASTER(-1, "master"),
    WOLF(20, "wolf");

    private final int id;
    private final String name;

    RoleId(int id, String name) {
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
