CREATE TABLE Action (
                        game_id SERIAL REFERENCES Game(ID),
                        player_username VARCHAR(20) REFERENCES Player(username),
                        round INTEGER NOT NULL,
                        phase INTEGER NOT NULL,
                        subphase INTEGER NOT NULL,
                        description CHARACTER VARYING,
                        type_of_action SERIAL REFERENCES type_action(ID) NOT NULL,
                        target VARCHAR(20) REFERENCES Player(username) NOT NULL,
                        PRIMARY KEY (game_id, player_username, round, phase, subphase)
);

COMMENT ON TABLE Action IS 'Represents actions performed by players during the game.';
COMMENT ON COLUMN Action.game_id IS 'The ID of the game in which the action occurred.';
COMMENT ON COLUMN Action.player_username IS 'The username of the player who performed the action.';
COMMENT ON COLUMN Action.round IS 'The round number in which the action occurred.';
COMMENT ON COLUMN Action.phase IS 'The phase of the round in which the action occurred.';
COMMENT ON COLUMN Action.subphase IS 'The subphase of the phase in which the action occurred.';
COMMENT ON COLUMN Action.description IS 'A description of the action.';
COMMENT ON COLUMN Action.type_of_action IS 'The type of action performed by the player.';
COMMENT ON COLUMN Action.target IS 'The username of the target player of the action.';
