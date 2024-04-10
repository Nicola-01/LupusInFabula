CREATE TABLE IS_FRIEND_WITH (
                                player_username TEXT REFERENCES Player(username),
                                friend_username TEXT REFERENCES Player(username),
                                date DATE NOT NULL,
                                PRIMARY KEY (player_username, friend_username)
);
