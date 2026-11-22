import { useState } from 'react';
import { Check, Circle, Minus, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { friends, roles as rolesFixture, search, session, settings as settingsFixture } from '@/mocks/fixtures';
import { Layout, MessageBox, Ornament, Panel, PageTitle, Toaster, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Local layout and colours. Plain unlayered CSS on purpose: it beats the shadcn utility classes
// (which Tailwind puts in a layer) and keeps the mock independent of late-generated utilities.
const CSS = `
.nw-scroll { max-height: 15rem; overflow-y: auto; padding: .25rem .25rem .25rem 0; }
.nw-row { display: flex; align-items: center; gap: .75rem; min-height: 2.25rem; }
.nw-row label { font-size: 15px; cursor: pointer; }
.nw-check { width: 1.25rem; height: 1.25rem; flex-shrink: 0; border: 2px solid var(--f-brass); border-radius: 3px; background: var(--f-paper); }
.nw-check[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); color: var(--f-on-felt); }
.nw-check svg { width: 1rem; height: 1rem; }
.nw-field {
  height: 2.5rem; width: 100%; padding: 0 .75rem 0 2.25rem; font-size: 1rem;
  background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
}
.nw-field::placeholder { color: var(--f-ink2); opacity: 1; }
.nw-search-icon { position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--f-ink2); pointer-events: none; }
.nw-results { margin-top: .5rem; }
.nw-chips { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
.nw-chip {
  display: inline-flex; align-items: center; gap: .5rem; max-width: 100%; padding: .2rem .25rem; padding-right: .25rem;
  font-size: 15px; background: var(--f-paper); border: 2px solid var(--f-brass); border-radius: 9999px;
}
.nw-chip-x {
  display: grid; place-items: center; width: 1.75rem; height: 1.75rem; flex-shrink: 0; cursor: pointer;
  background: transparent; color: var(--f-ink); border: 0; border-radius: 9999px;
}
.nw-chip-x:hover { background: var(--f-hl); }
.nw-chip-x svg { width: 1rem; height: 1rem; }
.nw-faction { padding: .75rem 1rem; border: 1px solid var(--f-brass); border-radius: 2px; color: var(--f-ink); }
.nw-faction h3 { font-family: 'Cinzel', Georgia, serif; font-weight: 700; font-size: .875rem; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 .25rem; }
.nw-role { display: flex; align-items: center; justify-content: space-between; gap: .5rem; min-height: 2.5rem; border-top: 1px dashed rgba(92, 70, 48, .45); }
.nw-faction li:first-child { border-top: 0; }
.nw-faction ul { list-style: none; margin: 0; padding: 0; }
.nw-stepper { display: flex; align-items: center; gap: .25rem; flex-shrink: 0; }
.nw-stepper .vf-btn { width: 2rem; height: 2rem; padding: 0; display: inline-grid; place-items: center; }
.nw-stepper svg { width: 1rem; height: 1rem; }
.nw-num {
  width: 3.25rem; height: 2rem; padding: 0 .25rem; text-align: center; font-weight: 700; -moz-appearance: textfield;
  background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
}
.nw-num::-webkit-outer-spin-button, .nw-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.nw-switch { width: 2.75rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); background: #b9a58a; }
.nw-switch[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); }
.nw-switch > span { width: 1rem; height: 1rem; background: #f4e9d1; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
.nw-switch > span[data-state="checked"] { transform: translateX(1.2rem); }
[data-bs-theme="dark"] .nw-switch { background: #5c4a36; }
.nw-ok { color: #3f5f3a; }
[data-bs-theme="dark"] .nw-ok { color: #6fa36f; }
.nw-ok svg, .nw-todo svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
.nw-todo { color: var(--f-ink2); }
.nw-summary-stats { display: flex; flex-wrap: wrap; gap: .25rem 1rem; margin: 0; font-size: 15px; }
.nw-summary-stats div { display: flex; gap: .35rem; }
.nw-summary-stats dt { color: var(--f-ink2); }
.nw-summary-stats dd { margin: 0; font-weight: 700; }
.nw-checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .35rem; font-size: 15px; }
.nw-checklist li { display: flex; align-items: center; gap: .5rem; }
.nw-cta { width: 100%; height: 2.75rem; font-size: 1rem; }
`;

// Same minimum as the real page (createNewGame.js: totPlayers >= 5).
const MIN_PLAYERS = 5;
// Fixture friends.json is empty; the demo list has the same shape the page reads (item.friend.username).
const DEMO_FRIENDS = [{ friend: { username: 'Aldo' } }, { friend: { username: 'Bianca' } }, { friend: { username: 'Chiara' } }, { friend: { username: 'Dario' } }, { friend: { username: 'Elena' } }];
const FRIEND_NAMES = (friends['resource-list'].length ? friends['resource-list'] : DEMO_FRIENDS).map((i) => i.friend.username);
// search.json only holds the master, so extra non-friend players are added for the demo.
const EXTRA_PLAYERS = ['Irene', 'Sara', 'Teo', 'Marta'];

// Same order and colour vars as the real page (good, evil, neutral, victory stealer). type comes from roles.json.
const FACTIONS = [
  { type: 0, title: 'Good', color: 'var(--roles-bg-good)' },
  { type: 1, title: 'Evil', color: 'var(--roles-bg-evil)' },
  { type: 3, title: 'Neutral', color: 'var(--roles-bg-neutral)' },
  { type: 2, title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)' },
];
const ROLES = rolesFixture.roles.flat();
const SETTINGS = settingsFixture['resource-list'].map((i) => i.setting);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const initial = (u) => u.charAt(0).toUpperCase();

const INITIAL_PLAYERS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Irene', 'Sara'];
// 5 roles for 6 players on purpose: the mismatch warning and disabled CTA show on load.
const INITIAL_COUNTS = { farmer: 3, wolf: 1, seer: 1 };

function RoleStepper({ role, value, onChange }) {
  return (
    <div className="nw-stepper">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={outlineBtn}
        aria-label={`Remove one ${role.name}`}
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
      >
        <Minus aria-hidden="true" />
      </Button>
      <Input
        type="number"
        min={0}
        max={role.max_number}
        value={value}
        aria-label={`Number of ${role.name}`}
        className="nw-num"
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={outlineBtn}
        aria-label={`Add one ${role.name}`}
        disabled={value >= role.max_number}
        onClick={() => onChange(value + 1)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}

export default function MockNewGameF() {
  const master = session.user.username;
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [settingsOn, setSettingsOn] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.setting_name, s.enable])));
  // Preset query so the search results are visible on load.
  const [query, setQuery] = useState('te');

  const addPlayer = (u) => setPlayers((list) => (list.includes(u) ? list : [...list, u]));
  const removePlayer = (u) => setPlayers((list) => list.filter((x) => x !== u));
  const setCount = (name, n) => {
    const max = ROLES.find((r) => r.name === name).max_number;
    setCounts((c) => ({ ...c, [name]: Math.max(0, Math.min(max, n)) }));
  };

  const totPlayers = players.length;
  const totRoles = ROLES.reduce((sum, r) => sum + (counts[r.name] ?? 0), 0);
  const enough = totPlayers >= MIN_PLAYERS;
  const matched = totRoles === totPlayers;
  const enabled = enough && matched;
  const activeSettings = Object.values(settingsOn).filter(Boolean).length;
  const diff = Math.abs(totRoles - totPlayers);

  const candidates = [...search['resource-list'].map((r) => r.player.username), ...EXTRA_PLAYERS]
    .filter((u) => u !== master && !players.includes(u) && u.toLowerCase().includes(query.trim().toLowerCase()));

  const create = () => notify('success', 'Village created', `${totPlayers} players and ${totRoles} roles are ready.`);

  return (
    <Layout user={master}>
      <style>{CSS}</style>
      <PageTitle sub="You are the master of this village.">Create a new village</PageTitle>

      <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Players */}
        <Panel as="section" aria-labelledby="nw-players" className="flex flex-col gap-4 p-5 lg:col-start-1 lg:row-start-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="nw-players" className="vf-title text-lg vf-rubric">Players</h2>
            <span className="vf-title text-sm">{totPlayers} {totPlayers === 1 ? 'player' : 'players'}</span>
          </div>

          <div>
            <h3 className="vf-title mb-1 text-sm">Your friends</h3>
            <div className="nw-scroll">
              {FRIEND_NAMES.map((f) => (
                <div key={f} className="nw-row">
                  <Checkbox
                    id={`friend-${f}`}
                    className="nw-check"
                    checked={players.includes(f)}
                    onCheckedChange={(v) => (v ? addPlayer(f) : removePlayer(f))}
                  />
                  <label htmlFor={`friend-${f}`}>{f}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="vf-title mb-1 text-sm">Find a player</h3>
            <div className="relative">
              <Search className="nw-search-icon" aria-hidden="true" />
              <Input
                type="search"
                value={query}
                placeholder="Username"
                aria-label="Find a player by username"
                className="nw-field"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {query.trim() !== '' && (
              candidates.length > 0 ? (
                <Command shouldFilter={false} className="vf-results vf-paper nw-results rounded-sm bg-transparent p-1">
                  <CommandList>
                    <CommandGroup heading="Add to village" className="vf-group-heading">
                      {candidates.map((u) => (
                        <CommandItem
                          key={u}
                          value={u}
                          className="vf-item gap-2 text-[15px]"
                          onSelect={() => { addPlayer(u); setQuery(''); }}
                        >
                          <span className="vf-token size-7 text-xs" aria-hidden="true">{initial(u)}</span>
                          {u}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <p className="vf-paper nw-results px-3 py-2 text-[15px]">No player found.</p>
              )
            )}
          </div>

          <div>
            <h3 className="vf-title mb-2 text-sm">In the village</h3>
            {players.length === 0 ? (
              <p className="vf-ink2 text-[15px]">No players yet. Add at least {MIN_PLAYERS}.</p>
            ) : (
              <ul aria-label="Players in the village" className="nw-chips">
                {players.map((u) => (
                  <li key={u} className="nw-chip">
                    <span className="vf-token size-7 text-xs" aria-hidden="true">{initial(u)}</span>
                    <span className="min-w-0 break-all">{u}</span>
                    <button type="button" aria-label={`Remove ${u}`} className="nw-chip-x" onClick={() => removePlayer(u)}>
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        {/* Roles */}
        <Panel as="section" aria-labelledby="nw-roles" className="flex flex-col gap-4 p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="flex flex-col gap-2">
            <h2 id="nw-roles" className="vf-title text-lg vf-rubric">Roles</h2>
            <p aria-live="polite" className="flex items-center gap-2 text-[15px] font-bold">
              {matched && <Check className="nw-ok" aria-hidden="true" />}
              <span>Roles {totRoles} / players {totPlayers}</span>
              {matched && <span className="sr-only">(equal)</span>}
            </p>
            {!matched && (
              <MessageBox
                kind="warning"
                title="Roles and players do not match"
                details={totRoles > totPlayers
                  ? `Remove ${diff} role${diff === 1 ? '' : 's'}: the village needs one role per player.`
                  : `Add ${diff} role${diff === 1 ? '' : 's'}: the village needs one role per player.`}
              />
            )}
          </div>

          {FACTIONS.map((f) => (
            <section key={f.type} aria-labelledby={`nw-f-${f.type}`} className="nw-faction" style={{ background: f.color }}>
              <h3 id={`nw-f-${f.type}`}>{f.title}</h3>
              <ul>
                {ROLES.filter((r) => r.type === f.type).map((r) => (
                  <li key={r.name} className="nw-role">
                    <span>{cap(r.name)}</span>
                    <RoleStepper role={r} value={counts[r.name] ?? 0} onChange={(n) => setCount(r.name, n)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Panel>

        {/* Settings */}
        <Panel as="section" aria-labelledby="nw-settings" className="flex flex-col gap-4 p-5 lg:col-start-3 lg:row-start-1">
          <div className="flex flex-col gap-1">
            <h2 id="nw-settings" className="vf-title text-lg vf-rubric">Other game settings</h2>
            <Ornament className="mt-1" />
          </div>
          {SETTINGS.map((s) => (
            <div key={s.setting_name} className="flex items-center justify-between gap-3">
              <Label htmlFor={`set-${s.setting_name}`}>{s.description}</Label>
              <Switch
                id={`set-${s.setting_name}`}
                className="nw-switch"
                checked={!!settingsOn[s.setting_name]}
                onCheckedChange={(v) => setSettingsOn((g) => ({ ...g, [s.setting_name]: v }))}
              />
            </div>
          ))}
        </Panel>

        {/* Summary + CTA: sticky at the bottom on mobile, sticky in the right column on desktop. */}
        <section
          aria-labelledby="nw-summary"
          className="vf-paper sticky bottom-0 z-30 flex flex-col gap-3 p-3 shadow-[0_-4px_12px_rgba(60,40,20,.18)] lg:col-start-3 lg:row-start-2 lg:top-24 lg:bottom-auto lg:gap-4 lg:p-5 lg:shadow-[0_6px_14px_rgba(60,40,20,.18)]"
        >
          <h2 id="nw-summary" className="vf-title hidden text-lg vf-rubric lg:block">Summary</h2>
          <dl className="nw-summary-stats">
            <div><dt>Players</dt><dd>{totPlayers}</dd></div>
            <div><dt>Roles</dt><dd>{totRoles}</dd></div>
            <div><dt>Settings on</dt><dd>{activeSettings} of {SETTINGS.length}</dd></div>
          </dl>
          <ul className="nw-checklist hidden lg:flex" aria-label="Requirements">
            <li className={enough ? 'nw-ok' : 'nw-todo'}>
              {enough ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
              At least {MIN_PLAYERS} players{enough ? '' : ` (${MIN_PLAYERS - totPlayers} missing)`}
            </li>
            <li className={matched ? 'nw-ok' : 'nw-todo'}>
              {matched ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
              Roles equal players
            </li>
          </ul>
          <Button className={cn(primaryBtn, 'nw-cta')} disabled={!enabled} onClick={create}>
            Create village
          </Button>
        </section>
      </div>

      <Toaster />
    </Layout>
  );
}
