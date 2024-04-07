DROP TABLE IF EXISTS Role;

CREATE TABLE Role (
                      name VARCHAR(25) NOT NULL ,
                      wins_with VARCHAR(50) NOT NULL,
                      description VARCHAR(300) NOT NULL,
                      PRIMARY KEY (name)
);

INSERT INTO Role (name, wins_with, description) VALUES ('Farmer', 'villagers', 'Inhabitant of Tabula. By day he stands in the courtroom to vote and send suspects to the gallows, and by night he sleeps unaware of the danger');

INSERT INTO Role (name, wins_with, description) VALUES ('Wolf', 'pack of wolves', 'Those who sow terror in the small village of Tabula. The wolves know each other and at night agree to kill a character');