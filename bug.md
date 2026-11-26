# Bug trovati durante la migrazione Spring Boot + React

Bug presenti nel codice ORIGINALE (servlet/JSP). Non sono stati corretti, per non cambiare la logica, salvo dove indicato.
I percorsi si riferiscono ai file originali, che si possono vedere nel branch `WebSocket`.

## Backend

1. **`/game/list` con metodo diverso da GET scrive due JSON**: `servlet/GameDispatcherServlet.java:157-171`. Nel ramo non-GET manca un `return`: viene scritto il 405 e poi `service()` aggiunge anche UNKNOWN_RESOURCE.
   Repro: da loggati, `PUT /lupus/game/list` → il body contiene due documenti JSON. *Comportamento mantenuto in `GameController`.*
2. **Messaggio 405 sbagliato su `/game/update/{id}`**: `servlet/GameDispatcherServlet.java:252-257`. Dice "required GET", ma il metodo corretto è PUT.
   Repro: `GET /lupus/game/update/<id>`.
3. **GAME_NOT_FOUND al posto di UNKNOWN_RESOURCE**: `servlet/GameDispatcherServlet.java:205`. Il lookup del gioco avviene prima della whitelist delle rotte (riga 238).
   Repro: `GET /lupus/game/bogus/<id inesistente>` → GAME_NOT_FOUND. *Con i controller Spring ora risponde UNKNOWN_RESOURCE.*
4. **Username che iniziano con "me" non raggiungibili**: `servlet/UserDispatcherServlet.java:132`. Il check `path.contains("/me")` cattura anche `/user/mentor`.
   Repro: `GET /lupus/user/mentor` → 404 "Unknown URI" anche se l'utente esiste. *Con i controller Spring ora funziona.*
5. **Messaggio 405 incompleto su `/user/me`**: `servlet/UserDispatcherServlet.java:153`. Dice "required PUT or DELETE" ma anche GET è supportato, e contiene il refuso "Unsuported".
6. **NPE senza risposta JSON nei dispatcher**: `servlet/GameDispatcherServlet.java:37` (e la riga equivalente in `UserDispatcherServlet`). `LogContext.setUser(...)` è fuori dal try e dereferenzia l'utente in sessione; senza utente lancia una NPE. Normalmente lo impedisce `UserFilter`.
7. **Redirect a una pagina inesistente dopo un 403**: `filter/UserFilter.java:140`. Dopo aver scritto il 403 JSON chiama `sendRedirect("/jsp/login.jsp")`, quindi la risposta diventa un 302 verso un URL che non esiste.
   Repro: `POST /lupus/login` con una password sbagliata (crea una sessione senza utente), poi `GET /lupus/user/me` con lo stesso cookie → 302 a `/lupus/jsp/login.jsp`.
8. **Token di login nei log in chiaro**: `filter/UserFilter.java:177` (e `PagesFilter.getPlayerByToken`). Il valore del cookie `loginToken` viene scritto nel log.
   Repro: qualsiasi richiesta con il cookie `loginToken`, poi grep nel log.
9. **SQLException ignorata nei filtri**: `filter/UserFilter.java:151` e `filter/PagesFilter.java:136`. L'eccezione viene solo loggata: la chain non prosegue e non c'è risposta, quindi il client riceve un 200 vuoto.
   Repro: fermare il DB, poi `GET /lupus/home` con il cookie `loginToken`.
10. **`/newvillage` minuscolo non protetto**: `WEB-INF/web.xml:58,128-134`. `PagesFilter` copre `/newVillage` ma non `/newvillage`, e il commento "case-insensitive" è sbagliato.
    Repro: da non loggati, `GET /lupus/newvillage` mostra la pagina, mentre `/lupus/newVillage` rimanda al login. *Mappatura mantenuta uguale in `FilterConfig`.*
11. **Possibile NPE su `gameMaster.equals(...)`**: `filter/PagesFilter.java:193` e `servlet/LoginSignupServlet.java:346`. Se il master del gioco non viene trovato la lookup restituisce null e scatta la NPE (probabilmente irraggiungibile in pratica).
12. **NPE su `/logout` senza utente in sessione**: `servlet/LoginSignupServlet.java` (`doGet`, ramo logout). `p.getUsername()` su `p == null`; normalmente lo impedisce `UserFilter`.
13. **Context path fisso e username non decodificati**: `servlet/UserPageServlet.java:58` e `servlet/CurrentGameServlet.java:57`. `/lupus` è scritto a mano e gli username con caratteri URL-encoded non vengono decodificati.
14. **Cookie `loginToken` senza HttpOnly/Secure**: `servlet/LoginSignupServlet.java` (`keepLoggedUser`). Il token di login persistente è leggibile da JavaScript, quindi esposto a XSS.

## Frontend

15. **Due versioni di Bootstrap caricate insieme**: `jsp/include/head.jsp` carica Bootstrap 5.3.8 (CSS + bundle JS) e `jsp/include/foot.jsp` carica anche jQuery slim 3.3.1, popper 1.14.7 e Bootstrap 4.3.1 JS. *Superato: Bootstrap è stato sostituito da Tailwind.*
16. **Rimozione amico sbagliata dalla lista "da ignorare"**: `js/friend/friendManagement.js:128`. `splice(indexOf(name), 1)` con `indexOf == -1` rimuove l'ultimo elemento.
    Repro: rimuovere un amico il cui nome non è in `playersToIgnore`.
17. **Parentesi sbagliata in `indexOf`**: `js/game/createNewGame.js:543` e `:562`. Si fa `indexOf(x, 1)` e poi `splice(idx)` senza count, quindi si cancellano tutti gli elementi dopo l'indice.
    Repro: aggiungere un amico al villaggio e poi rimuoverlo.
18. **XSS nei popup dei messaggi**: `js/utils/message.js:90-92`. Il testo del server viene inserito con `innerHTML`.
    Repro: una risposta di errore con `<img src=x onerror=alert(1)>` nei dettagli. *Nel port React il testo viene renderizzato come testo.*
19. **XSS nella ricerca giocatori**: `js/utils/searchPlayer.js:183`. L'evidenziazione costruisce HTML dall'username e lo inserisce con `innerHTML`. *Nel port React vengono creati nodi React.*
20. **Popup di ricerca vuoto**: `js/utils/searchPlayer.js:194`. L'apertura del popup si basa sulla lista non filtrata.
    Repro: una ricerca che restituisce solo giocatori ignorati mostra un popup vuoto.
21. **Ricerca con `searchUserContain` undefined**: `js/utils/searchPlayer.js` (`searchUser`). `user.includes(undefined)` cerca la stringa "undefined".
    Repro: scrivere "undefined" come prima ricerca.
22. **TypeError dopo aver aggiunto un username inesistente**: `js/game/createNewGame.js:151`. `removeFromPlayersTable()` inserisce la riga suggerimento e poi il ciclo legge `rows[0].cells[1]`, che è undefined. La disponibilità degli amici non viene aggiornata.
    Repro: in /newVillage scrivere un nome che non esiste e premere "Add!". *Nel port React non si verifica.*
23. **TypeError con la tabella amici vuota**: `js/game/createNewGame.js:162`. `rows[0].hasAttribute` fallisce se la risposta di disponibilità arriva prima della lista amici.
    Repro: rallentare `GET /lupus/user/me/friend` e aggiungere un giocatore prima che risponda.
24. **Crash senza `playerName` in localStorage**: `js/game/createNewGame.js:21`. `localStorage.getItem("playerName").toLowerCase()` lancia un'eccezione e salta il resto dell'inizializzazione della pagina.
    Repro: cancellare la chiave `playerName` da localStorage e aprire /newVillage. *Nel port React c'è un controllo.*
25. **Testi di errore copiati e incollati**: `js/game/createNewGame.js:88`, `:292` (e `:189`). Gli alert per amici e impostazioni dicono tutti "No game settings available".
26. **Variabile CSS inesistente**: `css/game/createNewGame.css:113`. `var(--bd-teal-rgb)` non è definita, quindi i pulsanti freccia non hanno sfondo.
27. **Selettori CSS che non applicano mai**: `css/game/createNewGame.css:170`, `:178`. `.toggle-switch input:checked + .toggle-switch-handle` non trova niente perché l'handle non è fratello dell'input.
28. **Invio con Enter salta la validazione**: `js/login.js:73`, `:89`. Premendo Enter viene chiamato `form.submit()`, che salta la validazione HTML e invia il form anche con campi vuoti o non validi.
    Repro: aprire /lupus/signup, mettere il focus su username vuoto e premere Enter → parte la POST. *Nel port React il form vuoto non viene inviato.*
29. **Off-by-one in `nth-child`**: `js/pageNotFound.js:79` (alberi) e `:103` (stelle). L'indice parte da 0 ma il selettore conta da 1, quindi l'ultimo albero (25°) e l'ultima stella (150°) non ricevono stile e restano invisibili. *Comportamento replicato nel port.*
30. **Label flottanti sempre sollevate**: `jsp/login.jsp:40,46,62` con `css/login.css:150,155,160`. Con `placeholder=""` il selettore `:not(:placeholder-shown)` è sempre vero, quindi le label stanno sopra i campi anche quando sono vuoti. *Comportamento mantenuto.*
31. **`innerHTML` con `public_ID`**: `js/homepage.js:24`. Il messaggio è costruito senza escape (rischio basso).
32. **`<hr>` dentro `<p>`**: `jsp/rules.jsp:65`, `:92`. Errore di annidamento HTML: il paragrafo si chiude prima e il testo "Note:" finisce fuori.
33. **Frecce dello slideshow non accessibili da tastiera**: `jsp/rules.jsp:149` (e gli altri link `.prev`/`.next`). Sono `<a onclick>` senza `href`, quindi non ricevono il focus.
34. **Refuso `d-flax`**: `jsp/login.jsp:107`. Dovrebbe essere `d-flex`; così la classe non ha effetto.
35. **Variabili del tema mai applicate nell'iframe di sfondo**: `jsp/utils/homeBackground.html:7,19`. I selettori `[data-bs-theme=...]` non trovano niente dentro l'iframe, quindi i gradienti cielo/roccia restano non impostati.
36. **Font Jost dichiarato ma mai caricato**: `css/common.css`. Il testo cade sul font sans-serif di sistema.
37. **WebSocket che si accumulano**: `js/game/currentGame/gameWebSocket.js:26` (chiamato da `playersStatus.js:181`, `:201`). Ogni volta che si ricostruisce il cerchio/griglia dei giocatori viene aperto un nuovo WebSocket, senza mai chiudere quello vecchio. Lato master `actionsResponse` chiama `elementsReload()` a ogni invio, quindi ogni voto viene gestito una volta per ogni socket aperto. Inoltre `onclose` logga solo "TODO", senza riconnessione.
    Repro: aprire /village/<id>/master, inviare azioni 2-3 volte e guardare il numero di WS nel tab Network. *Comportamento mantenuto (il port chiude i socket solo quando si lascia la pagina).*
38. **Primo caricamento del log senza `/master`**: `js/game/currentGame/gameLog.js:14-15` con `js/game/currentGame.js:46`. Il `DOMContentLoaded` di gameLog parte prima che `endsWithMaster` sia impostato. Su una partita finita i log non vengono richiesti di nuovo, quindi il master vede la versione del giocatore.
    Repro: aprire /village/<id-finita>/master come master. *Comportamento mantenuto.*
39. **TypeError per chi non gioca nella partita**: `js/game/currentGame/playersStatus.js:220-221`. Il ramo "No shot" usa `document.getElementById(user + "_status")` senza controllare null; se l'utente loggato non è un giocatore della partita (spettatore) lancia un'eccezione. Trovato leggendo il codice, non riprodotto.
40. **Richiesta inutile**: `js/game/currentGame.js` (`elementsReload`). Chiama `GET game/settings/<id>` con un callback vuoto (`empty()` è un TODO).
41. **Animazione `wave-4` mai definita**: CSS della pagina di gioco. La checkbox la usa, ma i keyframes non esistono. *Rimossa nel port.*
42. **`oldEmail` sempre null quando si elimina l'account**: `js/user/deleteAccount.js:49`. L'input `#email` è `disabled`, quindi non entra nel FormData e il body della DELETE contiene `"oldEmail": null`. *Comportamento mantenuto.*
43. **Backslash in più nella classe**: `jsp/user/deleteAccount.jsp:36`. `class="button-container mb-0 mt-5\"`: il `mt-5` non viene applicato.
44. **"Update the card" non fa niente senza una selezione**: `js/user/cards.js:77`. `querySelector('input[name="cardSelection"]:checked').value` lancia un'eccezione se non è stata cliccata nessuna carta (quella di default è evidenziata ma non selezionata).
    Repro: aprire Cards e cliccare Update senza scegliere una carta.
45. **Storico partite al contrario, intestazione in fondo**: `js/user/userStatistics.js:98`. `tbody.insertRow(0)` inserisce ogni partita sopra la riga di intestazione.
    Repro: aprire /habitant/<user> con almeno 2 partite. *Comportamento mantenuto.*
46. **Errore di aggiunta amico non mostrato**: `js/friend/friendActionButton.js:117`. Il selettore `#friendsPage .errorMessage` non esiste nella pagina delle statistiche, quindi l'errore non compare.
    Repro: aggiungere da un'altra scheda un amico già aggiunto.
47. **Amico "In game" con link `village/undefined`**: `js/friend/friendManagement.js:255`, `:265`. Il confronto è `players.get(name) === null`, ma `Map.get` restituisce `undefined`.
48. **XSS nel titolo delle statistiche**: `js/user/userStatistics.js:27`. L'username viene inserito con `innerHTML`. *Nel port React viene renderizzato come testo.*
49. **Maiuscole incoerenti nei messaggi**: `js/user/userStatistics.js:239,241,245`. Questi messaggi usano il nome in minuscolo, mentre il messaggio della tabella partite lo lascia com'è.
50. **Selettore CSS non valido**: `css/game/currentGame.css`. `#copyLink:focus:end` usa la pseudo-classe inesistente `:end`, quindi la regola non viene mai applicata.
51. **Lista amici vuota senza `playerName` in localStorage**: `js/friend/friendManagement.js:48`. `localStorage.getItem("playerName").toLowerCase()` lancia un'eccezione se l'utente non è passato prima dalla home (`playerName` viene impostato solo in `jsp/home.jsp:63`), quindi la lista amici non viene riempita. *Corretto nel port React: `FriendsPanel` usa lo username della sessione.*
52. **Errore JS nella home senza utente loggato**: `jsp/home.jsp` (script in fondo). `document.getElementById("username").innerText` lancia un'eccezione perché lo span esiste solo dentro il `c:if` dell'utente loggato.
53. **Refuso nel nome di una variabile CSS**: `css/lupusColors.css` e `css/common.css`. `--roles-db-victoryStealer-` ha "db" al posto di "bg" e un trattino finale in più. Funziona perché è usata sempre con lo stesso nome, ma è fuorviante. *Nome mantenuto in `frontend/src/index.css`.*
54. **"Show more" dei popup non si ripristina**: `js/utils/message.js` (`populateMessage`; ora `frontend/src/utils/message.js`). Se un popup viene riempito senza dettagli extra il bottone `.showMore` viene nascosto e non torna più visibile ai popup successivi con dettagli; anche `.moreDetails` resta espanso tra una chiamata e l'altra. *Comportamento mantenuto.*
55. **500 sui log per chi guarda una partita in cui non gioca**: `rest/GameLogGetRR.java:131`. Per un utente che non è nella partita `pl.get(nmPlayer)` è `null`, `GameRoleAction.valueOfName("null")` restituisce `null` e `getRoleType()` lancia NullPointerException. Repro: da loggati come un utente esterno alla partita, aprire `/village/<id>` → `GET /game/logs/<id>` risponde 500 e il log resta vuoto. *Comportamento mantenuto.*
