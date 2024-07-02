# Lupus in Fabula

### Table of Contents

  <ol>
    <li>
      <a href="#overview">Overview</a>
      <ul>
        <li><a href="#rules">Rules</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#build-and-run">Build and Run</a></li>
        <li><a href="#database">Database</a></li>
        <li><a href="#test">Test</a></li>
      </ul>
    </li>
    <li><a href="#frontend">Front-End</a></li>
	<li><a href="#group-members">Group members</a></li>
  </ol>

## Overview

The project aims to develop a web application to facilitate the role of the game-master during the game "Lupus in
Fabula". The game-master orchestrates the game, narrating events and facilitating discussion among players. This
application assists the game-master in managing game events, such as tracking player roles, nighttime actions (such as
player eliminations), and daytime voting for eliminations.

### Rules

Detailed rules and guidelines for playing "Lupus in Fabula" are available in section 1.1 of
the [report](hw1/WebApplication_HW1_LIFGroup.pdf).

## Getting started

### Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Maven](https://maven.apache.org/)

### Building and Running

Follow these steps to build and run the application:

- Build the project using `mvn clean package`
- Generate the Java documentation with `mvn javadoc:javadoc`
- Start the application using `docker compose up`
- Stop the application with `docker compose down`
- To view the web application logs, access the terminal of the web
  container: `docker exec -it webapp-lupus-web-1 /bin/bash`. Navigate to the directory
  `/webapps/my-logs`, and use `cat lupus.log` to view the logs.

### Database

The database initialization depends on the existence of the `/data/db` directory:

- If the directory `/data/db` does not exist, the database will initialize during application startup.
- If the directory `/data/db` exists, the database initialization is skipped.

o reset the database, you have two options:

- Delete the `/data/db/` directory and re-execute `docker-compose`.
- Alternatively, access the terminal of the database container: `docker exec -it webapp-lupus-db-1 /bin/bash`, navigate to
  the `/docker-entrypoint-initdb.d/` directory, and execute the SQL files. Note that `01_database_tables.sql` and `02_populate_db.sql` must
  always be executed after resetting the database.

### Test

To execute the tests for the RestAPI it's needed to execute the two .sql file:
- 02_populate_db.sql
- populate_db_optional.aaa

The first file inserts into the database all the possible roles; the second, instead, insert one complete game with all actions and also insert some games to test the logs and the statistics of an user.

## Front-End

The game can be accessed at http://localhost:8080/lupus/ and requires an account to play. Upon login, the home page is displayed, providing access to the `Habitant` and `Village` sections.
- Habitant: This section allows users to manage their account (friends, change credentials, or delete the account), view personal statistics and history, as well as the stats and history of other players.
- Village: In this section, users can create a new village, add friends, and select the roles used in the game. If already in a game, clicking 'Join your village' will display the current game.

To view the rules and roles of the game, visit http://localhost:8080/lupus/rules. No login is required.

## Group members

| *Last Name* | *First Name* | *Number* |
|-------------|--------------|:--------:|
| Busato      | Nicola       | 2119291  |
| Cini        | Jacopo       | 2125757  |
| Gusella     | Michele      | 2122861  |
| Miele       | Riccardo     | 2116946  |
| Momesso     | Jacopo       | 2123874  |
| Pozzo       | Nicola       | 2125382  |
