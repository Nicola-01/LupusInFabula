DROP TABLE IF EXISTS PLAYS_AS_IN;

CREATE TABLE PLAYS_AS_IN
(
    player_username  VARCHAR(20) REFERENCES Player (username),
    game_id          SERIAL REFERENCES Game (ID),
    role_id          SERIAL REFERENCES Role (ID),
    round_of_death   INTEGER,
    phase_of_death   CHAR(1),
    duration_of_life FLOAT,
    PRIMARY KEY (player_username, game_id, role_id)
);

COMMENT ON TABLE PLAYS_AS_IN IS 'Represents the role played by a player in a game.';
COMMENT ON COLUMN PLAYS_AS_IN.player_username IS 'The username of the player who played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.game_id IS 'The ID of the game in which the player played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.role_id IS 'The ID of the role played by the player.';
COMMENT ON COLUMN PLAYS_AS_IN.round_of_death IS 'The round number in which the player died (optional).';
COMMENT ON COLUMN PLAYS_AS_IN.phase_of_death IS 'The phase of the game in which the player died (N, D or M (Night, Day or Master)).';
COMMENT ON COLUMN PLAYS_AS_IN.duration_of_life IS 'The percentage of time in which the player has stayed alive during the game.';
