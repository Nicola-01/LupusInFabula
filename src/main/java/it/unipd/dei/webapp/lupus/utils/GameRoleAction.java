package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing roles in the Lupus in Fabula game.
 */
public enum GameRoleAction {

    MASTER("master", null),
    CARPENTER("carpenter", null), // TODO --> think to the day action
    FARMER("farmer", null),
    HOBBIT("hobbit", null),
    KAMIKAZE("kamikaze", "blowup"),
    KNIGHT("knight", "protect"),
    MEDIUM("medium", "look"),
    SAM("sam", null),
    SEER("seer", "investigate"),
    SHERIFF("sheriff", "shot"),
    BERSERKER("berserker", "rage"),
    DORKY("dorky", "point"),
    EXPLORER("explorer", "explore"),
    GIUDA("giuda", null),
    PUPPY("puppy", null),
    WOLF("wolf", "maul"),
    HAMSTER("hamster", null),
    JESTER("jester", null),
    ILLUSIONIST("illusionist", "block"),
    PLAGUE_SPREADER("plague spreader", "plague");


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
     * @param name   The name of the role.
     * @param action The action of the role.
     */
    GameRoleAction(String name, String action) {
        this.name = name;
        this.action = action;
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
