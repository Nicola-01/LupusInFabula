package it.unipd.dei.webapp.lupus.resource;

import java.sql.Date;

public class Player {
    private final int id;
    private final String username;
    private final String email;
    private final String password;
    private final Date registerDate;

    public Player(final int id, final String username, final String email,
                  final String password, final Date registerDate) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.registerDate = registerDate;
    }

    public final int getId() {
        return id;
    }

    public final String getUsername() {
        return username;
    }

    public final String getEmail() {
        return email;
    }

    public final String getPassword() {
        return password;
    }

    public final Date getRegisterDate() {
        return registerDate;
    }
}
