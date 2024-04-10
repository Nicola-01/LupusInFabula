CREATE TABLE PLAYS_AS_IN (
                             player_username VARCHAR(20) REFERENCES Player(username),
                             game_id SERIAL REFERENCES Game(ID),
                             role_id SERIAL REFERENCES Role(ID),
                             round_of_death INTEGER,
                             phase_of_death CHAR(1),
                             duration_of_life FLOAT,
                             PRIMARY KEY (player_username, game_id, role_id)
);