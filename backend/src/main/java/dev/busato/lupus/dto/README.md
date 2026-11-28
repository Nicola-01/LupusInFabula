# `dto/` — Data Transfer Object (il JSON dell'API)

Un DTO descrive **una forma di JSON** che entra o esce dall'API. È il contratto con il frontend:
le entity possono cambiare, i DTO restano stabili.

Convenzione dei nomi:
- `XxxRequest` — body in ingresso (`@RequestBody` nel controller), con le regole di validazione;
- `XxxResponse` — risposta in uscita.

Un DTO per ogni forma: per esempio `RoleResponse` è **un** ruolo, `RolesByTypeResponse` è la
busta `{"roles": {...}}` di `GET /api/rules/roles`. Una `Map.of("roles", ...)` funzionerebbe
uguale, ma non ha nome né tipo: il record rende il contratto esplicito.

## Perché un DTO se `Role` è già un enum? (`Role` vs `RoleResponse`)

`Role` è un `enum` Java, non una entity: non ha tabella, non ha lazy loading, non ha cicli. Il DTO
resta comunque, per tre motivi:
- il JSON è un **contratto**: `RoleResponse` ha esattamente i campi che il frontend legge
  (`name`, `type`, `withWhoWins`, `maxNumber`, `description`), e se domani il tipo del campo
  `Role` cambia (un campo in più, un nome diverso) il JSON resta quello;
- l'enum sa cose che non vanno nel JSON (ad esempio i campi interni per la logica di gioco): il
  DTO scrive solo quelli pubblici;
- è la stessa forma di tutti gli altri endpoint: un controller restituisce sempre DTO.

Le entity (`Game`, `Player`...) invece hanno tabella, relazioni e campi che non vanno esposti: lì
la separazione è obbligatoria. Il DTO risponde a un'altra domanda rispetto all'entity: l'entity è
**com'è fatto il dato**, il DTO è **cosa promettiamo al frontend**. Appena l'entity cresce
divergono (in FinanceWebApp `Tag` ha `id`, `wallet`, `parent`, `placeholder`; `TagResponse` ha solo
`parentName` e i campi visibili).

Restituire l'entity direttamente dal controller rischia:
- **dati esposti per sbaglio**: aggiungi `password` a `Player` e finisce in ogni JSON;
- **lazy loading**: Jackson chiama tutti i getter, anche `getGame()`, fuori dalla transazione →
  errore (o query nascoste);
- **cicli infiniti**: `Game → players → Player → game → ...`;
- **API legata al database**: rinomini una colonna e il frontend si rompe.

Regola uniforme: **dal service escono solo DTO**. Costo: un record e un mapper di poche righe
(se diventano tanti, MapStruct li genera da un'interfaccia).

## Bean?

**No.** Sono dati: li crea Jackson (dal JSON della richiesta) o il mapper (per la risposta).

## Perché `record`

I DTO non cambiano dopo la creazione: un `record` Java dà costruttore, accessor (`name()`),
`equals`, `hashCode`, `toString` senza Lombok. Jackson li sa leggere e scrivere.

## Annotazioni

| Annotazione | Significato |
|---|---|
| `@JsonProperty("with_who_wins")` | (Jackson) nome del campo nel JSON diverso da quello Java |
| `@JsonIgnore` | campo escluso dal JSON |
| `@NotNull`, `@NotBlank`, `@Size(min, max)`, `@Email`, `@Min`, `@Max` | (Bean Validation) regole controllate da `@Valid` nel controller; se violate → 400 senza che il service venga chiamato |

### `@JsonProperty`, nel dettaglio

> Non lo usiamo più: l'API nuova usa i nomi Java (`withWhoWins`, `maxNumber`) e il frontend verrà
> adattato. La spiegazione resta perché serve quando un nome JSON è imposto dall'esterno.

Jackson (la libreria che Spring usa per Java ⇄ JSON) di default usa il **nome Java** del campo:
`int withWhoWins` → `"withWhoWins"`. Il frontend però legge `with_who_wins` (snake_case, il nome
della vecchia colonna). Con `@JsonProperty("with_who_wins")` il campo Java resta in camelCase,
come vuole la convenzione Java, e nel JSON si chiama come vuole il frontend.

- Vale nei **due sensi**: in uscita Jackson scrive `with_who_wins`; in un DTO di richiesta legge
  `with_who_wins` dal body e lo mette in `withWhoWins`.
- Alternativa globale: `spring.jackson.property-naming-strategy=SNAKE_CASE` in
  `application.properties` rinomina **tutti** i campi di tutta l'API. Non la usiamo perché il
  frontend mescola le due convenzioni nei vari endpoint: meglio decidere campo per campo.
- Riguarda **solo il JSON**. Il nome della colonna nel database lo decide JPA nell'entity
  (`withWhoWins` → `with_who_wins` in automatico, o `@Column(name = "...")`).

### Validazione: come funziona

La dipendenza `spring-boot-starter-validation` porta **Bean Validation** (standard Jakarta,
implementato da Hibernate Validator). Le annotazioni sui campi descrivono le regole; il controllo
parte solo dove c'è `@Valid` (`@Valid @RequestBody SignupRequest request`). Se una regola è violata
Spring lancia `MethodArgumentNotValidException` **prima** di chiamare il metodo del controller, e
`GlobalExceptionHandler` risponde 400 con `"errors": {campo: messaggio}`. Il messaggio si può
personalizzare: `@NotBlank(message = "Username is required")`.

#### Da dove arriva il messaggio "must not be blank"?

Non lo scriviamo noi: ogni annotazione ha un messaggio di default, contenuto nel jar di
Hibernate Validator (`org/hibernate/validator/ValidationMessages.properties`):

```properties
jakarta.validation.constraints.NotBlank.message = must not be blank
jakarta.validation.constraints.Size.message     = size must be between {min} and {max}
jakarta.validation.constraints.Email.message    = must be a well-formed email address
```

`{min}` e `{max}` vengono sostituiti con i valori dell'annotazione (`@Size(min = 3, max = 20)`).
Il jar contiene anche le traduzioni (`ValidationMessages_it.properties`: "non deve essere
spazio"), e Spring sceglie la lingua in base all'header `Accept-Language` della richiesta: lo
stesso errore può uscire in inglese o in italiano a seconda del browser.

Per avere un testo fisso: `@NotBlank(message = "Username is required")`. Per cambiarli tutti:
un file `src/main/resources/ValidationMessages.properties` con le stesse chiavi.

Validazione nel DTO = regole sul **formato** (vuoto, lunghezza, email). Le regole che servono il
database ("username già usato") restano nel service.

### Perché nei DTO e non nelle entity (`model/`)?

Le due cose controllano momenti diversi:

| | Validazione nel DTO (`@NotBlank` + `@Valid`) | Vincoli nell'entity (`@Column(nullable = false, length = 20)`) |
|---|---|---|
| Quando | all'**ingresso** della richiesta, prima del controller | al **salvataggio** nel database |
| Chi controlla | Bean Validation, nel controller | il database (vincoli creati da Hibernate) |
| Se fallisce | 400 con `errors` per campo: errore dell'utente | eccezione SQL → 500: è un bug nostro |

- **Ogni richiesta ha regole sue**, mentre l'entity è una sola. Lo stesso `Player` arriva da
  `SignupRequest` (password obbligatoria, min 8 caratteri), da `UpdateUsernameRequest` (solo lo
  username) e da `LoginRequest` (nessun limite di lunghezza: chi sbaglia la password non deve
  sapere le regole). Con le regole sull'entity varrebbero tutte sempre.
- **Il DTO contiene campi che l'entity non ha**: la password in chiaro e la sua conferma, che
  non vengono mai salvate (nell'entity c'è solo l'hash). Non c'è un campo dell'entity su cui mettere
  `@Size(min = 8)`.
- **Prima si ferma, meno lavoro**: con il DTO l'errore si ferma alla porta, senza entrare nel
  service e senza aprire transazioni.

I vincoli dell'entity restano comunque: sono **l'ultima difesa** che garantisce dati corretti nel
database anche se un service ha un bug. Bean Validation funzionerebbe anche sull'entity
(Hibernate la esegue prima del salvataggio), ma l'errore arriverebbe tardi e come 500.

Esempio di richiesta (la versione reale è in `SignupRequest`):

```java
public record SignupRequest(
    @NotBlank @Size(max = 20) String username,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password) {}
```

### Regole con `@Pattern` e messaggio proprio

Per username e password le regole sono espressioni regolari (`@Pattern`), con un messaggio scritto
per l'utente invece di quello di default:

```java
@Pattern(regexp = PASSWORD, message = "8-20 characters with upper case, lower case, a digit and a symbol")
```

Le costanti `USERNAME` e `PASSWORD` stanno **dentro** il record (`static final`), vicino alla regola
che descrivono. Il controllo sulla password usa lookahead (`(?=.*\\d)` = "contiene almeno una
cifra"): ogni gruppo è una condizione indipendente, e l'ultima parte limita lunghezza e spazi.

### Username riservato: `search`

All'inizio di `USERNAME` c'è `(?!(?i:search)$)`: un *lookahead negativo* ("qui non deve esserci...")
con `(?i:...)`, che ignora le maiuscole solo per quel pezzo. Rifiuta lo username `search` in ogni
forma (`Search`, `SEARCH`). Il motivo: `GET /user/search/{text}` ha la precedenza su
`/user/{username}/...`, quindi le pagine di un utente chiamato `search` (es. `/user/search/deck`)
non sarebbero raggiungibili. Vale anche per `PUT /user/me`, che usa la stessa costante.

### Niente `passwordRepeat`

Il frontend chiede due volte la password per evitare errori di battitura, ma il confronto è un
controllo **dell'interfaccia**: il server riceve solo la password una volta. Un campo
`passwordRepeat` nel DTO lo dovrebbe controllare il backend senza un motivo di sicurezza, e
verrebbe inviato in chiaro in più. Il frontend confronta i due campi prima di inviare.

## Classi (nuovi)

- `SignupRequest` — `POST /signup`: username, email, password, con le regole sopra.
- `LoginRequest` — `POST /login`: `user` (username **o** email), `password`, `keepLogged` (resta
  loggato 30 giorni con il cookie remember-me). Nessuna regola di formato: chi sbaglia la password
  non deve sapere quali regole valgono.
- `PlayerResponse` — `username`, `email` di un utente.
- `SessionResponse` — `GET /api/session`: `user` (un `PlayerResponse`) e `gamemaster` (publicId
  della partita di cui è master, oppure `null`; il JSON include il campo anche quando è `null`,
  perché Spring Boot non esclude i null di default).
- `ProfileResponse` — `username`, `email`, `registeredOn`. Su `email` c'è
  `@JsonInclude(JsonInclude.Include.NON_NULL)`: quando è `null` (profilo di un altro utente) il
  campo **non compare** nel JSON, invece di valere `null`. A differenza di `gamemaster`, qui
  l'assenza è il messaggio: "questo dato non è per te".
- `UpdateProfileRequest` — `PUT /user/me`: `currentPassword` obbligatoria, `username`, `email`,
  `password` facoltativi (`null` = non cambia). Le regole sono quelle di `SignupRequest`
  (`@Pattern(regexp = SignupRequest.USERNAME)`): `@Pattern` ed `@Email` considerano valido un
  `null`, quindi un campo omesso passa e uno presente deve essere corretto.
- `DeleteAccountRequest` — `DELETE /user/me`: `currentPassword`.
- `FriendRequest` — `POST` e `DELETE /user/me/friend`: `username`.
- `FriendResponse` — `username`, `commonGames` (partite giocate insieme), `since`. `commonGames` è
  `Long` e non `long` perché il record è creato dalla query JPQL (`SELECT new ...`) e `count`
  restituisce `Long`: il costruttore deve avere lo stesso tipo.
- `PlayerSearchResponse` — `username`, `currentGame` (publicId della partita in corso, o `null`).
- `DeckRequest` — `POST` e `PUT /user/me/deck`: `name`, `players`, `roles` (`Map<Role, Integer>`
  con `@Min(1)` su ogni valore). Un ruolo con 0 carte non si salva: basta toglierlo dalla mappa.
  Le regole di sostanza (carte ≥ giocatori, equilibrio, nome libero) stanno nel service, come per
  `CreateGameRequest`.
- `DeckResponse` — `id`, `name`, `players`, `roles`. Stessa forma di `DeckRequest` più l'`id`: il
  frontend può rimandare la risposta in `PUT` senza trasformarla.

## Classi

- `RoleResponse` — un ruolo (`name` è la costante dell'enum, es. `"WOLF"`; `type`, `withWhoWins`, `maxNumber`, `description`).
- `RolesByTypeResponse` — `{"roles": {"GOOD": [...], "EVIL": [...], "VICTORY_STEALER": [...], "NEUTRAL": [...]}}`.
  Una `Map<RoleType, ...>` diventa un oggetto JSON con i nomi delle costanti come chiavi; è un
  `EnumMap`, quindi le chiavi escono nell'ordine dell'enum.
- `CreateGameRequest` — `POST /game/create`: `players` (in ordine di posto), `roles` (`Map<Role, Integer>`)
  e `settings` (facoltativo). Le annotazioni sul tipo dentro i generici validano ogni valore della
  mappa: `Map<Role, @NotNull @Min(0) Integer>` rifiuta un numero negativo o `null` per ogni ruolo.
  Un nome di ruolo sconosciuto (`"DRAGON"`) fa fallire la lettura del JSON, quindi arriva 400 prima
  di qualunque controllo del service.
- `CreateGameResponse` — `{publicId}`: la risposta di `POST /game/create`, con lo stesso valore
  nell'header `Location`.
- `SettingResponse` — `{name, description}` di una impostazione, per `GET /game/settings`.
- `GameSummaryResponse` — `{publicId, startedAt, endedAt, winner, master}`: l'ultima partita in
  `GET /game/list`. `master` dice se il chiamante è il master.
- `VillageResponse` — `GET /api/village/{publicId}`: `{publicId, isMaster, winner, settings}`. La
  chiave JSON è proprio `isMaster` (non `master`), perché il frontend la legge con quel nome.
