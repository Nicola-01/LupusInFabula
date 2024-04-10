DROP TABLE IF EXISTS Player;

CREATE TABLE Player (
    username VARCHAR(20) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    registerDate DATE NOT NULL
    );

INSERT INTO Player (username, email, password, registerDate) VALUES ('esempio', 'esempio@example.com',
                                                                     'password123', '2024-02-02');
INSERT INTO Player (username, email, password, registerDate) VALUES ('2esempio2', 'esempio@example.com',
                                                                     'password123', '2024-02-02');