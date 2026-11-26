# Autenticazione: JWT al posto della sessione HTTP + password con salt

Progetto `/home/nicola/Desktop/LupusInFabula` (leggi `CLAUDE.md`). Backend Spring Boot 3.5 / Java 17, con servlet raw: i filtri sono in `filter/`, i controller in `controller/`, le operazioni REST in `rest/*RR` e i DAO in `dao/`. Package base: `src/main/java/it/unipd/dei/webapp/lupus/`.

## Stato attuale
- **Login** (`controller/LoginSignupController.login`): crea una `HttpSession` e ci mette dentro il `Player` (`UserFilter.USER_ATTRIBUTE`) e l'id pubblico della partita di cui è master (`GameMasterFilter.GAMEMASTER_ATTRIBUTE`, `""` se non lo è). Con `keepLogged=on` salva un UUID nella tabella `User_tokens` (`AddUserTokenDAO`) e lo mette nel cookie `loginToken` (365 giorni).
- **Filtri:** `UserFilter` e `PagesFilter` ricostruiscono la sessione dal cookie `loginToken` (`AuthenticateTokenDAO`). Logout e cancellazione dell'account invalidano la sessione e il token (`InvalidateTokenDAO`).
- **Lettura dell'utente:** circa 30 punti fanno `req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)`. Alcuni leggono anche `GAMEMASTER_ATTRIBUTE` (`ApiController`, `PageController`, `GameMasterFilter`). `GameCreationPostRR` lo imposta alla creazione della partita.
- **WebSocket:** `webSocket/GetHttpSessionConfigurator` prende lo username dalla `HttpSession` durante l'handshake.
- **Password:** `md5(?)` senza salt in `dao/LoginPlayerDAO`, `dao/SignupPlayerDAO`, `dao/UpdatePasswordByUsernameDAO`.

## Obiettivo (richiesta dell'utente)
1. Tutta l'autenticazione passa a **JWT**: niente `HttpSession`, niente `JSESSIONID`.
2. La tabella `User_tokens` e i suoi DAO vengono **eliminati**.
3. Le password si salvano con **salt**.

## Contratto comune (tutti gli agenti lo rispettano: lavorano in parallelo)

### `utils/Jwt.java` (nuovo, agente A)
- HS256 implementato con la sola libreria standard: `javax.crypto.Mac` con `HmacSHA256` e `Base64.getUrlEncoder().withoutPadding()`. **Niente dipendenze nuove.**
- `static String issue(String username, long ttlSeconds)` → token con payload `{"sub":username,"iat":…,"exp":…}`.
- `static String verify(String token)` → lo username, oppure `null` se:
  - il formato non è valido;
  - l'header non è esattamente `{"alg":"HS256","typ":"JWT"}`: niente `none`, niente altri algoritmi;
  - la firma non corrisponde (confronto a tempo costante con `MessageDigest.isEqual`);
  - il token è scaduto.
  Per il JSON usa `org.json`, già presente nel pom.
- **Segreto:** variabile d'ambiente `JWT_SECRET`, di almeno 32 caratteri. Se manca o è troppo corta, genera 32 byte casuali con `SecureRandom` all'avvio e logga un WARN: i token in quel caso non sopravvivono al riavvio del server.

### `utils/Auth.java` (nuovo, agente A)
- `static final String COOKIE = "lupusToken"`.
- `static Player currentPlayer(HttpServletRequest req)` → il `Player` autenticato, oppure `null`. Prima guarda l'attributo di **richiesta** `UserFilter.USER_ATTRIBUTE`, che il filtro imposta. Se manca, verifica il cookie e carica il `Player` dal DB con il DAO già usato dai filtri per lo username, e lo mette nell'attributo di richiesta. Un account cancellato (username uguale all'email, vedi `login`) vale come non autenticato.
- `static String masterGame(DataSource ds, String username)` → id pubblico della partita **in corso** di cui l'utente è master, oppure `""`. Stessa logica di oggi nel login: `GetGameIdByPlayerUsernameDAO`, `PlayerInGameDAO`, `GetMasterFromIdGameDAO`. Si calcola a ogni chiamata dal DB: non c'è più nulla da tenere aggiornato.
- `static void setCookie(HttpServletRequest req, HttpServletResponse res, String username, boolean keepLogged)`:
  - token con scadenza 30 giorni se `keepLogged`, altrimenti 12 ore;
  - cookie `HttpOnly`, `Path=/`, `SameSite=Lax` (usa `ResponseCookie` di Spring oppure scrivi l'header `Set-Cookie` a mano);
  - `Secure` se `req.isSecure()` oppure se l'header `X-Forwarded-Proto` vale `https`;
  - `Max-Age` solo se `keepLogged`, altrimenti cookie di sessione del browser.
- `static void clearCookie(HttpServletRequest req, HttpServletResponse res)` → stesso cookie con `Max-Age=0`.
- `static String usernameFromCookieHeader(String cookieHeader)` → serve all'handshake del WebSocket.

### Sostituzioni
- `req.getSession().getAttribute(UserFilter.USER_ATTRIBUTE)` e le sue varianti (`getSession(false)`, `session.getAttribute(...)`) → `Auth.currentPlayer(req)`.
- Le letture di `GAMEMASTER_ATTRIBUTE` → `Auth.masterGame(ds, Auth.currentPlayer(req).getUsername())`. Le scritture di `GAMEMASTER_ATTRIBUTE` si **rimuovono**.
- `getSession().invalidate()` → `Auth.clearCookie(req, res)`.
- Le costanti `UserFilter.USER_ATTRIBUTE` e `GameMasterFilter.GAMEMASTER_ATTRIBUTE` restano, così compila tutto. `USER_ATTRIBUTE` ora indica l'attributo di **richiesta**.
- Nessuna chiamata a `getSession()` deve restare nel codice: verifica con `grep -rn "getSession" src/main/java` alla fine.

## Regole
- Gli URL, le risposte JSON, gli status code e i redirect restano identici. Login e signup rispondono ancora con un redirect a `/home` in caso di successo, e con gli stessi errori. Il form di login manda ancora `user`, `password`, `keepLogged`.
- Il frontend non cambia: legge la sessione da `GET /api/session` e il cookie è HttpOnly.
- Niente commit, niente push.
- Il backend su :9090 lo gestisce l'utente dall'IDE: non avviarlo, non fermarlo, non riavviarlo.
- Porte 5173, 5432 e 8080 vietate.
- Compilazione (da `/home/nicola/Desktop/LupusInFabula`):
  `/home/nicola/.jdks/ms-21.0.12/bin/javac -proc:none -d /tmp/lupus-classes-<agente> -cp "$(find ~/.m2/repository -name '*.jar' | tr '\n' ':')" $(find src/main/java -name '*.java')`
  Mentre gli altri agenti lavorano, la compilazione completa può fallire per i loro file non ancora finiti. Conta che i **tuoi** file non diano errori, e scrivi nel report gli errori che restano negli altri.
