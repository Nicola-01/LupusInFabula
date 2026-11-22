# Brief — sfondo animato del Login

Da usare come primo messaggio di una nuova chat. Repo: `/home/nicola/Desktop/LupusInFabula`, branch `ui-redesign`. Leggi prima `CLAUDE.md`, poi questo file; contesto del redesign in `docs/ui-redesign/` (`PLAN.md`, `decisions.md`, `variants.md` § F).

## Obiettivo
Rifinire lo sfondo immersivo della pagina di login: una radura notturna nel bosco con un **falò** al centro, **ceppi verticali come sedute** in cerchio (uno per posto, come i giocatori attorno al fuoco), un **tronco disteso** come panca, **pini** su più piani, una **luna** con un **lupo che ulula** su una roccia, occhi che brillano nel bosco di notte. Tema chiaro = tramonto/crepuscolo, scuro = notte.

## File
- `frontend/src/components/login/loginBackground.html` — **il file da sistemare**. Documento HTML autonomo (solo HTML + CSS + SVG inline, niente JS, niente asset/font esterni), reso in un iframe a tutta pagina via `srcDoc`.
- `frontend/src/mocks/login/F.jsx` — mock che lo usa (iframe fisso `-z-10`, `Layout transparent`, card di login sopra). Inietta `data-bs-theme` nel tag `<html lang="en">` del file.
- Riferimenti di stile: `frontend/src/components/home/homeBackground.html` (falò originale: l'effetto fiamme + fumo piace molto all'utente, va mantenuto), `frontend/src/components/home/villageBackground.html` (scena del villaggio della home, stesso contratto, approvata).
- Palette: `docs/ui-redesign/variants.md` § F.
- Generatori usati finora (fuori repo, possono essere spariti dopo un riavvio): `/tmp/lf-login/gen2.mjs`, `gen3.mjs`, `w3.svg`.

## Contratto tecnico (non cambiarlo)
- Il tag di apertura deve restare esattamente `<html lang="en">` (il mock ci inietta `data-bs-theme`).
- Colori come variabili CSS sotto `[data-bs-theme="light"]` e `[data-bs-theme="dark"]`; default light se manca l'attributo.
- Riempie 100vw × 100vh, `overflow:hidden`.
- Animazioni solo transform/opacity, niente blur grandi, < ~60 elementi animati; tutte spente con `@media (prefers-reduced-motion: reduce)`.
- Responsive: a 390×844 (uso principale: **mobile first**) la scena sta nella fascia alta (~28% sotto la navbar, sopra la card); a 1440×900 il falò è sotto la card centrata e i ceppi laterali restano visibili.

## Stato attuale (dopo l'ultimo giro)
- Lupo ridisegnato da zero (profilo verso sinistra, seduto sulla roccia, muso lungo con bocca aperta, orecchie a punta, criniera, coda folta), ~45×53 unità, luna r=64. **Non ancora visto da nessuno.**
- Pini su 3 piani (≈39 lontani chiari, ≈20 medi `--tree-mid`, 11 vicini scuri ai bordi), posizioni irregolari.
- Ceppi stile "b" (rustici: anelli sulla faccia superiore, corteccia, tacche d'ascia, muschio variabile, rametti, crepe, un fungo rosso), ognuno diverso; ombre radiali verso l'esterno dal fuoco; lato verso il fuoco illuminato; un tronco disteso in fondo a sinistra al posto di un ceppo.

## Storico feedback dell'utente (in ordine)
1. Vuole uno sfondo "immersivo con carattere" che rappresenti Lupus in Fabula: falò con attorno tronchi verticali, uno per seduta.
2. Card login/signup di pari altezza (fatto, 499px a 390 e 574px a 1440 su entrambe le tab).
3. Mobile first: la scena deve vedersi sul telefono (fatto, fascia alta).
4. "Il lupo non è un lupo, ed è troppo grande" → rimpicciolito e ridisegnato.
5. "Gli alberi in back sono tutti in riga, li voglio più sparsi" → 3 piani.
6. Tronchetti: scelti i "b", ma "sistema l'ombra" e "cambiali leggermente uno dall'altro (più o meno muschio, un rametto…), magari anche un tronco disteso" → fatto.
7. **Non** usare il logo dell'app sulla roccia: lì va un lupo vero disegnato (il logo-lupo `frontend/public/media/logo_wolf_sm.svg` è nella navbar).
8. Dopo il primo ridisegno: "il lupo ha la 104" (deforme) → ridisegnato con anatomia esplicita; da verificare.

## Da fare / verificare
- Guardare il risultato (screenshot o browser) e sistemare: anatomia e leggibilità del lupo, che le parti del lupo siano unite, varietà e naturalezza dei pini, ombre e luce dei ceppi, tronco disteso in prospettiva.
- Controllare light e dark, 390×844 e 1440×900.
- Nota costi: l'utente ha chiesto di **limitare gli screenshot** (costano); se servono, fare crop piccoli e mirati (es. solo il lupo, solo i ceppi) e pochi.

## Come vedere / verificare
- Dev server: `cd frontend && npm run dev` → http://localhost:5174/lupus/mock/login/F (`?theme=dark` / `?theme=light`, `&bare=1` per nascondere la toolbar della galleria). Il backend non serve per i mock.
- Scena da sola: aprire il file HTML aggiungendo `data-bs-theme="dark"` al tag `<html>`.
- Controllo errori console (niente screenshot): `node ~/.cache/lupus-mockcheck/check.mjs login F` → deve stampare `ok` su tutte le righe.

## Vincoli
- Modificare solo `loginBackground.html` (e se serve `mocks/login/F.jsx` per l'iframe). Non toccare il kit `mocks/shell/kit/F.jsx`, `index.css`, le pagine reali.
- Niente commit/push senza richiesta. Porte 5173/5432/8080 sono di un altro progetto: non usarle.
- Rispondere in italiano, conciso.
