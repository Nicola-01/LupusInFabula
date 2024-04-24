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

INSERT INTO public.TYPE_ACTION
VALUES (1, 'mangia'),
       (2, 'attacca'),
       (3, 'test');

INSERT INTO public.game
VALUES (1, 'dorky-farmer-explorer', '2024-04-21 14:01:49.305661', null, -1, 7, 0),
       (2, 'farmer-wolf-sam', '2024-04-21 14:02:33.348046', null, -1, 0, 0);

INSERT INTO public.plays_as_in (player_username, game_id, role_id, round_of_death, phase_of_death, duration_of_life)
VALUES ('esempio', 1, 1, null, null, null), -- esempio is the master
       ('user1', 1, 16, null, null, null),
       ('user2', 1, 9, null, null, null),
       ('user3', 1, 18, null, null, null),
       ('user4', 1, 16, null, null, null),
       ('user5', 1, 3, null, null, null),
       ('user6', 1, 17, null, null, null),
       ('user7', 1, 6, null, null, null),
       ('user8', 1, 3, null, null, null),
       -- Game 2
       ('player0', 2, 1, null, null, null), -- player0 is the master
       ('player1', 2, 6, null, null, null),
       ('player2', 2, 17, null, null, null),
       ('player3', 2, 18, null, null, null),
       ('player4', 2, 10, null, null, null),
       ('player5', 2, 9, null, null, null),
       ('player6', 2, 20, null, null, null),
       ('player7', 2, 16, null, null, null),
       ('player8', 2, 16, null, null, null),
       ('player9', 2, 8, null, null, null);

INSERT INTO public.Action
VALUES (1, 'player0', 1, 0, 1, 'test', 1, 'player3'),
       (1, 'player2', 3, 1, 1, 'test', 2, 'player3'),
       (1, 'player3', 4, 0, 1, 'test', 3, 'player3'),
       (1, 'player4', 3, 1, 1, 'test', 1, 'player3'),
       (1, 'player3', 1, 0, 1, 'test', 1, 'player3'),
       (1, 'player5', 5, 1, 1, 'test', 2, 'player3'),
       (1, 'player6', 6, 0, 1, 'test', 3, 'player3'),
       (1, 'player7', 7, 1, 2, 'test', 1, 'player3');
