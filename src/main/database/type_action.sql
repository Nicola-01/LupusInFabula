DROP TABLE IF EXISTS TYPE_ACTION;

CREATE TABLE TYPE_ACTION
(
    ID   SERIAL PRIMARY KEY,
    name CHARACTER VARYING NOT NULL
);

COMMENT ON TABLE TYPE_ACTION IS 'Represents different types of actions.';
COMMENT ON COLUMN TYPE_ACTION.ID IS 'The unique identifier for each type of action.';
COMMENT ON COLUMN TYPE_ACTION.name IS 'The name of the type of action.';
