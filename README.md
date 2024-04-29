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
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
	<li><a href="#group-members">Group members</a></li>
  </ol>

## Overview

The project aims to develop a web application to facilitate the role of the game-master during the game "Lupus in
Fabula". The game-master orchestrates the game, narrating events and facilitating discussion among players. This
application assists the game-master in managing game events, such as tracking player roles, nighttime actions (such as
player eliminations), and daytime voting for eliminations.

### Rules

Detailed rules and guidelines for playing "Lupus in Fabula" are available in section 1.1 of
the [report](REPORT_HW1/WebApplication_HW1_LIFGroup.pdf).

## Getting started

### Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Maven](https://maven.apache.org/)

### Building and Running

Follow these steps to build and run the application:

- Build the project using `mvn clean package`
- Generate the Java documentation with `mvn javadoc:javadoc`
- Start the application using `docker-compose up`
- Stop the application with `docker-compose down`
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
  the `/docker-entrypoint-initdb.d/` directory, and execute the SQL files. Note that `database.sql` and `populate_db.sql` must
  always be executed after resetting the database.

## Group members

| *Last Name* | *First Name* | *Number* |
|-------------|--------------|:--------:|
| Busato      | Nicola       | 2119291  |
| Cini        | Jacopo       | 2125757  |
| Gusella     | Michele      | 2122861  |
| Miele       | Riccardo     | 2116946  |
| Momesso     | Jacopo       | 2123874  |
| Pozzo       | Nicola       | 2125382  |
