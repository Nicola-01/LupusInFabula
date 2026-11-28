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

## Classi

- `PlayerRepository` — tabella `player`, chiave `UUID id`.
- `FriendshipRepository` — tabella `friendship`.
- `GameRepository` — tabella `game`.
- `GamePlayerRepository` — tabella `game_player`.
- `GameActionRepository` — tabella `game_action`.

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
