CREATE TABLE PLAYS_AS_IN (
                             player_username TEXT REFERENCES Player(username),
                             game_id SERIAL REFERENCES Game(ID),
                             round_of_death INTEGER,
                             phase_of_death CHAR(1),
                             duration_of_life INTEGER,
                             PRIMARY KEY (player_username, game_id)
);