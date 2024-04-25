-- #################################################################################################
-- ## Popolation for testing getlogs  and getStats                                                ##
-- #################################################################################################

INSERT INTO player
VALUES ('superuser', LOWER('superuser@test.com'), md5('ciao'), CURRENT_DATE);

INSERT INTO public.game
VALUES
    (100, 'sup1', now(), '00:10:07', 0),
    (101, 'sup2', now(), '00:10:07', 1),
    (102, 'sup3', now(), '00:10:07', 2);

INSERT INTO public.game VALUES
    (103, 'sup4', now(), '00:10:07', 0),
    (104, 'sup5', now(), '00:10:07', 1),
    (105, 'sup6', now(), '00:10:07', 0),
    (106, 'sup7', now(), '00:10:07', 1),
    (107, 'sup8', now(), '00:10:07', 0),
    (108, 'sup9', now(), '00:10:07', 1),
    (109, 'sup10', now(), '00:10:07', 0),
    (110, 'sup11', now(), '00:10:07', 1),
    (111, 'sup12', now(), '00:10:07', 0);


--Drop table plays_as_in;

INSERT INTO plays_as_in
VALUES ('superuser', 101, 'wolf', null, null, 12),
       ('superuser', 102, 'wolf', null, null, 12),
       ('superuser', 103, 'farmer', null, null, 5),
       ('superuser', 104, 'farmer', null, null, 6),
       ('superuser', 105, 'knight', null, null, 7),
       ('superuser', 106, 'knight', null, null, 7),
       ('superuser', 107, 'wolf', null, null, 5),
       ('superuser', 108, 'seer', null, null, 7),
       ('superuser', 109, 'master', null, null, 7),
       ('superuser', 110, 'wolf', null, null, 7),
       ('superuser', 111, 'farmer', null, null, 7);
