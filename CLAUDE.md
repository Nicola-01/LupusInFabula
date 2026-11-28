# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web app (University of Padova, Web Applications course) that helps the game master run a game of "Lupus in Fabula" (Werewolf). Backend: Spring Boot 3.5 (Java 17, embedded Tomcat, plain JDBC DAOs on PostgreSQL). Frontend: React 19 + react-router 7 + Tailwind CSS v4, built with Vite, in `frontend/`. Game rules: section 1.1 of `hw1/WebApplication_HW1_LIFGroup.pdf`.

The app was migrated from Servlet/JSP + Bootstrap (branch `WebSocket`/`master` history). Known bugs of the original code are listed in `bug.md`; they were intentionally kept unless noted there.

## New backend (`backend/`) — rewrite in progress

The backend is being rewritten from scratch in `backend/` (Spring Boot 4.2, Java 21, Maven wrapper `./mvnw`, package `dev.busato.lupus`), step by step, as a learning project. The structure and annotation style follow `/home/nicola/Desktop/FinanceWebApp/backend`: packages by layer (`controller/`, `service/`, `repository/`, `model/`, `dto/`, `mappers/`), JPA + Lombok, `ddl-auto=update` (the DB can be reset freely), DTOs as `record`, `@RequiredArgsConstructor` injection, Mockito unit tests. Own postgres in `backend/compose.yaml` (port 5434, db/user/password `lupus`; reset with `docker compose down && docker run --rm -v "$PWD/data:/d" alpine rm -rf /d/db`, the files belong to the container's postgres user), roles are a Java enum (`model/Role`), no seed data. URLs stay the same as the old app, but the JSON may change (camelCase names, enums as strings instead of int codes, e.g. `RoleType`, `WinFaction`): the frontend will be adapted. The old backend in `src/` stays untouched until the rewrite is done.

- The user is learning Spring: explain every choice (why, alternatives), in Italian.
- **Every code implementation/modification goes through a subagent with `model: haiku`**: the main agent designs the change, gives the subagent a precise spec (files, contents, verification commands), reviews the result, then explains it to the user.
- **Every package has a `README.md`** (and `dev/busato/lupus/README.md` explains beans in general). Keep them up to date: when you add/change a class, annotation or pattern, update the README of that package. When the user asks a question about something in a package (an annotation, a concept, a choice), answer it **and** add the explanation to that package's README (or the root one if it is general). New packages get their own README.

## Commands

- Frontend build (must run before packaging, output goes to `src/main/resources/static/`, git-ignored): `cd frontend && npm install && npm run build`
- Backend build: `mvn clean package` → `target/lupus-1.00.jar` (Spring Boot fat jar, includes the frontend build). `./mvnw` is not usable (no `.mvn/` dir).
- Run everything: `docker compose up` (web = `eclipse-temurin:17-jre` running the jar mounted from `target/`, db = postgres, pgAdmin on 5050). App at http://localhost:9090/, JDWP debug on 5005. Logs in the web container at `/app/logs/lupus.log`.
- Run locally without docker for the web part: `docker compose up -d db` (published on host port 5433), then `java -jar target/lupus-1.00.jar` or run `LupusApplication` from the IDE (default `DB_URL` is `localhost:5433`; the compose web service sets it to `db:5432`).
- Frontend dev server with hot reload: `cd frontend && npm run dev` → http://localhost:5174/ (proxies REST, login/logout and the WebSocket to the backend on :9090).
- Javadoc: `mvn javadoc:javadoc`
- Prod image: `docker build --target production .` (root `Dockerfile` builds frontend + jar). Deploy flow (release branches, GHCR, self-hosted runner, `docker-compose.prod.yml`) is in README "Deploy". App version comes from env `APP_VERSION` (git tag), served to the frontend as `window.__ENV__` by `GET /config.js` (`ApiController`).
- No unit tests. REST API tests are IntelliJ HTTP Client files in `RestApiTest/*.http`, run against the live server; they need `src/main/database/02_populate_db.sql` and `src/main/database/extra/03_populate_db_optional.sql` loaded.

## Database

- SQL in `src/main/database/` is mounted as `/docker-entrypoint-initdb.d/`, so it runs only when `./data/db` doesn't exist. To reset, delete `./data/db` and rerun compose.
- `01_database_tables.sql` creates the schema and the `lupus_sql` role used by the app (`src/main/resources/application.properties`, HikariCP).

## Architecture

### Backend (`src/main/java/it/unipd/dei/webapp/lupus/`)

Served at the root path (the old `/lupus` context path was removed); otherwise all URLs, JSON shapes and status codes are the same as the original servlet app.

- `config/`: `FilterConfig` registers the three servlet filters (same URL patterns as the old web.xml), `WebSocketConfig` exports `GameWebSocket`, `ErrorPageConfig` maps 404 to `/index.html` (React renders the not-found page).
- `filter/`: `UserFilter` authenticates `/game/*`, `/user/*`, `/logout`, `/api/session|village|habitant` from the session or the `loginToken` cookie and stores the `Player` under `UserFilter.USER_ATTRIBUTE`. `GameMasterFilter` guards `/game/.../master` URLs (checks the user is the master of that game). `PagesFilter` guards the HTML pages and redirects to `/login`.
- `controller/`:
  - `GameController` (`/game/**`) and `UserController` (`/user/**`) replace the old hand-written dispatchers. Handlers take raw `HttpServletRequest/Response` and delegate to the `rest/*RR` classes: `new XxxRR(req, res, dataSource).serve()`. Each controller keeps a `dispatch()` helper with the old error handling (UNKNOWN_RESOURCE / METHOD_NOT_ALLOWED / INTERNAL_ERROR as `Message` JSON) and a `/**` fallback. `/master` variants are mapped explicitly.
  - `PageController`: GET page routes (`/home`, `/rules`, `/newVillage`, `/habitant/**`, `/village/**`) keep the old redirect logic and forward to `/index.html`.
  - `LoginSignupController`: form-encoded POST `/login`, `/signup` (redirect to `/home` on success, `Message` JSON + status on error), `/logout`.
  - `ApiController`: JSON the JSPs used to get from request attributes: `/api/session`, `/api/rules/roles`, `/api/village/{publicId}`, `/api/habitant/{username}`.
- `rest/` (`*RR extends AbstractRR`): one class per REST operation, writes JSON; errors use `Message` + `utils/ErrorCode` (app code + HTTP status).
- `dao/` (`extends AbstractDAO<T>`): one class per query; `new XxxDAO(dataSource.getConnection(), ...).access().getOutputParam()`. `access()` closes the connection, so every DAO needs a fresh one.
- `resource/`: POJOs with `toJSON(OutputStream)` (Jackson streaming). `LogContext` holds thread-local IP/action/user for log4j2 and must be cleared in `finally`.
- Games have an internal int `ID` and a `public_ID` string used in URLs (`/village/{publicId}`); `GetGameIdFormPublicGameIdDAO` maps them.
- `webSocket/GameWebSocket` (`/gameWS/{room}`, room = public game id): shares live target selection; messages are `sender:target` strings, plus `#update` (sent by `notifyUpdate` after a game action/status change: clients reload) and `#votes:<json>` (the master's current day votes, forwarded to the room and replayed on connect; usernames can't start with `#`); state in static in-memory maps, dropped by `UpdateGameDAO` via `freeGameWebSocket` on phase change / game end. DataSource injected statically by `WebSocketConfig`.

### Frontend (`frontend/src/`)

- `App.jsx`: routes with the same paths as before (`BrowserRouter basename="/"`). Navigation is client-side (`<Link>`/`useNavigate`, tabs and wizard steps via `useSearchParams`); only login/signup POST and `/logout` do full page loads. The redirects `PageController`/`PagesFilter` do on direct loads are mirrored in the pages (`useLoginChecker`, `HabitantRedirect`, `JoinVillage`, master/player redirect in `CurrentGame`, canonical username and 404 in `UserStatistics`). `components/RouteEffects.jsx` runs on every route change (scroll to top, default title, hide message popups, `loadTheme()`). `fetchSession()` caches the session for the life of the app (`invalidateSession()` after changes).
- `pages/`: one component per old JSP page. `pages/CurrentGame.jsx` + `components/game/currentGame/` is the game UI, in React (`VillagePage`, state and REST/WebSocket in `useGame.js`, rules for actions/targets in `gameLogic.js`); requests and WebSocket messages are the same as the original imperative code.
- `utils/`: `utils.js` (XHR helpers `genericGET/POST/PUT/DELETERequest`, role groups/colors), `message.js` (popup messages), `session.js` (`useSession`, `useLoginChecker`). `README.md` in `frontend/src/` lists the shared components.
- Styling: Tailwind only (no Bootstrap) + shadcn/ui components in `components/ui/` (alias `@` → `src`). Design system "variant F" (medieval village): tokens `--lf-*` / Tailwind colors `lf-*`, classes `.lf-page`, `.lf-paper`, … in `index.css`, components in `components/lupus/` (see `frontend/src/README.md`); `index.css` still holds the old palette variables too. Light/dark theme via `data-bs-theme` on `<body>` (`dark:` variant follows it). CSS Tailwind can't express lives in `styles/*.css` or next to the component, scoped under a page root class. Dev-only mock gallery at `/mock` (`src/mocks/`, not in the production build).
