CREATE TABLE IS_FRIEND_WITH (
                                player_username VARCHAR(20) REFERENCES Player(username),
                                friend_username VARCHAR(20) REFERENCES Player(username),
                                date DATE NOT NULL,
                                PRIMARY KEY (player_username, friend_username)
);

COMMENT ON TABLE IS_FRIEND_WITH IS 'Represents friendship relationships between players.';
COMMENT ON COLUMN IS_FRIEND_WITH.player_username IS 'The username of the player who initiated the friendship.';
COMMENT ON COLUMN IS_FRIEND_WITH.friend_username IS 'The username of the player who is being befriended.';
COMMENT ON COLUMN IS_FRIEND_WITH.date IS 'The date when the friendship was established.';
