INSERT INTO Role
VALUES ('master', -1, -1, 1, 'The player who runs the game'),
       ('carpenter', 0, 0, 1, 'He is the villager who provides wood for the bonfire. If he is voted out, he will refuse to provide the wood, and there will be no bonfire for that day. The power can only be used once.'),
       ('farmer', 0, 0, 8, 'Inhabitant of Tabula. By day he stands in the courtroom to vote and send suspects to the gallows, and by night he sleeps unaware of the danger.'),
       ('hobbit', 0, 0, 1, 'When there are more than one wolf, The Hobbit is immune to wolf attacks.'),
       ('kamikaze', 0, 0, 1, 'He is a farmer by day and a kamikaze by night. If he is attacked, he will also kill the designated wolf. The blackmailer cannot block this, but the wolf bombarder can defuse it.'),
       ('knight', 0, 0, 1, 'He is a farmer during the day, but at night he has the ability to protect a player from being mauled by wolves. This power does not protect against anointing. He cannot protect the same player twice in a row or himself.'),
       ('mason', 0, 0, 2, 'They are normal farmers who know each other during the game. There can be only two mansons in a game.'),
       ('medium', 0, 0, 1, 'At the beginning of each night he will be informed by the mayor whether the character who died at the stake was seen Wolf or Not Wolf. It is activated from the second night by default (first night of the game).'),
       ('sam', 0, 0, 1, 'If Sam should die during the day (for any reason, including because of a vote), he has the right to utter the last words: "DIE" while pointing at a player. That player will be killed immediately.'),
       ('seer', 0, 0, 1, 'He is a peasant during the day, like any other. At night, he can ask the mayor if a player is a wolf. If he probes the hamster, it dies, but the seer remains uninformed of their role and death.'),
       ('sheriff', 0, 0, 1, 'During the night, the sheriff may decide to select a person and kill them. If the designated person is a wolf pack, or a victory stealer, he will die, but if the designated person is a villager, the sheriff himself will die.'),
       ('berserker', 1, 1, 1, 'The Berserker can only unleash his rage one during the game. This occurs on the night he is activated, where he has the ability to attack two players in a single turn. However, this action results in his death that same night. He can bypass the knight by making his protection ineffective.'),
       ('dorky', 1, 1, 1, 'He is a wolf, but does not know the identities of the other members of the pack. Each night he indicate another player: if the chosen player is a wolf, he will join the pack as a wolf. If he is the last wolf in the game without having succeeded in joining the pack, he will become the wolf pack himself.'),
       ('explorer', 1, 1, 1, 'A cunning and fast wolf is sent out to facilitate the movement of the pack. Only once during the game can he decide to act, in which case the wolves'' first action will be to maul their victim. Of course, only the explorer can maul.'),
       ('giuda', 1, 1, 1, 'Traitor farmer that plays and wins with the wolves (he is seen as a farmer by the seer). At the beginning of the game, he only knows one wolf pack.'),
       ('puppy', 1, 1, 1, 'The youngest member of the wolf pack usually joins in the wolf chat. However, due to his mischievous behaviour, the seer sees him as a Non-Wolf and he can be nominated for defrocking. If he is the last wolf remaining in the game, he cannot be mauled on the first night he is alone.'),
       ('wolf', 1, 1, 5, 'Those who sow terror in the small village of Tabula. The wolves know each other and at night they agree to kill a character by deciding who among them will go and maul him.'),
       ('hamster', 2, 2, 1, 'He is a farmer during the day, but at night he is invulnerable to wolves. If the seer probes him or the guard protects him, he dies. The hamster wins if he survives with the villagers.'),
       ('jester', 2, 3, 1, 'The Jester wins, alone, if he is burnt at the stake.'),
       ('illusionist', 3, 1, 1, 'He chooses a player during the night and blocks his power for that night.'),
       ('plague spreader', 3, 0, 1, 'He is a peasant during the day, but at night he may select a player to be anointed as the mayor. The anointed player cannot answer yes or no for the entire following day, or he will die on the spot. This will propagate the anointing to the two players next to them (left and right).');

INSERT INTO game_settings
VALUES ('master-free', 'Master-Free: No player is the master, each user chooses the target autonomously (not yet implemented)'),
       ('illusionistBlock', 'Illusionist block: If a player is blocked by the illusionist he does not know it (not yet implemented)'),
       ('largerRoleNumber', 'Insert more roles than players, to give more randomness (not yet implemented)');