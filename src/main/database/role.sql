CREATE TABLE Role (
                      ID SERIAL PRIMARY KEY,
                      name CHARACTER VARYING,
                      type SMALLINT,
                      with_who_wins SMALLINT,
                      description CHARACTER VARYING
);