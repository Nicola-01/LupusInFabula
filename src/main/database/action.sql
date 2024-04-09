CREATE TABLE Action (
                        game_id SERIAL REFERENCES Game(ID),
                        player_username TEXT REFERENCES Player(username),
                        round INTEGER,
                        phase INTEGER,
                        subphase INTEGER,
                        description CHARACTER VARYING,
                        PRIMARY KEY (game_id, player_username)
);