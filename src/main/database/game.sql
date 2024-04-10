CREATE TABLE Game (
                      ID SERIAL PRIMARY KEY,
                      date DATE NOT NULL,
                      hour TIME NOT NULL,
                      who_wins SMALLINT,
                      number_of_rounds INTEGER
);