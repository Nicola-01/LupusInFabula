# Varianti di design — token concreti

Ogni mock di una variante usa SOLO questi token. Applicali con classi Tailwind arbitrarie (`bg-[#3b2a1a]`, `font-[Cinzel]`, `shadow-[...]`) oppure con un `<style>` locale al mock che definisce variabili CSS su un wrapper `.variant-X` (mai globali). Dark mode: la classe `dark:` segue `data-bs-theme="dark"` su `<body>`; ogni mock deve funzionare in light e dark.

Font: caricali nel mock con un `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap">` reso dentro il componente (o `useEffect` che lo appende a `<head>` una volta).

Colori dei ruoli: usare sempre le variabili esistenti `var(--roles-bg-good)`, `var(--roles-bg-evil)`, `var(--roles-bg-neutral)`, `var(--roles-db-victoryStealer-)` per fazioni buoni / lupi / neutrali / ladri di vittoria.

Motion: tutte le animazioni dentro `motion-safe:` (o `@media (prefers-reduced-motion: no-preference)`).

---

## A — Fedele
Restyling sicuro dello stile attuale.
- Palette light: navbar `#4BA3C3` / secondario `#387B99`, sfondo `#F2F7FA`, card `#FFFFFF`, testo `#0c0d10`, accento rosso `#992922`.
- Palette dark: navbar `#0D324D`, sfondo `#10161c`, card `#1a232c`, testo `#EAF0F2`, accento `#c4473f`.
- Font: `Jost` (400/500/600) per tutto.
- Radius: `rounded-xl` card, `rounded-lg` bottoni.
- Ombre: `shadow-sm` card, `shadow-md` al hover.
- Texture: nessuna; eventuale sfondo foresta sfumato con gradient `from-[#4BA3C3]/10`.
- Motion: transizioni 150ms su hover/focus, niente altro.

## B — Tavolo da gioco
Scena dall'alto: tavolo di legno, carte, gettoni, pergamene appuntate.
- Palette light (giorno, luce calda): tavolo `#7a4e2d` con venature (gradient `repeating-linear-gradient(90deg,#7a4e2d 0 14px,#6e4528 14px 22px)`), feltro centrale `#2f5d3a`, carta `#f3e6c8`, inchiostro `#2b1d12`, ottone `#c9a24a`.
- Palette dark (notte, luce di candela): tavolo `#3a2414`, feltro `#173022`, carta `#d9c79e`, inchiostro `#1e140c`, glow candela `#ffb347` (`shadow-[0_0_40px_#ffb34766]`).
- Font: titoli `Cinzel Decorative` 700, testo `Alegreya` 400/700.
- Radius: carte `rounded-[14px]`, gettoni `rounded-full`, pergamene `rounded-sm`.
- Ombre: oggetti sul tavolo `shadow-[0_8px_16px_rgba(0,0,0,.45),0_2px_4px_rgba(0,0,0,.3)]`; leggera rotazione `-rotate-1`/`rotate-2` sulle pergamene.
- Texture: legno via gradient sopra; "puntina" = cerchio `#c0392b` con highlight.
- Motion: carte che si girano (`[transform-style:preserve-3d]`, `rotate-y-180` via `[transform:rotateY(180deg)]`, 400ms), gettoni che "cadono" (translateY + scale 250ms).

## C — Pergamena & sigillo
Libro delle regole miniato.
- Palette light: pergamena `#f4e9d1` (sfondo con `radial-gradient(circle at 30% 20%,#fbf4e2,#ecdcb8)`), inchiostro `#3b2a1a`, rubrica rossa `#8b1e1e`, oro `#b08a2e`, verde miniatura `#3f5f3a`.
- Palette dark: pergamena scura `#2a2218`, inchiostro chiaro `#efe2c4`, rubrica `#d0574a`, oro `#d4b25a`.
- Font: titoli `Cinzel` 600/700, testo `IM Fell English` 400 (e italic), capolettera `UnifrakturCook` 700.
- Radius: `rounded-none`/`rounded-sm`; bordi doppi `border-[3px] border-double border-[#b08a2e]`.
- Ombre: interne `shadow-[inset_0_0_40px_rgba(120,80,30,.25)]` sui pannelli.
- Badge = sigillo di ceralacca: cerchio `#8b1e1e`, bordo irregolare (`rounded-[48%_52%_50%_50%]`), testo oro.
- Capolettera: prima lettera dei paragrafi principali `float-left text-6xl leading-none mr-2 text-[#8b1e1e] font-[UnifrakturCook]`.
- Motion: minima, fade 200ms; sigillo con leggero `scale` al hover.

## D — Notte al villaggio
Dark-first, atmosfera.
- Palette dark (default): cielo `linear-gradient(180deg,#0b1026 0%,#1b1f3b 55%,#2a2140 100%)`, pannelli vetro `bg-[#141a33]/60 backdrop-blur-md border border-white/10`, testo `#e8e6f0`, lanterna `#ffb347`, glow `#ff8c42`, luna `#f5f1d6`.
- Palette light (alba dorata): cielo `linear-gradient(180deg,#ffd7a8 0%,#fbe9d0 50%,#e9f0f7 100%)`, pannelli `bg-white/60 backdrop-blur-md border border-[#c98a4b]/30`, testo `#2a1e2e`, accento `#d9692b`.
- Font: titoli `Cormorant Garamond` 600/700, testo `Nunito` 400/600.
- Radius: `rounded-2xl` pannelli, `rounded-full` bottoni primari.
- Ombre: glow `shadow-[0_0_24px_#ff8c4255]` su elementi primari, `shadow-[0_10px_30px_rgba(0,0,0,.35)]` pannelli.
- Texture: stelle (piccoli `div` bianchi `opacity-60` posizionati), sagoma tetti/alberi in SVG inline in basso; lucciole: puoi riusare il componente esistente `import Fireflies from '@/components/Fireflies.jsx'` (verifica il nome export nel file).
- Motion: flicker lanterna (opacity 0.85↔1, 3s), glow pulse lento; tutto `motion-safe:`.

## E — Cartoon giocoso
Gioco mobile/indie, mobile-first.
- Palette light: sfondo `#fdf3e1`, prato `#8cc152`, legno `#c97b3d`, cielo `#7cc6e8`, rosso lupo `#e2553f`, testo `#3a2a1f`, bordi `#3a2a1f`.
- Palette dark: sfondo `#2b2238`, superfici `#3b2f4d`, prato `#5f9a3a`, accento `#ffb84d`, rosso `#ff6b57`, testo `#fff4e0`, bordi `#120c1a`.
- Font: titoli `Lilita One` 400, testo `Baloo 2` 500/700.
- Radius: `rounded-3xl` card, `rounded-2xl` bottoni.
- Bordi spessi `border-[3px] border-[#3a2a1f]` (dark `border-[#120c1a]`).
- Ombre "sticker": `shadow-[4px_4px_0_#3a2a1f]` (dark `shadow-[4px_4px_0_#120c1a]`); bottone premuto: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#3a2a1f]`.
- Icone: `lucide-react` con `strokeWidth={2.5}` dentro cerchi colorati.
- Motion: molla al hover (`hover:-translate-y-0.5 hover:rotate-[-1deg]` 150ms `ease-[cubic-bezier(.34,1.56,.64,1)]`), wobble su badge.

## F — Merge B + C (scelta utente, 2026-11-22)
Base di B (font, navbar, accento verde) + pannelli e popup di C (doppia cornice). Il legno di B va reso **molto tenue**.
- Sfondo pagina light: marroncino chiaro `#e9dcc4` con righe verticali appena più scure: `repeating-linear-gradient(90deg,#e9dcc4 0 18px,#e3d3b8 18px 26px)` (contrasto righe minimo, deve sembrare carta/legno chiaro, non legno scuro).
- Sfondo pagina dark: `#2a2119` con righe `#251d16` (stessa repeating-linear-gradient, stesse misure).
- Navbar: come B (layout, font, logo, link con sottolineatura ottone, menu), ma sfondo a tinta unita `#5a3d26` (dark `#1f160f`) con righe tenui come sopra (`#55391f` / `#1b130d`), bordo inferiore `2px #c9a24a`, testo `#f3e6c8`.
- Accento primario (bottoni primari, focus ring, tab attiva, link attivi): verde feltro `#2f5d3a`, hover `#264c30`, testo `#f3e6c8`; dark `#3f7a4d`, hover `#4a8a59`, testo `#f3e6c8`.
- Ottone (bordi, separatori, icone decorative): `#b08a2e` light / `#d4b25a` dark.
- Pannelli/card: da C → pergamena `#f4e9d1` (light) / `#2f261c` (dark), `border-[3px] border-double` ottone, `rounded-sm`, `shadow-[inset_0_0_40px_rgba(120,80,30,.18)]` + ombra esterna leggera `shadow-[0_6px_14px_rgba(60,40,20,.18)]`. Niente rotazioni/puntine.
- Popup messaggi: esattamente lo stile di C (`MessageBox` di `shell/kit/C.jsx`: cornice doppia, icona in sigillo tondo, codice errore "inciso"), con colori: errore `#8b1e1e` (dark `#d0574a`), info verde accento, warning ottone, success `#3f5f3a` (dark `#6fa36f`).
- Testo: inchiostro `#2b1d12` light / `#efe2c4` dark; testo secondario `#5c4630` / `#c9b48c`.
- Font: titoli `Cinzel Decorative` 700 (solo logo e H1) + `Cinzel` 600 (H2/H3, etichette maiuscole), testo `Alegreya` 400/700.
- Radius: `rounded-sm` pannelli, `rounded-md` bottoni e input.
- Sigilli di ceralacca (C) disponibili per badge/azioni distruttive: `#8b1e1e`, testo `#f4e9d1` (non oro: contrasto AA).
- Motion: minima, fade/scale 150–200ms, `motion-safe:`.
- Popup errori: il codice errore (es. `EGME9`) **non** va mostrato nella UI, solo loggato in console (`console.warn`), è per debug (decisione utente).
