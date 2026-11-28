# `model/` — entity JPA (le tabelle)

Ogni classe `@Entity` corrisponde a una tabella, ogni campo a una colonna. Con
`spring.jpa.hibernate.ddl-auto=update` è **Hibernate a creare le tabelle** da queste classi
all'avvio: lo schema del database nasce da qui. I ruoli del gioco non sono righe di una tabella
ma un `enum` Java (`Role`): nessun dato iniziale da caricare.

## Cos'è JPA (e Hibernate, e Spring Data)

**JPA** (Jakarta Persistence API) è lo standard Java per mappare classi su tabelle (ORM,
Object-Relational Mapping). È solo una specifica: annotazioni e interfacce.

| Strato | Cosa fa | Dove lo vedi |
|---|---|---|
| **JPA** | definisce le annotazioni che legano classe e tabella | `@Entity`, `@Id`, `@Column`, `@ManyToOne` |
| **Hibernate** | l'implementazione: esegue l'SQL, trasforma righe in oggetti, crea le tabelle (`ddl-auto`) | non lo vedi, lavora sotto |
| **Spring Data JPA** | implementa da solo le interfacce dei repository | `extends JpaRepository`, `findByType...` |

Rispetto a JDBC a mano (`PreparedStatement`, `ResultSet`, `rs.getString("name")`, chiudere le
connessioni) non scrivi più SQL ripetitivo né la copia colonna → campo; le relazioni diventano
campi Java (`player.getGame()` invece di una JOIN). Attenzione a: lazy loading fuori dalla
transazione (errore) e query N+1 (vedi `repository/README.md`).

## Cos'è Lombok

Una libreria che **genera codice ripetitivo durante la compilazione**: scrivi l'annotazione e
Lombok aggiunge i metodi nel `.class` (nel sorgente non li vedi, ma esistono).

| Annotazione | Genera |
|---|---|
| `@Getter` / `@Setter` | `getX()` / `setX()` per ogni campo |
| `@NoArgsConstructor` / `@AllArgsConstructor` | costruttore vuoto / con tutti i campi |
| `@Builder` | `Player.builder().username("wolf").email("w@x.it").build()` |
| `@RequiredArgsConstructor` | costruttore con i campi `final` (usato per la dependency injection nei bean) |
| `@Data` | getter + setter + `equals` + `hashCode` + `toString` |
| `@Slf4j` | un campo `log` per i log |

Prezzo: è "magia" a compile-time, serve l'annotation processor nel `pom.xml`
(`maven-compiler-plugin` → `annotationProcessorPaths`) e il plugin in IntelliJ. I DTO non lo
usano perché i `record` Java fanno già lo stesso per classi immutabili; le entity sì, perché JPA
le vuole modificabili e con costruttore vuoto.

## Bean?

**No.** Le entity sono dati, non servizi: le crea Hibernate quando legge una riga, o tu con il
builder quando ne salvi una nuova. Non si iniettano e non contengono dipendenze.

## Annotazioni JPA

| Annotazione | Significato |
|---|---|
| `@Entity` | la classe è una tabella gestita da Hibernate |
| `@Table(name = "game_player")` | nome della tabella (default: nome della classe) |
| `@Id` | chiave primaria |
| `@GeneratedValue` / `@UuidGenerator` | chiave generata automaticamente (UUID v7, vedi sotto) |
| `@Column(nullable = false, length = 20, unique = true)` | vincoli della colonna; nome colonna dedotto: `withWhoWins` → `with_who_wins` |
| `@Enumerated(EnumType.STRING)` | salva un `enum` come testo |
| `@ManyToOne(fetch = FetchType.LAZY)` + `@JoinColumn(name = "game_id")` | chiave esterna verso un'altra entity |
| `@OneToMany(mappedBy = "game")` | lato inverso: la lista di entity che puntano a questa |
| `@CreationTimestamp` / `@UpdateTimestamp` | (Hibernate) data di creazione / ultima modifica automatica |

## Annotazioni Lombok

`@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor`.
- `@NoArgsConstructor` è **obbligatorio** per JPA: Hibernate crea l'oggetto vuoto e poi lo riempie.
- `@Builder` richiede `@AllArgsConstructor`.
- Niente `@Data` sulle entity: genera `equals`/`hashCode`/`toString` su tutti i campi, che con le
  relazioni lazy scatenano query nascoste o ricorsioni infinite (A.toString → B.toString → A...).

## Regole

- Le entity **non escono dal service**: al controller arrivano DTO (via `mappers/`). Così il
  JSON non cambia se cambia la tabella, e non si espongono campi interni (es. password).
- Relazioni sempre `LAZY` di default; si caricano quando servono con `JOIN FETCH` nel repository.

## Enum invece di numeri

Il vecchio backend salvava i "tipi" come numeri (`type = 1` voleva dire "cattivo", `-1` master) e
ogni pezzo di codice doveva ricordarsi il significato. Ora sono `enum` Java:

```java
public enum RoleType { GOOD, EVIL, VICTORY_STEALER, NEUTRAL }

@Enumerated(EnumType.STRING)
private RoleType type;
```

- Il compilatore impedisce valori sbagliati (`type = 7` non esiste più) e l'IDE completa i nomi.
- `@Enumerated(EnumType.STRING)` salva il **nome** della costante (`'GOOD'`) in una colonna di
  testo; Jackson lo scrive uguale nel JSON (`"type": "GOOD"`). La costante **è** il valore: non
  serve un campo numerico o testuale dentro l'enum come nel vecchio `RoleType(1, "evil")`.
- Mai `EnumType.ORDINAL` (il default!): salva la posizione (0, 1, 2...), e se un giorno inserisci
  una costante in mezzo tutti i dati già salvati cambiano significato.
- "Nessun valore" si esprime con `null`, non con una costante finta: `Game.winner = null` vuol
  dire "partita in corso", al posto del vecchio `NOT_FINISH(-1)`; `Game.endedAt = null` vuol dire
  lo stesso.
- Con `ddl-auto` Hibernate aggiunge un vincolo `CHECK (type IN ('GOOD', 'EVIL', ...))` sulla
  colonna, ma **non lo aggiorna** se poi aggiungi una costante: l'insert fallisce. Da noi basta
  resettare il database; in FinanceWebApp (dove il DB non si può resettare) si usa un
  `AttributeConverter` proprio per evitare questo vincolo (`JobFrequencyConverter`).
- Gli enum stanno in `model/` perché sono valori delle entity; un enum usato da una sola entity
  può anche stare dentro la classe (`Role.Type`), come fa FinanceWebApp. Questi li teniamo in file
  propri perché li usano più entity.

## Relazioni

Le relazioni tra tabelle si dichiarano nelle entity con poche annotazioni. Gli esempi sono quelli
del progetto.

**`@ManyToOne`: il lato "proprietario", con la colonna di chiave esterna.**
`GamePlayer` ha `game` e `player`, quindi la tabella `game_player` ha le colonne `game_id` e
`player_id` con il vincolo `FOREIGN KEY`. `@JoinColumn(name = "game_id")` dà il nome della colonna.
Molte righe possono puntare alla stessa riga: molti `GamePlayer` per un solo `Game`.
In Java però il campo è l'oggetto `Game`, non un `UUID`: `gamePlayer.getGame().getRound()` invece
di una JOIN a mano.

```java
@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "game_id")
private Game game;
```

`fetch = LAZY`: il default di `@ManyToOne` è `EAGER` (leggi un `GamePlayer` e Hibernate carica
subito la `Game`, e poi il suo `master`: una catena di query inutili). Con `LAZY` al posto della
`Game` c'è un **proxy**, un segnaposto che conosce solo l'id: la query parte la prima volta che
chiedi un dato vero (`getGame().getRound()`). `getGame().getId()` non fa query, l'id è già nella
colonna. Il prezzo: il proxy si carica solo **dentro una transazione**; toccato dopo (es. nel
controller, con `open-in-view=false`) lancia `LazyInitializationException`. Per questo il service
è `@Transactional` e restituisce DTO già costruiti dal mapper.

`optional = false` dice che la relazione è obbligatoria: la colonna diventa `NOT NULL`, Hibernate
controlla già in Java che il campo non sia `null` prima di mandare l'SQL, e caricando i dati può
usare una `INNER JOIN` invece di una `LEFT JOIN`. Il contrario: `GameAction.target` è
`optional = true` perché un'azione può non avere bersaglio (`target_id` nullable).

**`@OneToMany(mappedBy)`: il lato "inverso", senza colonna.**
`Game.players` è la lista dei giocatori, ma la colonna `game_id` sta in `GamePlayer`.
`mappedBy = "game"` dice "la relazione è gestita dal campo `game` dell'altra classe": non crea
tabelle né colonne, serve solo per leggere la lista. Per cambiare la partita di un giocatore si
modifica `GamePlayer.game`, non la lista.

```java
@OneToMany(mappedBy = "game")
@OrderBy("seat")   // la lista arriva ordinata dal database
private List<GamePlayer> players = new ArrayList<>();
```

**`@ElementCollection`: una collezione di valori, non di entity.**
Le impostazioni di una partita (`Game.settings`) sono un `Set<GameSetting>`: un enum non è
un'entity, non ha id né ciclo di vita. Hibernate crea una tabella di appoggio, `game_setting`
(`game_id`, `setting`), con una riga per impostazione attiva. Presente nel set = attiva.

**`@OnDelete(action = CASCADE)`: il database cancella le righe figlie.**
Quando cancelli una `Game`, il database cancella da solo le sue `GamePlayer` (`ON DELETE
CASCADE` nel `FOREIGN KEY`). È un'istruzione per il database, una sola `DELETE`.
L'alternativa JPA è `cascade = CascadeType.REMOVE` sulla relazione: Hibernate carica e cancella
le figlie **una per una** dal codice Java (più lento, ma fa eseguire i callback JPA su ogni
figlia). Noi usiamo quella del database perché le cancellazioni sono rare e semplici.

**`@Check`, `@UniqueConstraint`, `@Index`: vincoli e indici.**
- `@UniqueConstraint(columnNames = {"game_id", "player_id"})` in `game_player`: un giocatore
  non può essere due volte nella stessa partita. È il vincolo `UNIQUE` del database, quindi vale
  anche se il codice sbaglia.
- `@Check(constraints = "player_id <> friend_id")` in `Friendship`: `CHECK` del database. Nessuno
  può seguire se stesso. Il vincolo non è sull'intera tabella ma su una riga: si scrive sulla classe.
- `@Check` (annotazione di Hibernate) aggiunge un vincolo `CHECK` alla tabella: una regola che il
  **database** controlla a ogni `INSERT`/`UPDATE`, rifiutando la riga se è falsa. Hibernate la
  scrive nel `CREATE TABLE`. In `Game`:
  `@Check(constraints = "(ended_at IS NULL) = (winner IS NULL)")` → `CHECK ((ended_at IS NULL) = (winner IS NULL))`.
  `ended_at IS NULL` e `winner IS NULL` sono due booleani; `=` li confronta. È vera se sono **tutti
  e due nulli o tutti e due valorizzati**:

  | `endedAt` | `winner` | Risultato |
  |---|---|---|
  | null | null | ✅ partita in corso |
  | 21:30 | `WOLVES` | ✅ partita finita |
  | 21:30 | null | ❌ finita senza risultato |
  | null | `WOLVES` | ❌ vincitore ma non finita |

  Perché: "finita" e "ha un risultato" sono la stessa informazione su due colonne; il vincolo
  impedisce che diventino incoerenti (es. il service imposta `endedAt` e dimentica `winner`: il
  salvataggio fallisce con `DataIntegrityViolationException`). Il service rispetta comunque la
  regola: il vincolo è l'ultima difesa contro i bug. Si usa `IS NULL` e non `= NULL` perché in SQL
  `= NULL` non è mai vero né falso (è "sconosciuto"), mentre `IS NULL` dà sempre `true` o `false`.
- `@Index(columnList = "game_id, round, phase")` in `game_action`: un indice per le query "tutte
  le azioni di questo round". Un indice accelera le letture ma rallenta le scritture: si mette
  dove si legge spesso per una colonna.

I test dei vincoli sono in `repository/GameRepositoryTest` (un `save` che viola il vincolo lancia
`DataIntegrityViolationException`).

**`@UuidGenerator(style = VERSION_7)`: l'id lo genera Java, non il database.**
Un UUID v7 contiene il tempo di creazione nei primi bit: gli id nuovi finiscono in fondo all'indice
invece che in posti casuali, come succede con UUID v4. Il database non deve generare l'id, quindi
Hibernate lo sa **prima** dell'`INSERT` (utile per usare l'id subito). Negli URL non rivela quanti
utenti o partite esistono (non è un contatore come 1, 2, 3...), ma rivela **quando** è stata
creata la riga: chi vede l'id può ricavarne la data e l'ora di creazione. Per partite e giocatori
va bene; per dati in cui anche l'ora di creazione è riservata servirebbe un UUID v4 (casuale).

**`@CreationTimestamp`: data impostata da Hibernate.** Sulla colonna `startedAt` (o
`registeredOn`) Hibernate scrive l'istante al momento dell'`INSERT`. `updatable = false` impedisce
di modificarla dopo.

**`@Builder.Default`: il valore iniziale con il builder.** Lombok `@Builder` ignora
l'inizializzazione del campo (`private int round = 1;`) e metterebbe `0`. Con `@Builder.Default`
il valore vale anche nel builder. Serve per `round`, `phase`, le liste e i set.

## Perché `Role` è un enum e non una tabella

Prima `role` era una tabella con i ruoli come dati. Ora `Role` è un `enum` Java con 20 costanti
(i ruoli giocabili; il master non è un ruolo). Motivi:

- Le regole del gioco fanno riferimento ai ruoli **nel codice** (`if (role == Role.WOLF)`). Con
  una tabella il codice dipende da righe che qualcuno può rinominare o cancellare: un
  `UPDATE role SET name = 'lupo'` rompe la logica senza che il compilatore se ne accorga.
- La lista cambia con le regole, cioè con il codice, non con i dati: a ogni modifica si fa un
  deploy comunque.
- Niente join per leggere un ruolo: `GamePlayer.role` è una colonna di testo (`'WOLF'`).
- `GET /api/rules/roles` legge direttamente `Role.values()`: nessun accesso al database.

Il prezzo: aggiungere un ruolo richiede una modifica al codice e un nuovo valore nel `CHECK` del
database (vedi sopra); è il compromesso accettato.

## Decisioni sul modello

- **Il master è `Game.master`, non un ruolo.** Il master non gioca, non vince e non ha una
  squadra: metterlo in `Role` avrebbe reso `Role` un enum con un'eccezione (il vecchio
  `RoleType.MASTER`, `withWhoWins = null`).
- **Cancellazione logica di `Player`** (`deletedAt`): l'account non si cancella, si marca. Le
  partite restano con il loro master e i loro giocatori (cancellare l'utente romperebbe la storia
  delle partite); un account con `deletedAt` valorizzato non può fare login.
- **Amicizia unidirezionale:** `Friendship` A→B non implica B→A. Chi segue non è per forza seguito
  (come su Twitter, non come un'amicizia Facebook). Un'amicizia reciproca sarebbero due righe.
- **Nessun `GAME_ROLES`:** non c'è una tabella con i ruoli ammessi per partita. Il numero massimo
  di ogni ruolo è in `Role.maxNumber`; il controllo di quante copie usare sarà nel service.
- **Impostazioni di partita come `@ElementCollection`** (`game_setting`), non come colonne booleane:
  se se ne aggiunge una nuova non si cambia lo schema. Nessuna è ancora implementata nella logica
  di gioco.
- **Valori delle fazioni come nel vecchio DB** (`WinFaction`: `FARMERS`, `WOLVES`, `HAMSTER`,
  `JESTER`, `DRAW`): stessi nomi e stesso significato della vecchia tabella, solo testo invece di
  numeri.
- **`null` invece di valori magici:** `deathRound`/`deathPhase`/`diedAt` a `null` = vivo;
  `winner`/`endedAt` a `null` = partita in corso. Il `CHECK` di `game_player` garantisce che le tre
  colonne della morte siano tutte `null` o tutte valorizzate.

## Classi

Entity (tabelle), tutte con `id` UUID v7:
- `Player` — utente registrato (`username`, `email`, `passwordHash`, `deletedAt` per la cancellazione logica).
- `Friendship` — "segue" unidirezionale tra due `Player`.
- `Game` — partita: `publicId` (per gli URL), `master`, `round`, `phase`, `winner`, `settings`, `players`.
- `GamePlayer` — un giocatore in una partita: `role`, `seat` (posto al tavolo), morte (`deathRound`, `deathPhase`, `diedAt`).
- `GameAction` — riga del log: chi (`actor`) ha fatto cosa (`type`) a chi (`target`), in quale round e fase.

Enum:
- `Role` — i 20 ruoli giocabili, con tipo, fazione, numero massimo e descrizione. Lista fissa nel codice.
- `RoleType` — `GOOD`, `EVIL`, `VICTORY_STEALER`, `NEUTRAL`.
- `WinFaction` — fazione che può vincere: `FARMERS`, `WOLVES`, `HAMSTER`, `JESTER`, `DRAW` (solo come risultato di una partita).
- `GamePhase` — `NIGHT`, `DAY`.
- `ActionType` — `VOTE` (voto di giorno) e i poteri dei ruoli (`MAUL`, `PROTECT`, ...).
- `GameSetting` — `MASTER_FREE`, `ILLUSIONIST_BLOCK`, `LARGER_ROLE_NUMBER` (non ancora implementate).
