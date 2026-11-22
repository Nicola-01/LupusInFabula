# Regole comuni — Fase 3 (applicare il design alle pagine REALI)

Progetto `/home/nicola/Desktop/LupusInFabula`, frontend React 19 + Vite + Tailwind v4 in `frontend/` (JavaScript). Leggi `CLAUDE.md` (Frontend, Styling). Il design approvato è il **mock F** della tua pagina (`frontend/src/mocks/<screen>/F*.jsx`, indicato nel tuo brief): è il riferimento visivo e di struttura. Decisioni utente: `docs/ui-redesign/decisions.md`.

## Cosa usare
- Design system reale (Fase 2): token/classi in `frontend/src/index.css` (`--lf-*`, colori Tailwind `bg-lf-paper`, `text-lf-ink`, `text-lf-ink2`, `border-lf-brass`, `bg-lf-felt`, `text-lf-on-felt`, `text-lf-rubric`, `bg-lf-wax`, `lf-faction-*`, font `font-lf-title|heading|body`, classi `.lf-page`, `.lf-paper`, `.lf-nav`, `.lf-input`, `.lf-seal`, `.lf-token`), componenti `@/components/lupus` (`Panel`, `Seal`, `Ornament`, `PageTitle`, `MessageBox`, `MessageSeal`, `LfToaster`, `lfToast`, `UserToken`, `userColor`, `USER_COLORS`, `RoleIcon`, `ROLE_ICONS`, `FactionBadge`, `FACTIONS`, `factionFromType`), shadcn `@/components/ui/*` (button con varianti `felt|brass|wax` e size `touch`, badge `felt|brass|wax|good|evil|neutral|stealer`, tabs, dialog, alert-dialog, sheet, checkbox, switch, input, accordion, …). Font Awesome 5.8.1 è caricato globalmente (`<i className="fas fa-…" aria-hidden="true" />`).
- Il mock usa il kit `mocks/shell/kit/F.jsx` con classi `.vf-*`: **non importare nulla da `src/mocks/`** nella pagina reale; traduci `.vf-*` nei token/classi `lf-` equivalenti.
- Shell già pronta: `Navbar`, `Footer`, `Messages`, `Modal` (non modificarli). Sfondo pagina: avvolgi il contenuto con la classe `.lf-page` (non toccare `body`).

## Regole ASSOLUTE (la logica non cambia)
1. Stessi handler, state, effetti, chiamate (`genericGET/POST/PUT/DELETERequest`, `fetch`), URL, redirect, `useLoginChecker`/`useSession`. **Stessi `id` e `name` dei campi dei form**, stesse `action`/`method` dei form POST. Stessa navigazione a page-load completo (`<a href="/lupus/...">`).
2. Prima di toccare il markup fai un elenco di ogni `id`/classe usati da codice (`getElementById`, `querySelector`, `classList`, selettori in `utils/*.js` e nei moduli importati dalla pagina) e **preservali**. I popup messaggi si riempiono per selettore: continua a renderizzare `<Messages />` (o i singoli) dove c'erano.
3. Se il mock mostra dati che l'API non fornisce o funzioni nuove che richiedono backend (preset salvati, colore utente salvato, ordine posti…), implementa solo la parte frontend possibile e segna il resto con `// shortcut: <limite>, vedi docs/ui-redesign/TODO.md`. Niente nuove chiamate API.
4. Tocca **solo** i file elencati nel tuo brief. Non toccare `index.css`, `components/lupus/*`, `components/ui/*`, shell, `src/mocks/*`, `README.md`, altri pagine. Se ti serve un'aggiunta al design system, scrivila nel report (non farla).
5. **Mobile first** (390px): target ≥44px, azioni principali nel pollice, niente tabelle larghe non scrollabili. Poi desktop 1440. Light e dark (variant `dark:` segue `data-bs-theme`).
6. Accessibilità: label sui campi, `aria-label` sui bottoni-icona, focus visibile, animazioni `motion-safe:`. Link: la regola globale `a { color; underline }` va sovrascritta con `!` sui link stilizzati.
7. Niente commit/push/delete; non avviare/fermare il dev server (:5174); mai `npm run build` semplice. **Non fare né leggere screenshot** (regola utente).

## Verifica (obbligatoria)
1. `cd frontend && npx vite build --outDir /tmp/build-<screen> --emptyOutDir` → ok, nessun warning nuovo.
2. `node ~/.cache/lupus-mockcheck/pages.mjs compare` → tutte le pagine `ok` (nessun errore console/rete nuovo rispetto al baseline; logga come `smoketest`, visita login, signup, rules, 404, home, me, stats, newgame, master a 390 e 1440).
3. Test funzionale DOM della tua pagina con puppeteer-core (`~/.cache/lupus-mockcheck/node_modules`, Chrome `/usr/bin/google-chrome`, script in `~/.cache/lupus-mockcheck/`), **senza screenshot**: verifica che gli `id`/`name` chiave esistano, che le azioni principali funzionino (indicato nel brief) e che a 390px non ci sia overflow orizzontale (`document.documentElement.scrollWidth <= 390`).
4. `git diff --stat` deve mostrare solo i tuoi file.

## Report (conciso)
File cambiati, id/name/selettori preservati, cosa del mock non è stato possibile fare (e perché), richieste al design system, esito delle verifiche.
