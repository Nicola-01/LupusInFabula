DROP TABLE IF EXISTS Player;

CREATE TABLE Player (
    username VARCHAR(20) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL
    );

INSERT INTO Player (username, email, password, registration_date) VALUES ('esempio', 'esempio@example.com',
                                                                     'password123', '2024-02-02');
INSERT INTO Player (username, email, password, registration_date) VALUES ('2esempio2', 'esempio@example.com',
                                                                     'password123', '2024-02-02');