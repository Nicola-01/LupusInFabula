# Brief — pagina Partita (CurrentGame) in React, concept F2

Leggi prima: `CLAUDE.md`, `docs/ui-redesign/brief-phase3-common.md` (regole valide anche qui, salvo dove questo file dice altro), `docs/ui-redesign/decisions.md`, `bug.md`.

## Obiettivo
Riscrivere la pagina `/village/:id` (vista giocatore) e `/village/:id/master` (vista master) in React con il design del mock **`frontend/src/mocks/game/F2.jsx`**. La schermata di fine partita va presa da **`mocks/game/F3.jsx`** ("The End"). L'elenco dei ruoli in gioco va mostrato con le icone (`RoleIcon` / `ROLE_ICONS` da `@/components/lupus`). Il codice imperativo attuale va eliminato e sostituito da componenti React con state.

## File attuali (da sostituire)
- `pages/CurrentGame.jsx`
- `components/game/currentGame/*`: `currentGame.js`, `gameActions.js` (904 righe: form azioni notte/giorno, votazioni, ballottaggio), `gameLog.js`, `playersStatus.js` (cerchio), `gameWebSocket.js`, `state.js` e i wrapper `.jsx`.

Puoi riorganizzare liberamente i file dentro `components/game/currentGame/`. Puoi riscrivere `pages/CurrentGame.jsx`. Non toccare altro, con un'eccezione: `loadTheme()` in `components/Navbar.jsx` legge `#gameStatus` per il tema dinamico (la modalità "dynamic" segue la fase della partita). Un elemento con quell'`id` e lo stesso contenuto o attributo che legge `loadTheme` deve continuare a esistere, aggiornato quando cambia la fase. Verificalo leggendo `loadTheme`.

## Regola d'oro: comportamento identico verso il backend
- Stesse chiamate REST: URL, metodo, body/JSON, ordine e momento. Stessa gestione delle risposte e degli errori (popup `Messages` con `populateErrorMessage` & co.) e stessi redirect/reload.
- Stesso protocollo WebSocket `/gameWS/{room}` (messaggi `sender:target`). Stessa apertura e chiusura e stesso uso dei messaggi ricevuti.
- Stessa logica di gioco lato client: quali azioni e target sono possibili per ogni ruolo e fase, validazioni prima dell'invio, ballottaggio, ruoli speciali. Va portata 1:1 da `gameActions.js`.
- I bug noti in `bug.md` restano tali, salvo i problemi puramente di DOM che spariscono con React (annotali nel report).
- Niente modifiche a backend, DB, URL o API.

## Metodo obbligatorio
1. **Prima di riscrivere**, cattura il comportamento del codice attuale con puppeteer (vedi "Test"). Per ogni scenario registra la sequenza di richieste (metodo, URL, body) e di messaggi WebSocket inviati. Salvala in `~/.cache/lupus-mockcheck/game-baseline/`.
2. Riscrivi.
3. Riesegui gli stessi scenari: le sequenze devono coincidere (a meno di id e timestamp generati).

## Test end-to-end
- Backend su :9090 (già attivo: `java -jar target/lupus-1.00.jar`, DB Postgres su :5433), dev server su :5174 (già attivo; non avviarlo e non fermarlo).
- Account: `smoketest` / `Passw0rd!x` (master della partita `kamikaze-seer-plaguespreader`), `Nick` / `Lupus123!`.
- Per creare partite di test usa la stessa API della pagina newGame o i flussi in `RestApiTest/GameSection/*.http`. `CompleteGameTest.http` gioca una partita intera e mostra le richieste valide. Crea partite nuove con master `smoketest` e non modificare le partite esistenti degli altri utenti.
- Scenari minimi, da eseguire a 390px e a 1440px:
  - vista master: notte, giorno con votazione, ballottaggio, fine partita;
  - vista giocatore;
  - WebSocket: due pagine aperte sulla stessa partita (master e giocatore), la selezione del target si propaga;
  - log dei round ed espansione;
  - impostazioni e modale dei ruoli;
  - tema dinamico: `#gameStatus` cambia con la fase;
  - niente overflow orizzontale a 390px;
  - nessun errore in console.
- Script in `~/.cache/lupus-mockcheck/`, puppeteer-core da `~/.cache/lupus-mockcheck/node_modules`, Chrome in `/usr/bin/google-chrome`. **Niente screenshot.**
- Infine: `npx vite build --outDir /tmp/build-game --emptyOutDir` deve passare e `node ~/.cache/lupus-mockcheck/pages.mjs compare` deve dare `ok` (include la pagina master).

## Design
- Mobile first (390px): azioni principali raggiungibili col pollice, target di almeno 44px.
- Light e dark.
- Usa il design system reale: token `lf-*`, `@/components/lupus`, `@/components/ui/*`. Nessun import da `src/mocks/`.
- Colore utente: `userColor`/`UserToken`.
- Fazioni: `FactionBadge` / `factionFromType`.
- Icone dei ruoli: `ROLE_ICONS`, con `// shortcut: icone hardcoded, vedi docs/ui-redesign/TODO.md (colonna icona in DB)`.
- Se il mock mostra dati che l'API non fornisce, implementa solo ciò che si può e segna `// shortcut: ...`.

## Report (conciso)
- File cambiati ed eliminati.
- Tabella scenario → esito confronto con la baseline.
- Differenze di comportamento volute (con il perché).
- Cosa del mock non è stato possibile fare.
- Partite di test create (id pubblici).
