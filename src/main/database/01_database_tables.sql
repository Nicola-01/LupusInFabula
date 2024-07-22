SET TIME ZONE 'Europe/Rome';

DROP TABLE IF EXISTS Action;
DROP TABLE IF EXISTS TYPE_ACTION;
DROP TABLE IF EXISTS HAS_ROLES;
DROP TABLE IF EXISTS PLAYS_AS_IN;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS IS_FRIEND_WITH;
DROP TABLE IF EXISTS User_tokens;
DROP TABLE IF EXISTS Player;



-- #################################################################################################
-- ## Creation of the table Player                                                                ##
-- #################################################################################################
--
-- This table represents the players that has registered to the web app

CREATE TABLE Player
(
    username          VARCHAR(20) PRIMARY KEY,
    email             VARCHAR(100) NOT NULL UNIQUE,
    password          VARCHAR(100) NOT NULL,
    registration_date DATE         NOT NULL
);

COMMENT ON TABLE Player IS 'Represents player information.';
COMMENT ON COLUMN Player.username IS 'The unique username of the player.';
COMMENT ON COLUMN Player.email IS 'The email address of the player.';
COMMENT ON COLUMN Player.password IS 'The password of the player.';
COMMENT ON COLUMN Player.registration_date IS 'The date when the player registered.';


-- #################################################################################################
-- ## Creation of the table user_tokens                                                                ##
-- #################################################################################################
--
-- This table represents the tokens associated with user sessions, allowing multiple devices to stay
-- logged in simultaneously for a single user. Each token is uniquely generated and stored along with
-- the user ID and the timestamp of its creation. This facilitates the validation of user sessions
-- across different devices.

CREATE TABLE User_tokens
(
    token           CHAR(36) PRIMARY KEY,
    player_username VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_username) REFERENCES Player (username)
);

COMMENT ON TABLE User_tokens IS 'Stores tokens for user sessions to allow persistent login across multiple devices.';
COMMENT ON COLUMN User_tokens.player_username IS 'The unique identifier (username) of the player to whom the token belongs.';
COMMENT ON COLUMN User_tokens.token IS 'The unique token string used for session validation.';
COMMENT ON COLUMN User_tokens.created_at IS 'The timestamp when the token was created. It defaults to the current timestamp at the time of insertion.';


-- #################################################################################################
-- ## Creation of the table is_friend_with                                                        ##
-- #################################################################################################
--
-- This table represents the friendships of the players

CREATE TABLE IS_FRIEND_WITH
(
    player_username VARCHAR(20) REFERENCES Player (username),
    friend_username VARCHAR(20) REFERENCES Player (username),
    date            DATE NOT NULL,
    PRIMARY KEY (player_username, friend_username)
);

COMMENT ON TABLE IS_FRIEND_WITH IS 'Represents friendship relationships between players.';
COMMENT ON COLUMN IS_FRIEND_WITH.player_username IS 'The username of the player who initiated the friendship.';
COMMENT ON COLUMN IS_FRIEND_WITH.friend_username IS 'The username of the player who is being befriended.';
COMMENT ON COLUMN IS_FRIEND_WITH.date IS 'The date when the friendship was established.';


-- #################################################################################################
-- ## Creation of the table Role                                                                  ##
-- #################################################################################################
--
-- This table represents the roles playable in the game

CREATE TABLE Role
(
    name          VARCHAR(20) PRIMARY KEY,
    type          SMALLINT NOT NULL CHECK ( type IN (-1, 0, 1, 2, 3) ),
    with_who_wins SMALLINT NOT NULL CHECK ( type IN (-1, 0, 1, 2, 3) ),
    max_number    SMALLINT NOT NULL,
    description   CHARACTER VARYING
);

COMMENT ON TABLE Role IS 'Represents different roles in the game.';
COMMENT ON COLUMN Role.name IS 'The name of the role.';
COMMENT ON COLUMN Role.type IS 'The type of the role (master(-1), good (0), evil(1), victory_stealer(2) or neutral(3)).';
COMMENT ON COLUMN Role.with_who_wins IS 'The faction with which the role can win the game (farmers(0), wolves(1), hamster(2) or jester(3). Special case master(-1)).';
COMMENT ON COLUMN Role.max_number IS 'The max number of that role in a game.';
COMMENT ON COLUMN Role.description IS 'A description of the role.';


-- #################################################################################################
-- ## Creation of the table Game                                                                  ##
-- #################################################################################################
--
-- This table represents the games that have been played

CREATE TABLE Game
(
    ID            SERIAL PRIMARY KEY,
    public_ID     CHARACTER VARYING UNIQUE NOT NULL,
    start         TIMESTAMP(0)             NOT NULL,
    game_duration TIME,
    who_wins      SMALLINT CHECK ( who_wins IN (-1, 0, 1, 2, 3, 10) ) DEFAULT -1,
    rounds        SMALLINT CHECK ( rounds >= 0)                       DEFAULT 0,
    phase         SMALLINT CHECK ( phase IN (0, 1) )                  DEFAULT 0,
    subphase      SMALLINT CHECK ( subphase IN (0, 1, 2, 3) )         DEFAULT 0,
    CHECK ((phase = 0 AND subphase = 0) OR (phase = 1 AND subphase >= 0))
);

COMMENT ON TABLE Game IS 'Represents a game played.';
COMMENT ON COLUMN Game.ID IS 'The unique identifier for each game.';
COMMENT ON COLUMN Game.public_ID IS 'The public identifier, it is composition of three role taken at random from the ones in the game.';
COMMENT ON COLUMN Game.start IS 'The date and the hour in which the game has started.';
COMMENT ON COLUMN Game.game_duration IS 'The duration of the game.';
COMMENT ON COLUMN Game.who_wins IS 'The faction that won the game (farmers(0), wolves(1), hamster(2) or jester(3). If the game is not finished yet (-1)).';
COMMENT ON COLUMN Game.rounds IS 'The total number of rounds played in the game.';
COMMENT ON COLUMN Game.phase IS 'The current phase if the game is not finished or the last phase of the game (0 or 1 (Night or Day))';
COMMENT ON COLUMN Game.subphase IS 'The current subphase if the game is not finished or the last subphase of the game';


-- #################################################################################################
-- ## Creation of the table plays_as_in                                                           ##
-- #################################################################################################
--
-- This table represents the player that plays a role in a game

CREATE TABLE PLAYS_AS_IN
(
    player_username  VARCHAR(20) REFERENCES Player (username),
    game_id          SERIAL REFERENCES Game (ID),
    role             VARCHAR(20) REFERENCES Role (name),
    order_in_game    SMALLINT,
    round_of_death   SMALLINT,
    phase_of_death   SMALLINT,
    duration_of_life TIME,
    PRIMARY KEY (player_username, game_id, role)
);

COMMENT ON TABLE PLAYS_AS_IN IS 'Represents the role played by a player in a game.';
COMMENT ON COLUMN PLAYS_AS_IN.player_username IS 'The username of the player who played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.game_id IS 'The ID of the game in which the player played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.role IS 'The ID of the role played by the player.';
COMMENT ON COLUMN PLAYS_AS_IN.order_in_game IS 'The order of the player in the game.';
COMMENT ON COLUMN PLAYS_AS_IN.round_of_death IS 'The round number in which the player died (0 if the player is alive and the game is not finished or the player has not died in that game).';
COMMENT ON COLUMN PLAYS_AS_IN.phase_of_death IS 'The phase of the game in which the player died (0 or 1 (Night or Day)).';
COMMENT ON COLUMN PLAYS_AS_IN.duration_of_life IS 'The duration of of life of the player in the game.';


-- #################################################################################################
-- ## Creation of the table Action                                                                ##
-- #################################################################################################
--
-- This table represents the actions that has happened during a game

CREATE TABLE Action
(
    game_id         SERIAL REFERENCES Game (ID),
    player_username VARCHAR(20) REFERENCES Player (username),
    round           SMALLINT                                 NOT NULL,
    phase           SMALLINT                                 NOT NULL,
    subphase        SMALLINT                                 NOT NULL,
    type_of_action  VARCHAR(20)                              NOT NULL,
    target          VARCHAR(20) REFERENCES Player (username) NOT NULL,
    blocked         BOOLEAN DEFAULT FALSE                    NOT NULL,
    PRIMARY KEY (game_id, player_username, round, phase, subphase, target),
    CHECK ((phase = 0 AND subphase = 0) OR (phase = 1 AND subphase >= 0))
);

COMMENT ON TABLE Action IS 'Represents actions performed by players during the game.';
COMMENT ON COLUMN Action.game_id IS 'The ID of the game in which the action occurred.';
COMMENT ON COLUMN Action.player_username IS 'The username of the player who performed the action.';
COMMENT ON COLUMN Action.round IS 'The round number in which the action occurred.';
COMMENT ON COLUMN Action.phase IS 'The phase of the round in which the action occurred.';
COMMENT ON COLUMN Action.subphase IS 'The subphase of the phase in which the action occurred.';
COMMENT ON COLUMN Action.type_of_action IS 'The type of action performed by the player.';
COMMENT ON COLUMN Action.target IS 'The username of the target player of the action.';



-- #################################################################################################
-- ## Create a user used by the webapp                                                            ##
-- #################################################################################################

-- REVOKE ALL PRIVILEGES ON TABLE is_friend_with FROM lupus_sql;
-- REVOKE ALL PRIVILEGES ON TABLE role FROM lupus_sql;
-- REVOKE ALL PRIVILEGES ON TABLE action FROM lupus_sql;
-- REVOKE ALL PRIVILEGES ON TABLE game FROM lupus_sql;
-- REVOKE ALL PRIVILEGES ON TABLE player FROM lupus_sql;
-- REVOKE ALL PRIVILEGES ON TABLE plays_as_in FROM lupus_sql;

DO
$$
    BEGIN
        -- Revoke privileges if the role exists
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lupus_sql') THEN
            REVOKE ALL PRIVILEGES ON TABLE is_friend_with FROM lupus_sql;
            REVOKE ALL PRIVILEGES ON TABLE role FROM lupus_sql;
            REVOKE ALL PRIVILEGES ON TABLE action FROM lupus_sql;
            REVOKE ALL PRIVILEGES ON TABLE game FROM lupus_sql;
            REVOKE ALL PRIVILEGES ON TABLE player FROM lupus_sql;
            REVOKE ALL PRIVILEGES ON TABLE plays_as_in FROM lupus_sql;

            -- Drop the lupus_sql role
            DROP ROLE lupus_sql;
        END IF;
    END
$$;

-- Drop the lupus_sql role if it exists
DROP ROLE IF EXISTS lupus_sql;

-- Recreate the lupus_sql role with the specified permissions
CREATE ROLE lupus_sql LOGIN PASSWORD 'wolf';

GRANT SELECT, INSERT, UPDATE ON game, player, plays_as_in TO lupus_sql;
GRANT SELECT, INSERT, UPDATE, DELETE ON action, is_friend_with TO lupus_sql;
GRANT SELECT, INSERT, DELETE ON user_tokens TO lupus_sql;
GRANT SELECT ON role TO lupus_sql;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE game_id_seq TO lupus_sql;

-- Create a scheduled job to delete expired tokens every day at midnight
CREATE OR REPLACE FUNCTION delete_expired_tokens()
    RETURNS VOID AS
$$
BEGIN
    DELETE
    FROM User_tokens
    WHERE created_at < NOW() - INTERVAL '365 days'; -- Delete tokens older than 30 days
END;
$$ LANGUAGE plpgsql;

-- Schedule the job to run daily at midnight
CREATE OR REPLACE FUNCTION schedule_delete_job()
    RETURNS VOID AS
$$
BEGIN
    PERFORM pg_schedule_cron_job('delete_expired_tokens', '0 0 * * *');
END;
$$ LANGUAGE plpgsql;