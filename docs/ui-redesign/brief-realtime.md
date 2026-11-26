# Aggiornamenti realtime della partita via WebSocket

Progetto `/home/nicola/Desktop/LupusInFabula` (leggi `CLAUDE.md`). WebSocket della partita: backend `src/main/java/it/unipd/dei/webapp/lupus/webSocket/GameWebSocket.java` (`/gameWS/{room}`, room = id pubblico della partita), frontend `frontend/src/components/game/currentGame/useGame.js` (socket), `VillagePage.jsx` e `Table.jsx` (tavolo con frecce e contatori).

## Cosa vuole l'utente
Oggi il WebSocket condivide solo il target che un giocatore indica toccando un posto (messaggi `sender:target`). Mancano:
1. **Cambio di stato in tempo reale.** Quando il master invia le azioni (notte → giorno, giorno → notte, fine partita) o cambia le impostazioni (previous round, skip day, end game), le pagine dei giocatori devono aggiornarsi da sole: titolo NIGHT/DAY, tavolo, morti, log, tema dinamico.
2. **Voti in tempo reale durante il giorno.** I voti li inserisce il master nel suo form, toccando il votante e poi il votato (`VillagePage.jsx`, ramo master di giorno: `rows`, `counts`, `arrows`). Mentre il master vota, i giocatori devono vedere sul loro tavolo chi ha votato chi (le frecce) e il contatore dei voti su ogni posto, come li vede il master. Lo stesso vale per il ballottaggio: si mostra la sezione corrente del form.

## Protocollo (nuovi messaggi, compatibili con quelli esistenti)
Uno username non può iniziare con `#` (regex di signup), quindi i messaggi che iniziano con `#` non si confondono con quelli esistenti.

| Direzione | Messaggio | Significato |
|---|---|---|
| server → client | `#update` | lo stato della partita è cambiato: ricarica i dati |
| client (solo master) → server | `#votes:<json>` | stato corrente dei voti del form del master; `<json>` = array di coppie `[["voter","target"], …]`; `[]` = nessun voto |
| server → client | `#votes:<json>` | stesso contenuto, inoltrato a tutti nella room |

I messaggi esistenti `sender:target` non cambiano.

## Backend (`GameWebSocket.java` + `rest/GameActionsPostRR.java` + `rest/GameStatusUpdateRR.java`)
- `public static void notifyUpdate(int gameID)` invia `#update` a tutte le sessioni aperte delle room associate a quel `gameID` (`gameIdMap`: room → gameID). Va chiamata **alla fine** di una POST delle azioni andata a buon fine (`GameActionsPostRR`, dopo tutte le scritture nel DB, anche nel caso vittoria) e di un aggiornamento di stato andato a buon fine (`GameStatusUpdateRR`), così i client ricaricano dati già completi. Un errore di invio su una sessione si logga e non interrompe le altre né la risposta HTTP.
- In `onMessage`: se il messaggio inizia con `#votes:` e il mittente è il master della partita (ruolo `master` in `gameStateCache`, come già controllato in `broadcast`) e la fase è DAY, salva l'ultimo snapshot per gameID (nuova mappa statica) e lo inoltra così com'è a tutte le sessioni della room. Se il mittente non è master o la fase non è DAY, lo ignora. Il JSON non va interpretato, solo inoltrato. Va però rifiutato se supera 10 kB.
- In `onOpen`: dopo i messaggi già inviati oggi, se c'è uno snapshot di voti per quella partita, lo invia alla nuova sessione.
- `freeGameWebSocket` (chiamata a ogni cambio di fase e a fine partita) cancella anche lo snapshot dei voti.
- Le chiamate REST e il formato dei messaggi `sender:target` restano invariati.

## Frontend (`useGame.js`, `VillagePage.jsx`, `Table.jsx`)
- In `socket.onmessage`:
  - **`#update`**: solo se NON siamo nella vista master (il master ricarica già dopo le sue azioni), ricarica i dati della partita con la funzione già esistente `elementsReload()`. Così tornano status, giocatori e log, e il socket si ricrea come già succede oggi. Se la partita è finita, riusa lo stesso percorso che porta alla schermata "The End" (vedi come lo fa oggi `onReload`). Il tema dinamico si riapplica: dopo il cambio di `#gameStatus` chiama `loadTheme()` (export di `components/Navbar.jsx`), se non lo fa già.
  - **`#votes:<json>`**: salva le coppie in `s.votes` (una Map voter→target) e fai rerender. `s.votes` si azzera quando si ricaricano i giocatori, come già succede per `s.selections`.
  - Gli altri messaggi seguono la gestione attuale, che non cambia.
- **Master, di giorno:** quando cambiano i voti della sezione corrente del form (le `rows` di `VillagePage`, deduplicate come oggi), oppure quando cambia la sezione (voto o ballottaggio), invia `#votes:` + JSON delle coppie con un valore. Usa una funzione `sendVotes(pairs)` esposta da `useGame` che usa l'ultimo socket aperto (`s.sockets`). Non inviare se il contenuto non è cambiato rispetto all'ultimo invio. Dopo l'invio delle azioni (fine giorno) non serve mandare `[]`: lo snapshot lo cancella il server.
- **Giocatori e spettatori, di giorno:** sul tavolo, frecce da `s.votes` (stile delle frecce di voto del master: tone `ink`, curve) e `count` sui posti come nel ramo master (`seat(name).count`). Le frecce `ws` delle selezioni dei giocatori restano come oggi.
- Niente nuove chiamate REST. Gli `id` del DOM restano gli stessi. Il design è quello del tavolo esistente.
