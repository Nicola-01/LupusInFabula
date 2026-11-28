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
