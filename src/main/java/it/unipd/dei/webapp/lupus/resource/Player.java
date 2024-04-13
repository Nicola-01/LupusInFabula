package it.unipd.dei.webapp.lupus.resource;

import java.sql.Date;

public class Player {
    private final String username;
    private final String email;
    private final String password;
    private Date registration_date;

    public Player(final String username, final String email,
                  final String password, final Date registration_date) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.registration_date = registration_date;
    }

    public Player(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
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

    public final Date getRegistration_date() {
        return registration_date;
    }
}
