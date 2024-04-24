-- #################################################################################################
-- ## Popolation for testing getlogs                                                              ##
-- #################################################################################################

INSERT INTO game
VALUES (1, now(), null, 1, 12),
       (2, now(), null, 0, 5);
INSERT INTO game
VALUES (3, now(), null, 0, 6),
       (4, now(), null, 0, 7),
       (5, now(), null, 1, 7),
       (6, now(), null, 1, 5),
       (7, now(), null, 0, 7),
       (8, now(), null, 1, 7),
       (9, now(), null, 0, 7),
       (10, now(), null, 0, 7);


--Drop table plays_as_in;

INSERT INTO plays_as_in
VALUES ('user1', 1, 20, null, null, 12),
       ('user1', 2, 20, null, null, 5),
       ('user1', 3, 1, null, null, 6),
       ('user1', 4, 6, null, null, 7),
       ('user1', 5, 6, null, null, 7),
       ('user1', 6, 1, null, null, 5),
       ('user1', 7, 20, null, null, 7),
       ('user1', 8, 20, null, null, 7),
       ('user1', 9, 6, null, null, 7),
       ('user1', 10, 13, null, null, 7);
