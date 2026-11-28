# `repository/` — accesso al database

Un'interfaccia per ogni entity. **Non si scrive l'implementazione**: Spring Data JPA la genera
all'avvio e la registra come bean.

## Bean

Ogni interfaccia `extends JpaRepository<Entity, TipoId>` diventa un bean (l'annotazione
`@Repository` è facoltativa per le interfacce Spring Data, la mettiamo per chiarezza). Viene
iniettata nei service. Sotto usa i bean creati dall'auto-configurazione di Spring Boot:
`DataSource` (pool di connessioni HikariCP), `EntityManager` (Hibernate), `TransactionManager`.

## Cosa vogliono dire i due tipi: `JpaRepository<Game, UUID>`

`JpaRepository` è un'interfaccia **generica**: i due parametri dicono a Spring per cosa generare
il codice.

1. **`Game`**: l'entity gestita. Decide la tabella (`game`) e il tipo restituito:
   `findAll()` → `List<Game>`, `save(game)` → `Game`.
2. **`UUID`**: il tipo della **chiave primaria**, cioè del campo `@Id` di `Game`
   (`private UUID id`). Decide il tipo dei parametri che usano l'id:
   `findById(UUID id)`, `existsById(UUID id)`, `deleteById(UUID id)`.

Il secondo tipo **deve coincidere** con quello del campo `@Id`: se l'id fosse `Long`,
scriveresti `JpaRepository<Game, Long>`. Il compilatore non collega i due tipi: con un tipo
sbagliato il codice compila, e l'errore arriva da Hibernate quando usi l'id (es. `findById`).

L'id è `UUID` (v7, vedi README di `model/`) e non un numero progressivo. Non è un caso di
`Game`: tutte le nostre entity usano `UUID`, quindi tutti i repository hanno `UUID` come secondo
parametro. Il codice pubblico della partita negli URL (`publicId`) è un campo normale, non la
chiave primaria: per cercarlo serve un metodo apposta, per esempio `findByPublicId(String)`.

## Cosa ottieni gratis da `JpaRepository`

`findAll()`, `findById(id)` (→ `Optional`), `save(entity)` (INSERT se nuova, UPDATE se esiste),
`saveAll`, `delete`, `deleteById`, `existsById`, `count()`, paginazione e ordinamento.

## Query dal nome del metodo

Spring legge il nome e genera la query:

```java
Optional<Player> findByUsernameIgnoreCaseAndDeletedAtIsNull(String username);
// SELECT p FROM Player p WHERE lower(p.username) = lower(?1) AND p.deletedAt IS NULL
// (IgnoreCase ignora maiuscole; IsNull non vuole nessun parametro)

boolean existsByEmail(String email);
```

Parole chiave: `findBy`, `existsBy`, `countBy`, `deleteBy`, `And`, `Or`, `GreaterThan`,
`Between`, `Like`, `IgnoreCase`, `IsNull`, `In`, `OrderBy...Asc/Desc`. Un nome sbagliato (campo
inesistente) fa fallire l'**avvio**, non la richiesta: errore scoperto subito.

## Query scritte a mano

Quando il nome diventa illeggibile o serve una JOIN:

```java
@Query("SELECT gp FROM GamePlayer gp JOIN FETCH gp.player WHERE gp.game.id = :gameId")
List<GamePlayer> findPlayersOfGame(UUID gameId);

@Modifying
@Query("UPDATE Game g SET g.phase = :phase WHERE g.id = :id")
int updatePhase(UUID id, GamePhase phase);
```

`@Query` usa **JPQL** (nomi di classi e campi Java, non di tabelle e colonne).
`@Modifying` per UPDATE/DELETE. `JOIN FETCH` / `@EntityGraph` caricano le relazioni in una sola
query, evitando il problema "N+1" (una query per ogni elemento di una lista).

Le transazioni **non** si dichiarano qui ma nel service.

## Filtrare nel repository o nel service?

Esempio: il soft delete (`deletedAt != null` = account cancellato).

```java
playerRepository.findById(id).filter(p -> p.getDeletedAt() == null)   // filtro in Java
Optional<Player> findByIdAndDeletedAtIsNull(UUID id);                 // filtro nella WHERE
```

- **Velocità**: per una riga cercata per chiave primaria è uguale. Per una **lista** il filtro in
  SQL vince: il database non manda righe da scartare.
- **Chiarezza**: un concetto che si ripete ("giocatore attivo") va nel repository. Il nome del
  metodo dice cosa fa, e chi lo usa non può dimenticarsi il filtro.
- **Trappola `And`/`Or`**: nel nome del metodo `And` ha la precedenza su `Or` e non si possono
  mettere parentesi. `findByUsernameOrEmailAndDeletedAtIsNull` diventa
  `username = ? OR (email = ? AND deleted_at IS NULL)`, quindi un cancellato entra con lo username.
  In questi casi si scrive la query con `@Query`, mettendo le parentesi a mano.
- **Perché non `@SoftDelete` / `@SQLRestriction` di Hibernate**: aggiungono il filtro a **tutte**
  le query dell'entity, anche alle relazioni. Le partite di un account cancellato restano, e
  `GamePlayer.player` deve ancora trovare quel `Player`. Il filtro va solo dove serve (login,
  ricerca, profilo), quindi con query esplicite.

## Test dei repository

`@DataJpaTest` (in `repository/GameRepositoryTest`) avvia **solo** i bean JPA: DataSource,
Hibernate, repository e `TestEntityManager`. Niente controller, service o web: il test è veloce
e si concentra sulle query e sui vincoli del database.

- Ogni test gira in una **transazione** che alla fine viene annullata (rollback): i dati di un
  test non restano nel database e il test successivo parte pulito. Per questo usernames ed email
  devono essere unici dentro ogni test, ma possono ripetersi tra test diversi.
- `@AutoConfigureTestDatabase(replace = Replace.NONE)`: di default Spring sostituisce il database
  con uno in memoria (H2). Con `NONE` usa il PostgreSQL vero (`compose.yaml`), così i vincoli,
  i tipi e le query sono quelli di produzione. Il costo è che il database deve essere acceso.
- `flush()` manda al database le modifiche in sospeso (Hibernate le raccoglie e le invia solo
  quando serve); `clear()` svuota la cache di primo livello. Insieme, forzano il test a rileggere
  dal database invece che dalla memoria: senza `clear()` `findById` restituirebbe l'oggetto già in
  cache e il test non verificherebbe niente.
- Un vincolo violato (`saveAndFlush` con un duplicato) lancia `DataIntegrityViolationException`:
  Spring traduce l'errore SQL in un'eccezione della propria gerarchia, indipendente dal database.

## Query delle partite (`GameRepository`)

| Metodo | Query equivalente | Usato da |
|---|---|---|
| `existsOpenGameOf(UUID)` | `SELECT count(g) > 0 FROM Game g WHERE g.endedAt IS NULL AND (g.master.id = ?1 OR EXISTS (...))` | creazione partita (409), cancellazione account (409) |
| `findLatestOf(UUID, Limit)` | `WHERE g.master.id = ?1 OR EXISTS (...) ORDER BY g.startedAt DESC`, con `LIMIT` | `GameService.latest` (`GET /game/list`) |
| `existsByPublicId(String)` | `SELECT ... WHERE public_id = ?` (restituisce `true`/`false`) | `GameService.create`, per trovare un `publicId` libero |
| `findByPublicId(String)` | `WHERE public_id = ?` → `Optional<Game>` | `GameService.village` (`/api/village/{publicId}`) |

- **`existsOpenGameOf`** è vera se il giocatore è master **o** giocatore di una partita con
  `endedAt IS NULL`. Usa `count(g) > 0` invece di restituire la partita: serve solo il sì/no, e
  il database non deve costruire nessuna riga.
- **`EXISTS (SELECT ...)`** è vero se la sottoquery trova **almeno una riga**. Il database si ferma
  alla prima riga trovata, quindi il costo non dipende da quante partite ha giocato il giocatore.
  Nel caso di `existsOpenGameOf` la sottoquery cerca in `GamePlayer` le righe del giocatore nella
  partita corrente della query esterna (`gp.game = g`).
- **`findLatestOf`** ordina per `startedAt DESC` e riceve `Limit.of(1)`: la query restituisce al più
  una partita. Con UUID v7 anche l'`id` cresce nel tempo (sono in ordine di creazione), ma
  `startedAt` lo dice in modo esplicito e non dipende dal formato dell'id.

## Query dei mazzi (`DeckRepository`)

| Metodo | Cosa fa | Usato da |
|---|---|---|
| `findByOwnerIdOrderByNameAsc(UUID)` | mazzi di un utente, in ordine di nome | `GET /user/me/deck` e `GET /user/{username}/deck` |
| `findByIdAndOwnerId(UUID, UUID)` | un mazzo, **solo se** è dell'utente | modifica e cancellazione di `/user/me/deck/{deckId}` |
| `existsByOwnerIdAndNameIgnoreCase(UUID, String)` | nome già usato dallo stesso utente | `DeckService` al salvataggio (409) |
| `existsByOwnerIdAndNameIgnoreCaseAndIdNot(UUID, String, UUID)` | come sopra, escluso il mazzo stesso | `DeckService` in rinomina (`PUT`) |
| `deleteByOwnerId(UUID)` | cancella tutti i mazzi di un utente | `UserService.delete` |

- **`findByIdAndOwnerId` è il controllo di proprietà**: un solo filtro nella `WHERE`. Se il mazzo
  esiste ma è di un altro utente, non lo trova e il service lancia `DeckNotFoundException` → 404.
  Non 403: un 403 rivelerebbe che quell'id esiste.
- **`...AndIdNot`**: stesso ragionamento di `existsByUsernameIgnoreCaseAndIdNot`. Rinominare un
  mazzo cambiando solo le maiuscole non deve trovare il mazzo stesso.
- **`deleteByOwnerId` è una delete derivata**: Spring carica le righe e le cancella **una per una**.
  Serve una transazione (la chiama `UserService.delete`, che è `@Transactional`). Per pochi mazzi
  va bene; con tante righe si scriverebbe una query esplicita,
  `@Modifying @Query("DELETE FROM Deck d WHERE d.owner.id = :ownerId")`, che manda una sola
  istruzione `DELETE` al database.

## Query di lettura della partita (`GameRepository`, `GamePlayerRepository`)

| Metodo | Cosa fa | Usato da |
|---|---|---|
| `GameRepository.findLive(Limit)` | partite in corso (`endedAt` nullo), dalla più recente, con `JOIN FETCH g.master` | `GET /game/live` |
| `GamePlayerRepository.findSeats(Game)` | i posti della partita, con `JOIN FETCH gp.player` | `GET /game/players/{publicId}` |

- **`JOIN FETCH g.master`** carica il master nella stessa query. Il master è un `@ManyToOne`: una
  sola riga per partita, quindi non moltiplica le righe. È sicuro anche con `LIMIT`: il limite
  continua a contare partite.
- **`JOIN FETCH gp.player`** serve per lo username di ogni posto. Senza, Hibernate farebbe una
  query per posto per caricare il `Player`: il problema N+1 (1 query + N query).

### Perché niente `JOIN FETCH` su una collezione con `LIMIT`

`settings` e `players` sono collezioni: una riga per elemento. Con `JOIN FETCH` su una di queste,
ogni partita diventa più righe (5 giocatori = 5 righe). Il `LIMIT 50` del database conta **righe**,
non partite: 50 righe possono essere 10 partite, e la bacheca ne mostrerebbe 10 invece di 50.
Hibernate non sa tagliare per partite con SQL, quindi caricherebbe tutte le righe e taglierebbe in
memoria, avvisando con `HHH90003004` ("firstResult/maxResults specified with collection fetch;
applying in memory"). Per questo le collezioni non si caricano in questa query ma dopo, con
`@BatchSize` (vedi `model/README.md`).

## Classi

- `PlayerRepository` — tabella `player`, chiave `UUID id`.
- `FriendshipRepository` — tabella `friendship`.
- `GameRepository` — tabella `game`.
- `GamePlayerRepository` — tabella `game_player`.
- `GameActionRepository` — tabella `game_action`.
- `DeckRepository` — tabella `deck`, mazzi salvati (vedi "Query dei mazzi").

### Query aggiunte con l'autenticazione

| Metodo | Query equivalente (JPQL semplificata) | Usato da |
|---|---|---|
| `PlayerRepository.existsByUsernameIgnoreCase(String)` | `lower(username) = lower(?)`, restituisce `true`/`false` | `AuthService.signup` (409 prima del `save`) |
| `PlayerRepository.existsByEmail(String)` | `WHERE email = ?` (esatta, usa l'indice `UNIQUE`) | `AuthService.signup` |
| `PlayerRepository.findByIdAndDeletedAtIsNull(UUID)` | `WHERE id = ?1 AND deleted_at IS NULL` | `AuthService.session` (account cancellato = 401) |
| `PlayerRepository.findActiveByLogin(String, String)` | `@Query`: `WHERE (lower(username) = lower(?1) OR email = ?2) AND deleted_at IS NULL` | `PlayerDetailsService` (login per username **o** email, solo account attivi) |
| `GameRepository.findFirstByMasterIdAndEndedAtIsNull(UUID)` | `WHERE master_id = ? AND ended_at IS NULL ORDER BY ...` con `LIMIT 1` | `AuthService.session` (la partita di cui è master) |

Due dettagli:
- `findActiveByLogin` è scritta con `@Query` per le parentesi (vedi "Trappola `And`/`Or`") e il
  filtro `deletedAt` è nella stessa WHERE, quindi un account cancellato non si trova né per
  username né per email. Passa lo stesso valore due volte, ma il secondo è in minuscolo
  (`login, login.toLowerCase(Locale.ROOT)`): il frontend ha un solo campo "utente" che può essere
  username o email.
- Perché `existsByEmail` e non `existsByEmailIgnoreCase`: `IgnoreCase` diventa `lower(email) = lower(?)`,
  e Postgres non può usare un indice sulla colonna semplice per una funzione applicata alla colonna:
  scandisce tutta la tabella. Le email sono salvate in minuscolo dal callback `@PrePersist` di
  `Player` (vedi `model/README.md`), quindi basta un'uguaglianza esatta e il chiamante passa
  l'email già in minuscolo. Lo username resta `IgnoreCase` perché viene mostrato come digitato.
- `findFirst...` restituisce al massimo una riga. Il nome dice "il primo", ma senza un ordine è
  quello che il database trova per primo: va bene perché un master ha una sola partita aperta
  alla volta (la regola si fa rispettare nel service della creazione partita).

### Query aggiunte con profilo e amici

| Metodo | Cosa fa | Usato da |
|---|---|---|
| `PlayerRepository.existsByUsernameIgnoreCaseAndIdNot(String, UUID)` | username usato da **un altro** (anche cancellato) | `UserService.update` |
| `PlayerRepository.existsByEmailAndIdNot(String, UUID)` | email usata da un altro | `UserService.update` |
| `PlayerRepository.findByUsernameIgnoreCaseAndDeletedAtIsNull(String)` | account attivo per username | profilo, aggiunta amico |
| `PlayerRepository.search(String, UUID, Limit)` | `@Query`: ricerca per parte dello username, con la partita in corso | `UserService.search` |
| `FriendshipRepository.existsByPlayerIdAndFriendId(UUID, UUID)` | già amici? | `FriendService.add` |
| `FriendshipRepository.findByPlayerIdAndFriendUsernameIgnoreCase(UUID, String)` | l'amicizia da rimuovere; `FriendUsername` attraversa la relazione `friend.username` | `FriendService.remove` |
| `FriendshipRepository.findFriends(UUID)` | `@Query`: amici attivi con le partite in comune | `FriendService.list` |
| `GamePlayerRepository.countCommonGames(UUID, UUID)` | partite giocate da entrambi | `FriendService.add` |

- **`...AndIdNot`**: in `PUT /user/me` chi cambia solo le maiuscole (`nick` → `Nick`) troverebbe sé
  stesso con `existsByUsernameIgnoreCase`; escludendo il proprio id il controllo guarda solo gli altri.
- **La query restituisce direttamente il DTO**: `SELECT new dev.busato.lupus.dto.FriendResponse(...)`
  è una *constructor expression* JPQL. Hibernate legge solo le colonne servono e crea il record,
  senza caricare le entity. Serve il nome completo della classe, e i tipi del costruttore devono
  coincidere con quelli della query (`count` → `Long`).
- **Sottoquery nel `SELECT`** (`(SELECT count(gp1) ...)`): il conteggio delle partite in comune è
  calcolato dal database per ogni amico, in **una** query. Chiamare `countCommonGames` per ogni
  amico sarebbe il problema N+1 (1 query per la lista + 1 per amico).
- **`Limit`**: `search(text, id, Limit.of(20))` aggiunge `LIMIT 20` alla query. È il tipo di Spring
  Data per "al massimo N righe" con le `@Query`; il nome del metodo con `findFirst20By...` vale solo
  per le query derivate.
- **`LIKE ... ESCAPE '\'`**: in `LIKE` `%` e `_` sono jolly ("qualsiasi testo", "un carattere"). Lo
  username può contenere `_`, quindi `UserService.search` li fa precedere da `\` e la query dice
  che `\` è il carattere di escape: `a_b` cerca proprio `a_b`, non `axb`.
- **`max(g.publicId)`**: un giocatore dovrebbe essere in una sola partita aperta; `max` garantisce
  che la sottoquery restituisca una riga sola anche se per un bug fossero due.
