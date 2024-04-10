CREATE TABLE Game (
                      ID SERIAL PRIMARY KEY,
                      date DATE NOT NULL,
                      hour TIME NOT NULL,
                      who_wins SMALLINT,
                      number_of_rounds INTEGER
);

COMMENT ON TABLE Game IS 'Represents a game played.';
COMMENT ON COLUMN Game.ID IS 'The unique identifier for each game.';
COMMENT ON COLUMN Game.date IS 'The date when the game was played.';
COMMENT ON COLUMN Game.hour IS 'The time when the game started.';
COMMENT ON COLUMN Game.who_wins IS 'The faction that won the game.';
COMMENT ON COLUMN Game.number_of_rounds IS 'The total number of rounds played in the game.';
