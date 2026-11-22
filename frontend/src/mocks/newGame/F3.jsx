import { useRef, useState } from 'react';
import { Info, Minus, Plus, Search, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { friends, roles as rolesFixture, search, session, settings as settingsFixture } from '@/mocks/fixtures';
import { Layout, PageTitle, Toaster, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Only what the kit does not cover: switch thumb and the card hover/press feel.
const CSS = `
.dk-switch { width: 2.75rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); background: #b9a58a; }
.dk-switch[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); }
.dk-switch > span { width: 1rem; height: 1rem; background: #f4e9d1; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
.dk-switch > span[data-state="checked"] { transform: translateX(1.2rem); }
[data-bs-theme="dark"] .dk-switch { background: #5c4a36; }
.dk-card { transition: transform 150ms; }
.dk-card:not(:disabled):active { transform: scale(.97); }
.dk-thumb { filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .3)); }
`;

// Same minimum as the real page (createNewGame.js: totPlayers >= 5).
const MIN_PLAYERS = 5;
const DEMO_FRIENDS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Elena', 'Fabio', 'Gaia'].map((u) => ({ friend: { username: u } }));
// friends.json is empty in the fixtures, so the demo list has the shape the page reads (item.friend.username).
const FRIEND_NAMES = (friends['resource-list'].length ? friends['resource-list'] : DEMO_FRIENDS).map((i) => i.friend.username);
// search.json only holds the master and a few players, extra names are added for the demo.
const EXTRA_PLAYERS = ['Irene', 'Sara', 'Teo', 'Marta'];

// Order and colour vars as on the real page: good, evil, neutral, victory stealer.
const FACTIONS = [
  { type: 0, title: 'Good', color: 'var(--roles-bg-good)' },
  { type: 1, title: 'Evil', color: 'var(--roles-bg-evil)' },
  { type: 3, title: 'Neutral', color: 'var(--roles-bg-neutral)' },
  { type: 2, title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)' },
];
const FILTERS = [{ key: 'all', title: 'All' }, ...FACTIONS.map((f) => ({ key: f.type, title: f.title, color: f.color }))];

const ROLES = rolesFixture.roles.flat();
const SETTINGS = settingsFixture['resource-list'].map((i) => i.setting);
const factionOf = (role) => FACTIONS.find((f) => f.type === role.type);
const cardSrc = (role, dir = '') => `/media/cards/${dir ? `${dir}/` : ''}${encodeURIComponent(role.name)}.png`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Demo state: 6 players, 5 cards, so the mismatch warning and disabled CTA show on load.
const INITIAL_PLAYERS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Irene', 'Sara'];
const INITIAL_COUNTS = { wolf: 1, seer: 1, farmer: 3 };

// Card with the count badge and the info button; the main button adds one copy on tap, the
// long press opens the info dialog. The "−" lives outside the main button (no nested buttons).
function RoleCard({ role, count, onAdd, onRemove, onInfo }) {
  const faction = factionOf(role);
  const full = count >= role.max_number;
  const timer = useRef(null);
  const longPressed = useRef(false);
  const press = () => {
    longPressed.current = false;
    timer.current = setTimeout(() => { longPressed.current = true; onInfo(role); }, 500);
  };
  const release = () => clearTimeout(timer.current);
  const tap = () => { if (!longPressed.current) onAdd(role.name); };
  const selected = count > 0;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={full}
        onClick={tap}
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={`Add ${role.name} to deck${full ? ', maximum reached' : ''}`}
        style={selected ? { boxShadow: '0 0 0 3px var(--f-felt), 0 0 16px 4px rgba(63, 122, 77, .55)' } : undefined}
        className="dk-card vf-paper flex w-full flex-col overflow-hidden p-1.5 text-left disabled:cursor-not-allowed disabled:opacity-80"
      >
        <img src={cardSrc(role, 'lowResolution')} alt="" className="block aspect-[5/7] w-full rounded-[2px] object-cover" />
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

export default function MockNewGameF3() {
  const master = session.user.username;
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [filter, setFilter] = useState('all');
  const [playersOpen, setPlayersOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [info, setInfo] = useState(null);
  const [settingsOn, setSettingsOn] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.setting_name, s.enable])));
  const [query, setQuery] = useState('');

  const n = players.length;
  const total = ROLES.reduce((sum, r) => sum + (counts[r.name] ?? 0), 0);
  const enough = n >= MIN_PLAYERS;
  const matched = total === n;
  const ready = enough && matched;
  const gap = n - total; // > 0 cards short, < 0 cards too many
  const deck = ROLES.filter((r) => counts[r.name] > 0);
  const reason = !enough
    ? `At least ${MIN_PLAYERS} players needed (${MIN_PLAYERS - n} more).`
    : !matched
      ? (gap > 0 ? `${plural(gap, 'card')} short for the players.` : `${plural(-gap, 'card')} too many for the players.`)
      : null;

  const addPlayer = (u) => setPlayers((list) => (list.includes(u) ? list : [...list, u]));
  const removePlayer = (u) => setPlayers((list) => list.filter((x) => x !== u));
  const addCard = (name) => {
    const role = ROLES.find((r) => r.name === name);
    setCounts((c) => ({ ...c, [name]: Math.min(role.max_number, (c[name] ?? 0) + 1) }));
  };
  const removeCard = (name) => setCounts((c) => ({ ...c, [name]: Math.max(0, (c[name] ?? 0) - 1) }));

  const candidates = [...search['resource-list'].map((r) => r.player.username), ...EXTRA_PLAYERS]
    .filter((u) => u !== master && !players.includes(u) && u.toLowerCase().includes(query.trim().toLowerCase()));

  const create = () => {
    notify('success', 'Village created', `${n} players and ${total} roles are ready.`);
    setOptionsOpen(false);
  };

  const visibleRoles = ROLES.filter((r) => filter === 'all' || r.type === filter);

  return (
    <Layout user={master}>
      <style>{CSS}</style>
      <PageTitle sub="You are the master of this village.">Create a new village</PageTitle>

      {/* Header: two big counters. */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:mx-auto lg:max-w-md">
        <button
          type="button"
          onClick={() => setPlayersOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Players ${n}. Change players`}
          className="vf-paper flex min-h-20 flex-col items-start justify-center gap-1 p-3 text-left"
        >
          <span className="vf-title flex items-center gap-1.5 text-xs tracking-widest vf-rubric uppercase">
            <Users className="size-4" aria-hidden="true" />Players
          </span>
          <span className="vf-display text-4xl leading-none" aria-hidden="true">{n}</span>
        </button>

        <div
          role="status"
          aria-label={`Deck ${total} of ${n}`}
          className={cn(
            'flex min-h-20 flex-col items-start justify-center gap-1 p-3',
            ready
              ? 'vf-felt rounded-sm border-[3px] border-double border-[var(--f-brass)] shadow-[0_6px_14px_rgba(60,40,20,.18)]'
              : 'vf-paper',
          )}
        >
          <span className="vf-title text-xs tracking-widest uppercase">Deck</span>
          <span className="vf-display text-4xl leading-none" aria-hidden="true">{total}/{n}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-6">
        {/* Card browser. */}
        <section aria-labelledby="dk-browse" className="min-w-0">
          <h2 id="dk-browse" className="sr-only">Role cards</h2>
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

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
        </section>

        {/* Deck tray: sticky thumb-zone bar on phones, right sidebar on desktop. */}
        <section
          aria-labelledby="dk-deck"
          className="vf-paper sticky bottom-0 z-30 flex flex-col gap-3 p-3 shadow-[0_-4px_12px_rgba(60,40,20,.18)] lg:top-24 lg:bottom-auto lg:gap-4 lg:p-5 lg:shadow-[0_6px_14px_rgba(60,40,20,.18)]"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="dk-deck" className="vf-title text-base vf-rubric">Your deck</h2>
            <span className="text-sm font-bold">{total} of {n} cards</span>
          </div>

          {deck.length === 0 ? (
            <p className="vf-ink2 text-sm">Tap a card to add it to the deck.</p>
          ) : (
            <ul aria-label="Cards in the deck" className="flex overflow-x-auto py-1 pr-1 lg:flex-wrap lg:gap-2 lg:overflow-visible">
              {deck.map((r) => (
                <li key={r.name} className="relative -ml-3 w-14 shrink-0 first:ml-0 lg:ml-0 lg:w-16">
                  <img
                    src={cardSrc(r, 'lowResolution')}
                    alt={`${counts[r.name]} × ${r.name}`}
                    className="dk-thumb block aspect-[5/7] w-full rounded-[3px] border-2 border-[var(--f-brass)] object-cover"
                  />
                  <span className="absolute top-0.5 left-0.5 rounded-full bg-[var(--f-brass)] px-1.5 text-[11px] leading-4 font-bold text-[#1f160f]" aria-hidden="true">
                    ×{counts[r.name]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p role="status" className={cn('text-sm font-bold', ready ? 'text-[var(--f-felt)] dark:text-[#6fa36f]' : 'vf-rubric')}>
            {ready ? 'Deck matches the players.' : reason}
          </p>

          <Button
            className={cn(primaryBtn, 'h-11 w-full text-base')}
            disabled={!ready}
            aria-describedby={reason ? 'dk-reason' : undefined}
            onClick={() => setOptionsOpen(true)}
          >
            Next: options
          </Button>
          {reason && <span id="dk-reason" className="sr-only">{reason}</span>}
        </section>
      </div>

      {/* Players: friends, search, chips. */}
      <Sheet open={playersOpen} onOpenChange={setPlayersOpen}>
        <SheetContent side="bottom" className="variant-F vf-paper max-h-[85vh] gap-4 overflow-y-auto rounded-t-sm p-5 lg:mx-auto lg:max-w-lg">
          <div className="flex flex-col gap-1 pr-8">
            <SheetTitle className="vf-title text-lg vf-rubric">Choose players</SheetTitle>
            <SheetDescription className="text-[15px] vf-ink2">{plural(n, 'player')} in the village. You are the master.</SheetDescription>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="vf-title text-sm">Your friends</h3>
            {FRIEND_NAMES.map((f) => (
              <div key={f} className="flex min-h-11 items-center gap-3">
                <Checkbox
                  id={`dk-friend-${f}`}
                  checked={players.includes(f)}
                  onCheckedChange={(v) => (v ? addPlayer(f) : removePlayer(f))}
                  className="size-5 rounded-[3px] border-2 border-[var(--f-brass)] bg-[var(--f-paper)] data-[state=checked]:border-[var(--f-felt)] data-[state=checked]:bg-[var(--f-felt)] data-[state=checked]:text-[var(--f-on-felt)]"
                />
                <Label htmlFor={`dk-friend-${f}`} className="cursor-pointer text-[15px]">{f}</Label>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="vf-title text-sm">Find a player</h3>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 vf-ink2" aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Username"
                aria-label="Find a player by username"
                className="vf-input h-11 pl-9 text-base md:text-sm"
              />
            </div>
            {query.trim() !== '' && (
              candidates.length > 0 ? (
                <ul className="flex flex-col gap-1 rounded-sm border border-[var(--f-brass)] bg-[var(--f-paper)] p-1">
                  {candidates.map((u) => (
                    <li key={u}>
                      <button
                        type="button"
                        onClick={() => { addPlayer(u); setQuery(''); }}
                        className="flex min-h-11 w-full items-center gap-2 rounded-sm px-2 text-left text-[15px] hover:bg-[var(--f-hl)]"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                        Add {u}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] vf-ink2">No player found.</p>
              )
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="vf-title text-sm">In the village</h3>
            <ul aria-label="Players in the village" className="flex flex-wrap gap-2">
              {players.map((u) => (
                <li key={u} className="flex items-center gap-1 rounded-full border-2 border-[var(--f-brass)] bg-[var(--f-paper)] py-0.5 pr-0.5 pl-3 text-[15px]">
                  {u}
                  <button
                    type="button"
                    onClick={() => removePlayer(u)}
                    aria-label={`Remove ${u}`}
                    className="grid size-9 place-items-center rounded-full hover:bg-[var(--f-hl)]"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <Button className={cn(outlineBtn, 'h-11')} onClick={() => setPlayersOpen(false)}>Done</Button>
        </SheetContent>
      </Sheet>

      {/* Options: settings switches, then create. */}
      <Sheet open={optionsOpen} onOpenChange={setOptionsOpen}>
        <SheetContent side="bottom" className="variant-F vf-paper max-h-[85vh] gap-4 overflow-y-auto rounded-t-sm p-5 lg:mx-auto lg:max-w-lg">
          <div className="flex flex-col gap-1 pr-8">
            <SheetTitle className="vf-title text-lg vf-rubric">Game options</SheetTitle>
            <SheetDescription className="text-[15px] vf-ink2">
              {plural(n, 'player')} and {plural(total, 'card')}. Optional rules for this village.
            </SheetDescription>
          </div>

          <div className="flex flex-col gap-3">
            {SETTINGS.map((s) => (
              <div key={s.setting_name} className="flex items-center justify-between gap-3">
                <Label htmlFor={`dk-set-${s.setting_name}`} className="text-[15px] leading-snug">{s.description}</Label>
                <Switch
                  id={`dk-set-${s.setting_name}`}
                  className="dk-switch"
                  checked={!!settingsOn[s.setting_name]}
                  onCheckedChange={(v) => setSettingsOn((g) => ({ ...g, [s.setting_name]: v }))}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button className={cn(primaryBtn, 'h-11 w-full text-base')} disabled={!ready} onClick={create}>Create village</Button>
            <Button className={cn(outlineBtn, 'h-11 w-full')} onClick={() => setOptionsOpen(false)}>Back to deck</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Role info: big card and description. */}
      <Dialog open={info !== null} onOpenChange={(o) => !o && setInfo(null)}>
        {info && (
          <DialogContent className="variant-F vf-paper max-h-[90vh] overflow-y-auto p-5 sm:max-w-md">
            <DialogTitle className="vf-title text-xl capitalize vf-rubric">{info.name}</DialogTitle>
            <DialogDescription className="text-[15px] vf-ink2">
              {factionOf(info).title} · max {info.max_number} per village
            </DialogDescription>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <img
                src={cardSrc(info)}
                alt=""
                className="w-44 shrink-0 rounded-[3px] border-2 border-[var(--f-brass)] shadow-[0_4px_10px_rgba(0,0,0,.3)] sm:w-40"
              />
              <p className="text-[15px] leading-relaxed">{info.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className={cn(outlineBtn, 'h-11 flex-1')} onClick={() => setInfo(null)}>Close</Button>
              <Button
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

      <Toaster />
    </Layout>
  );
}
