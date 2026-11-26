-- Migration in place from the old schema (username keys, SERIAL game ids) to UUIDv7 keys.
-- Requires PostgreSQL 18 (uuidv7()). Run it once on the existing database, not on a fresh one:
--   docker exec -i <container> psql -U postgres -d postgres -v ON_ERROR_STOP=1 < 2026-11-26_uuid.sql
-- The whole script is one transaction: on any error nothing is applied.
-- Data is preserved: ids are assigned in registration / start order, all relations are re-pointed.

BEGIN;

-- 0. Table of the removed token login: it references Player(username), so it must go before the
--    primary key of Player is dropped.
DROP TABLE IF EXISTS User_tokens;

-- 1. New uuid columns. The ones that clash with an old column name get a temporary name (new_*).
ALTER TABLE Player ADD COLUMN new_id UUID;
ALTER TABLE Game ADD COLUMN new_id UUID;
ALTER TABLE IS_FRIEND_WITH ADD COLUMN player_id UUID, ADD COLUMN friend_id UUID;
ALTER TABLE PLAYS_AS_IN ADD COLUMN player_id UUID, ADD COLUMN new_game_id UUID;
ALTER TABLE GAME_ROLES ADD COLUMN new_game_id UUID;
ALTER TABLE SETTINGS_IN_GAME ADD COLUMN new_game_id UUID;
ALTER TABLE Action ADD COLUMN player_id UUID, ADD COLUMN target_id UUID, ADD COLUMN new_game_id UUID;

-- 2. Fill the ids one row at a time, in registration / start order, so uuidv7() values grow with time.
DO
$$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN SELECT username FROM Player ORDER BY registration_date, username
            LOOP
                UPDATE Player SET new_id = uuidv7() WHERE username = r.username;
            END LOOP;
        FOR r IN SELECT ID FROM Game ORDER BY start, ID
            LOOP
                UPDATE Game SET new_id = uuidv7() WHERE ID = r.ID;
            END LOOP;
    END
$$;

-- 3. Fill the new foreign keys by joining on the old columns.
UPDATE IS_FRIEND_WITH f
SET player_id = p.new_id
FROM Player p
WHERE p.username = f.player_username;
UPDATE IS_FRIEND_WITH f
SET friend_id = p.new_id
FROM Player p
WHERE p.username = f.friend_username;

UPDATE PLAYS_AS_IN x
SET player_id = p.new_id
FROM Player p
WHERE p.username = x.player_username;
UPDATE PLAYS_AS_IN x
SET new_game_id = g.new_id
FROM Game g
WHERE g.ID = x.game_id;

UPDATE GAME_ROLES x
SET new_game_id = g.new_id
FROM Game g
WHERE g.ID = x.game_id;

UPDATE SETTINGS_IN_GAME x
SET new_game_id = g.new_id
FROM Game g
WHERE g.ID = x.game_id;

UPDATE Action a
SET player_id = p.new_id
FROM Player p
WHERE p.username = a.player_username;
UPDATE Action a
SET target_id = p.new_id
FROM Player p
WHERE p.username = a.target;
UPDATE Action a
SET new_game_id = g.new_id
FROM Game g
WHERE g.ID = a.game_id;

-- Stop here if any row could not be mapped (would mean a broken reference in the old data).
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM IS_FRIEND_WITH WHERE player_id IS NULL OR friend_id IS NULL)
            OR EXISTS (SELECT 1 FROM PLAYS_AS_IN WHERE player_id IS NULL OR new_game_id IS NULL)
            OR EXISTS (SELECT 1 FROM GAME_ROLES WHERE new_game_id IS NULL)
            OR EXISTS (SELECT 1 FROM Action WHERE player_id IS NULL OR target_id IS NULL OR new_game_id IS NULL)
            OR EXISTS (SELECT 1 FROM Player WHERE new_id IS NULL)
            OR EXISTS (SELECT 1 FROM Game WHERE new_id IS NULL) THEN
            RAISE EXCEPTION 'migration 2026-11-26: unmapped rows, aborting';
        END IF;
    END
$$;

-- 4. Drop the old columns. CASCADE also drops the primary keys and foreign keys that use them,
--    and the SERIAL sequences owned by the old game_id columns.
ALTER TABLE IS_FRIEND_WITH DROP COLUMN player_username CASCADE, DROP COLUMN friend_username CASCADE;
ALTER TABLE PLAYS_AS_IN DROP COLUMN player_username CASCADE, DROP COLUMN game_id CASCADE;
ALTER TABLE GAME_ROLES DROP COLUMN game_id CASCADE;
ALTER TABLE SETTINGS_IN_GAME DROP COLUMN game_id CASCADE;
ALTER TABLE Action DROP COLUMN player_username CASCADE, DROP COLUMN target CASCADE, DROP COLUMN game_id CASCADE;
ALTER TABLE Game DROP COLUMN ID CASCADE;
-- Player.username stays (NOT NULL), only its primary key goes.
ALTER TABLE Player DROP CONSTRAINT player_pkey;

-- 5. Rename the new columns to their final names (Game.ID -> id is done here), then create
--    the primary keys, the unique constraints and the foreign keys.
ALTER TABLE Player RENAME COLUMN new_id TO id;
ALTER TABLE Player
    ALTER COLUMN id SET NOT NULL,
    ADD PRIMARY KEY (id),
    ADD CONSTRAINT player_username_key UNIQUE (username);

ALTER TABLE Game RENAME COLUMN new_id TO id;
ALTER TABLE Game
    ALTER COLUMN id SET NOT NULL,
    ADD PRIMARY KEY (id);

ALTER TABLE IS_FRIEND_WITH
    ALTER COLUMN player_id SET NOT NULL,
    ALTER COLUMN friend_id SET NOT NULL,
    ADD FOREIGN KEY (player_id) REFERENCES Player (id),
    ADD FOREIGN KEY (friend_id) REFERENCES Player (id),
    ADD PRIMARY KEY (player_id, friend_id);

ALTER TABLE PLAYS_AS_IN RENAME COLUMN new_game_id TO game_id;
ALTER TABLE PLAYS_AS_IN
    ALTER COLUMN player_id SET NOT NULL,
    ALTER COLUMN game_id SET NOT NULL,
    ADD FOREIGN KEY (player_id) REFERENCES Player (id),
    ADD FOREIGN KEY (game_id) REFERENCES Game (id),
    ADD PRIMARY KEY (player_id, game_id, role);

ALTER TABLE GAME_ROLES RENAME COLUMN new_game_id TO game_id;
ALTER TABLE GAME_ROLES
    ALTER COLUMN game_id SET NOT NULL,
    ADD FOREIGN KEY (game_id) REFERENCES Game (id),
    ADD PRIMARY KEY (game_id, role);

ALTER TABLE SETTINGS_IN_GAME RENAME COLUMN new_game_id TO game_id;
ALTER TABLE SETTINGS_IN_GAME
    ADD FOREIGN KEY (game_id) REFERENCES Game (id);

ALTER TABLE Action RENAME COLUMN new_game_id TO game_id;
ALTER TABLE Action
    ALTER COLUMN game_id SET NOT NULL,
    ALTER COLUMN player_id SET NOT NULL,
    ADD FOREIGN KEY (game_id) REFERENCES Game (id),
    ADD FOREIGN KEY (player_id) REFERENCES Player (id),
    ADD FOREIGN KEY (target_id) REFERENCES Player (id),
    ADD PRIMARY KEY (game_id, player_id, round, phase, subphase, target_id);

-- 6. Grants of lupus_sql, the same as in 01_database_tables.sql (without the sequence).
GRANT SELECT, INSERT, UPDATE ON game, player, plays_as_in TO lupus_sql;
GRANT SELECT, INSERT, UPDATE, DELETE ON action, is_friend_with TO lupus_sql;
GRANT SELECT ON role, game_settings TO lupus_sql;
GRANT SELECT, INSERT ON GAME_ROLES, SETTINGS_IN_GAME TO lupus_sql;

-- 7. The sequence of the old Game.ID is gone with its column; drop it if it is still around.
DROP SEQUENCE IF EXISTS game_id_seq;

COMMIT;
