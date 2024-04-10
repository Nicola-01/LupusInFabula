DROP TABLE IF EXISTS Player;

CREATE TABLE Player (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    registerDate DATE NOT NULL
    );

INSERT INTO Player (username, email, password, registerDate) VALUES ('esempio', 'esempio@example.com',
                                                                     md5('password123'), '2024-02-02');
INSERT INTO Player (username, email, password, registerDate) VALUES ('2esempio2', '2esempio2@example.com',
                                                                     md5('password123'), '2024-02-02');