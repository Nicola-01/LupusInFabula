# TODO — porting del backend in `backend/`

Ordine pensato perché ogni passo usi solo cose già fatte. Gli URL restano quelli del vecchio
backend (`src/`), il JSON può cambiare (il frontend verrà adattato alla fine).
Ogni passo: codice via subagent Haiku, test, README del package aggiornato, spiegazione.

## Fatto

- [x] Progetto Spring Boot 4.2 / Java 21, `compose.yaml` con postgres (porta 5434)
- [x] `GlobalExceptionHandler` con `ProblemDetail`
- [x] Ruoli come enum, `GET /api/rules/roles`
- [x] Entity e repository: `Player`, `Friendship`, `Game`, `GamePlayer`, `GameAction`
      (analisi del vecchio schema in `dbReport.md`)

## 1. Utenti e autenticazione (Spring Security)

Sessione HTTP (`JSESSIONID`, in memoria) + remember-me (cookie `remember-me`) + CSRF per SPA
(`csrf.spa()`). Niente JWT: un solo frontend sullo stesso dominio e il WebSocket, dove il cookie
di sessione viaggia da solo. Dettagli in `security/README.md`.

- [x] Dipendenze `spring-boot-starter-security` e `spring-boot-starter-security-test`
- [x] `PasswordEncoder` (BCrypt) come `@Bean` in `security/SecurityConfig`
- [x] `POST /signup` (201, avvia la sessione), `POST /login` (204, opzione `keepLogged` = remember-me)
- [x] `POST /logout` (204, `LogoutFilter` di Spring: invalida la sessione, cancella i cookie)
- [x] `SecurityFilterChain`: URL protetti come `UserFilter`, pagine e statici pubblici
- [x] `GET /api/session` (utente loggato, con publicId della partita di cui è master)
- [x] Package `exceptions/` con `AlreadyUsedException` (409, `ErrorResponseException`)
- [x] 401/403 come `ProblemDetail` (`GlobalExceptionHandler`, anche per gli errori dei filtri)
- [x] Test: service con Mockito, `PlayerDetailsService` con Mockito, flusso completo con MockMvc
- [ ] Logout da tutti i dispositivi (oggi solo il browser corrente; servirebbe Spring Session JDBC o `tokenVersion`)

## 2. Profilo e amici (`/user/**`)

- [x] `GET /user/me`, `PUT /user/me` (username, email, password), `DELETE /user/me` (soft delete, D4: username bloccato, email liberata)
- [x] `GET /user/{username}` (sostituisce `GET /api/habitant/{username}`, rimosso)
- [x] `GET /user/search/{text}` (min 2 caratteri, max 20, esclude cancellati e se stessi)
- [x] `GET/POST/DELETE /user/me/friend` (amicizia a senso unico, D6; DELETE con body)

## 3. Creazione partita (`/game/create`, `/game/settings`, `/game/list`)

- [ ] `GET /game/create` (ruoli disponibili), `GET /game/settings` (impostazioni possibili)
- [ ] `POST /game/create`: validazione numero ruoli/giocatori, assegnazione casuale, `publicId`
- [ ] `GET /game/list` (partite dell'utente)
- [ ] `GET /api/village/{publicId}`

## 4. Stato della partita (sola lettura)

- [ ] Controllo "è il master di questa partita" (`@PreAuthorize` o bean di sicurezza, come `GameMasterFilter`)
- [ ] `GET /game/status/{id}[/master]`, `/players/...`, `/settings/...`, `/configuration/...`
- [ ] Cosa vede il master e cosa vede il giocatore (ruoli nascosti finché la partita non finisce)

## 5. Logica di gioco

- [ ] Decidere le domande aperte di `dbReport.md`: D5, D7, D8, D10, D11
- [ ] `GET/POST /game/actions/{id}[/master]`: azioni notturne, voto diurno
- [ ] Risoluzione delle azioni per ruolo (protezione, blocco, peste, …), morti, cambio fase
- [ ] `POST /game/update/{id}/master` (avanzamento fase), condizioni di vittoria
- [ ] Impostazioni di partita attive (D1: `MASTER_FREE`, `ILLUSIONIST_BLOCK`, `LARGER_ROLE_NUMBER`)
- [ ] Molti test unitari: è la parte con più regole

## 6. Tempo reale

- [ ] WebSocket `/gameWS/{room}` come bean (niente mappe statiche), autenticato col cookie JWT
- [ ] `#update` dopo ogni azione/cambio fase, `#votes:` del master

## 7. Statistiche e log

- [ ] `GET /game/logs/{id}[/master]`
- [ ] `GET /user/{username}/logs`, `GET /user/{username}/statistic`

## 8. Integrazione

- [ ] `GET /config.js` (versione app per il frontend)
- [ ] Servire il frontend buildato + fallback delle pagine React (oggi `PageController`, `ErrorPageConfig`)
- [ ] Adattare il frontend al nuovo JSON
- [ ] `Dockerfile` e `docker-compose.yml` della radice puntano a `backend/`
- [ ] Rimuovere il vecchio backend `src/`, aggiornare `CLAUDE.md` e README
