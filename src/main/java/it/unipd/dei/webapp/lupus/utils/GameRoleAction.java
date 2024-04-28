package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing roles in the Lupus in Fabula game.
 */
public enum GameRoleAction {

    MASTER(RoleType.MASTER, "master", null),
    CARPENTER(RoleType.GOOD,"carpenter", null), // TODO --> think to the day action
    FARMER(RoleType.GOOD, "farmer", null),
    HOBBIT(RoleType.GOOD,"hobbit", null),
    KAMIKAZE(RoleType.GOOD,"kamikaze", "blowup"),
    KNIGHT(RoleType.GOOD,"knight", "protect"),
    MEDIUM(RoleType.GOOD,"medium", "look"),
    SAM(RoleType.GOOD,"sam", null), // TODO --> think to the day action
    SEER(RoleType.GOOD,"seer", "investigate"),
    SHERIFF(RoleType.GOOD,"sheriff", "shot"),
    BERSERKER(RoleType.EVIL,"berserker", "rage"),
    DORKY(RoleType.EVIL,"dorky", "point"),
    EXPLORER(RoleType.EVIL,"explorer", "explore"),
    GIUDA(RoleType.EVIL,"giuda", null),
    PUPPY(RoleType.EVIL,"puppy", null),
    WOLF(RoleType.EVIL,"wolf", "maul"),
    HAMSTER(RoleType.VICTORY_STEALER,"hamster", null),
    JESTER(RoleType.VICTORY_STEALER,"jester", null),
    ILLUSIONIST(RoleType.NEUTRAL,"illusionist", "block"),
    PLAGUE_SPREADER(RoleType.NEUTRAL,"plague spreader", "plague");

    /**
     * The type of the role.
     */
    private final RoleType roleType;

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
    GameRoleAction(RoleType roleType, String name, String action) {
        this.roleType = roleType;
        this.name = name;
        this.action = action;
    }

    /**
     * Gets the type of the role.
     *
     * @return The roleType of the role.
     */
    public RoleType getRoleType() {
        return roleType;
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

    /**
     * Retrieves the GameRoleAction enum constant associated with the specified name.
     *
     * @param name The name of the GameRoleAction enum constant.
     * @return The GameRoleAction enum constant associated with the specified name, or {@code null} if no such constant is found.
     */
    public static GameRoleAction valueOfName(String name) {

        for (GameRoleAction roleAction : GameRoleAction.values())
            if (roleAction.getName().equals(name))
                return roleAction;

        return null;
    }
}
