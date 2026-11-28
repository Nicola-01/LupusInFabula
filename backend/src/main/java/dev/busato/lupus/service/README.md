# `service/` — logica di business

Il cuore dell'applicazione: le regole (del gioco, dei permessi, delle validazioni che coinvolgono
il database). Non sa nulla di HTTP: riceve e restituisce oggetti Java, e quando qualcosa va
storto **lancia un'eccezione** (es. `GameNotFoundException`), che sarà tradotta in risposta HTTP
altrove.

## Bean

Ogni classe è un bean `@Service`. Dipende da repository, mapper e altri service, iniettati con
`@RequiredArgsConstructor` (campi `private final`). È usato dai controller (e in futuro dal
WebSocket o da job pianificati: per questo la logica sta qui e non nel controller).

## Annotazioni

| Annotazione | Significato |
|---|---|
| `@Service` | registra la classe come bean dello strato di business |
| `@RequiredArgsConstructor` | (Lombok) costruttore con tutti i campi `final` → dependency injection |
| `@Transactional` | il metodo gira in **una** transazione: se lancia un'eccezione, tutte le scritture fatte vengono annullate (rollback) |
| `@Transactional(readOnly = true)` | transazione di sola lettura: Hibernate non controlla se gli oggetti sono stati modificati, più veloce |
| `@PreAuthorize("...")` | controlla i permessi prima di eseguire il metodo (non ancora usato: per ora i controlli sono nei filtri, vedi `security/`) |

`@Transactional` e `@PreAuthorize` funzionano tramite il **proxy** del bean (vedi README della
radice): valgono solo se il metodo è chiamato da un'altra classe, non da un metodo della stessa.

## Perché la transazione è qui

Un'operazione di gioco ("il lupo sbrana X") tocca più tabelle: azione, stato del giocatore,
fase della partita. O vanno a buon fine tutte o nessuna. Il service è l'unico punto che conosce
l'operazione intera, quindi è lui a decidere dove inizia e finisce la transazione.
Restituendo DTO (via mapper) invece di entity, tutti i dati sono letti **dentro** la transazione
(`open-in-view=false`: fuori non si può più caricare niente).

## Costruire la risposta: prima i dati, poi il record

Un `record` è un valore immutabile ("questi sono i dati, completi"). Si potrebbe creare
`new RolesByTypeResponse(new EnumMap<>(...))` e riempire dopo `response.roles()` (funziona: il
record tiene un riferimento alla mappa, che resta modificabile), ma contraddice l'idea del record.
Regola: **prepara i dati, poi crea il record in un colpo solo**, come fa `getRolesByType()`.

Alternativa con gli stream, in una sola espressione:

```java
return new RolesByTypeResponse(
    Arrays.stream(Role.values())
        .collect(Collectors.groupingBy(
            Role::getType,
            () -> new EnumMap<>(RoleType.class),
            Collectors.mapping(roleMapper::mapToResponse, Collectors.toList()))));
```

Più corta, ma `groupingBy` crea una chiave solo se c'è almeno un ruolo di quel tipo: i tipi vuoti
sparirebbero dal JSON invece di valere `[]`. Per questo il codice usa due cicli: il primo mette
tutte le chiavi, il secondo le riempie.

`getRolesByType()` non ha `@Transactional`: non legge il database (i ruoli sono un enum), quindi
non serve aprire una transazione. Le annotazioni di transazione servono quando il service
legge o scrive più righe e deve farlo in modo atomico, come sarà per le operazioni di gioco.

## Test

Unitari con Mockito, senza Spring e senza database: `@Spy` per il mapper (codice puro, niente da
fingere) e `@InjectMocks` per il service. Vedi `src/test/java/dev/busato/lupus/service/RoleServiceTest.java`.
Quando un service dipende da un repository, si usa `@Mock` per il repository.

## Esempio: `AuthService` (registrazione e sessione)

```java
@Transactional
public void signup(SignupRequest request) {
  if (playerRepository.existsByUsernameIgnoreCase(request.username()))
    throw new AlreadyUsedException("username");
  if (playerRepository.existsByEmail(request.email().toLowerCase(Locale.ROOT)))
    throw new AlreadyUsedException("email");
  ...
  playerRepository.save(Player.builder()...passwordHash(passwordEncoder.encode(request.password())).build());
}
```

Il controllo `existsBy...` prima del `save` dà il 409 con il campo giusto. L'email va minuscola
prima della ricerca, perché il callback di `Player` la minuscolizza solo al salvataggio. Ma non basta da solo:
se due richieste identiche arrivano nello stesso istante, entrambe passano il controllo e la
seconda `save` viola il vincolo `UNIQUE` del database. Oggi quella violazione diventa un 500
generico (`GlobalExceptionHandler.handleUnexpected`); è un caso raro che si può trasformare in 409
catturando `DataIntegrityViolationException`, se serve.

`session(UUID playerId)` è `@Transactional(readOnly = true)`: legge il giocatore attivo (`findByIdAndDeletedAtIsNull`) e la sua partita
da master e restituisce un DTO (`SessionResponse`) già completo, così il controller non tocca
entity. Se il giocatore è cancellato lancia `InsufficientAuthenticationException`, che diventa 401.

## `Optional`, `map` e `::`

```java
String gamemaster = gameRepository
    .findFirstByMasterIdAndEndedAtIsNull(playerId)   // Optional<Game>
    .map(Game::getPublicId)                          // Optional<String>
    .orElse(null);                                   // String, oppure null
```

- **`Optional<Game>`** è una scatola che contiene una partita **oppure niente**. Il repository la
  usa al posto di `null` per dire che la partita potrebbe non esserci, e il compilatore ti
  costringe a gestire il caso vuoto.
- **`.map(f)`**: se la scatola è piena applica `f` al contenuto e restituisce una nuova scatola
  con il risultato (`Optional<Game>` → `Optional<String>`). Se è vuota non chiama `f` e resta
  vuota. Così non serve nessun `if (game != null)`.
- **`.orElse(null)`** apre la scatola: il valore se c'è, altrimenti quello di riserva. Le varianti
  sono `orElseThrow(...)`, che lancia un'eccezione (come in `session` per il giocatore), e
  `orElseGet(() -> ...)`, che calcola il valore di riserva solo se serve.
- **`Game::getPublicId`** è un **method reference**, la forma corta della lambda
  `game -> game.getPublicId()`: "chiama `getPublicId` sull'oggetto che ricevi". Si legge
  "classe `::` metodo". Altre forme: `playerMapper::mapToResponse`, cioè
  `p -> playerMapper.mapToResponse(p)` (metodo di un oggetto preciso), e `Player::new` (un
  costruttore).

Lo stesso codice senza `Optional`:

```java
Optional<Game> game = gameRepository.findFirstByMasterIdAndEndedAtIsNull(playerId);
String gamemaster = game.isPresent() ? game.get().getPublicId() : null;
```

## `UserService` e `FriendService`

- **Il giocatore "attivo"**: ogni metodo parte da `findByIdAndDeletedAtIsNull(id)`. Se l'account è
  stato cancellato da un altro dispositivo, la sessione rimasta aperta riceve 401 al primo uso.
- **Password attuale**: `PUT` e `DELETE /user/me` la richiedono (`passwordEncoder.matches`). Così
  una sessione lasciata aperta su un PC altrui non basta per cambiare password o cancellare l'account.
- **Nessun `save` in `update`**: dentro una transazione l'entity letta è *managed*; Hibernate
  confronta i campi alla fine (*dirty checking*) e scrive l'`UPDATE` da solo.
- **`saveAndFlush` in `FriendService.add`**: `since` è `@CreationTimestamp` e Hibernate lo valorizza
  quando scrive la riga. Con `save` l'`INSERT` è rimandato alla fine della transazione e il valore
  sarebbe ancora `null` nella risposta; `flush` lo forza subito.
- **Ricerca**: almeno 2 caratteri (con 1 tornerebbe mezzo database), massimo 20 risultati, esclude
  te stesso e i cancellati.
- **Amicizia a senso unico** (D6): aggiungere B mette solo la riga A → B.

## `GameService`: creazione della partita

`GameService.create` riceve l'id del master (dal principal della sessione) e il
`CreateGameRequest`, controlla le regole **in ordine** e, se sono tutte rispettate, distribuisce
i ruoli e salva la partita. Tutto avviene in una sola transazione: se una regola fallisce, non
viene scritto niente.

Ordine dei controlli:

1. il master esiste ed è attivo (altrimenti 401: account cancellato);
2. il master non è già in una partita aperta → 409 `InGameException`;
3. nessun username ripetuto → 400 `InvalidGameException`;
4. controllo di **ogni** giocatore: se qualcuno non va bene, il service raccoglie tutti i problemi
   e lancia **un solo** `InvalidPlayersException` (400), con la mappa `players`
   `{username: NOT_FOUND | IN_GAME | IS_MASTER}`. Così il frontend segna tutti i giocatori
   sbagliati insieme, non uno alla volta;
5. in `MASTER_FREE` il master deve essere nella lista, al suo posto → 400;
6. almeno 5 giocatori → 400;
7. ogni ruolo al massimo `maxNumber` → 400;
8. numero di carte uguale al numero di giocatori (o maggiore con `LARGER_ROLE_NUMBER`) → 400;
9. equilibrio delle fazioni → 400;
10. distribuzione dei ruoli, `publicId`, salvataggio di `Game` e dei `GamePlayer`.

Lo username è cercato senza distinguere le maiuscole (`findByUsernameIgnoreCaseAndDeletedAtIsNull`),
e il duplicato nella lista è confrontato in minuscolo (`toLowerCase(Locale.ROOT)`): `Nick` e `nick`
sono la stessa persona.

### Perché la vecchia assegnazione dei ruoli era sbagliata

Il vecchio `randomRole` pescava tra i **nomi** dei ruoli rimasti (`roles.keySet()`), non tra le
carte. Lo schema, semplificato:

```java
// vecchio: pesca un NOME tra quelli rimasti, poi toglie una carta da quel ruolo
Role r = remaining.keySet().get(random.nextInt(remaining.size()));
remaining.merge(r, -1, Integer::sum);

// nuovo: un elemento per carta, mescolato; la carta i va al posto i
List<Role> deck = List.of(SEER, FARMER, FARMER, ...);   // una riga per carta
Collections.shuffle(deck);
```

Con `{SEER: 1, FARMER: 7}` le chiavi sono 2, quindi il primo giocatore era veggente con probabilità
1/2 invece di 1/8: il conteggio serviva solo a togliere la carta dopo, non a pesare la scelta.
L'effetto: i ruoli rari finivano quasi sempre ai primi posti della lista, cioè ai primi posti del
tavolo.

Ora il mazzo ha una carta per elemento (`SEER, FARMER×7`), `Collections.shuffle` lo mescola (ogni
ordine ha la stessa probabilità) e la carta `i` va al posto `i`. Nessun ruolo è favorito.

### Equilibrio delle fazioni (`unbalanced`)

Regole prese dal vecchio backend, con `n` = carte distribuite:

- buoni ≥ `floor(n / 2.5)`;
- cattivi ≤ `round(n / 3)`;
- cattivi ≥ `max(round(n / 8), 1)`.

| `n` | buoni almeno | cattivi al massimo | cattivi almeno |
|---|---|---|---|
| 5 | 2 | 2 | 1 |
| 8 | 3 | 3 | 1 |
| 12 | 4 | 4 | 2 |

Il vecchio codice andava in `NullPointerException` se non c'erano ruoli buoni o cattivi; ora
`unbalanced` li conta come 0 (con uno stream e `count()`), e la regola fallisce con un messaggio
che dice quanti ne servono.

### `LARGER_ROLE_NUMBER`: più carte dei giocatori

Il master sceglie più carte dei giocatori. Il mazzo si mescola e si prendono le prime `n` carte:
quella è la mano. Se la mano non è equilibrata, si rimescola, fino a 100 volte (`MAX_DEALS`); se
dopo 100 tentativi nessuna mano va bene, la richiesta fallisce con 400.

L'equilibrio si controlla sulla **mano**, non sul mazzo: altrimenti potrebbe capitare una partita
senza lupi, pescata dalle carte scartate. Il mazzo intero viene salvato in `Game.deck` (vedi
`model/README.md`): ai giocatori si mostrerà il mazzo, così nessuno sa quali ruoli sono davvero
in gioco.

### `MASTER_FREE`: il master gioca

In `MASTER_FREE` il creatore è comunque `Game.master` (gestisce la partita e le impostazioni) ed
è anche un `GamePlayer` con un ruolo. Vedrà solo le sue cose: questo sarà garantito dallo step 4 di `TODO.md`
(cosa vede il master e cosa vede il giocatore). Lo svolgimento (ognuno invia la propria
azione) è nello step 5.

`ILLUSIONIST_BLOCK` per ora è solo salvato nelle impostazioni: riguarda la risoluzione della notte
(step 5).

### `publicId`

Il codice pubblico della partita è tre nomi di ruolo più quattro cifre, per esempio
`seer-wolf-plaguespreader-0427`. Le combinazioni sono 20³ × 10 000 = 80 milioni, contro le 8000
del vecchio formato, dove i nomi delle partite finite restavano occupati per sempre. Il service
genera un codice e ripete finché `existsByPublicId` dice che è libero.

### Limite noto, accettato

Due creazioni nello stesso istante con lo stesso giocatore passano entrambe il controllo "non è in
partita". Non è gestito: è un'app interna e il caso è rarissimo.

### `UserService.delete` e la partita aperta

`UserService.delete` risponde 409 se l'account è in una partita aperta, come master o come
giocatore (`existsOpenGameOf`). Un account con partita in corso non si può cancellare.

I test sono in `src/test/java/dev/busato/lupus/service/GameServiceTest.java`.

## `DeckService`: salvare i mazzi

Un mazzo è un preset di ruoli. `DeckService` ne controlla le regole al salvataggio, con le stesse
regole della creazione partita. Il controllo di `maxNumber` e la lista delle carte sono un solo
metodo, `GameService.cards(Map<Role, Integer>)`: è `static` e package-private, quindi visibile alle
classi dello stesso package `service` e a nessun'altra. Lo usano sia la creazione della partita sia
i mazzi, così le due regole non possono divergere.

Regole al salvataggio:
1. ogni ruolo da 1 a `maxNumber` (nessun ruolo con 0 carte: per toglierlo basta non metterlo);
2. numero di carte ≥ `players`;
3. se le carte sono **uguali** a `players`, l'equilibrio buoni/cattivi (`GameService.unbalanced`)
   si controlla subito, sul mazzo stesso;
4. se le carte sono **di più**, il mazzo serve per `LARGER_ROLE_NUMBER`: l'equilibrio non si
   controlla sul mazzo ma sulla mano distribuita alla creazione della partita (vedi sopra). Un
   mazzo con più carte può quindi essere salvato anche se, preso intero, non sarebbe equilibrato.

Altre regole:
- **Nome già usato dallo stesso utente** → 409 (`AlreadyUsedException("name")`). Il confronto non
  distingue maiuscole, come lo username; il vincolo `UNIQUE` del database è esatto e fa da ultima
  difesa.
- **Usare un mazzo**: il frontend legge `roles` dal mazzo e le copia nella `POST /game/create`. La
  partita salva la **propria** copia (`Game.deck`). Quindi modificare o cancellare il preset **non
  cambia** le partite già create.
- **Account cancellato**: `UserService.delete` cancella i suoi mazzi con `deleteByOwnerId`. È una
  delete vera, non soft: i mazzi sono pubblici (`GET /user/{username}/deck`) e non devono restare
  visibili. La riga di `Player` invece resta (soft delete, vedi `model/README.md`), perché le
  partite la referenziano.

## Chi vede cosa: `RoleVisibility` e `GameViewService`

Due classi con compiti separati. `RoleVisibility` decide **cosa** un giocatore può vedere;
`GameViewService` **legge** i dati dal database e applica quella decisione.

### `RoleVisibility`: regole pure, non un bean

`RoleVisibility` è `final`, package-private, con costruttore privato e solo metodi `static`.
**Non è un bean**: le sue regole non hanno dipendenze (né repository, né altri service) e non
tengono stato. Un bean serve quando una classe ha dipendenze da iniettare o stato gestito da
Spring; qui non c'è niente di tutto ciò, e una classe di metodi statici è più semplice. Il
vantaggio è che si testa con JUnit puro, senza Spring e senza Mockito.

Le regole sono due metodi:

- `seesAll(game, viewerId)`: vede **tutti** i ruoli se la partita è finita, o se `viewerId` è il
  master di una partita che non è `MASTER_FREE`. Usa l'id perché il master (D2) non ha un
  `GamePlayer`, quindi `viewer` è `null` sia per il master sia per lo spettatore.
- `canSee(game, viewer, target)`: vede il ruolo di `target` secondo il proprio ruolo, con le regole
  **in quest'ordine** (vale la prima che si applica):
  1. `viewer == null` (spettatore, master senza posto) → niente;
  2. lo stesso posto → il proprio ruolo;
  3. i lupi (`PACK`: WOLF, PUPPY, BERSERKER, EXPLORER) si vedono tra loro;
  4. il DORKY diventato lupo vede i lupi e viceversa. `dorkyIsWolf` per ora è sempre `false`
     (nel codice è marcato `shortcut:`): dipende dalle azioni dello step 5;
  5. i MASON si vedono tra loro;
  6. altrimenti no.

Perché due metodi: `canSee` confronta solo i posti, mentre `seesAll` ha bisogno dell'id del master.
`seesAll` si calcola una volta per tutta la lista invece che una volta per posto.

Il ruolo dei morti resta nascosto fino alla fine della partita (scelta del progetto, come nel
vecchio backend). In `MASTER_FREE` il master è un giocatore normale: ha un posto e un ruolo, quindi
`seesAll` è falso per lui e vede il proprio posto tramite `canSee`.

### `GameViewService`: le letture

`GameViewService` fa le letture della partita: `status`, `players`, `configuration` e `live`.
Tutte sono `@Transactional(readOnly = true)`: non scrivono nulla, quindi Hibernate non deve
controllare quali oggetti sono cambiati (*dirty checking*) e il database può trattarle come sola
lettura.

È separato da `GameService`, che crea le partite. Ognuno dei due ha un motivo solo per cambiare:
le regole di creazione e le regole di visibilità non dipendono l'una dall'altra.

`players` cerca il posto di chi chiama (`viewer`) tra i posti della partita e calcola una volta
`seesAll`. Per ogni posto chiede a `RoleVisibility.canSee` se mostrare il ruolo (oppure vale
`seesAll`) e passa il risultato (`showRole`) al mapper: se il ruolo
non è visibile, nel JSON vale `role: null`. Il service decide, il mapper copia (vedi
`mappers/README.md`).

**Spettatori**: chiunque sia loggato può leggere qualunque partita, come nel vecchio backend. Uno
spettatore però vede solo le informazioni pubbliche: stato, posti, chi è vivo o morto, mazzo.

## Stream: `filter`, `findFirst`, `map`, `toList` (esempio: `GameViewService.players`)

```java
GamePlayer viewer =
    seats.stream()                                                // i posti, uno alla volta
        .filter(seat -> seat.getPlayer().getId().equals(viewerId)) // tiene solo il mio posto
        .findFirst()                                               // Optional<GamePlayer>
        .orElse(null);                                             // il mio posto, o null se non gioco
boolean all = RoleVisibility.seesAll(game, viewerId);          // calcolato una volta sola
return seats.stream()
    .map(seat -> gameMapper.mapToPlayer(seat, all || RoleVisibility.canSee(game, viewer, seat)))
    .toList();                                                     // List<GamePlayerResponse>
```

Uno **stream** fa scorrere gli elementi di una lista attraverso una catena di passi:
- **`filter(condizione)`** lascia passare solo gli elementi per cui la lambda restituisce `true`;
- **`findFirst()`** prende il primo che arriva e lo mette in un `Optional` (vuoto se non è passato
  niente). Lo stream si ferma lì: non controlla gli altri posti;
- **`map(f)`** trasforma ogni elemento in un altro (qui `GamePlayer` → `GamePlayerResponse`);
- **`toList()`** raccoglie i risultati in una lista nuova, che non si può modificare.

`seat -> ...` è una **lambda**: una funzione senza nome, "dato un `seat`, calcola ...". Lo stesso
codice con i cicli:

```java
GamePlayer viewer = null;
for (GamePlayer seat : seats)
  if (seat.getPlayer().getId().equals(viewerId)) { viewer = seat; break; }
boolean all = RoleVisibility.seesAll(game, viewerId);
List<GamePlayerResponse> result = new ArrayList<>();
for (GamePlayer seat : seats)
  result.add(gameMapper.mapToPlayer(seat, all || RoleVisibility.canSee(game, viewer, seat)));
```

**Come fa `seat` a essere un elemento di `seats`?** Il nome non c'entra: potresti scrivere
`x -> x.getPlayer()...` e funzionerebbe uguale. Sono due cose:
1. **chi chiama la lambda è lo stream**: `filter` la chiama una volta per ogni elemento, passando
   l'elemento come argomento. `seat` è il nome del parametro, come in un metodo
   `boolean isMine(GamePlayer seat)`;
2. **il tipo lo deduce il compilatore**: `seats` è `List<GamePlayer>`, quindi `seats.stream()` è
   `Stream<GamePlayer>`, e `filter` di uno `Stream<GamePlayer>` vuole una funzione che riceve un
   `GamePlayer` (`Predicate<GamePlayer>`). Per questo `seat.getPlayer()` compila: il parametro è un
   `GamePlayer` anche senza scriverlo. Si può scrivere esplicito: `(GamePlayer seat) -> ...`.

Perché si cerca prima `viewer`: le regole dipendono dal **ruolo di chi guarda** (un lupo vede gli
altri lupi), quindi serve il suo posto prima di decidere per ogni altro posto. `null` vuol dire "non
gioca" (spettatore, o master che non gioca), e `canSee` lo tratta come tale.

## Classi

- `AuthService` — registrazione (controlla username ed email, salva l'hash BCrypt) e lettura della
  sessione (utente + publicId della partita di cui è master, se c'è).
- `UserService` — profilo proprio e degli altri, modifica (username, email, password), cancellazione
  (soft delete con email liberata), ricerca.
- `FriendService` — lista (con partite in comune), aggiunta e rimozione degli amici.
- `RoleService` — tutti i `Role` raggruppati per `RoleType` in un `EnumMap` (mappa ottimizzata
  per chiavi enum, ordinata come l'enum). Tutti i tipi sono presenti anche se vuoti, così il
  frontend non deve gestire chiavi mancanti. Dipende solo dal mapper: nessun repository.
- `GameService` — creazione della partita: controlli delle regole, distribuzione dei ruoli
  (mazzo mescolato, `LARGER_ROLE_NUMBER`), `publicId`, salvataggio. Lettura dell'ultima partita
  e della partita per `publicId`, con i mapper.
- `DeckService` — salvataggio, modifica, lista e cancellazione dei mazzi salvati: regole sui ruoli
  e sulle carte (stesso `GameService.cards`), nome unico per utente.
- `RoleVisibility` — regole di visibilità dei ruoli: chi può vedere il ruolo di chi, in una
  partita. Solo metodi `static`, niente bean: non ha dipendenze.
- `GameViewService` — letture della partita: stato, posti (con i ruoli visibili a chi chiama),
  configurazione, bacheca delle partite in corso. Separato da `GameService`, che le crea.
