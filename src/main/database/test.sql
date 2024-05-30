-- Creazione utenti
INSERT INTO Player
VALUES ('test_user_0', LOWER('test_user_0@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_1', LOWER('test_user_1@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_2', LOWER('test_user_2@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_3', LOWER('test_user_3@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_4', LOWER('test_user_4@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_5', LOWER('test_user_5@test.com'), md5('ciao'), CURRENT_DATE),
       ('test_user_m', LOWER('test_user_m@test.com'), md5('ciao'), CURRENT_DATE);

-- Creazione partite
INSERT INTO public.game
VALUES (200, 'game_1', now(), '00:10:00', 0),
       (201, 'game_2', now(), '00:15:00', 1),
       (202, 'game_3', now(), '00:20:00', 2),
       (203, 'game_4', now(), '00:25:08', 0),
       (204, 'game_5', now(), '00:00:00', -1);

-- Associazione utenti alle partite
INSERT INTO plays_as_in
VALUES
-- Partita 1
('test_user_m', 200, 'master', 1, 0, 0, '00:01:00'),
('test_user_0', 200, 'wolf', 1, 0, 0, '00:12:00'),
('test_user_1', 200, 'wolf', 1, 0, 0, '00:12:00'),
('test_user_2', 200, 'farmer', 1, 0, 0, '00:12:00'),
('test_user_3', 200, 'farmer', 1, 0, 0, '00:12:00'),
('test_user_4', 200, 'seer', 1, 0, 0, '00:12:00'),

-- Partita 2
('test_user_m', 201, 'master', 1, 0, 0, '00:01:00'),
('test_user_1', 201, 'wolf', 1, 0, 0, '00:11:00'),
('test_user_2', 201, 'wolf', 1, 0, 0, '00:11:00'),
('test_user_3', 201, 'farmer', 1, 0, 0, '00:11:00'),
('test_user_4', 201, 'farmer', 1, 0, 0, '00:11:00'),
('test_user_0', 201, 'knight', 1, 0, 0, '00:11:00'),

-- Partita 3
('test_user_m', 202, 'master', 1, 0, 0, '00:01:00'),
('test_user_2', 202, 'wolf', 1, 0, 0, '00:01:36'),
('test_user_3', 202, 'wolf', 1, 0, 0, '00:01:36'),
('test_user_4', 202, 'farmer', 1, 0, 0, '00:01:36'),
('test_user_1', 202, 'farmer', 1, 0, 0, '00:01:36'),
('test_user_0', 202, 'sam', 1, 0, 0, '00:01:36'),

-- Partita 4
('test_user_m', 203, 'master', 1, 0, 0, '00:01:00'),
('test_user_3', 203, 'wolf', 1, 0, 0, '00:15:08'),
('test_user_4', 203, 'wolf', 1, 0, 0, '00:15:08'),
('test_user_2', 203, 'farmer', 1, 0, 0, '00:15:08'),
('test_user_0', 203, 'farmer', 1, 0, 0, '00:15:08'),
('test_user_1', 203, 'seer', 1, 0, 0, '00:15:08'),

-- Partita 5
('test_user_m', 204, 'master', 1, 0, 0, '00:01:00'),
('test_user_4', 204, 'wolf', 1, 0, 0, '00:09:00'),
('test_user_3', 204, 'wolf', 1, 0, 0, '00:09:00'),
('test_user_0', 204, 'farmer', 1, 0, 0, '00:09:00'),
('test_user_1', 204, 'farmer', 1, 0, 0, '00:09:00'),
('test_user_2', 204, 'knight', 1, 0, 0, '00:09:00');
