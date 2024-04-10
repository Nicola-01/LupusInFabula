DROP TABLE IF EXISTS HAS_ROLES;

CREATE TABLE HAS_ROLES
(
    game_id         SERIAL REFERENCES Game (ID),
    role_id         SERIAL REFERENCES Role (ID),
    number_of_roles SMALLINT NOT NULL,
    PRIMARY KEY (game_id, role_id)
);

COMMENT ON TABLE HAS_ROLES IS 'Associates roles with games.';
COMMENT ON COLUMN HAS_ROLES.game_id IS 'The ID of the game in which roles are associated.';
COMMENT ON COLUMN HAS_ROLES.role_id IS 'The ID of the role associated with the game.';
COMMENT ON COLUMN HAS_ROLES.number_of_roles IS 'The number of instances of the role associated with the game.';