# Regole comuni: navigazione SPA (niente ricarica di pagina)

Progetto `/home/nicola/Desktop/LupusInFabula`. Frontend React 19 + react-router 7 + Vite in `frontend/`. Leggi prima `CLAUDE.md` e `frontend/src/README.md`.

## Obiettivo (richiesta dell'utente)
Oggi la navigazione interna ricarica sempre la pagina intera: `<a href="/...">` e `window.location.href = ...`. Anche i tab di /habitant/me ricaricano. L'utente vuole una vera app React:
- ogni cambio di schermata avviene lato client, senza ricarica;
- nessuna richiesta al backend fatta solo per "entrare" in una pagina;
- la sessione (`fetchSession()` in `utils/session.js`, promise a livello di modulo) si prende una volta sola e si riusa tra le navigazioni.

## Come
- Link interni → `<Link to="/...">` di `react-router-dom`. Se il link è stilizzato, tieni la stessa `className`: `Link` produce un `<a>`, quindi gli stili `!no-underline`/`!text-…` funzionano uguale.
- Navigazione da codice → `const navigate = useNavigate(); navigate('/...')` (con `{ replace: true }` dove prima c'era `location.replace`).
- Query string (es. i tab `?page=`) → `useSearchParams`.
- Componenti shadcn con `asChild` (Button, DropdownMenuItem): metti `<Link>` come figlio, al posto di `<a>`.
- Restano a ricarica completa:
  - la POST di login e di signup, con il redirect di risposta;
  - `/logout` (è un endpoint del backend che invalida la sessione: usa `<a href="/logout">` oppure `reloadDocument` su `Link`);
  - i link esterni.
- `contextPath` (`utils/utils.js`) vale `origin + "/"` e si usa per le chiamate API. Va bene lì; non usarlo per navigare.

## Regole
- Niente cambi a backend, API, DB o URL. Gli URL restano identici, e il deep link e il refresh di ogni pagina devono continuare a funzionare.
- Le stesse chiamate API di prima: niente endpoint nuovi, niente chiamate in più.
- Stessi `id` e `name` del DOM (li usano il codice e i test). Il design non cambia.
- Tocca SOLO i file elencati nel tuo brief. Non toccare `src/mocks/` né `components/ui/`.
- Niente commit, niente push, niente screenshot. Il dev server su :5174 e il backend su :9090 sono già attivi: non avviarli e non fermarli. Le porte 5173, 5432 e 8080 sono vietate.
- Per la build usa solo `npx vite build --outDir /tmp/build-spa-<nome> --emptyOutDir`, lanciato da `frontend/`.

## Verifica
- La build deve passare.
- Test con puppeteer-core:
  - script in `~/.cache/lupus-mockcheck/`, Chrome in `/usr/bin/google-chrome`; esempi: `pa2.mjs` (login più navigazione) e `pages.mjs`;
  - account: `smoketest` / `Passw0rd!x` (master di `kamikaze-seer-plaguespreader`), `Nick` / `Lupus123!`;
  - per controllare che non ci sia stata ricarica: `await page.evaluate(() => window.__mark = 1)` dopo il primo caricamento, poi clicca i link; dopo ogni clic `window.__mark` deve valere ancora 1;
  - nessun errore in console.
- `node ~/.cache/lupus-mockcheck/pages.mjs compare` → tutte le righe devono essere `ok`.
- `git diff --stat` deve mostrare solo i tuoi file.

## Report (breve, in italiano)
File modificati, navigazioni rimaste a ricarica completa e perché, esito delle verifiche, problemi.
