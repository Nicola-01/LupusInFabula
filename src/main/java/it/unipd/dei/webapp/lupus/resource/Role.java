package it.unipd.dei.webapp.lupus.resource;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.OutputStream;

public class Role extends AbstractResource {

    private final String name;
    private final int type;
    private final int with_who_wins;
    private final int max_number;
    private final String description;

    public Role(String name, int type, int with_who_wins, int maxNumber, String description) {
        this.name = name;
        this.type = type;
        this.with_who_wins = with_who_wins;
        this.max_number = maxNumber;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public int getWith_who_wins() {
        return with_who_wins;
    }

    public String getDescription() {
        return description;
    }

    public int getMax_number() {
        return max_number;
    }

    public int getType() {
        return type;
    }

    @Override
    protected void writeJSON(OutputStream out) throws Exception {

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
