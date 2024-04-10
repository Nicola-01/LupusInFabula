DROP TABLE IF EXISTS Player;

CREATE TABLE Player (
                        username VARCHAR(20) PRIMARY KEY,
                        email VARCHAR(100) NOT NULL,
                        password VARCHAR(100) NOT NULL,
                        registration_date DATE NOT NULL
);

COMMENT ON TABLE Player IS 'Represents player information.';
COMMENT ON COLUMN Player.username IS 'The unique username of the player.';
COMMENT ON COLUMN Player.email IS 'The email address of the player.';
COMMENT ON COLUMN Player.password IS 'The password of the player.';
COMMENT ON COLUMN Player.registration_date IS 'The date when the player registered.';



INSERT INTO Player (username, email, password, registration_date) VALUES ('esempio', 'esempio@example.com',
                                                                          'password123', '2024-02-02');

INSERT INTO Player (username, email, password, registration_date) VALUES ('2esempio2', 'esempio@example.com',
                                                                          'password123', '2024-02-02');
