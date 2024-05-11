-- Note: The direct SQL insert does not include password complexity check.

INSERT INTO Player (username, email, password, registration_date)
VALUES ('esempio', LOWER('esempio@example.com'), md5('password123'), CURRENT_DATE),
       ('user1', LOWER('user1@test.com'), md5('ciao'), CURRENT_DATE),
       ('user2', LOWER('user2@test.com'), md5('ciao'), CURRENT_DATE),
       ('user3', LOWER('user3@test.com'), md5('ciao'), CURRENT_DATE),
       ('user4', LOWER('user4@test.com'), md5('ciao'), CURRENT_DATE),
       ('user5', LOWER('user5@test.com'), md5('ciao'), CURRENT_DATE),
       ('user6', LOWER('user6@test.com'), md5('ciao'), CURRENT_DATE),
       ('user7', LOWER('user7@test.com'), md5('ciao'), CURRENT_DATE),
       ('user8', LOWER('user8@test.com'), md5('ciao'), CURRENT_DATE),
       ('user9', LOWER('user9@test.com'), md5('ciao'), CURRENT_DATE),

       ('player0', LOWER('player0@test.com'), md5('ciao'), CURRENT_DATE),
       ('player1', LOWER('player1@test.com'), md5('ciao'), CURRENT_DATE),
       ('player2', LOWER('player2@test.com'), md5('ciao'), CURRENT_DATE),
       ('player3', LOWER('player3@test.com'), md5('ciao'), CURRENT_DATE),
       ('player4', LOWER('player4@test.com'), md5('ciao'), CURRENT_DATE),
       ('player5', LOWER('player5@test.com'), md5('ciao'), CURRENT_DATE),
       ('player6', LOWER('player6@test.com'), md5('ciao'), CURRENT_DATE),
       ('player7', LOWER('player7@test.com'), md5('ciao'), CURRENT_DATE),
       ('player8', LOWER('player8@test.com'), md5('ciao'), CURRENT_DATE),
       ('player9', LOWER('player9@test.com'), md5('ciao'), CURRENT_DATE);

-- Users for a game with all the roles
INSERT INTO Player (username, email, password, registration_date)
VALUES ('allRoleMaster', LOWER('allRoleMaster@example.com'), md5('allRole'), CURRENT_DATE),
       ('allRole1', LOWER('allRole1@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole2', LOWER('allRole2@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole3', LOWER('allRole3@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole4', LOWER('allRole4@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole5', LOWER('allRole5@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole6', LOWER('allRole6@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole7', LOWER('allRole7@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole8', LOWER('allRole8@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole9', LOWER('allRole9@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole10', LOWER('allRole10@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole11', LOWER('allRole11@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole12', LOWER('allRole12@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole13', LOWER('allRole13@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole14', LOWER('allRole14@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole15', LOWER('allRole15@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole16', LOWER('allRole16@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole17', LOWER('allRole17@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole18', LOWER('allRole18@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole19', LOWER('allRole19@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole20', LOWER('allRole20@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole21', LOWER('allRole21@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole22', LOWER('allRole22@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole23', LOWER('allRole23@test.com'), md5('allRole'), CURRENT_DATE),
       ('allRole24', LOWER('allRole24@test.com'), md5('allRole'), CURRENT_DATE);

-- Users for test a creation of new game
INSERT INTO Player (username, email, password, registration_date)
VALUES ('newGameM', LOWER('newGameM@example.com'), md5('newGame'), CURRENT_DATE),
       ('newGame1', LOWER('newGame1@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame2', LOWER('newGame2@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame3', LOWER('newGame3@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame4', LOWER('newGame4@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame5', LOWER('newGame5@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame6', LOWER('newGame6@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame7', LOWER('newGame7@test.com'), md5('newGame'), CURRENT_DATE),
       ('newGame8', LOWER('newGame8@test.com'), md5('newGame'), CURRENT_DATE);


INSERT INTO public.game (public_ID, start, phase)
VALUES ('dorky-farmer-explorer', NOW(), 0),
       ('farmer-wolf-sam', NOW(), 0),
       ('sheriff-carpenter-sam', NOW(), 0);

INSERT INTO public.plays_as_in (player_username, game_id, role, order_in_game, round_of_death, phase_of_death,
                                duration_of_life)
VALUES ('esempio', 1, 'master', 0, null, null, null), -- esempio is the master for game 1
       ('user2', 1, 'dorky', 1, null, null, null),
       ('user3', 1, 'kamikaze', 2, null, null, null),
       ('user4', 1, 'hobbit', 3, null, null, null),
       ('user5', 1, 'explorer', 4, null, null, null),
       ('user6', 1, 'hamster', 5, null, null, null),
       ('user7', 1, 'knight', 6, null, null, null),
       ('user8', 1, 'sheriff', 7, null, null, null),
       ('user9', 1, 'wolf', 8, null, null, null);
--
-- -- Game 2
INSERT INTO public.plays_as_in (player_username, game_id, role, order_in_game, round_of_death, phase_of_death,
                                duration_of_life)
VALUES ('player0', 2, 'master', 0, null, null, null), -- player0 is the master for game 2
       ('player1', 2, 'knight', 1, null, null, null),
       ('player2', 2, 'carpenter', 2, null, null, null),
       ('player3', 2, 'jester', 3, null, null, null),
       ('player4', 2, 'sheriff', 4, null, null, null),
       ('player5', 2, 'seer', 5, null, null, null),
       ('player6', 2, 'plague spreader', 6, null, null, null),
       ('player7', 2, 'wolf', 7, null, null, null),
       ('player8', 2, 'wolf', 8, null, null, null),
       ('player9', 2, 'sam', 9, null, null, null);

-- Game with all roles
INSERT INTO public.plays_as_in (player_username, game_id, role, order_in_game, round_of_death, phase_of_death,
                                duration_of_life)
VALUES ('allRoleMaster', 3, 'master', 0, null, null, null),
       ('allRole1', 3, 'puppy', 1, null, null, null),
       ('allRole2', 3, 'illusionist', 2, null, null, null),
       ('allRole3', 3, 'hobbit', 3, null, null, null),
       ('allRole4', 3, 'kamikaze', 4, null, null, null),
       ('allRole5', 3, 'giuda', 5, null, null, null),
       ('allRole6', 3, 'explorer', 6, null, null, null),
       ('allRole7', 3, 'jester', 7, null, null, null),
       ('allRole8', 3, 'knight', 8, null, null, null),
       ('allRole9', 3, 'plague spreader', 9, null, null, null),
       ('allRole10', 3, 'berserker', 10, null, null, null),
       ('allRole11', 3, 'medium', 11, null, null, null),
       ('allRole12', 3, 'wolf', 12, null, null, null),
       ('allRole13', 3, 'dorky', 13, null, null, null),
       ('allRole14', 3, 'sam', 14, null, null, null),
       ('allRole15', 3, 'seer', 15, null, null, null),
       ('allRole16', 3, 'carpenter', 16, null, null, null),
       ('allRole17', 3, 'hamster', 17, null, null, null),
       ('allRole18', 3, 'sheriff', 18, null, null, null),
       ('allRole19', 3, 'farmer', 19, null, null, null),
       ('allRole20', 3, 'farmer', 20, null, null, null),
       ('allRole21', 3, 'farmer', 21, null, null, null),
       ('allRole22', 3, 'farmer', 22, null, null, null),
       ('allRole23', 3, 'farmer', 23, null, null, null),
       ('allRole24', 3, 'farmer', 24, null, null, null);


-- #################################################################################################
-- ## Popolation for testing getlogs  and getStats for user                                       ##
-- #################################################################################################

INSERT INTO Player
VALUES ('log_player', LOWER('log_player@test.com'), md5('ciao'), CURRENT_DATE),
       ('log_player2', LOWER('log_player2@test.com'), md5('ciao'), CURRENT_DATE);

INSERT INTO public.game
VALUES (100, 'log_game_1', now(), '00:10:07', 0),
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
VALUES ('log_player', 101, 'wolf', 1, 0, null, '00:12:00'),
       ('log_player', 102, 'wolf', 1, 5, null, '00:05:00'),
       ('log_player', 103, 'farmer', 1, 7, null, '00:07:00'),
       ('log_player', 104, 'farmer', 1, 9, null, '00:09:00'),
       ('log_player', 105, 'knight', 1, 1, null, '00:01:00'),
       ('log_player', 106, 'knight', 1, 1, null, '00:01:00'),
       ('log_player', 107, 'wolf', 1, 23, null, '00:23:00'),
       ('log_player', 108, 'seer', 1, 12, null, '00:12:00'),
       ('log_player', 109, 'master', 0, 1, null, '00:01:00'),
       ('log_player', 110, 'wolf', 1, 0, null, '00:00:00'),
       ('log_player', 111, 'farmer', 1, 1, null, '00:01:00');