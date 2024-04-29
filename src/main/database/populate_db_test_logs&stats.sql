-- #################################################################################################
-- ## Popolation for testing getlogs  and getStats for user                                       ##
-- #################################################################################################

INSERT INTO Player
VALUES ('log_player', LOWER('log_player@test.com'), md5('ciao'), CURRENT_DATE),
       ('log_player2', LOWER('log_player2@test.com'), md5('ciao'), CURRENT_DATE);

INSERT INTO public.game
VALUES
    (100, 'log_game_1', now(), '00:10:07', 0),
    (101, 'log_game_2', now(), '00:11:02', 1),
    (102, 'log_game_3', now(), '00:01:36', 2),
    (103, 'log_game_4', now(), '00:15:08', 0),
    (104, 'log_game_5', now(), '00:09:00', 1),
    (105, 'log_game_6', now(), '00:11:17', 0),
    (106, 'log_game_7', now(), '00:10:45', 1),
    (107, 'log_game_8', now(), '00:16:27', 0),
    (108, 'log_game_9', now(), '00:21:17', 1),
    (109, 'log_game_10', now(), '00:45:37', 0),
    (110, 'log_game_11', now(), '00:31:20', 1),
    (111, 'log_game_12', now(), '00:17:12', 0);

INSERT INTO plays_as_in
VALUES ('log_player', 101, 'wolf', 0, null, '00:12:00'),
       ('log_player', 102, 'wolf', 5, null, '00:05:00'),
       ('log_player', 103, 'farmer', 7, null, '00:07:00'),
       ('log_player', 104, 'farmer', 9, null, '00:09:00'),
       ('log_player', 105, 'knight', 1, null, '00:01:00'),
       ('log_player', 106, 'knight', 1, null, '00:01:00'),
       ('log_player', 107, 'wolf', 23, null, '00:23:00'),
       ('log_player', 108, 'seer', 12, null, '00:12:00'),
       ('log_player', 109, 'master', 1, null, '00:01:00'),
       ('log_player', 110, 'wolf', 0, null, '00:00:00'),
       ('log_player', 111, 'farmer', 1, null, '00:01:00');