# Piano — Redesign UI "villaggio medievale giocoso"

Obiettivo: modernizzare la UI del frontend React (`frontend/src/`) con componenti shadcn (shadcn/ui + catalogo www.shadcn.io), tono **giocoso** con feeling **medioevo / villaggio**, senza cambiare logica, API, DB o URL.
Orchestratore: Opus. Esecutori: subagent Haiku. Vincoli completi in `SYSTEM_PROMPT.md`.

---

## Fase 0 — Fondamenta (1 agent Haiku, sequenziale)

1. Inizializza shadcn nel progetto Vite esistente (JS, non TS; `components.json` con `tsx: false`):
   - alias `@/` → `src/` in `vite.config.js` + `jsconfig.json`;
   - deps richieste da shadcn: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, pacchetti `@radix-ui/*` aggiunti dalla CLI;
   - `src/lib/utils.js` con `cn()`.
   - **Non** sovrascrivere i colori esistenti di `src/index.css` (palette lupus + ruoli `--roles-*`): aggiungi i token shadcn (`--background`, `--primary`, `--radius`…) accanto, mappati anche sul dark (`[data-bs-theme="dark"]`, non `.dark`).
2. Installa il set base (solo questi; altri si aggiungono quando servono):
   `button card dialog alert-dialog tabs input label checkbox switch table badge avatar tooltip dropdown-menu sheet command popover sonner select accordion scroll-area separator skeleton progress`
3. Verifica che l'app attuale compili e appaia **identica** (i componenti installati non sono ancora usati).
4. Crea la galleria mock (solo in dev):
   - route `/mock` (indice) e `/mock/:screen/:variant` in `App.jsx`, caricate con `React.lazy` e registrate solo se `import.meta.env.DEV`;
   - cartella `src/mocks/<screen>/<Variant>.jsx`, fixture JSON in `src/mocks/fixtures/` (catturate con curl dalle API reali con l'utente `smoketest`, shape identica);
   - i mock **non** chiamano il backend: usano solo fixture.

L'orchestratore poi scrive `docs/ui-redesign/variants.md` con i token concreti delle 5 varianti (palette HEX light/dark, font Google, radius, ombre, texture/illustrazioni, motion). Ogni brief di mock riceve il blocco della variante.

### Le 5 varianti (direzioni, uguali per tutte le schermate per avere coerenza)

| Id | Nome | Idea |
|----|------|------|
| **A** | *Fedele* | Layout e gerarchia attuali, stessi colori (navbar rossa/bordeaux, foresta), ma con componenti shadcn, spaziature moderne, angoli arrotondati, tipografia pulita. Il "restyling sicuro". |
| **B** | *Tavolo da gioco* (molto originale) | Lo schermo è un tavolo di legno visto dall'alto: carte-ruolo che si girano, gettoni, pergamene appuntate, la partita è una plancia circolare intorno al fuoco del villaggio; giorno/notte cambia tutta la luce della scena. |
| **C** | *Pergamena & sigillo* | Classico medievale: carta pergamena, bordi miniati, iniziali capolettera, sigilli di ceralacca come badge, font serif (es. Cinzel / IM Fell). Elegante, "libro delle regole". |
| **D** | *Notte al villaggio* | Dark-first, atmosfera: cielo notturno, lanterne calde, lucciole (riuso `Fireflies`), glow arancio, glassmorphism leggero sui pannelli. Il giorno è un'alba dorata. |
| **E** | *Cartoon giocoso* | Stile da gioco mobile/indie: forme morbide, bordi spessi, ombre "sticker", icone illustrate, micro-animazioni a molla, colori saturi ma terrosi. Mobile-first. |

---

## Fase 1 — Mock (5 per schermata)

Schermate (in ordine di priorità) e cosa ogni mock deve mostrare:

| # | Screen id | Pagina reale | Contenuti da coprire nei mock |
|---|-----------|--------------|-------------------------------|
| 0 | `shell` | `Navbar`, `Footer`, `Modal`, `Messages`, `SearchPlayer` | navbar loggato/non loggato, menu utente, ricerca giocatore, popup messaggi (errore/info/warning), modale generico, toggle tema |
| 1 | `login` | `pages/Login.jsx` | login + signup (switch tra i due), hint complessità password, mostra password, "resta collegato", errore |
| 2 | `home` | `pages/Home.jsx` | benvenuto, CTA nuova partita, partite in corso/recenti, accesso a regole e profilo |
| 3 | `game` | `pages/CurrentGame.jsx` (+ GameHeader, PlayersStatus, GameActions, GameLog, PlayerRole, GameSettings, RolesModal, GameOver) | vista **master** notte, vista master giorno (votazione), vista **giocatore** (solo ruolo/stato), cerchio giocatori vivi/morti, log per round, fine partita/vincitori |
| 4 | `newGame` | `pages/CreateNewGame.jsx` | scelta giocatori (amici, ricerca, checkbox), numero per ruolo (NumberInput), switch opzioni, riepilogo e avvio |
| 5 | `stats` | `pages/UserStatistics.jsx` | statistiche, grafici, tabella storico partite ordinabile, profilo di un altro utente + aggiungi amico |
| 6 | `profile` | `pages/UserPage.jsx` (CardsPanel, FriendsPanel, UpdateCredentialsPanel, DeleteAccountPanel) | card profilo, amici, modifica email/password, elimina account (alert) |
| 7 | `rules` | `pages/Rules.jsx` | regole, schede ruolo per fazione con colori ruolo |
| 8 | `notFound` | `pages/PageNotFound.jsx` | 404 a tema |

Per ogni schermata: **5 file** `src/mocks/<screen>/{A,B,C,D,E}.jsx` + screenshot.

### Esecuzione
- Ordine: prima `shell` (serve a tutte), poi le altre in parallelo.
- **1 agent Haiku per (schermata × variante)** nelle schermate grandi (`game`, `newGame`, `stats`); **1 agent per schermata** (5 varianti) in quelle piccole (`notFound`, `rules`, `login`, `home`, `profile`). Max ~6 agent contemporanei.
- Ogni mock: dati solo da fixture, nessun import dai moduli imperativi di gioco, solo componenti `@/components/ui/*` + Tailwind + `lucide-react`.
- Screenshot di ogni mock a **1440×900** e **390×844**, light e dark → `docs/ui-redesign/mocks/<screen>/<variant>-<w>-<theme>.png`.
- L'orchestratore genera `docs/ui-redesign/mocks/README.md`: una tabella per schermata con le 5 immagini e 2 righe di descrizione per variante.

### Gate utente
Chiedi all'utente (AskUserQuestion) per ogni schermata quale variante scegliere (o un mix, es. "D globale, ma login da B"). Annota le scelte in `docs/ui-redesign/decisions.md`. Non procedere senza.

---

## Fase 2 — Design system definitivo (1–2 agent)

- Consolida la variante scelta in token unici in `src/index.css` (light + dark), font, radius, ombre, motion.
- Personalizza le varianti dei componenti shadcn (`button`, `card`, `badge`…) con `cva` (es. `variant: "wax" | "wood" | "ghost"`), invece di creare componenti nuovi.
- Componenti di dominio riusabili in `src/components/lupus/`: `RoleBadge` (usa i colori `--roles-*`), `PlayerToken`, `PhaseIndicator` (giorno/notte), `ParchmentPanel`. Solo se usati in ≥2 schermate.
- Shell nuova (`Navbar`, `Footer`, `Modal` → `Dialog`, `Messages` → `sonner` mantenendo le firme di `populateErrorMessage/InfoMessage/WarningMessage`).

## Fase 3 — Applicazione alle pagine reali

1 agent per pagina, in parallelo dove i file sono disgiunti. Per ogni pagina:
- sostituisci markup/classi con i componenti scelti; **stessi handler, state, chiamate, id dei campi e `name` dei form**;
- `Modal`/`RolesModal` → `Dialog`; conferme distruttive → `AlertDialog`; `ToggleSwitch` → `Switch`; `NumberInput` → `Input`+`Button`; `SearchPlayer` → `Command`/`Popover`; tab login/signup → `Tabs` (attenzione: il `disabled` dei campi del pannello nascosto va mantenuto, i form restano due).
- Grafici e tabella ordinabile in `UserStatistics` (oggi Chart.js + sorttable da CDN): restyling via opzioni; la sostituzione con `chart` shadcn/recharts è opzionale e va chiesta all'utente.
- **CurrentGame**: solo classi e markup statico; nei moduli `.js` importa `buttonVariants`/`badgeVariants` e usa `cn()` per le classi; preserva ogni `id`/classe usata nei selettori (fai prima un elenco con grep e mettilo nel brief).

Ordine consigliato: shell → login → home → rules → notFound → profile → stats → newGame → game.

## Fase 4 — Verifica (orchestratore)

Per ogni pagina applicata, prima di passare oltre:
1. `npm run build` ok, nessun warning nuovo; `mvn clean package` a fine fase.
2. Screenshot light/dark, desktop/mobile, confronto con il mock scelto.
3. Smoke e2e con puppeteer (utente `smoketest`): login, logout, signup errore, ricerca giocatore, aggiunta amico, crea partita con 5 giocatori (smokep1..5 o crea utenti), notte master → giorno, vista giocatore, fine partita; zero errori in console (eccetto il 403 noto di `/api/session` da anonimo).
4. Accessibilità rapida: navigazione da tastiera nei dialog, focus visibile, contrasto.
5. Aggiorna `CLAUDE.md` (sezione Styling) e `frontend/src/README.md` con il nuovo design system.

Alla fine: rimuovere la galleria `/mock` e `src/mocks/`? → **chiedere all'utente**.

---

## Rischi noti
- I moduli di gioco imperativi leggono il DOM per id/classi: ogni rinomina rompe la partita. → elenco selettori nel brief + e2e obbligatorio.
- shadcn assume dark mode via classe `.dark`: qui è `data-bs-theme="dark"`; adattare i token, non introdurre un secondo sistema.
- Font e texture pesanti (varianti B/C): usare WebP/SVG e `font-display: swap`.
- Haiku tende a "migliorare" la logica: nei brief ripetere che logica e chiamate non si toccano; review del diff su ogni `fetch`/`generic*Request`/`onSubmit`.
- La nuova `Navbar` (Fase 2/3) deve mantenere la logica di `loadTheme()` in `components/Navbar.jsx` che propaga `data-bs-theme` dentro l'iframe `#background` del falò in Home (altrimenti il falò perde i colori).
- Mobile (Fase 2): navbar F a 390px occupa ~110px (riga logo + riga ricerca) e i PageTitle sono enormi → su mobile ricerca dietro un'icona (apre Sheet/Command) e titoli compatti, così il contenuto principale sta above the fold.
