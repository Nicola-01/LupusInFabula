package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing phases in a game.
 */
public enum GamePhase {

    NIGHT(0, "night"),
    DAY(1, "day");

    /**
     * The unique identifier of the phase.
     */
    private final int id;

    /**
     * The name of the phase.
     */
    private final String name;

    /**
     * Constructs a GamePhase enum constant with the specified ID and name.
     *
     * @param id   The ID of the phase.
     * @param name The name of the phase.
     */
    GamePhase(int id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Gets the ID of the phase.
     *
     * @return The ID of the phase.
     */
    public int getId() {
        return id;
    }

    /**
     * Gets the name of the phase.
     *
     * @return The name of the phase.
     */
    public String getName() {
        return name;
    }

    /**
     * Retrieves the GamePhase enum constant associated with the specified ID.
     *
     * @param id The ID of the phase to retrieve.
     * @return The GamePhase enum constant associated with the specified ID, or null if no match is found.
     */
    public static GamePhase getById(int id) {
        for (GamePhase phase : GamePhase.values()) {
            if (phase.getId() == id) {
                return phase;
            }
        }
        return null;
    }
}