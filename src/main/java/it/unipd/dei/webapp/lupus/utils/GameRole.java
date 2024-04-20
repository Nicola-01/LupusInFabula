package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing roles in the Lupus in Fabula game.
 */
public enum GameRole {

    MASTER(1, "master"),
    WOLF(16, "wolf");

    /**
     * The unique identifier of the role, is the same of the database.
     */
    private final int id;

    /**
     * The name of the role, is the same of the database.
     */
    private final String name;

    /**
     * Constructs a GameRole enum constant with the specified ID and name.
     *
     * @param id   The ID of the role.
     * @param name The name of the role.
     */
    GameRole(int id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Gets the ID of the role.
     *
     * @return The ID of the role.
     */
    public int getId() {
        return id;
    }

    /**
     * Gets the name of the role.
     *
     * @return The name of the role.
     */
    public String getName() {
        return name;
    }
}
