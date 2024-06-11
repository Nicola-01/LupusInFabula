package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Represents a role in the system.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class Role extends AbstractResource {

    /**
     * The name of the role
     */
    private final String name;

    /**
     * The type of the role:
     * - -1: master
     * - 0: good
     * - 1: evil
     * - 2: victory stealer
     * - 3: neutral
     */
    private final int type;

    /**
     * The faction with which the role can win the game:
     * - -1: special case for the master
     * - 0: farmers/villagers
     * - 1: wolves
     * - 2: hamster
     * - 3: jester
     */
    private final int with_who_wins;

    /**
     * The max number of that role in a game
     */
    private final int max_number;

    /**
     * The description of the role
     */
    private final String description;

    /**
     * Constructs a Role object with the specified name, type, with_who_wins, max_number and description.
     *
     * @param name          The name of the role.
     * @param type          The type of the role.
     * @param with_who_wins The faction with which the role can win the game.
     * @param maxNumber     The max number of that role in a game.
     * @param description   The description of the role.
     */
    public Role(String name, int type, int with_who_wins, int maxNumber, String description) {
        this.name = name;
        this.type = type;
        this.with_who_wins = with_who_wins;
        this.max_number = maxNumber;
        this.description = description;
    }

    /**
     * Gets the name of the role.
     *
     * @return the name of the role.
     */
    public String getName() {
        return name;
    }

    /**
     * Gets the faction with which the role can win the game.
     *
     * @return faction with which the role can win the game.
     */
    public int getWith_who_wins() {
        return with_who_wins;
    }

    /**
     * Gets the description of the role.
     *
     * @return the description of the role.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Gets the max number of that role in a game.
     *
     * @return the max number of that role in a game.
     */
    public int getMax_number() {
        return max_number;
    }

    /**
     * Gets the type of the role.
     *
     * @return the type of the role.
     */
    public int getType() {
        return type;
    }

    /**
     * Converts the Role object into JSON format and writes it to the provided OutputStream.
     *
     * @param out the OutputStream to write the JSON representation to.
     * @throws IOException if an I/O error occurs while writing the JSON representation.
     */
    @Override
    protected void writeJSON(OutputStream out) throws IOException {

        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);

        jg.writeStartObject();
        jg.writeFieldName("role");
        jg.writeStartObject();
        jg.writeStringField("name", name);
        jg.writeNumberField("type", type);
        jg.writeNumberField("with_who_wins", with_who_wins);
        jg.writeNumberField("max_number", max_number);
        jg.writeStringField("description", description);
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
}
