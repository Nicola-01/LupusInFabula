# `exceptions/` — eccezioni di dominio

Le eccezioni che il service lancia quando una regola non è rispettata (un valore già usato, una
risorsa che non esiste). Ogni eccezione porta **già** lo status HTTP e il `ProblemDetail` (il JSON
dell'errore), quindi nessun handler deve tradurla: il `GlobalExceptionHandler` la eredita dalla
classe base (vedi `controller/README.md`).

## Come si scrive un'eccezione

```java
/** 409: a unique value (username, email) is already taken. */
public class AlreadyUsedException extends ErrorResponseException {
  public AlreadyUsedException(String field) {
    super(HttpStatus.CONFLICT, problem(field), null);
  }
  ...
}
```

- estende `ErrorResponseException` di Spring (non `RuntimeException`): il costruttore riceve lo
  status e il `ProblemDetail`;
- `setProperty("field", field)` aggiunge un campo al JSON, così il frontend sa quale campo
  evidenziare senza leggere il testo;
- il messaggio (`"Username already used"`) è scritto nell'eccezione: il frontend legge
  `detail`, non deve tradurre lo status.

Risposta reale di `POST /signup` con un username già usato (curl):

```
HTTP/1.1 409
Content-Type: application/problem+json

{"detail":"Username already used","status":409,"title":"Conflict","field":"username"}
```

## Perché le eccezioni di sicurezza non sono qui

`AuthenticationException` e `AccessDeniedException` le lancia **Spring Security**, non il nostro
codice: non le possiamo cambiare. Le trasformiamo in `ProblemDetail` nel `GlobalExceptionHandler`
(metodi `handleAuthentication` e `handleAccessDenied`), che è il punto unico per tutti gli errori.

## Classi

- `AlreadyUsedException` — 409, con il campo (`username`, `email`) che è già usato.
- `PlayerNotFoundException` — 404, nessun account attivo con quello username.
- `WrongPasswordException` — 403, `currentPassword` sbagliata in `PUT`/`DELETE /user/me`. È 403 e
  non 401 perché l'utente **è** autenticato: un 401 farebbe credere al frontend che la sessione sia
  scaduta.
- `AlreadyFriendException` — 409, l'amico è già nella lista.
- `NotFriendException` — 404, rimozione di qualcuno che non è nella lista.
- `InvalidFriendException` — 400, aggiungere se stessi.
- `SearchTooShortException` — 400, ricerca con meno di 2 caratteri.
- `InGameException` — 409, il master o un giocatore è già in una partita non finita.
- `InvalidGameException` — 400, una regola della partita non è rispettata; il `detail` dice quale.
- `InvalidPlayersException` — 400, uno o più giocatori non possono giocare. Ha un enum annidato
  `PlayerProblem` (`NOT_FOUND`, `IN_GAME`, `IS_MASTER`) e una mappa `players` che associa ogni
  username (come è stato inviato) al suo problema. Uso di `LinkedHashMap` invece di `HashMap`: le
  chiavi restano nell'ordine della richiesta, così il frontend le mostra come le ha scritte l'utente.
- `GameNotFoundException` — 404, nessuna partita con quel `publicId`.
- `NoGamesException` — 404, il giocatore non è mai stato master né giocatore di una partita.
- `DeckNotFoundException` — 404, nessun mazzo con quell'id **tra quelli dell'utente**. Anche un
  mazzo esistente di un altro utente dà 404, per non rivelare che l'id esiste.
