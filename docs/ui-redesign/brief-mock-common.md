# Regole comuni per gli agent che scrivono MOCK (Fase 1)

Progetto: `/home/nicola/Desktop/LupusInFabula`, frontend React 19 + Vite + Tailwind v4 in `frontend/` (JavaScript, file `.jsx`, niente TypeScript). App per il master di "Lupus in Fabula" (Werewolf). Stiamo esplorando 5 direzioni visive (A–E) per un redesign "villaggio medievale giocoso"; tu scrivi mock statici.

## Cosa sono i mock
- File `frontend/src/mocks/<screen>/<V>.jsx` con `export default function ...` (pagina intera). Vengono caricati automaticamente dalla galleria dev su `http://localhost:5174/lupus/mock/<screen>/<V>` (dev server già in esecuzione: NON avviarne un altro, NON fermarlo).
- Dati SOLO da fixture: `import { session, roles, ... } from '@/mocks/fixtures'` (vedi `frontend/src/mocks/fixtures/index.js` per i nomi; apri i JSON per la shape). Se servono più dati (es. più righe di log) creali nel mock copiando ESATTAMENTE la shape della fixture. Nessuna chiamata di rete, nessun `fetch`, nessun import da `@/utils/*`, `@/pages/*`, `@/components/game/*`.
- Interattività solo locale (useState) per mostrare gli stati (tab, dialog aperto, toggle). Più stati della stessa schermata: mostrali uno sotto l'altro con un'etichetta piccola, oppure con un piccolo switcher in alto nel mock.
- Shell comune: se esiste `frontend/src/mocks/shell/kit/<V>.jsx` usa i suoi export (`Layout`, `Navbar`, `Footer`, ...) per la tua variante, invece di riscrivere navbar/footer.

## Componenti
- Prima i componenti già installati in `frontend/src/components/ui/` (shadcn, import `@/components/ui/<nome>`): button card dialog alert-dialog tabs input label checkbox switch table badge avatar tooltip(serve `TooltipProvider` attorno) dropdown-menu sheet command popover sonner select accordion scroll-area separator skeleton progress. Leggi il file del componente prima di usarlo per vedere gli export.
- Icone: `lucide-react`. Classi: Tailwind v4 + `cn` da `@/lib/utils`.
- NON modificare i file in `components/ui/`, `index.css`, `App.jsx`, `vite.config.js`, `package.json`, le pagine reali o i file di altri agent. Non installare pacchetti. Personalizza lo stile passando `className` ai componenti.
- Stili della variante: usa SOLO i token della tua variante (sotto). Valori arbitrari Tailwind (`bg-[#f4e9d1]`, `font-['Cinzel']`) o un `<style>` scoped su una classe wrapper `.mock-<V>`. Font Google: aggiungi il `<link>` a `document.head` in un `useEffect` (una volta, controlla se esiste già).
- ATTENZIONE: `index.css` ha una regola globale `a { color:#0d6efd; text-decoration:underline }` (e una dark più specifica): su ogni `<a>` imposta colore e decorazione con `!` (es. `!text-inherit !no-underline`), anche nei contenuti portaled (menu, sheet, dialog).
- Dark mode: `dark:` segue `data-bs-theme="dark"` su `<body>` (la galleria la imposta con `?theme=dark`). Ogni mock DEVE essere curato in light e in dark.
- **Mobile first** (decisione utente): l'app si usa soprattutto da telefono. Progetta PRIMA a 390px (target touch ≥ 44px, azioni principali raggiungibili col pollice, niente tabelle/colonne larghe), poi adatta a 1440px.
- Accessibilità: contrasto AA, focus visibile, `aria-label` sui bottoni con sola icona, animazioni solo `motion-safe:`.
- Testi dell'interfaccia in inglese (come l'app attuale).

## Verifica (obbligatoria)
**Decisione utente: NON leggere (Read) gli screenshot, costano troppo.** Verifica solo compilazione (curl 200) e assenza di errori console (`mock.mjs` righe ok/ERR). Gli screenshot si guardano solo su richiesta esplicita dell'utente.
Mai `npm run build` o `vite build` senza `--outDir /tmp/build-<screen>-<V> --emptyOutDir` (l'outDir di default è condiviso). Il 404 su `/lupus/lupus/config.js` in console è noto: ignoralo.

1. `curl -s -o /dev/null -w '%{http_code}' http://localhost:5174/lupus/src/mocks/<screen>/<V>.jsx` → 200 (500 = errore di compilazione: leggi il body).
2. `node ~/.cache/lupus-mockcheck/check.mjs <screen> <V>` → screenshot in `docs/ui-redesign/mocks/<screen>/<V>-{1440,390}-{light,dark}.png`; ogni riga deve dire `ok` (altrimenti errori console da correggere).
3. ~~Apri (Read) almeno `<V>-1440-light.png`, `<V>-1440-dark.png` e `<V>-390-light.png` e correggi problemi evidenti (testo illeggibile, overflow, elementi sovrapposti, dark non curato).

## Report finale (conciso)
File creati, stati coperti, cosa NON sei riuscito a fare, eventuali problemi.
