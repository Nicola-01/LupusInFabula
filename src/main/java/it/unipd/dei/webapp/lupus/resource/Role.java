package it.unipd.dei.webapp.lupus.resource;

public class Role {

    private final int id;
    private final String name;
    private final int type;
    private final int with_who_wins;
    private final int max_number;
    private final String description;

    public Role(int id, String name, int type, int with_who_wins, int maxNumber, String description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.with_who_wins = with_who_wins;
        this.max_number = maxNumber;
        this.description = description;
    }

    public int getId() { return id; }

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
}
