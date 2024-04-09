CREATE TABLE HAS_TARGET (
                            action_id SERIAL REFERENCES Action(game_id, player_username),
                            target_username TEXT REFERENCES Player(username),
                            PRIMARY KEY (action_id)
);
