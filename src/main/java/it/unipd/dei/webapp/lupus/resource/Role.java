package it.unipd.dei.webapp.lupus.resource;

public class Role {

    private final int id;
    private final String name;
    private final int type;
    private final String with_who_wins;
    private final String description;

    public Role(int id, String name, int type, String with_who_wins, String description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.with_who_wins = with_who_wins;
        this.description = description;
    }

    public int getId() { return id; }

    public String getName() {
        return name;
    }

    public String getWith_who_wins() {
        return with_who_wins;
    }

    public String getDescription() {
        return description;
    }

    public int getType() {
        return type;
    }
}
