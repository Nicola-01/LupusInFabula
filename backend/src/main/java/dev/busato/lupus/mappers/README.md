# `mappers/` — conversione entity → DTO

Un mapper per entity: trasforma l'entity (`model/`) nel DTO di risposta (`dto/`) e, quando serve,
il DTO di richiesta in entity. Tiene questa conversione in un posto solo invece di ripeterla in
ogni service.

## Bean

Ogni mapper è un bean `@Component` (bean generico: non è né logica di business né accesso ai
dati). Viene iniettato nei service con `@RequiredArgsConstructor`. Non ha dipendenze proprie e
non ha stato, quindi è sicuro condividerlo (singleton) tra tutte le richieste.

## Regole

- Solo copia e trasformazione dei campi, **nessuna query e nessuna regola di business**.
- Va chiamato **dentro** la transazione del service: se legge una relazione lazy
  (`player.getGame().getPublicId()`) Hibernate deve poterla caricare.
- Nei test dei service si usa il mapper vero (`@Spy`) invece di un mock: è codice puro, non c'è
  niente da fingere.

Esiste anche MapStruct, una libreria che genera i mapper da un'interfaccia; qui li scriviamo a
mano come in FinanceWebApp, finché sono pochi e semplici.

## Classi

- `PlayerMapper` — `Player` → `PlayerResponse` (`username`, `email`). Non espone `passwordHash`,
  `id` e `deletedAt`: il JSON è solo quello che il frontend mostra.
- `PlayerMapper.mapToOwnProfile` / `mapToPublicProfile` — `Player` → `ProfileResponse`. Il primo
  (per `/user/me`) ha l'email, il secondo (per il profilo di un altro) la lascia `null`: l'email è
  privata. Due metodi con il nome che dice chi li vede, invece di un `boolean` da ricordare.
- `RoleMapper` — `Role` (enum) → `RoleResponse`. Non richiede una transazione: l'enum è già in memoria.
