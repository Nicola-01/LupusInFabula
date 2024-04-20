INSERT INTO Player (username, email, password, registration_date)
VALUES ('esempio', LOWER('esempio@example.com'), md5('password123'), CURRENT_DATE),
       ('user1', LOWER('user1@test.com'), md5('ciao'), CURRENT_DATE),
       ('user2', LOWER('user2@test.com'), md5('ciao'), CURRENT_DATE),
       ('user3', LOWER('user3@test.com'), md5('ciao'), CURRENT_DATE),
       ('user4', LOWER('user41@test.com'), md5('ciao'), CURRENT_DATE),
       ('user5', LOWER('user5@test.com'), md5('ciao'), CURRENT_DATE),
       ('user6', LOWER('user6@test.com'), md5('ciao'), CURRENT_DATE),
       ('user7', LOWER('user7@test.com'), md5('ciao'), CURRENT_DATE),
       ('user8', LOWER('user8@test.com'), md5('ciao'), CURRENT_DATE);


INSERT INTO Role
VALUES (1, 'master', -1, -1, 1, 'The player who runs the game'),
       (2, 'carpenter', 0, 0, 1, 'He is the villager who provides wood for the bonfire. If he is voted out, he will refuse to provide the wood, and there will be no bonfire for that day. The power can only be used once.'),
       (3, 'farmer', 0, 0, 8, 'Inhabitant of Tabula. By day he stands in the courtroom to vote and send suspects to the gallows, and by night he sleeps unaware of the danger.'),
       (4, 'hobbit', 0, 0, 1, 'When there are more than one wolf, The Hobbit is immune to wolf attacks.'),
       (5, 'kamikaze', 0, 0, 1, 'He is a farmer by day and a kamikaze by night. If he is attacked, he will also kill the designated wolf. The blackmailer cannot block this, but the wolf bombarder can defuse it.'),
       (6, 'knight', 0, 0, 1, 'He is a farmer during the day, but at night he has the ability to protect a player from being mauled by wolves. This power does not protect against anointing. He cannot protect the same player twice in a row or himself.'),
       (7, 'medium', 0, 0, 1, 'At the beginning of each night he will be informed by the mayor whether the character who died at the stake was seen Wolf or Not Wolf. It is activated from the second night by default (first night of the game).'),
       (8, 'sam', 0, 0, 1, 'If Sam should die during the day (for any reason, including because of a vote), he has the right to utter the last words: "DIE" while pointing at a player. That player will be killed immediately.'),
       (9, 'seer', 0, 0, 1, 'He is a peasant during the day, like any other. At night, he can ask the mayor if a player is a wolf. If he probes the hamster, it dies, but the seer remains uninformed of their role and death.'),
       (10, 'sheriff', 0, 0, 1, 'During the night, the sheriff may decide to select a person and kill them. If the designated person is a wolf pack, or a victory stealer, he will die, but if the designated person is a villager, the sheriff himself will die.'),
       (11, 'berserker', 1, 1, 1, 'The Berserker can only unleash his rage one during the game. This occurs on the night he is activated, where he has the ability to attack two players in a single turn. However, this action results in his death that same night. He can bypass the knight by making his protection ineffective.'),
       (12, 'dorky', 1, 1, 1, 'He is a wolf, but does not know the identities of the other members of the pack. Each night he must indicate another player: if the chosen player is a wolf, he will also join the pack and become a wolf like the others. If he is the last wolf in the game without having succeeded in joining the pack, he will become the wolf pack himself and can start killing during the night.'),
       (13, 'explorer', 1, 1, 1, 'A cunning and fast wolf is sent out to facilitate the movement of the pack. Only once during the game can he decide to act, in which case the wolves'' first action will be to maul their victim. Of course, only the explorer can maul.'),
       (14, 'giuda', 1, 1, 1, 'Traitor farmer that plays and wins with the wolves (he is seen as a farmer by the seer). At the beginning of the game, he only knows one wolf pack.'),
       (15, 'puppy', 1, 1, 3, 'The youngest member of the wolf pack usually joins in the wolf chat. However, due to his mischievous behaviour, the seer sees him as a Non-Wolf and he can be nominated for defrocking. If he is the last wolf remaining in the game, he cannot be mauled on the first night he is alone.'),
       (16, 'wolf', 1, 1, 5, 'Those who sow terror in the small village of Tabula. The wolves know each other and at night they agree to kill a character by deciding who among them will go and maul him.'),
       (17, 'hamster', 2, 2, 1, 'He is a farmer during the day, but at night he is invulnerable to wolves. If the seer probes him or the guard protects him, he dies. The hamster wins if he survives with the villagers.'),
       (18, 'jester', 2, 3, 1, 'The Jester wins, alone, if he is burnt at the stake.'),
       (19, 'illusionist', 3, 1, 1, 'He chooses a player during the night and blocks his power for that night.'),
       (20, 'plague spreader', 3, 0, 1, 'He is a peasant during the day, but at night he may select a player to be anointed as the mayor. The anointed player cannot answer yes or no for the entire following day, or he will die on the spot. This will propagate the anointing to the two players next to them (left and right).');

INSERT INTO game (id, public_id, start, game_duration, who_wins, number_of_rounds) VALUES
                    (1, 'hamster-jester', '2024-04-18 12:00:00', NULL, NULL, 2),
                    (2, 'wolf-puppy', '2024-04-10 14:00:00', NULL, NULL, 5);

INSERT INTO plays_as_in (player_username, game_id, role_id, round_of_death, phase_of_death, duration_of_life)  VALUES
                    ('user1', 1, 3, NULL, NULL, NULL),
                    ('user2', 1, 2, NULL, NULL, NULL),
                    ('user3', 2, 5, NULL, NULL, NULL);