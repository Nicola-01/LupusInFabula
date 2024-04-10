CREATE TABLE IS_FRIEND_WITH (
                                player_username VARCHAR(20) REFERENCES Player(username),
                                friend_username VARCHAR(20) REFERENCES Player(username),
                                date DATE NOT NULL,
                                PRIMARY KEY (player_username, friend_username)
);
