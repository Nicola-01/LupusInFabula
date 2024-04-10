CREATE TABLE Action (
                        game_id SERIAL REFERENCES Game(ID),
                        player_username TEXT REFERENCES Player(username),
                        round INTEGER NOT NULL,
                        phase INTEGER NOT NULL,
                        subphase INTEGER NOT NULL,
                        description CHARACTER VARYING,
                        type_of_action SERIAL REFERENCES type_action(ID) NOT NULL,
                        target VARCHAR(20) REFERENCES Player(username) NOT NULL,
                        PRIMARY KEY (game_id, player_username, round, phase, subphase)
);