# `repository/` — accesso al database

Un'interfaccia per ogni entity. **Non si scrive l'implementazione**: Spring Data JPA la genera
all'avvio e la registra come bean.

## Bean

Ogni interfaccia `extends JpaRepository<Entity, TipoId>` diventa un bean (l'annotazione
`@Repository` è facoltativa per le interfacce Spring Data, la mettiamo per chiarezza). Viene
iniettata nei service. Sotto usa i bean creati dall'auto-configurazione di Spring Boot:
`DataSource` (pool di connessioni HikariCP), `EntityManager` (Hibernate), `TransactionManager`.

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

Per ora sono vuoti: i metodi di query arrivano con le funzionalità che li usano.
