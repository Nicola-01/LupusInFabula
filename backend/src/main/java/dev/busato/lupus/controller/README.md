# `controller/` — strato HTTP

Riceve le richieste HTTP, le traduce in chiamate Java al service e restituisce la risposta.
**Nessuna logica qui**: ogni metodo è (quasi) una riga che chiama il service.

## Bean

Ogni classe è un bean `@RestController` (= `@Controller` + `@ResponseBody`: il valore restituito
viene scritto come JSON da Jackson invece di essere il nome di una pagina).
Dipende **solo** dai service, iniettati dal costruttore con `@RequiredArgsConstructor`.

## Annotazioni

| Annotazione | Dove | Significato |
|---|---|---|
| `@RestController` | classe | è un controller REST, risposte in JSON |
| `@RequestMapping("/api/rules")` | classe | prefisso comune a tutti i metodi |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` | metodo | verbo HTTP + resto del percorso |
| `@PathVariable` | parametro | pezzo dell'URL: `/game/{id}` → `UUID id` (conversione automatica) |
| `@RequestParam` | parametro | query string: `?page=2` |
| `@RequestBody` | parametro | il JSON del body convertito nel DTO di richiesta |
| `@Valid` | parametro | applica le regole del DTO (`@NotBlank`, `@Size`...); se fallisce → 400 |
| `@AuthenticationPrincipal` | parametro | l'utente loggato: Spring lo prende dalla sessione (vedi `security/README.md`) |

## Risposta

Si restituisce `ResponseEntity<XxxResponse>` per scegliere lo status in modo esplicito:
`ResponseEntity.ok(body)` (200), `ResponseEntity.status(HttpStatus.CREATED).body(...)` (201),
`ResponseEntity.noContent().build()` (204).

Gli errori **non** si gestiscono qui con try/catch: il service lancia un'eccezione e la traduce
in risposta un unico `@RestControllerAdvice`, `GlobalExceptionHandler`.

## Errori: `GlobalExceptionHandler` e `ProblemDetail`

Ogni errore esce nello stesso formato JSON, lo standard **RFC 9457 "Problem Details"**
(`Content-Type: application/problem+json`), rappresentato in Spring dalla classe `ProblemDetail`:

```json
{ "title": "Not Found", "status": 404, "detail": "Game 'wolf-seer-sam' not found" }
```

Lo standard prevede anche `type` (URL che descrive il tipo di errore; omesso quando vale il
default `about:blank`) e `instance` (l'URL della richiesta; Spring non lo imposta da solo).

Il frontend legge sempre `status` e `detail`, qualunque sia l'errore.

### `@RestControllerAdvice`: cos'è

Senza un gestore, ogni metodo del controller dovrebbe avere il suo try/catch e costruirsi la
risposta d'errore a mano (com'era il vecchio backend). `@ControllerAdvice` è un bean "consigliere"
che vale **per tutti i controller insieme**: quando un qualsiasi controller lancia un'eccezione,
Spring la passa a lui invece di rispondere con la sua pagina d'errore di default.
`@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody`: quello che i suoi metodi
restituiscono viene scritto come JSON, come in un `@RestController`.

Dentro, ogni metodo `@ExceptionHandler(X.class)` dice: "se esce un'eccezione di tipo X, rispondi
con quello che restituisco io". Se più metodi vanno bene, Spring sceglie quello con il tipo **più
specifico** (`GameNotFoundException` batte `ErrorResponseException`, che batte `Exception`).

### Cosa succede quando arriva un errore

```
1. il service lancia  new GameNotFoundException("abc")
2. l'eccezione risale: service → controller → Spring MVC (nessun try/catch nel nostro codice)
3. Spring cerca nel @RestControllerAdvice un @ExceptionHandler adatto
4. il metodo trovato costruisce un ProblemDetail
5. Spring lo scrive come JSON con lo status giusto
```

### `extends ResponseEntityExceptionHandler`: cosa ereditiamo

`ResponseEntityExceptionHandler` è una classe **scritta da Spring** che contiene già un
`@ExceptionHandler` per ognuna delle eccezioni che Spring MVC stesso lancia, ciascuno che
costruisce il `ProblemDetail` giusto. Estendendola, `GlobalExceptionHandler` **eredita tutti quei
metodi**, come se li avessimo scritti noi:

| Situazione | Eccezione lanciata da Spring | Risposta che otteniamo gratis |
|---|---|---|
| URL che non esiste | `NoResourceFoundException` | 404 |
| `POST` su un endpoint solo `GET` | `HttpRequestMethodNotSupportedException` | 405 |
| body non JSON / JSON rotto | `HttpMessageNotReadableException` | 400 |
| `/game/abc` dove serve un UUID | `MethodArgumentTypeMismatchException` | 400 |
| `@Valid` fallito | `MethodArgumentNotValidException` | 400 |
| la **nostra** eccezione di dominio | `ErrorResponseException` (sua sottoclasse) | lo status che porta dentro |

Senza `extends` dovremmo scrivere un `@ExceptionHandler` per ognuna di queste righe.

Ogni metodo ereditato è `protected` e si può **sovrascrivere** (`@Override`) per cambiarne il
comportamento. Noi ne cambiamo uno solo e ne aggiungiamo uno:

- `@Override handleMethodArgumentNotValid` (validazione fallita): il metodo originale risponde
  solo `"detail": "Invalid request content."`; il nostro aggiunge
  `"errors": {"username": "must not be blank", ...}`, così il frontend sa quale campo evidenziare.
- `@ExceptionHandler(Exception.class) handleUnexpected`: per le eccezioni che **nessun** altro
  metodo gestisce (un `NullPointerException`, un errore SQL). È per forza un bug: viene scritto
  nel log con lo stack trace (`log.error`) e al client arriva un 500 generico, **senza** il
  messaggio dell'eccezione, che potrebbe contenere dettagli interni (SQL, nomi di classi). Essendo
  il tipo più generico, Spring lo usa solo se nessun altro handler corrisponde.

`@Slf4j` (Lombok) crea il campo `log`.

### Perché non c'è un `buildErrorResponse` come in FinanceWebApp

La differenza sta in **chi decide status e messaggio dell'errore**.

**FinanceWebApp**: l'eccezione contiene solo un testo. Status e titolo li decide l'handler.

```java
// l'eccezione: solo il messaggio
public class TagNotFoundException extends RuntimeException {
  public TagNotFoundException(String message) { super(message); }
}

// l'handler: un metodo per eccezione, che sceglie 404 e "Tag Not Found"
@ExceptionHandler(TagNotFoundException.class)
public ResponseEntity<ProblemDetail> handleTagNotFound(TagNotFoundException ex, HttpServletRequest req) {
  return buildErrorResponse(ex, HttpStatus.NOT_FOUND, "Tag Not Found", req);
}

// il "costruttore" del JSON, condiviso dai 13 metodi
private ResponseEntity<ProblemDetail> buildErrorResponse(Exception ex, HttpStatus status, String title, ...) {
  ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, ex.getMessage());
  pd.setTitle(title);
  ...
  return ResponseEntity.status(status).body(pd);
}
```

Ogni handler ha le stesse 5 righe per costruire il `ProblemDetail` cambiando solo status e
titolo: `buildErrorResponse` serve a non ripeterle.

**Qui**: l'eccezione nasce **già con il `ProblemDetail` completo**.

```java
public class GameNotFoundException extends ErrorResponseException {
  public GameNotFoundException(String publicId) {
    super(HttpStatus.NOT_FOUND,                                   // status
        ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,     // il JSON, già pronto
            "Game '" + publicId + "' not found"),
        null);
  }
}
```

Il metodo ereditato da `ResponseEntityExceptionHandler` per `ErrorResponseException` fa in pratica
`return ResponseEntity.status(ex.getStatusCode()).body(ex.getBody())`: prende il `ProblemDetail`
che l'eccezione ha già e lo restituisce. Non c'è un metodo per eccezione, quindi non c'è codice
ripetuto da raccogliere in un helper: il lavoro che in FinanceWebApp fa `buildErrorResponse`, qui
lo fa il costruttore dell'eccezione.

| | FinanceWebApp | Qui |
|---|---|---|
| Status e messaggio decisi da | l'handler | l'eccezione |
| Nuova eccezione = | classe + metodo nell'handler | solo la classe |
| `ProblemDetail` costruito da | `buildErrorResponse` | il costruttore dell'eccezione |

FinanceWebApp aggiunge anche `instance` (URL) e `timestamp` a ogni errore: se servissero, il posto
giusto sarebbe sovrascrivere **un solo** metodo della classe base, `handleExceptionInternal`, da
cui passano tutte le risposte d'errore ereditate.

### Eccezioni di dominio

Il service lancia eccezioni che **portano con sé lo status HTTP**, estendendo
`ErrorResponseException` di Spring:

```java
public class GameNotFoundException extends ErrorResponseException {
  public GameNotFoundException(String publicId) {
    super(HttpStatus.NOT_FOUND,
        ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Game '" + publicId + "' not found"),
        null);
  }
}
```

Nessun `@ExceptionHandler` da aggiungere: `ResponseEntityExceptionHandler` le gestisce già tutte.
**Differenza con FinanceWebApp**: lì ogni eccezione estende `RuntimeException` e ha il suo metodo
nel `GlobalExceptionHandler` (13 eccezioni → 13 metodi quasi uguali). Qui lo status sta
nell'eccezione e il gestore è uno solo. Il prezzo: le eccezioni conoscono un concetto HTTP (lo
status); in un'app che espone solo REST è un compromesso comune.

Le eccezioni di dominio stanno nel package `exceptions/` (vedi il suo README).

### Test

`src/test/java/dev/busato/lupus/controller/GlobalExceptionHandlerTest.java` usa **MockMvc
standalone** (`MockMvcBuilders.standaloneSetup`): niente contesto Spring e niente database, solo un
controller finto definito nel test e il gestore (`setControllerAdvice`). MockMvc simula le
richieste HTTP senza avviare Tomcat; `jsonPath("$.detail")` legge un campo del JSON di risposta.

## Classi

- `RoleController` — `GET /api/rules/roles`: ruoli giocabili raggruppati per tipo.
- `AuthController` — `POST /signup`, `POST /login` (201/204, sessione creata a mano), `GET /api/session`.
  Il logout non ha un metodo: `POST /logout` lo gestisce il `LogoutFilter` di Spring Security.
- `GlobalExceptionHandler` — ogni eccezione → `ProblemDetail` (vedi sopra).

### Errori di sicurezza: perché passano dal `GlobalExceptionHandler`

I filtri di Spring Security (CSRF, utente non loggato, permessi) lanciano le loro eccezioni
**fuori** dal controller, quindi `@ExceptionHandler` non le vedrebbe. `SecurityConfig` le
inoltra al `handlerExceptionResolver` di Spring MVC, lo stesso che usa il controller, e così
arrivano ai due metodi aggiunti in `GlobalExceptionHandler`:

- `handleAuthentication(AuthenticationException)`: 401. "Wrong credentials" per il login
  sbagliato (`BadCredentialsException`), "Authentication required" nel resto.
- `handleAccessDenied(AccessDeniedException)`: 403. "Invalid or missing CSRF token" per
  `CsrfException` (che è una sottoclasse di `AccessDeniedException`), "Access denied" nel resto.

Il risultato: anche un 401 o un 403 del filtro ha lo stesso JSON `ProblemDetail` di tutti gli altri
errori, costruito in un solo punto. Dettagli in `security/README.md`.

## Come funziona `POST /login`

```java
@PostMapping("/login")
public ResponseEntity<Void> login(
    @Valid @RequestBody LoginRequest body, HttpServletRequest request, HttpServletResponse response) {
  startSession(body.user(), body.password(), body.keepLogged(), request, response);
  return ResponseEntity.noContent().build();
}
```

**I parametri**:
- `@RequestBody LoginRequest body`: Jackson converte il JSON
  `{"user":"nick","password":"...","keepLogged":true}` nel record.
- `@Valid` controlla `@NotBlank` su `user` e `password` **prima** di eseguire il metodo.
- `HttpServletRequest` / `HttpServletResponse`: Spring passa la richiesta e la risposta "grezze".
  Servono a `startSession` per leggere e creare la sessione e per aggiungere i cookie.

**Il metodo** non restituisce dati: il risultato del login è nei **cookie**, messi da
`startSession` nella risposta.
1. Controlla le credenziali. Se sono sbagliate lancia un'eccezione e il metodo si ferma.
2. Crea una sessione nuova.
3. Ci salva dentro l'utente.
4. Con `keepLogged`, aggiunge il cookie `remember-me`.

**Le risposte possibili**:

| Caso | Status | Chi lo produce |
|---|---|---|
| login riuscito | **204 No Content**, cookie `JSESSIONID` (+ `remember-me` se `keepLogged`) | `ResponseEntity.noContent()` |
| `user` o `password` vuoti | 400, `errors` per campo | `@Valid` → `handleMethodArgumentNotValid` |
| credenziali sbagliate, utente inesistente o cancellato | 401 "Wrong credentials" | `BadCredentialsException` → `handleAuthentication` |
| header `X-XSRF-TOKEN` mancante o sbagliato | 403 | `CsrfFilter`, **prima** di arrivare al controller |
| JSON malformato | 400 | `HttpMessageNotReadableException`, gestita da `ResponseEntityExceptionHandler` |

**Perché 204 e non 200**: 204 vuol dire "riuscito, e non c'è un body". Il login non deve
restituire dati: il frontend, se gli servono, chiama `GET /api/session`. Il signup risponde invece
**201 Created**, perché crea una risorsa nuova (il giocatore).

## `UserController` (`/user/**`)

| Metodo e URL | Body | Risposta | Errori |
|---|---|---|---|
| `GET /user/me` | — | 200 `ProfileResponse` con email | 401 |
| `PUT /user/me` | `{currentPassword, username?, email?, password?}` | 200 profilo aggiornato | 400, 403 password sbagliata, 409 username/email usati |
| `DELETE /user/me` | `{currentPassword}` | 204, sessione e remember-me chiusi | 403 |
| `GET /user/{username}` | — | 200 profilo **senza email** | 404 |
| `GET /user/search/{text}` | — | 200 `[PlayerSearchResponse]` | 400 se meno di 2 caratteri |
| `GET /user/me/friend` | — | 200 `[FriendResponse]` | |
| `POST /user/me/friend` | `{username}` | 201 `FriendResponse` | 400 te stesso, 404, 409 già amico |
| `DELETE /user/me/friend` | `{username}` | 204 | 404 non è un amico |

- **`/user/me` e `/user/{username}` non si scontrano**: Spring sceglie il pattern più specifico,
  e un segmento fisso (`me`) batte una variabile. Uno username `me` non può esistere (minimo 3 caratteri).
- **`@AuthenticationPrincipal PlayerPrincipal me`**: Spring passa il principal della sessione;
  il controller usa solo `me.id()` e lascia tutto il resto al service.
- **DELETE con body**: Spring lo legge con `@RequestBody` come per POST. Lo standard HTTP non dà
  un significato al body di una DELETE e qualche proxy potrebbe scartarlo; lo teniamo perché è
  l'API vecchia e tra frontend e backend non ci sono proxy che lo tolgono.
- **Perché non c'è più `/api/habitant/{username}`**: la usava solo la pagina delle statistiche
  (`/habitant/:username`) per sapere se l'utente esiste (404 → pagina non trovata) e per avere lo
  username scritto come è salvato (`/habitant/nick` → `/habitant/Nick`). `GET /user/{username}`
  restituisce le stesse informazioni, quindi il frontend userà quello.

### Come funziona `PUT /user/me`

```java
ProfileResponse profile = userService.update(me.id(), body);
if (body.username() != null || body.password() != null)
  sessionAuthenticator.refresh(profile.username(), request, response);
return ResponseEntity.ok(profile);
```

1. `userService.update` cambia i dati nel **database** e restituisce il profilo nuovo. La
   transazione si chiude qui: quando il metodo torna, le modifiche sono salvate.
2. Il database è aggiornato, ma due copie dei dati vecchi restano **fuori**:
   - il `PlayerPrincipal` nella sessione (RAM del server) ha ancora lo username vecchio;
   - il cookie `remember-me` nel browser è firmato con lo username e l'hash della password vecchi.
3. `refresh` sistema entrambe: crea un principal nuovo e lo salva in sessione, e se il browser
   aveva il cookie `remember-me` ne scrive uno nuovo nella risposta. Per questo servono `request` e
   `response`.

Senza `refresh`:
- **il remember-me non funziona più**: alla prossima apertura del browser, Spring legge il cookie,
  ricalcola la firma con i dati attuali, non coincide e lo cancella. Chi aveva scelto "resta
  loggato" si ritrova sloggato. Con lo username cambiato non trova nemmeno l'utente;
- **i log mostrano lo username vecchio** (`LogContextFilter` lo prende dal principal);
- qualunque codice futuro che usasse `me.username()` leggerebbe quello vecchio.

`/api/session` invece sarebbe già corretto, perché rilegge dal database usando `me.id()`, che non cambia.

Solo username e password richiedono il `refresh`: sono gli unici dati che stanno nel principal e
nella firma del cookie. Il cambio della sola email non tocca né l'uno né l'altra.
