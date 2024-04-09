CREATE TABLE Game (
                      ID SERIAL PRIMARY KEY,
                      date DATE,
                      hour TIME,
                      who_wins SMALLINT,
                      number_of_rounds INTEGER
);