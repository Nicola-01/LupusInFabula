# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web app (University of Padova, Web Applications course) that helps the game master run a game of "Lupus in Fabula" (Werewolf). Backend: Spring Boot 3.5 (Java 17, embedded Tomcat, plain JDBC DAOs on PostgreSQL). Frontend: React 19 + react-router 7 + Tailwind CSS v4, built with Vite, in `frontend/`. Game rules: section 1.1 of `hw1/WebApplication_HW1_LIFGroup.pdf`.

The app was migrated from Servlet/JSP + Bootstrap (branch `WebSocket`/`master` history). Known bugs of the original code are listed in `bug.md`; they were intentionally kept unless noted there.

## Commands

- Frontend build (must run before packaging, output goes to `src/main/resources/static/`, git-ignored): `cd frontend && npm install && npm run build`
- Backend build: `mvn clean package` → `target/lupus-1.00.jar` (Spring Boot fat jar, includes the frontend build). `./mvnw` is not usable (no `.mvn/` dir).
- Run everything: `docker compose up` (web = `eclipse-temurin:17-jre` running the jar mounted from `target/`, db = postgres, pgAdmin on 5050). App at http://localhost:8080/lupus/, JDWP debug on 5005. Logs in the web container at `/app/logs/lupus.log`.
- Run locally without docker for the web part: `DB_URL=jdbc:postgresql://localhost:5432/postgres java -jar target/lupus-1.00.jar` (default URL points to host `db`).
- Frontend dev server with hot reload: `cd frontend && npm run dev` → http://localhost:5173/lupus/ (proxies REST, login/logout and the WebSocket to the backend on :8080).
- Javadoc: `mvn javadoc:javadoc`
- No unit tests. REST API tests are IntelliJ HTTP Client files in `RestApiTest/*.http`, run against the live server; they need `src/main/database/02_populate_db.sql` and `src/main/database/extra/03_populate_db_optional.sql` loaded.

## Database

- SQL in `src/main/database/` is mounted as `/docker-entrypoint-initdb.d/`, so it runs only when `./data/db` doesn't exist. To reset, delete `./data/db` and rerun compose.
- `01_database_tables.sql` creates the schema and the `lupus_sql` role used by the app (`src/main/resources/application.properties`, HikariCP).

## Architecture

### Backend (`src/main/java/it/unipd/dei/webapp/lupus/`)

Context path `/lupus`; all URLs, JSON shapes and status codes are the same as the original servlet app.

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
- `webSocket/GameWebSocket` (`/gameWS/{room}`, room = public game id): shares live target selection; messages are `sender:target` strings; state in static in-memory maps, dropped by `UpdateGameDAO` via `freeGameWebSocket` on phase change / game end. DataSource injected statically by `WebSocketConfig`.

### Frontend (`frontend/src/`)

- `App.jsx`: routes with the same paths as before (`BrowserRouter basename="/lupus"`). Internal navigation uses full page loads (`<a href="/lupus/...">`), as the JSP app did, so the backend redirects/filters still run.
- `pages/`: one component per old JSP page. `pages/CurrentGame.jsx` + `components/game/currentGame/` is the game UI: React owns the shell, while the action form, player circle, log and WebSocket are the original imperative DOM code ported as ES modules and run from effects.
- `utils/`: `utils.js` (XHR helpers `genericGET/POST/PUT/DELETERequest`, role groups/colors), `message.js` (popup messages), `session.js` (`useSession`, `useLoginChecker`). `README.md` in `frontend/src/` lists the shared components.
- Styling: Tailwind only (no Bootstrap). `index.css` holds the old palette (`lupusColors.css`) as CSS variables exposed as Tailwind colors (`bg-navbar-bg`, `text-role-color-wolf`, …) and a base layer replicating Bootstrap reboot + `common.css`. Light/dark theme via `data-bs-theme` on `<body>` (`dark:` variant follows it). CSS Tailwind can't express (keyframes, sibling-state selectors) lives in `styles/*.css`, scoped under a page root class.
