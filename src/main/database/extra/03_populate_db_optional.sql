-- Note: The direct SQL insert does not include password complexity check.

INSERT INTO Player (id, username, email, password, registration_date)
VALUES
       (uuidv7(), 'esempio', LOWER('esempio@example.com'), md5('password123'), CURRENT_DATE),
       (uuidv7(), 'user1', LOWER('user1@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user2', LOWER('user2@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user3', LOWER('user3@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user4', LOWER('user4@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user5', LOWER('user5@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user6', LOWER('user6@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user7', LOWER('user7@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user8', LOWER('user8@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'user9', LOWER('user9@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player0', LOWER('player0@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player1', LOWER('player1@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player2', LOWER('player2@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player3', LOWER('player3@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player4', LOWER('player4@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player5', LOWER('player5@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player6', LOWER('player6@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player7', LOWER('player7@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player8', LOWER('player8@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'player9', LOWER('player9@test.com'), md5('ciao'), CURRENT_DATE);

-- Users for a game with all the roles
INSERT INTO Player (id, username, email, password, registration_date)
VALUES
       (uuidv7(), 'allRoleMaster', LOWER('allRoleMaster@example.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole1', LOWER('allRole1@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole2', LOWER('allRole2@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole3', LOWER('allRole3@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole4', LOWER('allRole4@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole5', LOWER('allRole5@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole6', LOWER('allRole6@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole7', LOWER('allRole7@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole8', LOWER('allRole8@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole9', LOWER('allRole9@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole10', LOWER('allRole10@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole11', LOWER('allRole11@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole12', LOWER('allRole12@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole13', LOWER('allRole13@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole14', LOWER('allRole14@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole15', LOWER('allRole15@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole16', LOWER('allRole16@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole17', LOWER('allRole17@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole18', LOWER('allRole18@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole19', LOWER('allRole19@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole20', LOWER('allRole20@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole21', LOWER('allRole21@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole22', LOWER('allRole22@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole23', LOWER('allRole23@test.com'), md5('allRole'), CURRENT_DATE),
       (uuidv7(), 'allRole24', LOWER('allRole24@test.com'), md5('allRole'), CURRENT_DATE);

-- Users for test a creation of new game
INSERT INTO Player (id, username, email, password, registration_date)
VALUES
       (uuidv7(), 'newGameM', LOWER('newGameM@example.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame1', LOWER('newGame1@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame2', LOWER('newGame2@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame3', LOWER('newGame3@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame4', LOWER('newGame4@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame5', LOWER('newGame5@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame6', LOWER('newGame6@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame7', LOWER('newGame7@test.com'), md5('newGame'), CURRENT_DATE),
       (uuidv7(), 'newGame8', LOWER('newGame8@test.com'), md5('newGame'), CURRENT_DATE);


INSERT INTO public.game (id, public_ID, start, phase)
VALUES
       (uuidv7(), 'dorky-farmer-explorer', NOW(), 0),
       (uuidv7(), 'farmer-wolf-sam', NOW(), 0),
       (uuidv7(), 'sheriff-carpenter-sam', NOW(), 0);

INSERT INTO public.plays_as_in (player_id, game_id, role, order_in_game, round_of_death, phase_of_death, duration_of_life)
VALUES
       ((SELECT id FROM Player WHERE username = 'esempio'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'master', 0, null, null, null),  -- esempio is the master for game 1
       ((SELECT id FROM Player WHERE username = 'user2'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'dorky', 1, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user3'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'kamikaze', 2, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user4'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'hobbit', 3, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user5'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'explorer', 4, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user6'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'hamster', 5, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user7'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'knight', 6, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user8'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'sheriff', 7, null, null, null),
       ((SELECT id FROM Player WHERE username = 'user9'), (SELECT id FROM Game WHERE public_ID = 'dorky-farmer-explorer'), 'wolf', 8, null, null, null);
--
-- -- Game 2
INSERT INTO public.plays_as_in (player_id, game_id, role, order_in_game, round_of_death, phase_of_death, duration_of_life)
VALUES
       ((SELECT id FROM Player WHERE username = 'player0'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'master', 0, null, null, null),  -- player0 is the master for game 2
       ((SELECT id FROM Player WHERE username = 'player1'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'knight', 1, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player2'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'carpenter', 2, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player3'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'jester', 3, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player4'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'sheriff', 4, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player5'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'seer', 5, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player6'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'plague spreader', 6, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player7'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'wolf', 7, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player8'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'wolf', 8, null, null, null),
       ((SELECT id FROM Player WHERE username = 'player9'), (SELECT id FROM Game WHERE public_ID = 'farmer-wolf-sam'), 'sam', 9, null, null, null);

-- Game with all roles
INSERT INTO public.plays_as_in (player_id, game_id, role, order_in_game, round_of_death, phase_of_death, duration_of_life)
VALUES
       ((SELECT id FROM Player WHERE username = 'allRoleMaster'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'master', 0, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole1'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'puppy', 1, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole2'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'illusionist', 2, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole3'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'hobbit', 3, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole4'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'kamikaze', 4, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole5'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'giuda', 5, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole6'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'explorer', 6, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole7'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'jester', 7, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole8'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'knight', 8, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole9'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'plague spreader', 9, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole10'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'berserker', 10, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole11'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'medium', 11, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole12'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'wolf', 12, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole13'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'dorky', 13, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole14'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'sam', 14, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole15'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'seer', 15, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole16'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'carpenter', 16, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole17'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'hamster', 17, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole18'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'sheriff', 18, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole19'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 19, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole20'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 20, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole21'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 21, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole22'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 22, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole23'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 23, null, null, null),
       ((SELECT id FROM Player WHERE username = 'allRole24'), (SELECT id FROM Game WHERE public_ID = 'sheriff-carpenter-sam'), 'farmer', 24, null, null, null);


-- #################################################################################################
-- ## Popolation for testing getlogs  and getStats for user                                       ##
-- #################################################################################################

INSERT INTO Player (id, username, email, password, registration_date)
VALUES
       (uuidv7(), 'log_player', LOWER('log_player@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'log_player2', LOWER('log_player2@test.com'), md5('ciao'), CURRENT_DATE),
       (uuidv7(), 'log_master', LOWER('log_master@test.com'), md5('ciao'), CURRENT_DATE);

INSERT INTO public.game (id, public_ID, start, game_duration, who_wins)
VALUES
       (uuidv7(), 'log_game_1', now(), '00:10:07', 0),
       (uuidv7(), 'log_game_2', now(), '00:11:02', 1),
       (uuidv7(), 'log_game_3', now(), '00:01:36', 2),
       (uuidv7(), 'log_game_4', now(), '00:15:08', 0),
       (uuidv7(), 'log_game_5', now(), '00:09:00', 1),
       (uuidv7(), 'log_game_6', now(), '00:11:17', 0),
       (uuidv7(), 'log_game_7', now(), '00:10:45', 1),
       (uuidv7(), 'log_game_8', now(), '00:16:27', 0),
       (uuidv7(), 'log_game_9', now(), '00:21:17', 1),
       (uuidv7(), 'log_game_10', now(), '00:45:37', 0),
       (uuidv7(), 'log_game_11', now(), '00:31:20', 1),
       (uuidv7(), 'log_game_12', now(), '00:17:12', 0);

INSERT INTO plays_as_in (player_id, game_id, role, order_in_game, round_of_death, phase_of_death, duration_of_life)
VALUES
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_2'), 'wolf', 1, 0, 0, '00:12:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_3'), 'wolf', 1, 5, 0, '00:05:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_4'), 'farmer', 1, 7, 0, '00:07:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_5'), 'farmer', 1, 9, 0, '00:09:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_6'), 'knight', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_7'), 'knight', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_8'), 'wolf', 1, 23, 0, '00:23:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_9'), 'seer', 1, 12, 0, '00:12:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_10'), 'master', 0, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_11'), 'wolf', 1, 0, 0, '00:00:00'),
       ((SELECT id FROM Player WHERE username = 'log_player'), (SELECT id FROM Game WHERE public_ID = 'log_game_12'), 'farmer', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_2'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_3'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_4'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_5'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_6'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_7'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_8'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_9'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_11'), 'master', 1, 1, 0, '00:01:00'),
       ((SELECT id FROM Player WHERE username = 'log_master'), (SELECT id FROM Game WHERE public_ID = 'log_game_12'), 'master', 1, 1, 0, '00:01:00');

