package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing the types of roles in the Lupus in Fabula game.
 */
public enum RoleType {

    MASTER(-1, "master"),
    GOOD(0, "good"),
    EVIL(1, "evil"),
    VICTORY_STEALER(2, "victory_stealer"),
    NEUTRAL(3, "neutral");

    /**
     * The type of the role.
     */
    private final int type;

    /**
     * The name of the role.
     */
    private final String name;

    /**
     * Constructs a RoleType enum constant with the specified type and name.
     *
     * @param type The type of the role.
     * @param name The name of the role.
     */
    RoleType(int type, String name) {
        this.type = type;
        this.name = name;
    }

    /**
     * Gets the type of the role.
     *
     * @return The type of the role.
     */
    public int getType() {
        return type;
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
