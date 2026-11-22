import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, Info, Minus, Plus, RotateCcw, RotateCw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { friends, roles as rolesFixture, session, settings as settingsFixture } from '@/mocks/fixtures';
import { Layout, PageTitle, Panel, Toaster, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// F5 = wizard (F2) + round table with editable seating order on the table (F4) + deck builder with presets (F3, F4).
// Plain CSS scoped to the `nw5-` prefix; colours and type come from the kit `vf-*` classes and vars.
const CSS = `
.nw5-page { width: 100%; max-width: 760px; margin: 0 auto; }
.nw5-table { position: relative; width: min(100%, 360px); aspect-ratio: 1; margin: 0 auto; }
.nw5-ring {
  position: absolute; inset: 24%; border-radius: 9999px; border: 3px double var(--f-brass);
  background: radial-gradient(circle at 50% 45%, var(--f-felt) 0 55%, rgba(0,0,0,.25) 100%);
  box-shadow: inset 0 0 24px rgba(0,0,0,.35), 0 4px 10px rgba(60,40,20,.25);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  color: var(--f-on-felt); text-align: center; padding: 0 .5rem;
}
.nw5-ring svg { width: 1.75rem; height: 1.75rem; color: #f0b25a; }
.nw5-seats { position: absolute; inset: 0; list-style: none; margin: 0; padding: 0; }
/* Each seat is a slot rotated to its angle; the token counter-rotates so it stays upright. Moving = transform transition. */
.nw5-slot { position: absolute; inset: 0; }
.nw5-pos { position: absolute; left: 50%; top: 9%; width: 0; height: 0; }
@media (prefers-reduced-motion: no-preference) { .nw5-slot { transition: transform 260ms ease; } }
.nw5-seat { position: absolute; left: 0; top: 0; width: 2.75rem; height: 2.75rem; transform: translate(-50%, -50%); padding: 0; font-size: 15px; touch-action: none; user-select: none; }
button.nw5-seat { cursor: grab; }
button.nw5-seat:hover { filter: brightness(1.12); }
.nw5-seat[aria-pressed="true"] { box-shadow: 0 0 0 3px var(--f-paper), 0 0 0 6px var(--f-rubric), 0 2px 4px rgba(0,0,0,.3); }
.nw5-seat.is-lifted { opacity: .35; }
.nw5-lift { position: fixed; z-index: 60; pointer-events: none; box-shadow: 0 8px 18px rgba(0,0,0,.4); }
.nw5-seat-first { outline: 3px solid var(--f-brass); outline-offset: 3px; }
.nw5-seat-no {
  position: absolute; top: -.5rem; right: -.5rem; display: grid; place-items: center; width: 1.25rem; height: 1.25rem;
  border-radius: 9999px; border: 1.5px solid var(--f-brass); background: var(--f-paper); color: var(--f-ink);
  font-size: 11px; line-height: 1; font-weight: 700;
}
.nw5-seat-name {
  position: absolute; top: 1.6rem; left: 50%; transform: translateX(-50%); white-space: nowrap;
  font-size: 12px; font-weight: 700; color: var(--f-ink); text-shadow: 0 0 3px var(--f-paper);
}
.nw5-ghost { position: absolute; left: 0; top: 0; width: 2.75rem; height: 2.75rem; transform: translate(-50%, -50%); border: 2px dashed var(--f-brass); border-radius: 9999px; background: var(--f-hl); }
.nw5-arrow {
  position: absolute; top: 0; transform: translate(-50%, -50%); width: 2.75rem; height: 2.75rem; display: grid; place-items: center;
  padding: 0; border-radius: 9999px; border: 2px solid var(--f-brass); background: var(--f-paper); color: var(--f-ink);
  box-shadow: 0 2px 4px rgba(0,0,0,.3); cursor: pointer;
}
.nw5-arrow:hover { background: var(--f-hl); }
.nw5-arrow svg { width: 1.25rem; height: 1.25rem; }
.nw5-row { display: flex; align-items: center; gap: .75rem; min-height: 3.5rem; padding: .25rem 0; border-bottom: 1px dashed rgba(92, 70, 48, .4); cursor: pointer; font-size: 17px; }
.nw5-row:last-child { border-bottom: 0; }
.nw5-check { width: 1.5rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); border-radius: 4px; background: var(--f-paper); }
.nw5-check[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); color: var(--f-on-felt); }
.nw5-check[data-state="indeterminate"] { background: var(--f-felt); border-color: var(--f-felt); }
.nw5-check[data-state="indeterminate"] svg { display: none; }
.nw5-check[data-state="indeterminate"]::after { content: ''; width: .6rem; height: 2px; background: var(--f-on-felt); }
.nw5-check svg { width: 1rem; height: 1rem; }
.nw5-field { height: 2.75rem; width: 100%; padding: 0 .75rem 0 2.5rem; font-size: 1rem; background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px; }
.nw5-field::placeholder { color: var(--f-ink2); opacity: 1; }
.nw5-search-icon { position: absolute; left: .85rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--f-ink2); pointer-events: none; }
.nw5-cand { display: flex; align-items: center; gap: .5rem; width: 100%; min-height: 2.75rem; padding: 0 .5rem; font-size: 16px; text-align: left; color: var(--f-ink); background: transparent; border: 0; border-bottom: 1px dashed rgba(92, 70, 48, .4); cursor: pointer; }
.nw5-cand:hover { background: var(--f-hl); }
.nw5-cand svg { width: 1rem; height: 1rem; }
.nw5-chip-x { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; flex-shrink: 0; cursor: pointer; background: transparent; color: inherit; border: 0; border-radius: 9999px; }
.nw5-chip-x:hover { background: var(--f-hl); }
.nw5-chip-x svg { width: 1rem; height: 1rem; }
.nw5-ok { color: var(--f-felt); }
[data-bs-theme="dark"] .nw5-ok { color: #6fa36f; }
.nw5-ok svg, .nw5-todo svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
.nw5-switch { width: 2.75rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); background: #b9a58a; }
.nw5-switch[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); }
.nw5-switch > span { width: 1rem; height: 1rem; background: #f4e9d1; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
.nw5-switch > span[data-state="checked"] { transform: translateX(1.2rem); }
[data-bs-theme="dark"] .nw5-switch { background: #5c4a36; }
.nw5-card { transition: transform 150ms; }
.nw5-card:not(:disabled):active { transform: scale(.97); }
.nw5-thumb { filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .3)); }
`;

// Same minimum as the real page (createNewGame.js: totPlayers >= 5).
const MIN_PLAYERS = 5;
// Fixture friends.json is empty; the demo list has the shape the page reads (item.friend.username).
const DEMO_FRIENDS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Elena', 'Fabio', 'Gaia'].map((u) => ({ friend: { username: u } }));
const FRIEND_NAMES = (friends['resource-list'].length ? friends['resource-list'] : DEMO_FRIENDS).map((i) => i.friend.username);
// search.json only holds the master, so non-friend players are added for the demo.
const EXTRA_PLAYERS = ['Irene', 'Sara', 'Teo', 'Marta'];

// Same type -> faction mapping and colour vars as the real page. Order: good, evil, neutral, victory stealer.
const FACTIONS = [
  { type: 0, title: 'Good', color: 'var(--roles-bg-good)', icon: 'fas fa-shield-alt' },
  { type: 1, title: 'Evil', color: 'var(--roles-bg-evil)', icon: 'fas fa-paw' },
  { type: 3, title: 'Neutral', color: 'var(--roles-bg-neutral)', icon: 'fas fa-theater-masks' },
  { type: 2, title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)', icon: 'fas fa-user-secret' },
];
const FILTERS = [{ key: 'all', title: 'All' }, ...FACTIONS.map((f) => ({ key: f.type, title: f.title, color: f.color }))];
const ROLES = rolesFixture.roles.flat();
const SETTINGS = settingsFixture['resource-list'].map((i) => i.setting);
const STEPS = ['Players', 'Roles', 'Options', 'Summary'];
const STEP_HINT = [
  'Who is in the village? Set the seating order, pick friends or search for others.',
  'Pick a preset or build the deck, one card at a time.',
  'Optional rules for this village.',
  'Check the seating and the roles before creating the village.',
];
const REASON_ID = 'nw5-reason';
const STEP_KEYS = ['players', 'roles', 'options', 'summary'];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const initial = (u) => u.charAt(0).toUpperCase();
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const roleSrc = (name, low = true) => `/media/cards/${low ? 'lowResolution/' : ''}${encodeURIComponent(name)}.png`;
const zeroCounts = () => Object.fromEntries(ROLES.map((r) => [r.name, 0]));
const fill = (comp) => ({ ...zeroCounts(), ...comp });
const totalOf = (c) => ROLES.reduce((s, r) => s + (c[r.name] ?? 0), 0);
const sameCounts = (a, b) => ROLES.every((r) => (a[r.name] ?? 0) === (b[r.name] ?? 0));
// Moves the item at `from` to index `to` (others shift). Returns the same array when nothing changes.
const reorder = (list, from, to) => {
  if (from < 0 || from === to) return list;
  const next = [...list];
  const [u] = next.splice(from, 1);
  next.splice(to, 0, u);
  return next;
};
const TAU = Math.PI * 2;

// Built-in presets are computed for N players: ~1 wolf every 4 players, capped by the role max numbers.
const wolves = (n) => Math.min(5, Math.max(1, Math.round(n / 4)));
const classicFor = (n) => ({ wolf: wolves(n), seer: 1, farmer: Math.min(8, Math.max(0, n - wolves(n) - 1)) });
const chaosFor = (n) => ({
  wolf: wolves(n), seer: 1, illusionist: 1, jester: 1,
  farmer: Math.min(8, Math.max(0, n - wolves(n) - 3)),
});
const BUILTIN = [
  { id: 'classic', name: 'Classic', build: classicFor },
  { id: 'chaos', name: 'Chaos', build: chaosFor },
];
const compOf = (p, n) => (p.build ? p.build(n) : p.comp);

// Seats run clockwise from the top; seat i is at i * 360 / N degrees. Interactive mode wires drag, tap and keys from PlayersStep.
function Ring({ players, interactive = false, selected = null, drag = null, tableRef, onPress, onTap, onKey, onNudge }) {
  const N = players.length;
  const step = N ? 360 / N : 0;
  const label = (u) => (N > 8 ? u.slice(0, 6) : u);
  return (
    <div ref={tableRef} className="nw5-table">
      <div className="nw5-ring" aria-hidden="true">
        <Flame />
        <span className="vf-title text-sm">{N ? `${N} seated` : 'Empty fire'}</span>
      </div>
      <ol aria-label={`Seating around the fire, ${N} players, seat 1 at the top, clockwise`} className="nw5-seats">
        {drag && (
          <li className="nw5-slot" style={{ transform: `rotate(${drag.target * step}deg)` }} aria-hidden="true">
            <div className="nw5-pos" style={{ transform: `rotate(${-drag.target * step}deg)` }}>
              <span className="nw5-ghost" />
            </div>
          </li>
        )}
        {players.map((u, i) => {
          const deg = i * step;
          const isSel = selected === u;
          const seatNo = <span className="nw5-seat-no" aria-hidden="true">{i + 1}</span>;
          return (
            <li key={u} className="nw5-slot" style={{ transform: `rotate(${deg}deg)` }}>
              <div className="nw5-pos" style={{ transform: `rotate(${-deg}deg)` }}>
                {interactive ? (
                  <button
                    type="button"
                    className={cn('vf-token nw5-seat', i === 0 && 'nw5-seat-first', drag?.name === u && 'is-lifted')}
                    aria-pressed={isSel}
                    aria-label={`${u}, seat ${i + 1} of ${N}`}
                    title={u}
                    onPointerDown={(e) => onPress(e, u)}
                    onClick={() => onTap(u)}
                    onKeyDown={(e) => onKey(e, u)}
                  >
                    {initial(u)}
                    {seatNo}
                  </button>
                ) : (
                  <span role="img" aria-label={`Seat ${i + 1}: ${u}`} className={cn('vf-token nw5-seat', i === 0 && 'nw5-seat-first')}>
                    {initial(u)}
                    {seatNo}
                  </span>
                )}
                {interactive && isSel && (
                  <>
                    <button type="button" aria-label={`Move ${u} to seat ${((i - 1 + N) % N) + 1}`} className="nw5-arrow" style={{ left: -72 }} onClick={() => onNudge(u, -1)}>
                      <RotateCcw aria-hidden="true" />
                    </button>
                    <button type="button" aria-label={`Move ${u} to seat ${((i + 1) % N) + 1}`} className="nw5-arrow" style={{ left: 72 }} onClick={() => onNudge(u, 1)}>
                      <RotateCw aria-hidden="true" />
                    </button>
                  </>
                )}
                <span className="nw5-seat-name" aria-hidden="true">{label(u)}</span>
              </div>
            </li>
          );
        })}
      </ol>
      {drag && (
        <span className="vf-token nw5-seat nw5-lift" style={{ left: drag.x, top: drag.y }} aria-hidden="true">{initial(drag.name)}</span>
      )}
    </div>
  );
}

function Stepper({ step }) {
  return (
    <ol aria-label="Steps" className="flex items-start">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < step ? 'done' : n === step ? 'current' : 'todo';
        return (
          <li key={label} aria-current={state === 'current' ? 'step' : undefined} className="relative flex flex-1 flex-col items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className={cn('absolute top-[15px] right-1/2 z-0 h-0.5 w-full', i < step ? 'bg-[var(--f-brass)]' : 'bg-[rgba(176,138,46,.35)]')} />
            )}
            <span
              className={cn(
                'relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold',
                state === 'done' && 'border-[var(--f-brass)] bg-[var(--f-brass)] text-[var(--f-seal-warn-text)]',
                state === 'current' && 'border-[var(--f-felt)] bg-[var(--f-felt)] text-[var(--f-on-felt)] shadow-[0_0_0_3px_var(--f-hl)]',
                state === 'todo' && 'border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink2)]',
              )}
            >
              {state === 'done' ? <Check className="size-4" aria-hidden="true" /> : n}
              <span className="sr-only">{state === 'done' ? ', done' : state === 'current' ? ', current' : ''}</span>
            </span>
            <span className={cn('vf-title text-xs sm:text-sm', state === 'current' ? 'font-bold text-[var(--f-ink)]' : 'text-[var(--f-ink2)]')}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function PlayersStep({ players, setPlayers, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null);
  const tableRef = useRef(null);
  const suppressClick = useRef(false);
  const q = query.trim().toLowerCase();
  const candidates = q ? EXTRA_PLAYERS.filter((u) => !players.includes(u) && u.toLowerCase().includes(q)) : [];
  const N = players.length;
  const sel = selected && players.includes(selected) ? selected : null;
  const seatedFriends = FRIEND_NAMES.filter((f) => players.includes(f)).length;
  const allFriends = seatedFriends === FRIEND_NAMES.length;
  const someFriends = seatedFriends > 0 && !allFriends;

  // Pointer angle from the table centre -> nearest seat index (seat 0 at the top, clockwise).
  const seatAt = (x, y) => {
    const r = tableRef.current.getBoundingClientRect();
    const theta = Math.atan2(x - (r.left + r.width / 2), -(y - (r.top + r.height / 2)));
    const a = theta < 0 ? theta + TAU : theta;
    return Math.round(a / (TAU / N)) % N;
  };

  const nudge = (u, dir) => {
    setSelected(u);
    setPlayers((list) => {
      const from = list.indexOf(u);
      return reorder(list, from, (from + dir + list.length) % list.length);
    });
  };

  // Tap = select (click). Press and move beyond 8px = drag; the drop seat is the nearest one to the pointer.
  // Window listeners: the token is moved by React while dragging, so element capture would be unreliable.
  const onPress = (e, u) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    suppressClick.current = false;
    const start = { x: e.clientX, y: e.clientY };
    let active = false;
    const move = (ev) => {
      if (!active) {
        if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 8) return;
        active = true;
      }
      setDrag({ name: u, x: ev.clientX, y: ev.clientY, target: seatAt(ev.clientX, ev.clientY) });
    };
    const end = (ev, cancelled) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      if (!active) return; // a tap: the click event does the selection
      suppressClick.current = true;
      setDrag(null);
      if (cancelled) return;
      const to = seatAt(ev.clientX, ev.clientY);
      setPlayers((list) => reorder(list, list.indexOf(u), to));
      setSelected(u);
    };
    const up = (ev) => end(ev, false);
    const cancel = (ev) => end(ev, true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
  };

  const onTap = (u) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setSelected((s) => (s === u ? null : u));
  };

  const onKey = (e, u) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      nudge(u, e.key === 'ArrowLeft' ? -1 : 1);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onRemove(u);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <Ring
          players={players}
          interactive
          selected={sel}
          drag={drag}
          tableRef={tableRef}
          onPress={onPress}
          onTap={onTap}
          onKey={onKey}
          onNudge={nudge}
        />
        <p aria-live="polite" className="text-center text-[15px] vf-ink2">
          {sel
            ? <><b className="text-[var(--f-ink)]">{sel}</b> · Seat {players.indexOf(sel) + 1} of {N}</>
            : `Tap a player to select, then drag it or use the arrows. ${N} seated.`}
        </p>
        {sel && (
          <button type="button" onClick={() => { onRemove(sel); setSelected(null); }} className={cn(outlineBtn, 'h-11 gap-2 px-4 text-sm')}>
            <X aria-hidden="true" /> Remove {sel}
          </button>
        )}
      </div>

      <div>
        <h3 className="vf-title mb-1 text-sm">Your friends</h3>
        <label className="nw5-row font-bold">
          <Checkbox
            className="nw5-check"
            checked={allFriends ? true : someFriends ? 'indeterminate' : false}
            onCheckedChange={(v) => setPlayers((list) => (v
              ? [...list, ...FRIEND_NAMES.filter((f) => !list.includes(f))]
              : list.filter((x) => !FRIEND_NAMES.includes(x))))}
          />
          <span>Select all ({FRIEND_NAMES.length})</span>
        </label>
        {FRIEND_NAMES.map((f) => (
          <label key={f} className="nw5-row">
            <Checkbox
              className="nw5-check"
              checked={players.includes(f)}
              onCheckedChange={(v) => (v ? onAdd(f) : onRemove(f))}
            />
            <span>{f}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="vf-title mb-2 text-sm">Add other players</h3>
        <div className="relative">
          <Search className="nw5-search-icon" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            placeholder="Username"
            aria-label="Find a player by username"
            className="nw5-field"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {q !== '' && (
          <ul className="mt-2 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)]">
            {candidates.length === 0 && <li className="px-3 py-2 text-[15px]">No player found.</li>}
            {candidates.map((u) => (
              <li key={u}>
                <button type="button" className="nw5-cand" onClick={() => { onAdd(u); setQuery(''); }}>
                  <Plus aria-hidden="true" /> Add {u}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Card with the count badge and the info button. The main button adds one copy, the "−" lives outside it.
function RoleCard({ role, count, onAdd, onRemove, onInfo }) {
  const faction = FACTIONS.find((f) => f.type === role.type);
  const full = count >= role.max_number;
  const selected = count > 0;
  return (
    <div className="relative">
      <button
        type="button"
        disabled={full}
        onClick={() => onAdd(role.name)}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={`Add ${role.name} to deck${full ? ', maximum reached' : ''}`}
        style={selected ? { boxShadow: '0 0 0 3px var(--f-felt), 0 0 16px 4px rgba(63, 122, 77, .55)' } : undefined}
        className="nw5-card vf-paper flex w-full flex-col overflow-hidden p-1.5 text-left disabled:cursor-not-allowed disabled:opacity-80"
      >
        <img src={roleSrc(role.name)} alt="" className="block aspect-[5/7] w-full rounded-[2px] object-cover" />
        <span className="vf-title flex items-center justify-between gap-1 px-1 pt-1.5 pb-1 text-sm font-bold capitalize">
          {role.name}
          {full && <span className="vf-rubric text-xs normal-case">max</span>}
        </span>
        <span className="block h-2 rounded-[1px]" style={{ background: faction.color }} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => onInfo(role)}
        aria-label={`About ${role.name}`}
        className="absolute top-1.5 left-1.5 z-10 grid size-9 place-items-center rounded-full border-2 border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)] shadow"
      >
        <Info className="size-4" aria-hidden="true" />
      </button>

      {selected && (
        <div className="absolute top-1 right-1 z-10 flex items-center rounded-full border-2 border-[var(--f-brass)] bg-[var(--f-brass)] font-bold text-[#1f160f] shadow-[0_2px_4px_rgba(0,0,0,.35)]">
          <button
            type="button"
            onClick={() => onRemove(role.name)}
            aria-label={`Remove one ${role.name}`}
            className="grid size-8 place-items-center rounded-full hover:bg-black/10"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="pr-2 text-sm" aria-hidden="true">×{count}</span>
        </div>
      )}
    </div>
  );
}

function RolesStep({ players, counts, totRoles, filter, setFilter, presets, applyPreset, savePreset, deletePreset, addCard, removeCard }) {
  const [info, setInfo] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');
  const N = players.length;
  const visibleRoles = ROLES.filter((r) => filter === 'all' || r.type === filter);
  const deck = ROLES.filter((r) => counts[r.name] > 0);
  const equal = totRoles === N && N > 0;

  const submitPreset = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    savePreset(name.trim(), { ...counts });
    setName('');
    setSaveOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <p role="status" className="vf-title text-base font-bold">Deck {totRoles}/{N}</p>
        {equal && <span className="nw5-ok flex items-center gap-1 text-sm font-bold"><Check aria-hidden="true" /> Balanced</span>}
      </div>

      {/* Presets: fill the deck in one tap. Saved presets are local to this page. */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="vf-title text-sm">Presets</h3>
          <button type="button" onClick={() => setSaveOpen(true)} disabled={totRoles === 0} className={cn(outlineBtn, 'h-11 px-3 text-sm disabled:opacity-40')}>
            Save as preset
          </button>
        </div>
        <div role="group" aria-label="Role presets" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {presets.map((p) => {
            const comp = fill(compOf(p, N));
            const on = sameCounts(comp, counts);
            const size = totalOf(comp);
            return (
              <div
                key={p.id}
                className={cn(
                  'flex shrink-0 items-center rounded-full border-2',
                  on ? 'border-[var(--f-felt)] bg-[var(--f-felt)] text-[var(--f-on-felt)]' : 'border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)]',
                )}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => applyPreset(p)}
                  className="flex min-h-11 items-center gap-2 px-4 text-sm font-bold"
                >
                  {on && <Check className="size-4" aria-hidden="true" />}
                  {p.name}
                  <span className="font-normal opacity-80">· {size} roles</span>
                </button>
                {p.comp && (
                  <button type="button" aria-label={`Delete preset ${p.name}`} onClick={() => deletePreset(p.id)} className="nw5-chip-x mr-0.5">
                    <X aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div role="group" aria-label="Filter by faction" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 text-sm font-bold',
                  active
                    ? 'border-[var(--f-felt)] bg-[var(--f-felt)] text-[var(--f-on-felt)]'
                    : 'border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)]',
                )}
              >
                {f.color && <span className="size-3 rounded-full border border-black/30" style={{ background: f.color }} aria-hidden="true" />}
                {f.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {visibleRoles.map((r) => (
            <RoleCard
              key={r.name}
              role={r}
              count={counts[r.name] ?? 0}
              onAdd={addCard}
              onRemove={removeCard}
              onInfo={setInfo}
            />
          ))}
        </div>
      </div>

      <Dialog open={info !== null} onOpenChange={(o) => !o && setInfo(null)}>
        {info && (
          <DialogContent className="variant-F vf-paper max-h-[90vh] overflow-y-auto p-5 sm:max-w-md">
            <DialogTitle className="vf-title text-xl capitalize vf-rubric">{info.name}</DialogTitle>
            <DialogDescription className="text-[15px] vf-ink2">
              {FACTIONS.find((f) => f.type === info.type).title} · max {info.max_number} per village
            </DialogDescription>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <img src={roleSrc(info.name, false)} alt="" className="w-44 shrink-0 rounded-[3px] border-2 border-[var(--f-brass)] shadow-[0_4px_10px_rgba(0,0,0,.3)] sm:w-40" />
              <p className="text-[15px] leading-relaxed">{info.description}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" className={cn(outlineBtn, 'h-11 flex-1')} onClick={() => setInfo(null)}>Close</Button>
              <Button
                type="button"
                className={cn(primaryBtn, 'h-11 flex-1')}
                disabled={(counts[info.name] ?? 0) >= info.max_number}
                onClick={() => { addCard(info.name); setInfo(null); }}
              >
                Add to deck
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="variant-F vf-paper max-w-[min(22rem,calc(100%-2rem))] gap-4 p-5">
          <DialogTitle className="vf-title text-lg vf-rubric">Save as preset</DialogTitle>
          <DialogDescription className="text-[15px] vf-ink2">Keeps the current deck ({totRoles} roles) in the preset list.</DialogDescription>
          <form className="flex flex-col gap-3" onSubmit={submitPreset}>
            <Label htmlFor="nw5-preset-name" className="text-[15px]">Preset name</Label>
            <Input
              id="nw5-preset-name"
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              className="nw5-field !pl-3"
            />
            <div className="flex gap-2">
              <Button type="button" className={cn(outlineBtn, 'h-11 flex-1')} onClick={() => setSaveOpen(false)}>Cancel</Button>
              <Button type="submit" className={cn(primaryBtn, 'h-11 flex-1')} disabled={name.trim() === ''}>Save preset</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OptionsStep({ settingsOn, setSettingsOn }) {
  return (
    <div className="flex flex-col">
      {SETTINGS.map((s) => (
        <div key={s.setting_name} className="flex min-h-14 items-center justify-between gap-4 border-b border-dashed border-[rgba(92,70,48,.4)] py-3 last:border-0">
          <label htmlFor={`set-${s.setting_name}`} className="cursor-pointer text-[16px] leading-snug">{s.description}</label>
          <Switch
            id={`set-${s.setting_name}`}
            className="nw5-switch"
            checked={!!settingsOn[s.setting_name]}
            onCheckedChange={(v) => setSettingsOn((g) => ({ ...g, [s.setting_name]: v }))}
          />
        </div>
      ))}
    </div>
  );
}

function SummaryStep({ players, counts, settingsOn, totRoles, reason }) {
  const active = SETTINGS.filter((s) => settingsOn[s.setting_name]);
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="nw5-sum-seats" className="flex flex-col gap-3">
        <h3 id="nw5-sum-seats" className="vf-title text-sm">Seating ({players.length})</h3>
        <Ring players={players} />
      </section>

      <section aria-labelledby="nw5-sum-roles" className="flex flex-col gap-4">
        <h3 id="nw5-sum-roles" className="vf-title text-sm">Roles ({totRoles})</h3>
        {FACTIONS.map((f) => {
          const list = ROLES.filter((r) => r.type === f.type && (counts[r.name] ?? 0) > 0);
          if (list.length === 0) return null;
          return (
            <div key={f.type} className="flex flex-col gap-2 pl-3" style={{ borderLeft: `6px solid ${f.color}` }}>
              <h4 className="vf-title flex items-center gap-2 text-xs vf-ink2">
                <i className={f.icon} aria-hidden="true" />
                {f.title}
              </h4>
              <ul className="flex flex-wrap gap-3">
                {list.map((r) => (
                  <li key={r.name} title={cap(r.name)} className="flex w-[4.5rem] flex-col items-center gap-1 text-center">
                    <span className="relative">
                      <img src={roleSrc(r.name)} alt={cap(r.name)} width={40} height={56} className="h-14 w-10 rounded-[3px] border-2 border-[var(--f-brass)] object-cover" />
                      <span className="vf-token absolute -top-2 -right-2 h-5 min-w-5 px-1 text-[11px]">×{counts[r.name]}</span>
                    </span>
                    <span className="w-full truncate text-xs">{cap(r.name)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="nw5-sum-opts" className="flex flex-col gap-2">
        <h3 id="nw5-sum-opts" className="vf-title text-sm">Options</h3>
        {active.length === 0 ? (
          <p className="vf-ink2 text-[15px]">No extra options</p>
        ) : (
          <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px]">
            {active.map((s) => <li key={s.setting_name}>{s.description}</li>)}
          </ul>
        )}
      </section>

      {reason ? (
        <p id={REASON_ID} role="status" className="flex items-start gap-2 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)] p-3 text-[15px]">
          <span>{reason}</span>
        </p>
      ) : (
        <p className="nw5-ok flex items-center gap-2 text-[15px] font-bold"><Check aria-hidden="true" /> Ready to create the village.</p>
      )}
    </div>
  );
}

export default function MockNewGameF5() {
  const master = session.user.username;
  // ?step=players|roles|options|summary (invalid or missing -> players). The URL follows the current step.
  const [step, setStep] = useState(() => {
    const i = STEP_KEYS.indexOf(new URLSearchParams(window.location.search).get('step'));
    return i >= 0 ? i + 1 : 1;
  });
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', STEP_KEYS[step - 1]);
    window.history.replaceState(window.history.state, '', url);
  }, [step]);
  // Demo: the 7 friends are seated, Classic preset applied (2 wolves, seer, 4 farmers).
  const [players, setPlayers] = useState(() => FRIEND_NAMES.slice(0, 7));
  const [counts, setCounts] = useState(() => fill(classicFor(7)));
  const [filter, setFilter] = useState('all');
  // shortcut: presets are local only, saving to DB is a TODO (docs/ui-redesign/TODO.md)
  const [saved, setSaved] = useState([]);
  const [settingsOn, setSettingsOn] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.setting_name, s.enable])));

  const N = players.length;
  const totRoles = totalOf(counts);
  const enough = N >= MIN_PLAYERS;
  const matched = totRoles === N;
  const enabled = enough && matched;
  const diff = Math.abs(totRoles - N);
  const reason = !enough
    ? `Add ${MIN_PLAYERS - N} more ${MIN_PLAYERS - N === 1 ? 'player' : 'players'} (minimum ${MIN_PLAYERS}).`
    : !matched
      ? `Roles ${totRoles} / players ${N}: ${totRoles > N ? 'remove' : 'add'} ${plural(diff, 'role')}.`
      : null;

  const presets = [...BUILTIN, ...saved];
  const addPlayer = (u) => setPlayers((list) => (list.includes(u) ? list : [...list, u]));
  const removePlayer = (u) => setPlayers((list) => list.filter((x) => x !== u));
  const addCard = (name) => {
    const role = ROLES.find((r) => r.name === name);
    setCounts((c) => ({ ...c, [name]: Math.min(role.max_number, (c[name] ?? 0) + 1) }));
  };
  const removeCard = (name) => setCounts((c) => ({ ...c, [name]: Math.max(0, (c[name] ?? 0) - 1) }));
  const applyPreset = (p) => setCounts(fill(compOf(p, N)));
  const savePreset = (presetName, comp) => setSaved((l) => [...l, { id: `saved-${Date.now()}`, name: presetName, comp }]);
  const deletePreset = (id) => setSaved((l) => l.filter((p) => p.id !== id));

  const go = (s) => { setStep(s); window.scrollTo({ top: 0 }); };
  const create = () => notify('success', 'Village created', `${plural(N, 'player')} and ${plural(totRoles, 'role')} are ready.`);

  return (
    <Layout user={master}>
      <style>{CSS}</style>
      <div className="nw5-page flex flex-col gap-6">
        <PageTitle>Create a new village</PageTitle>
        <Stepper step={step} />

        <Panel as="section" aria-labelledby="nw5-h" className="flex flex-col gap-4 p-4 sm:p-6">
          <div>
            <h2 id="nw5-h" className="vf-title text-lg vf-rubric">{STEPS[step - 1]}</h2>
            <p className="vf-ink2 text-[15px]">{STEP_HINT[step - 1]}</p>
          </div>
          {step === 1 && <PlayersStep players={players} setPlayers={setPlayers} onAdd={addPlayer} onRemove={removePlayer} />}
          {step === 2 && (
            <RolesStep
              players={players}
              counts={counts}
              totRoles={totRoles}
              filter={filter}
              setFilter={setFilter}
              presets={presets}
              applyPreset={applyPreset}
              savePreset={savePreset}
              deletePreset={deletePreset}
              addCard={addCard}
              removeCard={removeCard}
            />
          )}
          {step === 3 && <OptionsStep settingsOn={settingsOn} setSettingsOn={setSettingsOn} />}
          {step === 4 && (
            <SummaryStep players={players} counts={counts} settingsOn={settingsOn} totRoles={totRoles} reason={reason} />
          )}
        </Panel>

        {/* Bottom bar: status, the deck tray on the roles step, then Back/Next. Thumb-reachable, sticky. */}
        <div className="sticky bottom-0 z-30 -mx-4 -mb-8 mt-2 border-t-[3px] border-double border-[var(--f-brass)] bg-[var(--f-paper)] px-4 pt-3 pb-4 shadow-[0_-4px_12px_rgba(60,40,20,.18)]">
          <div className="nw5-page flex flex-col gap-3">
            <p aria-live="polite" className="text-center text-sm font-bold">
              {plural(N, 'player')} · {totRoles}/{N} roles
            </p>
            {step === 2 && (
              <ul aria-label="Cards in the deck" className="flex items-center overflow-x-auto px-1 py-1">
                {totRoles === 0 && <li className="text-sm vf-ink2">Deck is empty</li>}
                {ROLES.filter((r) => counts[r.name] > 0).map((r) => (
                  <li key={r.name} className="relative -ml-3 w-9 shrink-0 first:ml-0">
                    <img
                      src={roleSrc(r.name)}
                      alt={`${counts[r.name]} × ${r.name}`}
                      className="block aspect-[5/7] w-full rounded-[3px] border-2 border-[var(--f-brass)] object-cover shadow-[0_2px_3px_rgba(0,0,0,.3)]"
                    />
                    <span className="absolute -top-1 -right-1 rounded-full bg-[var(--f-brass)] px-1 text-[10px] leading-4 font-bold text-[#1f160f]" aria-hidden="true">
                      ×{counts[r.name]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 1}
                className={cn(outlineBtn, 'h-11 flex-1 gap-2 disabled:opacity-40')}
              >
                <ArrowLeft aria-hidden="true" /> Back
              </button>
              {step < 4 ? (
                <button type="button" onClick={() => go(step + 1)} className={cn(primaryBtn, 'h-11 flex-[2] gap-2')}>
                  Next <ArrowRight aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={create}
                  disabled={!enabled}
                  aria-describedby={reason ? REASON_ID : undefined}
                  className={cn(primaryBtn, 'h-11 flex-[2] disabled:opacity-40')}
                >
                  Create village
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </Layout>
  );
}
