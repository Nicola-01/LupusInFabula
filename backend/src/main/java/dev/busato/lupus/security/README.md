# `security/` — autenticazione e sessione (Spring Security)

Chi sei (login), cosa ricordiamo di te tra due richieste (sessione, remember-me) e quali URL
richiedono un utente loggato. Il protocollo è quello "classico" di Spring: **sessione HTTP**
(cookie `JSESSIONID`) più **remember-me** (cookie `remember-me`), niente JWT, niente tabelle di
sessione nel database.

## Cos'è Spring Security

Spring Security è una **catena di filtri servlet** che sta davanti ai controller: ogni richiesta
attraversa i filtri **prima** di arrivare a `@RestController`. La catena è definita da un bean
`SecurityFilterChain` (in `SecurityConfig`). I filtri che usiamo, nell'ordine in cui la richiesta
li attraversa:

| Filtro | Cosa fa |
|---|---|
| `SecurityContextHolderFilter` | legge il `SecurityContext` (chi è loggato) dalla sessione e lo mette nel thread corrente |
| `CsrfFilter` | controlla il token CSRF sulle richieste che modificano dati (POST, PUT, DELETE) |
| `LogoutFilter` | intercetta `POST /logout`: invalida la sessione e cancella i cookie |
| `RememberMeAuthenticationFilter` | se non c'è una sessione ma c'è il cookie `remember-me`, ricrea il login |
| `LogContextFilter` | mette utente e IP nel log (MDC), vedi "Log di sicurezza" |
| `AuthorizationFilter` | controlla che l'URL richiesto sia `authenticated()` o `permitAll()` |
| `ExceptionTranslationFilter` | trasforma le eccezioni di sicurezza (non loggato, senza permessi) in risposte di errore |

L'ordine conta: per esempio il `CsrfFilter` deve stare prima del controller, e
`AuthorizationFilter` deve vedere il login già ricostruito da `SecurityContextHolderFilter` e
`RememberMeAuthenticationFilter`.

## Il flusso

Login (`POST /login`):

```
AuthController.login
  → AuthenticationManager.authenticate(login, password)
      → DaoAuthenticationProvider
          → PlayerDetailsService.loadUserByUsername(login)   (username o email)
          → PasswordEncoder (BCrypt) confronta la password con l'hash
  → SecurityContext salvato nella HttpSession → risposta con cookie JSESSIONID
```

Richieste successive (con il cookie `JSESSIONID`):

```
SecurityContextHolderFilter legge il SecurityContext dalla sessione
  → AuthorizationFilter: URL protetto, c'è un utente? sì → avanti
  → controller: @AuthenticationPrincipal PlayerPrincipal me
```

## Perché il login è "manuale"

Spring Security ha un `formLogin()` che gestisce da solo `POST /login`, ma accetta solo
**form HTML** (`application/x-www-form-urlencoded`) e fa redirect. La nostra API riceve **JSON** e
risponde con status code. La documentazione di Spring suggerisce, in questo caso, di fare il
login a mano: l'`AuthenticationManager` controlla le credenziali, e il `SecurityContext` lo salviamo
noi nella sessione. È il metodo `startSession` di `AuthController`, quattro passi:

1. `authenticationManager.authenticate(...)`: controlla login e password; se sbagliate lancia
   `BadCredentialsException` (→ 401 "Wrong credentials").
2. `sessionStrategy.onAuthentication(...)`: **session fixation**. Un attaccante potrebbe far
   usare alla vittima un `JSESSIONID` che lui conosce; dopo il login quel valore andrebbe a
   essere autenticato. `ChangeSessionIdAuthenticationStrategy` cambia l'id della sessione al
   login, quindi quello vecchio non vale più. Se la sessione non c'è ancora, non fa nulla.
3. `SecurityContextHolder.setContext(...)`: il contesto del thread corrente (usato dai filtri
   per il resto della richiesta).
4. `securityContextRepository.saveContext(...)`: lo scrive nella sessione, così le richieste
   successive lo ritrovano. Il repository è **lo stesso bean** usato dalla catena di filtri
   (`SecurityConfig`): se fossero due istanze, il login non sarebbe visto.

Se l'utente ha chiesto "keep me logged in" (`keepLogged`), in più si chiama
`rememberMeServices.loginSuccess(...)`, che manda il cookie `remember-me`.

## Sessione in memoria

Il `SecurityContext` vive nella `HttpSession` del servlet container (Tomcat). Caratteristiche:

- **in memoria**: la sessione è un oggetto nella RAM del processo. Non tocca il database.
- **timeout 30 minuti** di inattività (default di Tomcat, `server.servlet.session.timeout`).
- **si perde al riavvio** dell'applicazione: chi era loggato deve rifare il login (o si
  ripristina con il remember-me, vedi sotto).
- **non scala su più istanze** senza sticky session: un'altra istanza non conosce la sessione.
  Con una sola istanza (il nostro caso) è irrilevante.

Alternativa: **Spring Session JDBC** salva le sessioni in due tabelle (`spring_session` e
`spring_session_attributes`). Sopravvive ai riavvii, funziona con più istanze e permette di
chiudere le sessioni di un utente da tutti i dispositivi (`findByPrincipalName`). L'abbiamo
scartata perché vogliamo **non tenere nulla nel database** oltre alle entity del gioco; se un
giorno serve il logout da tutti i dispositivi, si aggiunge.

## Request cache disabilitata

Con `formLogin` Spring salva l'URL richiesto nella sessione, per rimandarci lì dopo il login.
La nostra API risponde in JSON e il frontend decide dove andare, quindi questa funzione è inutile:
la disattiviamo con `requestCache(c -> c.disable())` in `SecurityConfig`. Senza, ogni 401 anonimo
(per esempio `GET /api/session` senza login) creerebbe una sessione in memoria: memoria sprecata, e
chiunque potrebbe crearne quante vuole.

## Remember-me

Il cookie `remember-me` permette di restare loggati dopo la scadenza della sessione (30 giorni
con `keepLogged`). Il valore è `username:scadenza:firma`, dove la firma è calcolata con la **chiave**
`app.remember-me.key` (SHA-256). La firma include anche l'**hash della password**: cambiare
password invalida tutti i remember-me esistenti, senza dover tenere una lista.

- `RememberMeAuthenticationFilter` legge il cookie quando manca la sessione, ricarica l'utente con
  `PlayerDetailsService`, verifica la firma e ricrea il login.
- `setAlwaysRemember(true)`: di default `TokenBasedRememberMeServices` crea il cookie solo se la
  richiesta contiene il parametro `remember-me` (come un form con una checkbox). Noi chiamiamo
  `loginSuccess` **solo** quando l'utente ha chiesto `keepLogged`, quindi il controllo sul
  parametro non serve e lo disattiviamo.
- Il logout cancella il cookie (`LogoutFilter` chiama anche il remember-me).

### Cosa c'è dentro il cookie

Da `TokenBasedRememberMeServices` (sorgente di Spring Security 7.2):

```
remember-me = Base64( username : scadenza : algoritmo : firma )
              es. Base64("nick:1767225600000:SHA256:3f9a...e1")

firma = hex( SHA-256( username + ":" + scadenza + ":" + hashPassword + ":" + chiave ) )
```

- **username**: chi è.
- **scadenza**: istante in millisecondi, login + 30 giorni.
- **algoritmo**: `SHA256`, scritto nel cookie per poter cambiare algoritmo in futuro.
- **firma**: l'hash di tutti i campi, più l'hash BCrypt della password (quello del database,
  **non** la password in chiaro) e la **chiave segreta** `app.remember-me.key`.

**È firmato, non cifrato.** Base64 è solo una codifica: chi ha il cookie legge username e
scadenza. Non può però **modificarli**: per ricalcolare la firma servirebbe la chiave, che sta solo
sul server. Il server non salva il cookie da nessuna parte: ricalcola la firma con i dati attuali e
la confronta.
- **Scadenza modificata** a mano → la firma non torna più.
- **Password cambiata** → cambia l'hash nel database, quindi la firma attesa è diversa e tutti i
  vecchi cookie sono invalidi.
- **Chiave cambiata** → tutti i remember-me di tutti gli utenti sono invalidi.
- **Cookie rubato** → funziona fino alla scadenza (è il limite di questo tipo, vedi sotto).

Tecnicamente non è un HMAC (la costruzione standard per firmare con una chiave): è uno SHA-256
con la chiave in fondo ai dati. Con la chiave alla fine l'attacco tipico contro questa forma
(*length extension*) non funziona, quindi per questo uso è sicuro.

Attributi del cookie: `HttpOnly` (JavaScript non può leggerlo), `Secure` se la richiesta è in
HTTPS, `Max-Age` di 30 giorni, `Path=/`.

### Chi controlla il cookie dopo (nessun codice nostro)

`RememberMeAuthenticationFilter` non è nel progetto: è una classe di Spring Security, nel jar
`spring-security-web` (package `org.springframework.security.web.authentication.rememberme`).
Per vederla in IntelliJ: `Ctrl+N` (o doppio `Shift`), scrivi `RememberMeAuthenticationFilter` e
attiva "Include non-project items". Oppure `Ctrl+click` su `.rememberMe(...)` in `SecurityConfig`:
si apre `RememberMeConfigurer`, e il suo `configure` crea il filtro e lo aggiunge alla catena.
Per vedere a runtime l'elenco dei filtri attivi: `logging.level.org.springframework.security=DEBUG`;
all'avvio Spring stampa la catena.

`.rememberMe(r -> r.rememberMeServices(...))` in `SecurityConfig` aggiunge alla catena il
`RememberMeAuthenticationFilter`. Esempio: la sessione è scaduta, o il server è stato riavviato.
1. `SecurityContextHolderFilter` cerca la sessione del `JSESSIONID`: non c'è, quindi l'utente è anonimo.
2. `RememberMeAuthenticationFilter` vede l'utente anonimo e chiama `rememberMeServices.autoLogin(...)`:
   - legge il cookie (Base64 di `username:scadenza:algoritmo:firma`) e controlla la scadenza;
   - carica l'utente con `PlayerDetailsService`. Se è cancellato non lo trova e il cookie viene
     rifiutato;
   - ricalcola la firma con chiave e hash della password e la confronta. Se è diversa (password
     cambiata, cookie modificato) cancella il cookie.
3. Se tutto torna, mette l'utente nel `SecurityContext` **e lo salva nella sessione**: il filtro
   usa lo stesso `SecurityContextRepository` della catena. Nasce una sessione nuova e la risposta
   ha un nuovo `JSESSIONID`.
4. La richiesta prosegue verso `AuthorizationFilter` e il controller come se l'utente fosse loggato.
   Le richieste dopo usano la sessione nuova; il remember-me torna in gioco solo quando anche
   questa scade.

Il cookie `remember-me` **non** è un cookie di sessione: ha `Max-Age` di 30 giorni, quindi resta
anche chiudendo il browser. Il `JSESSIONID` invece sparisce. La scadenza è fissa (30 giorni dal
login) e **non si rinnova** a ogni uso: dopo 30 giorni bisogna rifare il login. Lo verifica
`AuthFlowTest.rememberMeCookieAloneRestoresTheSession`.

Limiti accettati:
- il cookie vale finché la chiave non cambia: il logout cancella il cookie **di quel browser**;
  non esiste "esci da tutti i dispositivi". Le sessioni già aperte altrove restano valide fino al
  timeout.
- il cookie non è revocabile singolarmente.

Alternativa: `PersistentTokenBasedRememberMeServices` salva ogni token in una tabella
(`persistent_logins`): il token viene **ruotato a ogni uso** (se un token rubato viene riusato,
Spring rileva il furto e invalida tutto) e si può revocare. È più sicuro, ma aggiunge una tabella.

### E se qualcuno ruba il cookie?

**Entra**, come l'utente, fino alla scadenza (30 giorni dal login). Il cookie è una "chiave al
portatore": chi ce l'ha entra, il server non sa chi lo presenta. Vale anche per `JSESSIONID`
(*session hijacking*), ma quello smette di funzionare dopo 30 minuti di inattività o al logout.

Come si può rubare e cosa lo impedisce già:

| Modo | Difesa |
|---|---|
| JavaScript iniettato nella pagina (XSS) | `HttpOnly`: JS non può leggerlo |
| intercettarlo in rete | `Secure` + HTTPS: viaggia cifrato (in produzione serve HTTPS) |
| farlo mandare da un altro sito | `SameSite=Lax` + token CSRF: l'altro sito non può usarlo per scrivere |
| accesso al PC, malware, copia dei file del browser | **nessuna**: è il caso scoperto |

Come si chiude, con questa configurazione:
- **cambiare la password**: tutti i remember-me esistenti diventano invalidi;
- **cambiare `REMEMBER_ME_KEY`** sul server: invalida i remember-me di **tutti** gli utenti.

Con `PersistentTokenBasedRememberMeServices` il furto viene **rilevato**. Dopo un uso il token
cambia: se il ladro lo usa, la vittima resta con un token vecchio, e al suo prossimo accesso
Spring vede la stessa *series* con un token diverso. A quel punto cancella tutti i remember-me
dell'utente. Il ladro però può usare il cookie finché la vittima non torna. Gli stessi limiti valgono
per i refresh token JWT di FinanceWebApp: lì si chiude con `tokenVersion`.

## CSRF

**Cos'è**: un sito esterno (`evil.example`) può far partire una richiesta verso la nostra API
(per esempio un `POST /game/...` da un form nascosto) e il browser allega i cookie, incluso
`JSESSIONID`. La richiesta sembra legittima, ma non l'ha voluta l'utente.

**Difesa**: ogni richiesta che modifica dati deve portare un **token** che un altro sito non può
leggere. `csrf(c -> c.spa())` (la configurazione per le single page application):

1. il server mette il token nel cookie `XSRF-TOKEN`. Questo cookie **non** è `HttpOnly`: il
   JavaScript del frontend lo può leggere;
2. il frontend rimanda il valore nell'header `X-XSRF-TOKEN` per ogni `POST`/`PUT`/`DELETE`;
3. il server confronta header e cookie. Un sito esterno non può leggere il cookie (la same-origin
   policy), quindi non può mettere l'header giusto.

Il token viene emesso sulla prima richiesta, anche su una risposta 401 (verificato con curl).
La richiesta senza token (o con token sbagliato) risponde 403 "Invalid or missing CSRF token".

Seconda difesa: `server.servlet.session.cookie.same-site=lax`. Il browser non manda il cookie di
sessione nelle richieste cross-site fatte da form o script (solo nelle navigazioni di primo
livello, come il click su un link). Non basta da sola: i browser vecchi non la supportano bene e
la navigazione GET resta possibile; per questo teniamo anche il token.

## Password: BCrypt

`BCryptPasswordEncoder` (bean in `SecurityConfig`):

- ogni `encode` genera un **salt casuale di 16 byte** e lo **incorpora nella stringa dell'hash**.
  Formato: `$2a$10$` (versione e costo) + 22 caratteri di salt + 31 caratteri di hash = 60
  caratteri. Per questo basta la colonna `passwordHash`: nessuna colonna per il salt.
- il **costo 10** = 2^10 round di calcolo: lento di proposito, così un attaccante che ha rubato il
  database non può provare milioni di password al secondo.
- `matches(raw, hash)` rilegge salt e costo dalla stringa stessa, quindi funziona anche se cambi
  il costo in futuro (gli hash vecchi restano validi).

Confronto: il vecchio backend (`src/`) usava PBKDF2-HMAC-SHA256 con 210000 iterazioni e un salt
da 16 byte, implementato a mano. Il risultato è equivalente; BCrypt è lo standard di Spring e non
c'è codice nostro da mantenere.

## Errori

Gli errori di sicurezza non hanno una gestione propria: `exceptionHandling` in `SecurityConfig`
passa l'eccezione al `handlerExceptionResolver` di Spring MVC, lo stesso che usa il controller.
Così arrivano a `GlobalExceptionHandler`, che le trasforma in `ProblemDetail`:

| Situazione | Eccezione | Risposta |
|---|---|---|
| nessun login su URL protetto | `AuthenticationException` | 401 "Authentication required" |
| login sbagliato | `BadCredentialsException` | 401 "Wrong credentials" |
| CSRF mancante o errato | `CsrfException` (è un `AccessDeniedException`) | 403 "Invalid or missing CSRF token" |
| login senza permessi | `AccessDeniedException` | 403 "Access denied" |

"Wrong credentials" è **uguale** per utente inesistente, account cancellato e password sbagliata:
`DaoAuthenticationProvider` trasforma `UsernameNotFoundException` in `BadCredentialsException`, e
quando l'utente non esiste fa comunque un confronto BCrypt, così il tempo di risposta non rivela
se l'account esiste.

## Il principal: `PlayerPrincipal`

Dentro la sessione finisce un `PlayerPrincipal`, un **record nostro** che implementa `UserDetails`
(`id`, `username`, `passwordHash`), non l'entity `Player`. Motivi:

- **l'entity fuori dalla transazione**: la sessione sopravvive alla richiesta, e un'entity
  con relazioni lazy (`Player` ha `deletedAt` e in futuro collezioni) darebbe errore o dati
  scollegati dal database.
- **dati vecchi**: l'entity è una copia letta al login; il record è una foto minima e immutabile
  (l'hash serve solo a Spring per il remember-me).
- **l'`id` e non lo username**: l'username può cambiare (`PUT /user/me`), l'`id` UUID no. Le
  chiamate al database usano l'`id`.

Nel controller si legge con `@AuthenticationPrincipal PlayerPrincipal me`: Spring prende il
principal dal `SecurityContext` e lo passa come parametro. Se nessuno è loggato e l'URL è protetto,
la richiesta non arriva nemmeno al controller.

### Dove sta la password (hash, non cifratura)

| Posto | Cosa contiene |
|---|---|
| database, `player.password_hash` | hash BCrypt |
| `PlayerPrincipal` nella sessione (RAM del server) | lo stesso hash BCrypt |
| cookie `JSESSIONID` | solo un id casuale, nessun dato |
| cookie `remember-me` | username, scadenza, firma; né la password né l'hash (l'hash entra solo nel **calcolo** della firma, fatto sul server; nel cookie va solo il risultato SHA-256, da cui non si risale ai dati di partenza) |
| risposte JSON | mai (`PlayerResponse` ha solo username ed email) |

La password in chiaro esiste solo durante la richiesta di signup o di login, poi non è salvata da
nessuna parte.

**Hash ≠ cifratura**: una cifratura si può invertire con la chiave giusta, un hash no. Dall'hash
BCrypt non si risale alla password: si può solo verificare se una password data produce lo
stesso hash (`matches`). Anche chi ruba il database non ottiene le password, ma deve
indovinarle una per una, e BCrypt lo rende lento di proposito.

Nella sessione l'hash serve solo durante il login, perché il remember-me lo rilegge fresco dal
database. Dopo, `PlayerPrincipal` se lo porta dietro senza motivo. Spring lo cancellerebbe da solo
se il principal implementasse `CredentialsContainer` (`eraseCredentials()`). Un record però è
immutabile, quindi oggi resta: è solo nella memoria del server e non esce mai.

## Confronto con FinanceWebApp

FinanceWebApp usa un **access token JWT** nell'header `Authorization` più un **refresh token** in
un cookie `HttpOnly` su `/api/auth`, con un filtro scritto a mano (libreria jjwt). La revoca usa un
campo `tokenVersion` (per il logout da tutti i dispositivi e il cambio password) con una cache
Caffeine. Ha senso lì perché l'API ha **client esterni** (token personali, client MCP) che non
usano i cookie.

Qui c'è **un solo frontend sullo stesso dominio**, più il WebSocket. Il cookie di sessione viaggia da
solo anche nell'handshake del WebSocket; un header `Authorization` no (il browser non lo manda
nelle connessioni WebSocket). Quindi sessioni e cookie sono l'approccio standard di Spring per
questo caso, e la revoca "da tutti i dispositivi" è il limite accettato sopra.

## Classi

- `SecurityConfig` — `@Configuration @EnableWebSecurity`: i bean `PasswordEncoder` (BCrypt),
  `AuthenticationManager`, `SecurityContextRepository`, `TokenBasedRememberMeServices` e la
  `SecurityFilterChain` (CSRF, logout, remember-me, URL protetti).
- `PlayerDetailsService` — carica un utente per username o email (`UserDetailsService`); se è
  cancellato (`deletedAt`) o non esiste, lancia `UsernameNotFoundException`. Il filtro sui
  cancellati è nella query `PlayerRepository.findActiveByLogin`, non in Java. Il login per email
  porta il valore in minuscolo prima della query, come le email salvate (vedi `model/README.md`).
- `PlayerPrincipal` — il record in sessione: `id`, `username`, `passwordHash`.
- `LogContextFilter` — non è un `@Component`: lo crea `SecurityConfig` e lo aggiunge alla catena
  dopo il remember-me. Riempie l'MDC con utente e IP e lo svuota alla fine della richiesta.
- `AuthEventsLogger` — `@Component` con tre `@EventListener`: scrive una riga per login, login
  fallito e logout.

## Log di sicurezza

Ogni riga di log della richiesta deve dire **chi** e **da dove**, senza che il controller lo
scriva a mano. Il pezzo che lo fa è l'**MDC** (Mapped Diagnostic Context): una mappa chiave-valore
legata al **thread** corrente. Il vecchio backend faceva lo stesso con la classe `LogContext`
(thread-local), ma a mano; qui è lo standard di SLF4J, letto da Logback.

- `LogContextFilter` mette `user` (se c'è un login) e `ip` (`getRemoteAddr()`, che tiene conto di
  `X-Forwarded-For` grazie a `server.forward-headers-strategy=framework`).
- `application.properties` dice a Logback di stampare la mappa nel livello:
  `logging.pattern.level=%5p [%X{user:-anonymous} %X{ip:-}]`, quindi ogni riga ha la forma
  `INFO [nick 127.0.0.1] ... : messaggio`.
- Il filtro sta **dopo** `RememberMeAuthenticationFilter`: a quel punto sessione e remember-me
  hanno già ricostruito il login, quindi l'utente è noto. Per questo le righe scritte prima
  (logout, login via remember-me) non hanno l'IP: vedi sotto.
- **Il `finally` è obbligatorio**. Tomcat riusa i thread: senza `MDC.remove`, la richiesta
  successiva su quello stesso thread erediterebbe l'utente della precedente.

### Eventi di Spring Security

Login, remember-me e logout avvengono in **posti diversi**: il login nel nostro `AuthController`,
il remember-me nel filtro `RememberMeAuthenticationFilter`, il logout nel filtro `LogoutFilter`.
Mettere una riga di log in ogni posto vorrebbe dire toccare anche i filtri di Spring, dove non
abbiamo codice. La soluzione è **ascoltare gli eventi** che Spring Security pubblica comunque:

| Evento | Quando | Pubblicato da |
|---|---|---|
| `AuthenticationSuccessEvent` | un `AuthenticationManager` ha accettato le credenziali | `ProviderManager` |
| `AbstractAuthenticationFailureEvent` | credenziali rifiutate (`BadCredentialsException`, ...) | `ProviderManager` |
| `LogoutSuccessEvent` | logout completato | `LogoutSuccessEventPublishingLogoutHandler` (nella catena di logout) |

`AuthEventsLogger` li ascolta con `@EventListener` e scrive:
- `Login ok: <user>`, oppure `Login ok via remember-me: <user>` se il token è un
  `RememberMeAuthenticationToken` (il remember-me passa anche lui dal `ProviderManager`);
- `Login failed: <user> (<eccezione>)`, a livello WARN;
- `Logout: <user>`.

Non serve nessun `AuthenticationEventPublisher` personalizzato: Spring Security usa già un
`DefaultAuthenticationEventPublisher` per il `ProviderManager` costruito da `AuthenticationConfiguration`.
Il test `AuthFlowTest` (`loginIsLoggedOnce`, `rememberMeLoginIsLoggedOnce`, ...) lo verifica.

Note:
- `InteractiveAuthenticationSuccessEvent` (pubblicato dopo un login interattivo) **non** estende
  `AuthenticationSuccessEvent` (estende `AbstractAuthenticationEvent`): ascoltando solo il primo,
  ogni login produce una riga sola.
- Il nome nell'evento è lo username del `PlayerPrincipal`, non l'email digitata: il login per
  email scrive comunque l'username.
- Per il login fallito il nome è quello digitato dall'utente (può essere una email o un
  username inesistente): è utile per capire attacchi a forza bruta.
- Il `LogoutFilter` e il `RememberMeAuthenticationFilter` girano **prima** di `LogContextFilter`:
  le righe `Logout` e `Login ok via remember-me` non hanno l'IP nel bracket (lo mostrano
  `[anonymous ]`). Il nome dell'utente è comunque nel messaggio. Per avere anche l'IP bisognerebbe
  spostare `LogContextFilter` prima di `LogoutFilter`, con il risultato che il bracket non avrebbe
  l'utente su quelle righe: abbiamo scelto di lasciarlo dove previsto.
- La riga `Login ok` del login via `AuthController` mostra `[anonymous <ip>]`, non l'utente:
  il `SecurityContext` viene scritto **durante** la richiesta, dopo che il filtro ha già letto
  l'utente (che era `anonymous`). Il nome è comunque nel messaggio.
- `Signup:` è scritto in `AuthService` (non è un evento di sicurezza): il signup non ha un
  evento Spring dedicato.
