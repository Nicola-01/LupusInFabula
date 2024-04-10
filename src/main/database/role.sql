CREATE TABLE Role (
                      ID SERIAL PRIMARY KEY,
                      name CHARACTER VARYING NOT NULL,
                      type SMALLINT NOT NULL,
                      with_who_wins SMALLINT NOT NULL,
                      description CHARACTER VARYING
);