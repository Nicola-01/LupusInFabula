
INSERT INTO Player (username, email, password, registration_date) VALUES ('esempio', 'esempio@example.com',
                                                                          'password123', '2024-02-02');

INSERT INTO Player (username, email, password, registration_date) VALUES ('2esempio2', 'esempio@example.com',
                                                                          'password123', '2024-02-02');

INSERT INTO Role (name, type, with_who_wins, description)
VALUES ('farmer', 0, 0, 'prova del farmer');

INSERT INTO Role (name, type, with_who_wins, description)
VALUES ('wolf', 1, 1, 'prova del lupo');

INSERT INTO Role (name, type, with_who_wins, description)
VALUES ('sam', 0, 0, 'prova del sam');

INSERT INTO Role (name, type, with_who_wins, description)
VALUES ('hamster', 2, 2, 'prova del criceto');