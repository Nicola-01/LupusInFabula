package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing the winning factions in the game.
 * Each faction has an associated ID and name.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public enum WinFaction {
    /**
     * The Farmers faction.
     */
    FARMERS(0, "farmers"),
    /**
     * The Wolves faction.
     */
    WOLVES(1, "wolves"),
    /**
     * The Hamster faction.
     */
    HAMSTER(2, "hamster"),
    /**
     * The Jester faction.
     */
    JESTER(3, "jester"),

    /**
     * The game is a draw.
     */
    DRAW(10, "draw");


    /**
     * The unique identifier of the faction.
     */
    private final int id;

    /**
     * The name of the faction.
     */
    private final String name;


    /**
     * Constructor for WinFaction enum.
     *
     * @param id   the ID of the faction
     * @param name the name of the faction
     */
    WinFaction(int id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get the ID of the faction.
     *
     * @return the ID of the faction
     */
    public int getId() {
        return id;
    }

    /**
     * Get the name of the faction.
     *
     * @return the name of the faction
     */
    public String getName() {
        return name;
    }
}
