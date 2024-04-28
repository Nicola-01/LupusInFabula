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


/*
INSERT INTO public.TYPE_ACTION
VALUES (1, 'mangia'),
       (2, 'attacca'),
       (3, 'test');
*/
INSERT INTO public.game (public_ID, start, phase)
VALUES ('dorky-farmer-explorer', '2024-04-21 14:01:49.305661', 0),
       ('farmer-wolf-sam', '2024-04-21 14:02:33.348046', 1),
       ('sheriff-carpenter-sam', '2024-04-21 14:02:33.348046', 0);

INSERT INTO public.plays_as_in (player_username, game_id, role, round_of_death, phase_of_death, duration_of_life)
VALUES ('esempio', 1, 'master', null, null, null), -- esempio is the master for game 1
       ('user2', 1, 'dorky', null, null, null),
       ('user3', 1, 'kamikaze', null, null, null),
       ('user4', 1, 'hobbit', null, null, null),
       ('user5', 1, 'explorer', null, null, null),
       ('user6', 1, 'hamster', null, null, null),
       ('user7', 1, 'knight', null, null, null),
       ('user8', 1, 'sheriff', null, null, null),
       ('user9', 1, 'wolf', null, null, null);

-- Game 2
INSERT INTO public.plays_as_in (player_username, game_id, role, round_of_death, phase_of_death, duration_of_life)
VALUES    ('player0', 2, 'master', null, null, null), -- player0 is the master for game 2
          ('player1', 2, 'knight', null, null, null),
          ('player2', 2, 'carpenter', null, null, null),
          ('player3', 2, 'jester', null, null, null),
          ('player4', 2, 'sheriff', null, null, null),
          ('player5', 2, 'seer', null, null, null),
          ('player6', 2, 'plague spreader', null, null, null),
          ('player7', 2, 'wolf', null, null, null),
          ('player8', 2, 'wolf', null, null, null),
          ('player9', 2, 'sam', null, null, null);
-- Game with all roles
--        ('allRoleMaster', 3, 'master', null, null, null),
--        ('allRole1', 3, 'puppy', null, null, null),
--        ('allRole2', 3, 'illusionist', null, null, null),
--        ('allRole3', 3, 'hobbit', null, null, null),
--        ('allRole4', 3, 'kamikaze', null, null, null),
--        ('allRole5', 3, 'giuda', null, null, null),
--        ('allRole6', 3, 'explorer', null, null, null),
--        ('allRole7', 3, 'jester', null, null, null),
--        ('allRole8', 3, 'knight', null, null, null),
--        ('allRole9', 3, 'plague spreader', null, null, null),
--        ('allRole10', 3, 'berserker', null, null, null),
--        ('allRole11', 3, 'medium', null, null, null),
--        ('allRole12', 3, 'wolf', null, null, null),
--        ('allRole13', 3, 'dorky', null, null, null),
--        ('allRole14', 3, 'sam', null, null, null),
--        ('allRole15', 3, 'seer', null, null, null),
--        ('allRole16', 3, 'carpenter', null, null, null),
--        ('allRole17', 3, 'hamster', null, null, null),
--        ('allRole18', 3, 'sheriff', null, null, null),
--        ('allRole19', 3, 'farmer', null, null, null),
--        ('allRole20', 3, 'farmer', null, null, null),
--        ('allRole21', 3, 'farmer', null, null, null),
--        ('allRole22', 3, 'farmer', null, null, null),
--        ('allRole23', 3, 'farmer', null, null, null),
--        ('allRole24', 3, 'farmer', null, null, null);



-- INSERT INTO public.Action
-- VALUES (1, 'user7', 1, 0, 0, 'protect', 'user7');
--        (1, 'user2', 1, 0, 0, 'point', 'user1'),
--        (1, 'user5', 2, 0, 0, 'explorer', 'user4'),
--        (1, 'user8', 2, 0, 0, 'shot', 'user9'),
--        (1, 'user7', 2, 0, 0, 'protect', 'user1');
--        (1, 'user')
--        (1, 'user3', 4, 0, 0, 'test', 'user3'),
--        (1, 'user1', 3, 1, 1, 'test', 'user3'),
--        (1, 'user2', 1, 0, 0, 'test', 'user3'),
--        (1, 'user3', 5, 1, 1, 'test', 'user3'),
--        (1, 'user4', 6, 0, 0, 'test', 'user3'),
--        (1, 'user2', 7, 1, 2, 'test', 'user3');
