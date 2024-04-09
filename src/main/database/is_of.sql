CREATE TABLE IS_OF (
                       action_id SERIAL REFERENCES Action(game_id, player_username),
                       type_action_id SERIAL REFERENCES TYPE_ACTION(ID),
                       PRIMARY KEY (action_id)
);
