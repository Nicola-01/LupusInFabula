CREATE TABLE HAS_ROLES (
                           game_id SERIAL REFERENCES Game(ID),
                           role_id SERIAL REFERENCES Role(ID),
                           number_of_roles SMALLINT NOT NULL,
                           PRIMARY KEY (game_id, role_id)
);