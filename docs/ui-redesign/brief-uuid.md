# Migrazione a UUIDv7 di Player e Game

Progetto `/home/nicola/Desktop/LupusInFabula` (leggi `CLAUDE.md`). Package Java base: `src/main/java/it/unipd/dei/webapp/lupus/`. DAO in `dao/`, con un DAO per query; ogni DAO apre e chiude la propria connessione in `access()`.

## Obiettivo (richiesta dell'utente)
`Player` e `Game` hanno come chiave un UUIDv7 generato da Spring Boot, quindi in Java, non dal DB. Tutte le tabelle collegate puntano all'UUID, non più a `username` o all'`int`. Lo username resta l'identificativo visibile: le API, il JSON, gli URL e i parametri dei metodi pubblici che oggi ricevono uno username continuano a riceverlo. Cambia solo la chiave interna.

## Schema di arrivo (PostgreSQL ≥ 18) — contratto per tutti

```sql
CREATE TABLE Player (
    id                UUID PRIMARY KEY,
    username          VARCHAR(20)  NOT NULL UNIQUE,
    email             VARCHAR(100) NOT NULL UNIQUE,
    password          VARCHAR(100) NOT NULL,
    registration_date DATE         NOT NULL DEFAULT CURRENT_DATE   -- come oggi: verifica nel file attuale
);
CREATE TABLE IS_FRIEND_WITH (
    player_id   UUID REFERENCES Player (id),
    friend_id   UUID REFERENCES Player (id),
    date        ...  -- le altre colonne restano identiche a oggi
    PRIMARY KEY (player_id, friend_id)
);
CREATE TABLE Game (
    id         UUID PRIMARY KEY,                 -- prima: ID SERIAL
    public_ID  CHARACTER VARYING UNIQUE NOT NULL,
    ...        -- altre colonne identiche
);
CREATE TABLE PLAYS_AS_IN (
    player_id  UUID REFERENCES Player (id),
    game_id    UUID REFERENCES Game (id),
    role       VARCHAR(20) REFERENCES Role (name),
    ...        -- altre colonne identiche
    PRIMARY KEY (player_id, game_id, role)
);
CREATE TABLE GAME_ROLES       ( game_id UUID REFERENCES Game (id), ... identiche ..., PRIMARY KEY (game_id, role) );
CREATE TABLE Action (
    game_id    UUID REFERENCES Game (id),
    player_id  UUID REFERENCES Player (id),
    ...        -- round, phase, subphase, type_of_action identiche
    target_id  UUID REFERENCES Player (id) NOT NULL,
    PRIMARY KEY (game_id, player_id, round, phase, subphase, target_id)
);
CREATE TABLE SETTINGS_IN_GAME ( game_id UUID REFERENCES Game (id), ... identiche ... );
```

`Role` e `Game_settings` non cambiano: sono dati di riferimento con chiave per nome.

Mappatura delle colonne vecchie → nuove:

| Tabella | Vecchia colonna | Nuova colonna |
|---|---|---|
| Player | `username` (PK) | `id` (PK); `username` diventa UNIQUE |
| Game | `ID` (SERIAL) | `id` (UUID) |
| IS_FRIEND_WITH | `player_username` / `friend_username` | `player_id` / `friend_id` |
| PLAYS_AS_IN | `player_username` | `player_id` |
| Action | `player_username` / `target` | `player_id` / `target_id` |
| tutte le tabelle con `game_id` | `game_id` (int) | `game_id` (uuid) |

Nelle query, per leggere o filtrare per username si fa `JOIN Player p ON p.id = x.player_id` e si usa `p.username`. Per inserire partendo da uno username si usa `(SELECT id FROM Player WHERE username = ?)`. Mantieni il `LOWER(...)` dove oggi c'è.

## Contratto Java — per tutti
- `utils/UuidV7.java` (agente S): `public static UUID generate()`. RFC 9562: 48 bit di timestamp Unix in millisecondi, versione 7, variante `10`, e il resto casuale da `SecureRandom`. Niente dipendenze nuove.
- **Tipo dell'id della partita:** ogni `int`/`Integer` che rappresenta l'id interno di una partita (parametri, ritorni, campi, chiavi di mappe) diventa `java.util.UUID`. "Nessuna partita" (oggi `-1`, `0` o `<= 0`) diventa `null`: chi controllava `gameID > 0` ora controlla `gameID != null`.
- **JDBC:** `pstmt.setObject(i, uuid)` e `rs.getObject("col", UUID.class)`.
- **Creazione dei record:**
  - `SignupPlayerDAO` inserisce `UuidV7.generate()` come `id` del player;
  - `CreateGameDAO` inserisce `UuidV7.generate()` come `id` della partita e restituisce la partita come oggi.
- `resource/Player.java`: nuovo campo `UUID id` con getter, e un costruttore che lo accetta. Tieni anche i costruttori esistenti, se sono usati. Non esporlo nel JSON (`toJSON`), salvo che oggi il JSON esponga già un id.
- `resource/Game.java`: l'`id` diventa `UUID`. Nel JSON resta il campo `"id"`, che diventa una stringa.
- I metodi pubblici dei DAO mantengono lo stesso nome e gli stessi parametri, salvo i tipi degli id di partita.

## Regole
- Niente commit, niente push.
- Non avviare, fermare o riavviare il backend (:9090), che gestisce l'utente.
- **Non modificare il database locale**: la migrazione la applica l'orchestratore alla fine.
- Porte 5173, 5432 e 8080 vietate.
- Compilazione (da `/home/nicola/Desktop/LupusInFabula`):
  `/home/nicola/.jdks/ms-21.0.12/bin/javac -proc:none -nowarn -d /tmp/lupus-classes-<agente> -cp "$(find ~/.m2/repository -name '*.jar' | tr '\n' ':')" $(find src/main/java -name '*.java')`
  Gli altri agenti lavorano in parallelo: conta che i **tuoi** file non diano errori, e scrivi nel report quelli che restano negli altri.
- Tocca SOLO i tuoi file.
