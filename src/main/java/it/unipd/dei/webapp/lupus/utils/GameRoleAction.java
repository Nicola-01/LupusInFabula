package it.unipd.dei.webapp.lupus.utils;

/**
 * Enumeration representing roles in the Lupus in Fabula game.
 */
public enum GameRoleAction {

    /**
     * The MASTER role.
     */
    MASTER(RoleType.MASTER, "master", null),

    /**
     * The CARPENTER role.
     */
    CARPENTER(RoleType.GOOD,"carpenter", "last chance"),

    /**
     * The FARMER role.
     */
    FARMER(RoleType.GOOD, "farmer", null),

    /**
     * The HOBBIT role.
     */
    HOBBIT(RoleType.GOOD,"hobbit", null),

    /**
     * The KAMIKAZE role.
     */
    KAMIKAZE(RoleType.GOOD,"kamikaze", "blowup"),

    /**
     * The KNIGHT role.
     */
    KNIGHT(RoleType.GOOD,"knight", "protect"),

    /**
     * The MEDIUM role.
     */
    MEDIUM(RoleType.GOOD,"medium", "look"),

    /**
     * The SAM role.
     */
    SAM(RoleType.GOOD,"sam", "revenge"),

    /**
     * The SEER role.
     */
    SEER(RoleType.GOOD,"seer", "investigate"),

    /**
     * The SHERIFF role.
     */
    SHERIFF(RoleType.GOOD,"sheriff", "shot"),

    /**
     * The BERSERKER role.
     */
    BERSERKER(RoleType.EVIL,"berserker", "rage"),

    /**
     * The DORKY role.
     */
    DORKY(RoleType.EVIL,"dorky", "point"),

    /**
     * The EXPLORER role.
     */
    EXPLORER(RoleType.EVIL,"explorer", "explore"),

    /**
     * The GIUDA role.
     */
    GIUDA(RoleType.EVIL,"giuda", null),

    /**
     * The PUPPY role.
     */
    PUPPY(RoleType.EVIL,"puppy", "maul"),

    /**
     * The WOLF role.
     */
    WOLF(RoleType.EVIL,"wolf", "maul"),

    /**
     * The HAMSTER role.
     */
    HAMSTER(RoleType.VICTORY_STEALER,"hamster", null),

    /**
     * The JESTER role.
     */
    JESTER(RoleType.VICTORY_STEALER,"jester", null),

    /**
     * The ILLUSIONIST role.
     */
    ILLUSIONIST(RoleType.NEUTRAL,"illusionist", "block"),

    /**
     * The PLAGUE_SPREADER role.
     */
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
     * @param roleType The RoleType of a role.
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
