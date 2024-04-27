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
/*
INSERT INTO public.TYPE_ACTION
VALUES (1, 'mangia'),
       (2, 'attacca'),
       (3, 'test');
*/
INSERT INTO public.game
VALUES (1, 'dorky-farmer-explorer', '2024-04-21 14:01:49.305661', null, -1, 0, 0),
       (2, 'farmer-wolf-sam', '2024-04-21 14:02:33.348046', null, -1, 0, 0);

INSERT INTO public.plays_as_in (player_username, game_id, role, round_of_death, phase_of_death, duration_of_life)
VALUES ('esempio', 1, 'master', null, null, null), -- esempio is the master for game 1
       ('user1', 1, 'wolf', null, null, null),
       ('user2', 1, 'explorer', null, null, null),
       ('user3', 1, 'kamikaze', null, null, null),
       ('user4', 1, 'hobbit', null, null, null),
       ('user5', 1, 'berserker', null, null, null),
       ('user6', 1, 'hamster', null, null, null),
       ('user7', 1, 'knight', null, null, null),
       ('user8', 1, 'sheriff', null, null, null),
       -- Game 2
       ('player0', 2, 'master', null, null, null), -- player0 is the master for game 2
       ('player1', 2, 'knight', null, null, null),
       ('player2', 2, 'hamster', null, null, null),
       ('player3', 2, 'jester', null, null, null),
       ('player4', 2, 'sheriff', null, null, null),
       ('player5', 2, 'seer', null, null, null),
       ('player6', 2, 'plague spreader', null, null, null),
       ('player7', 2, 'wolf', null, null, null),
       ('player8', 2, 'wolf', null, null, null),
       ('player9', 2, 'sam', null, null, null);

INSERT INTO public.Action
VALUES (1, 'user1', 1, 0, 0, 'test', 'user3'),
       (1, 'user2', 3, 1, 1, 'test', 'user3'),
       (1, 'user3', 4, 0, 0, 'test', 'user3'),
       (1, 'user1', 3, 1, 1, 'test', 'user3'),
       (1, 'user2', 1, 0, 0, 'test', 'user3'),
       (1, 'user3', 5, 1, 1, 'test', 'user3'),
       (1, 'user4', 6, 0, 0, 'test', 'user3'),
       (1, 'user2', 7, 1, 2, 'test', 'user3');
