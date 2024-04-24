package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;

public class StatsRole extends AbstractResource{
    private final String name;
    private final int countName;
    private final int countWins;

    public StatsRole(String name, int countName, int countWins) {
        this.name = name;
        this.countName = countName;
        this.countWins = countWins;
    }

    public String getName() {
        return name;
    }

    public int getCountName() {
        return countName;
    }

    public int getCountWins() {
        return countWins;
    }

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

