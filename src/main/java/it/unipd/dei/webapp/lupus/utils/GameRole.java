package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing roles in the Lupus in Fabula game.
 */
public enum GameRole {

    MASTER(1, "master", null),
    CARPENTER(2, "carpenter", null), // TODO --> think to the day action
    FARMER(3, "farmer", null),
    HOBBIT(4, "hobbit", null),
    KAMIKAZE(5, "kamikaze", "blowup"),
    KNIGHT(6, "knight", "protect"),
    MEDIUM(7, "medium", "look"),
    SAM(8, "sam", null),
    SEER(9, "seer", "investigate"),
    SHERIFF(10, "sheriff", "shot"),
    BERSERKER(11, "berserker", "rage"),
    DORKY(12, "dorky", "point"),
    EXPLORER(13, "explorer", "explore"),
    GIUDA(14, "giuda", null),
    PUPPY(15, "puppy", null),
    WOLF(16, "wolf", "maul"),
    HAMSTER(17, "hamster", null),
    JESTER(18, "jester", null),
    ILLUSIONIST(19, "illusionist", "block"),
    PLAGUE_SPREADER(20, "plague spreader", "plague");


    /**
     * The unique identifier of the role, is the same of the database.
     */
    private final int id;

    /**
     * The name of the role, is the same of the database.
     */
    private final String name;

    /**
     * The action of the role.
     */
    private final String action;

    /**
     * Constructs a GameRole enum constant with the specified ID, name and action.
     *
     * @param id     The ID of the role.
     * @param name   The name of the role.
     * @param action The action of the role.
     */
    GameRole(int id, String name, String action) {
        this.id = id;
        this.name = name;
        this.action = action;
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

    /**
     * Gets the action of the role.
     *
     * @return The action of the role.
     */
    public String getAction() {
        return action;
    }
}
