DROP TABLE IF EXISTS Game;

CREATE TABLE Game
(
    ID               SERIAL PRIMARY KEY,
    start            TIMESTAMP NOT NULL,
    who_wins         SMALLINT,
    game_duration    TIME,
    number_of_rounds INTEGER
);

COMMENT ON TABLE Game IS 'Represents a game played.';
COMMENT ON COLUMN Game.ID IS 'The unique identifier for each game.';
COMMENT ON COLUMN Game.start IS 'The date and time when the game started.';
COMMENT ON COLUMN Game.game_duration IS 'How long the game lasted';
COMMENT ON COLUMN Game.who_wins IS 'The faction that won the game.';
COMMENT ON COLUMN Game.number_of_rounds IS 'The total number of rounds played in the game.';
