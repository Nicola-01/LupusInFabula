DROP TABLE IF EXISTS Action;
DROP TABLE IF EXISTS TYPE_ACTION;
DROP TABLE IF EXISTS HAS_ROLES;
DROP TABLE IF EXISTS PLAYS_AS_IN;
DROP TYPE IF EXISTS cycle_phase;
DROP TABLE IF EXISTS Game;
DROP TYPE IF EXISTS winning_faction;
DROP TABLE IF EXISTS Role;
DROP TYPE IF EXISTS alignment;
DROP TYPE IF EXISTS faction;
DROP TABLE IF EXISTS IS_FRIEND_WITH;
DROP TABLE IF EXISTS Player;

-- #################################################################################################
-- ## Creation of the table Player                                                                ##
-- #################################################################################################
--
-- This table represents the players that has registered to the web app

CREATE TABLE Player
(
    username          VARCHAR(20) PRIMARY KEY,
    email             VARCHAR(100) NOT NULL,
    password          VARCHAR(100) NOT NULL,
    registration_date DATE         NOT NULL
);

COMMENT ON TABLE Player IS 'Represents player information.';
COMMENT ON COLUMN Player.username IS 'The unique username of the player.';
COMMENT ON COLUMN Player.email IS 'The email address of the player.';
COMMENT ON COLUMN Player.password IS 'The password of the player.';
COMMENT ON COLUMN Player.registration_date IS 'The date when the player registered.';



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
-- ## Creation of enumeration for faction                                                         ##
-- #################################################################################################
--
-- This enumeration represents the factions that are present in the game.
--  -1 stands for Master,
--   0 for wolves,
--   1 for farmers,
--   2 for itself.

CREATE TYPE faction AS ENUM (
    '-1',
    '0',
    '1',
    '2'
    );
COMMENT ON TYPE faction IS 'The categories of the possible factions in the game.';

-- #################################################################################################
-- ## Creation of enumeration for alignment                                                       ##
-- #################################################################################################
--
-- This enumeration represents the alignments that a role can be.
--  -1 stands for Master,
--   0 for evil,
--   1 for good,
--   2 for neutral.

CREATE TYPE alignment AS ENUM (
    '-1',
    '0',
    '1',
    '2'
    );
COMMENT ON TYPE faction IS 'The categories of the possible alignments that a role can be in the game.';

-- #################################################################################################
-- ## Creation of the table Role                                                                  ##
-- #################################################################################################
--
-- This table represents the roles playable in the game

CREATE TABLE Role
(
    ID            SERIAL PRIMARY KEY,
    name          CHARACTER VARYING NOT NULL,
    type          alignment         NOT NULL,
    with_who_wins faction           NOT NULL,
    description   CHARACTER VARYING
);

COMMENT ON TABLE Role IS 'Represents different roles in the game.';
COMMENT ON COLUMN Role.ID IS 'The unique identifier for each role.';
COMMENT ON COLUMN Role.name IS 'The name of the role.';
COMMENT ON COLUMN Role.type IS 'The type of the role (good, evil or neutral).';
COMMENT ON COLUMN Role.with_who_wins IS 'The faction with which the role can win the game (wolves, farmers or itself).';
COMMENT ON COLUMN Role.description IS 'A description of the role.';



-- #################################################################################################
-- ## Creation of enumeration for winning faction                                                 ##
-- #################################################################################################
--
-- This enumeration represents the possible factions that can win a game.
--  -1 stands for none,
--   0 for wolves,
--   1 for farmers,
--   2 for other.

CREATE TYPE winning_faction AS ENUM (
    '-1',
    '0',
    '1',
    '2'
    );
COMMENT ON TYPE faction IS 'The categories of the possible winning factions in the game.';

-- #################################################################################################
-- ## Creation of the table Game                                                                  ##
-- #################################################################################################
--
-- This table represents the games that have been played

CREATE TABLE Game
(
    ID               SERIAL PRIMARY KEY,
    start            TIMESTAMP NOT NULL,
    game_duration    TIME,
    who_wins         winning_faction,
    number_of_rounds INTEGER
);

COMMENT ON TABLE Game IS 'Represents a game played.';
COMMENT ON COLUMN Game.ID IS 'The unique identifier for each game.';
COMMENT ON COLUMN Game.start IS 'The date and the hour in which the game has started.';
COMMENT ON COLUMN Game.game_duration IS 'The duration of the game.';
COMMENT ON COLUMN Game.who_wins IS 'The faction that won the game.';
COMMENT ON COLUMN Game.number_of_rounds IS 'The total number of rounds played in the game.';



-- #################################################################################################
-- ## Creation of enumeration for phase                                                           ##
-- #################################################################################################
--
-- This enumeration represents the phases that are present in the game.
--   M stands for Master,
--   N for night,
--   D for day,

CREATE TYPE cycle_phase AS ENUM (
    'M',
    'N',
    'D'
    );

COMMENT ON TYPE faction IS 'The categories of the possible phases in a game.';

-- #################################################################################################
-- ## Creation of the table plays_as_in                                                           ##
-- #################################################################################################
--
-- This table represents the player that plays a role in a game

CREATE TABLE PLAYS_AS_IN
(
    player_username  VARCHAR(20) REFERENCES Player (username),
    game_id          SERIAL REFERENCES Game (ID),
    role_id          SERIAL REFERENCES Role (ID),
    round_of_death   INTEGER,
    phase_of_death   cycle_phase,
    duration_of_life FLOAT,
    PRIMARY KEY (player_username, game_id, role_id)
);

COMMENT ON TABLE PLAYS_AS_IN IS 'Represents the role played by a player in a game.';
COMMENT ON COLUMN PLAYS_AS_IN.player_username IS 'The username of the player who played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.game_id IS 'The ID of the game in which the player played the role.';
COMMENT ON COLUMN PLAYS_AS_IN.role_id IS 'The ID of the role played by the player.';
COMMENT ON COLUMN PLAYS_AS_IN.round_of_death IS 'The round number in which the player died (optional).';
COMMENT ON COLUMN PLAYS_AS_IN.phase_of_death IS 'The phase of the game in which the player died (N, D or M (Night, Day or Master)).';
COMMENT ON COLUMN PLAYS_AS_IN.duration_of_life IS 'The percentage of time in which the player has stayed alive during the game.';


-- #################################################################################################
-- ## Creation of the table has_roles                                                             ##
-- #################################################################################################
--
-- This table represents the number of instances for each role in a game

CREATE TABLE HAS_ROLES
(
    game_id         SERIAL REFERENCES Game (ID),
    role_id         SERIAL REFERENCES Role (ID),
    number_of_roles SMALLINT NOT NULL,
    PRIMARY KEY (game_id, role_id)
);

COMMENT ON TABLE HAS_ROLES IS 'Associates roles with games.';
COMMENT ON COLUMN HAS_ROLES.game_id IS 'The ID of the game in which roles are associated.';
COMMENT ON COLUMN HAS_ROLES.role_id IS 'The ID of the role associated with the game.';
COMMENT ON COLUMN HAS_ROLES.number_of_roles IS 'The number of instances of the role associated with the game.';


-- #################################################################################################
-- ## Creation of the table type_action                                                           ##
-- #################################################################################################
--
-- This table represents the type of actions possible in a game

CREATE TABLE TYPE_ACTION
(
    ID   SERIAL PRIMARY KEY,
    name CHARACTER VARYING NOT NULL
);

COMMENT ON TABLE TYPE_ACTION IS 'Represents different types of actions.';
COMMENT ON COLUMN TYPE_ACTION.ID IS 'The unique identifier for each type of action.';
COMMENT ON COLUMN TYPE_ACTION.name IS 'The name of the type of action.';



-- #################################################################################################
-- ## Creation of the table Action                                                                ##
-- #################################################################################################
--
-- This table represents the actions that has happened during a game

CREATE TABLE Action
(
    game_id         SERIAL REFERENCES Game (ID),
    player_username VARCHAR(20) REFERENCES Player (username),
    round           INTEGER                                  NOT NULL,
    phase           INTEGER                                  NOT NULL,
    subphase        INTEGER                                  NOT NULL,
    description     CHARACTER VARYING,
    type_of_action  SERIAL REFERENCES type_action (ID)       NOT NULL,
    target          VARCHAR(20) REFERENCES Player (username) NOT NULL,
    PRIMARY KEY (game_id, player_username, round, phase, subphase)
);

COMMENT ON TABLE Action IS 'Represents actions performed by players during the game.';
COMMENT ON COLUMN Action.game_id IS 'The ID of the game in which the action occurred.';
COMMENT ON COLUMN Action.player_username IS 'The username of the player who performed the action.';
COMMENT ON COLUMN Action.round IS 'The round number in which the action occurred.';
COMMENT ON COLUMN Action.phase IS 'The phase of the round in which the action occurred.';
COMMENT ON COLUMN Action.subphase IS 'The subphase of the phase in which the action occurred.';
COMMENT ON COLUMN Action.description IS 'A description of the action.';
COMMENT ON COLUMN Action.type_of_action IS 'The type of action performed by the player.';
COMMENT ON COLUMN Action.target IS 'The username of the target player of the action.';
