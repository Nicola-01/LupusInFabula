CREATE TABLE Action (
                        game_id SERIAL REFERENCES Game(ID),
                        player_username TEXT REFERENCES Player(username),
                        round INTEGER,
                        phase INTEGER,
                        subphase INTEGER,
                        description CHARACTER VARYING,
                        type_of_action SERIAL REFERENCES type_action(ID),
                        target VARCHAR(20) REFERENCES Player(username),
                        PRIMARY KEY (game_id, player_username)
);