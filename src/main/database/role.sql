DROP TABLE IF EXISTS Role;

CREATE TABLE Role
(
    ID            SERIAL PRIMARY KEY,
    name          CHARACTER VARYING NOT NULL,
    type          SMALLINT          NOT NULL,
    with_who_wins SMALLINT          NOT NULL,
    description   CHARACTER VARYING
);

COMMENT ON TABLE Role IS 'Represents different roles in the game.';
COMMENT ON COLUMN Role.ID IS 'The unique identifier for each role.';
COMMENT ON COLUMN Role.name IS 'The name of the role.'
COMMENT ON COLUMN Role.type IS 'The type of the role (good, evil or neutral).'
COMMENT ON COLUMN Role.with_who_wins IS 'The faction with which the role can win the game (wolfes, farmers or itself).';
COMMENT ON COLUMN Role.description IS 'A description of the role.';
