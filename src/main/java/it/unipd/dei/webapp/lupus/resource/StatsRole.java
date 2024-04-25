package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;

/**
 * Represents statistics about a role.
 * This class contains information about the role's name, the number of times it appears, and the number of wins associated with it.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */
public class StatsRole extends AbstractResource {
    /**
     * The name of the role.
     */
    private final String name;

    /**
     * The number of times the role appears.
     */
    private final int countName;

    /**
     * The number of wins associated with the role.
     */
    private final int countWins;

    /**
     * Constructs a new StatsRole object with the specified parameters.
     *
     * @param name       The name of the role.
     * @param countName  The number of times the role appears.
     * @param countWins  The number of wins associated with the role.
     */
    public StatsRole(String name, int countName, int countWins) {
        this.name = name;
        this.countName = countName;
        this.countWins = countWins;
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
     * Gets the number of times the role appears.
     *
     * @return The number of times the role appears.
     */
    public int getCountName() {
        return countName;
    }

    /**
     * Gets the number of wins associated with the role.
     *
     * @return The number of wins associated with the role.
     */
    public int getCountWins() {
        return countWins;
    }

    /**
     * Writes JSON representation of the object to the output stream.
     *
     * @param out The output stream to write JSON to.
     * @throws Exception If an error occurs while writing JSON.
     */
    @Override
    protected void writeJSON(OutputStream out) throws Exception {
        final JsonGenerator jg = JSON_FACTORY.createGenerator(out);
        jg.writeStartObject();
        jg.writeFieldName("StatsRole");
        jg.writeStartObject();
        jg.writeStringField("name", name);
        jg.writeNumberField("countName", countName);
        jg.writeNumberField("countWins", countWins);
        jg.writeEndObject();
        jg.writeEndObject();
        jg.flush();
    }
}
