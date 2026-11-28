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
| `@PreAuthorize("...")` | (con Spring Security) controlla i permessi prima di eseguire il metodo |

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

## Classi

- `RoleService` — tutti i `Role` raggruppati per `RoleType` in un `EnumMap` (mappa ottimizzata
  per chiavi enum, ordinata come l'enum). Tutti i tipi sono presenti anche se vuoti, così il
  frontend non deve gestire chiavi mancanti. Dipende solo dal mapper: nessun repository.
