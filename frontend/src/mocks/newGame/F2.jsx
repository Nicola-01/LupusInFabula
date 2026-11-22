import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Minus, Plus, Search, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { friends, roles as rolesFixture, session, settings as settingsFixture } from '@/mocks/fixtures';
import { Layout, PageTitle, Panel, Toaster, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Wizard variant of the create-village page. Unlayered CSS beats the shadcn utility classes
// (Checkbox, Switch, Progress), same approach as the F mock.
const CSS = `
.nw2-page { width: 100%; max-width: 720px; margin: 0 auto; }
.nw2-row { display: flex; align-items: center; gap: .75rem; min-height: 3.5rem; padding: .25rem 0; border-bottom: 1px dashed rgba(92, 70, 48, .4); cursor: pointer; font-size: 17px; }
.nw2-row:last-child { border-bottom: 0; }
.nw2-check { width: 1.5rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); border-radius: 4px; background: var(--f-paper); }
.nw2-check[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); color: var(--f-on-felt); }
.nw2-check svg { width: 1rem; height: 1rem; }
.nw2-field { height: 2.75rem; width: 100%; padding: 0 .75rem 0 2.5rem; font-size: 1rem; background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px; }
.nw2-field::placeholder { color: var(--f-ink2); opacity: 1; }
.nw2-search-icon { position: absolute; left: .85rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--f-ink2); pointer-events: none; }
.nw2-cand { display: flex; align-items: center; gap: .5rem; width: 100%; min-height: 2.75rem; padding: 0 .5rem; font-size: 16px; text-align: left; color: var(--f-ink); background: transparent; border: 0; border-bottom: 1px dashed rgba(92, 70, 48, .4); cursor: pointer; }
.nw2-cand:hover { background: var(--f-hl); }
.nw2-cand svg { width: 1rem; height: 1rem; }
.nw2-chips { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
.nw2-chip { display: inline-flex; align-items: center; gap: .4rem; max-width: 100%; padding: .15rem .15rem .15rem .15rem; font-size: 15px; background: var(--f-paper); border: 2px solid var(--f-brass); border-radius: 9999px; }
.nw2-chip-x { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; flex-shrink: 0; cursor: pointer; background: transparent; color: var(--f-ink); border: 0; border-radius: 9999px; }
.nw2-chip-x:hover { background: var(--f-hl); }
.nw2-chip-x svg { width: 1rem; height: 1rem; }
.nw2-progress { height: .75rem; background: var(--f-hl); }
.nw2-progress > [data-slot="progress-indicator"] { background: var(--f-brass); }
.nw2-progress.is-equal > [data-slot="progress-indicator"] { background: var(--f-felt); }
.nw2-ok { color: var(--f-felt); }
[data-bs-theme="dark"] .nw2-ok { color: #6fa36f; }
.nw2-ok svg, .nw2-todo svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
.nw2-todo { color: var(--f-ink2); }
.nw2-switch { width: 2.75rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); background: #b9a58a; }
.nw2-switch[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); }
.nw2-switch > span { width: 1rem; height: 1rem; background: #f4e9d1; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
.nw2-switch > span[data-state="checked"] { transform: translateX(1.2rem); }
[data-bs-theme="dark"] .nw2-switch { background: #5c4a36; }
.nw2-tab-stripe { position: absolute; left: 4px; right: 4px; top: 4px; height: 6px; border-radius: 2px; }
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
  { type: 0, title: 'Good', color: 'var(--roles-bg-good)' },
  { type: 1, title: 'Evil', color: 'var(--roles-bg-evil)' },
  { type: 3, title: 'Neutral', color: 'var(--roles-bg-neutral)' },
  { type: 2, title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)' },
];
const ROLES = rolesFixture.roles.flat();
const SETTINGS = settingsFixture['resource-list'].map((i) => i.setting);
const STEPS = ['Players', 'Roles', 'Options', 'Summary'];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const initial = (u) => u.charAt(0).toUpperCase();
const cardSrc = (name, low = true) => encodeURI(`/media/cards/${low ? 'lowResolution/' : ''}${name}.png`);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Balanced default: ~1 wolf per 4 players, 1 seer, the rest farmers (capped by the farmer max of 8).
function suggestCounts(n) {
  const wolf = Math.min(5, Math.max(1, Math.floor(n / 4)));
  const seer = n >= MIN_PLAYERS ? 1 : 0;
  const farmer = Math.min(8, Math.max(0, n - wolf - seer));
  return { wolf, seer, farmer };
}

const INITIAL_PLAYERS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Irene', 'Sara'];
// 5 roles for 6 players on purpose: the progress is not full yet on load.
const INITIAL_COUNTS = { farmer: 3, wolf: 1, seer: 1 };
const ZERO_COUNTS = Object.fromEntries(ROLES.map((r) => [r.name, 0]));

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

function PlayersStep({ players, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const candidates = q ? EXTRA_PLAYERS.filter((u) => !players.includes(u) && u.toLowerCase().includes(q)) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="vf-title mb-2 text-sm">In the village ({players.length})</h3>
        {players.length === 0 ? (
          <p className="vf-ink2 text-[15px]">No players yet. Add at least {MIN_PLAYERS}.</p>
        ) : (
          <ul aria-label="Players in the village" className="nw2-chips">
            {players.map((u) => (
              <li key={u} className="nw2-chip">
                <span className="vf-token size-7 text-xs" aria-hidden="true">{initial(u)}</span>
                <span className="min-w-0 break-all pr-1">{u}</span>
                <button type="button" aria-label={`Remove ${u}`} className="nw2-chip-x" onClick={() => onRemove(u)}>
                  <X aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="vf-title mb-1 text-sm">Your friends</h3>
        {FRIEND_NAMES.map((f) => (
          <label key={f} className="nw2-row">
            <Checkbox
              className="nw2-check"
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
          <Search className="nw2-search-icon" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            placeholder="Username"
            aria-label="Find a player by username"
            className="nw2-field"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {q !== '' && (
          <ul className="mt-2 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)]">
            {candidates.length === 0 && <li className="px-3 py-2 text-[15px]">No player found.</li>}
            {candidates.map((u) => (
              <li key={u}>
                <button type="button" className="nw2-cand" onClick={() => { onAdd(u); setQuery(''); }}>
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

function RoleRow({ role, value, onChange, onDetail }) {
  const name = cap(role.name);
  return (
    <li className="flex min-h-[4.5rem] items-center gap-3 border-b border-dashed border-[rgba(92,70,48,.4)] py-2 last:border-0">
      <button
        type="button"
        onClick={() => onDetail(role)}
        aria-label={`Show the ${role.name} card`}
        className="shrink-0 rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--f-focus)]"
      >
        <img
          src={cardSrc(role.name)}
          alt=""
          width={40}
          height={56}
          className="h-14 w-10 rounded-[3px] border-2 border-[var(--f-brass)] object-cover shadow-[0_2px_4px_rgba(0,0,0,.3)]"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="vf-title text-[15px] font-bold leading-tight">{name}</p>
        <p className="truncate text-sm vf-ink2">{role.description}</p>
      </div>
      <div role="group" aria-label={`${name} count`} className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Remove one ${role.name}`}
          disabled={value === 0}
          onClick={() => onChange(value - 1)}
          className={cn(outlineBtn, 'grid size-11 place-items-center p-0 disabled:opacity-40')}
        >
          <Minus aria-hidden="true" />
        </button>
        <span aria-live="polite" className="w-8 text-center text-lg font-bold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`Add one ${role.name}`}
          disabled={value >= role.max_number}
          onClick={() => onChange(value + 1)}
          className={cn(outlineBtn, 'grid size-11 place-items-center p-0 disabled:opacity-40')}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function RolesStep({ counts, totPlayers, totRoles, faction, setFaction, onChange, onSuggest, onDetail }) {
  const equal = totRoles === totPlayers && totPlayers > 0;
  const pct = totPlayers ? Math.min(100, (totRoles / totPlayers) * 100) : 0;
  const factionTotal = (type) => ROLES.filter((r) => r.type === type).reduce((s, r) => s + (counts[r.name] ?? 0), 0);
  const current = FACTIONS.find((f) => f.type === faction);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <p className="vf-title text-[15px] font-bold">Roles {totRoles} / {totPlayers} players</p>
          {equal && <span className="nw2-ok flex items-center gap-1 text-sm font-bold"><Check aria-hidden="true" /> Balanced</span>}
        </div>
        <Progress
          value={pct}
          aria-label={`Roles ${totRoles} of ${totPlayers} players`}
          className={cn('nw2-progress', equal && 'is-equal')}
        />
        <button type="button" onClick={onSuggest} className={cn(outlineBtn, 'mt-1 h-11 w-full gap-2')}>
          <Sparkles aria-hidden="true" /> Suggested setup
        </button>
      </div>

      <div role="tablist" aria-label="Faction" className="grid grid-cols-4 gap-1 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)] p-1">
        {FACTIONS.map((f) => {
          const selected = f.type === faction;
          return (
            <button
              key={f.type}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFaction(f.type)}
              className={cn(
                'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-sm px-1 pt-3 pb-1.5 text-center text-xs leading-tight',
                selected ? 'bg-[var(--f-hl)] font-bold text-[var(--f-ink)]' : 'text-[var(--f-ink2)]',
              )}
            >
              <span aria-hidden="true" className="nw2-tab-stripe" style={{ background: f.color }} />
              <span>{f.title}</span>
              <span className={cn('vf-token size-6 text-xs', factionTotal(f.type) === 0 && 'opacity-50')}>{factionTotal(f.type)}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" aria-label={current.title}>
        <ul>
          {ROLES.filter((r) => r.type === faction).map((r) => (
            <RoleRow
              key={r.name}
              role={r}
              value={counts[r.name] ?? 0}
              onChange={(n) => onChange(r.name, Math.max(0, Math.min(r.max_number, n)))}
              onDetail={onDetail}
            />
          ))}
        </ul>
      </div>
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
            className="nw2-switch"
            checked={!!settingsOn[s.setting_name]}
            onCheckedChange={(v) => setSettingsOn((g) => ({ ...g, [s.setting_name]: v }))}
          />
        </div>
      ))}
    </div>
  );
}

function SummaryStep({ players, counts, settingsOn, totRoles, reason }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="vf-title mb-2 text-sm">Players ({players.length})</h3>
        <ul aria-label="Players in the village" className="nw2-chips">
          {players.map((u) => (
            <li key={u} className="nw2-chip px-2 py-1">{u}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="vf-title text-sm">Roles ({totRoles})</h3>
        {FACTIONS.map((f) => {
          const list = ROLES.filter((r) => r.type === f.type && (counts[r.name] ?? 0) > 0);
          if (list.length === 0) return null;
          return (
            <section key={f.type} aria-label={f.title} className="pl-3" style={{ borderLeft: `6px solid ${f.color}` }}>
              <h4 className="vf-title mb-2 text-xs vf-ink2">{f.title}</h4>
              <ul className="flex flex-wrap gap-3">
                {list.map((r) => (
                  <li key={r.name} title={cap(r.name)} className="flex w-[4.5rem] flex-col items-center gap-1 text-center">
                    <span className="relative">
                      <img src={cardSrc(r.name)} alt={cap(r.name)} width={40} height={56} className="h-14 w-10 rounded-[3px] border-2 border-[var(--f-brass)] object-cover" />
                      <span className="vf-token absolute -top-2 -right-2 h-5 min-w-5 px-1 text-[11px]">×{counts[r.name]}</span>
                    </span>
                    <span className="w-full truncate text-xs">{cap(r.name)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div>
        <h3 className="vf-title mb-2 text-sm">Options</h3>
        <ul className="flex flex-col gap-1 text-[15px]">
          {SETTINGS.map((s) => (
            <li key={s.setting_name} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0">{s.setting_name}</span>
              <span className={cn('font-bold', settingsOn[s.setting_name] ? 'nw2-ok' : 'vf-ink2')}>{settingsOn[s.setting_name] ? 'On' : 'Off'}</span>
            </li>
          ))}
        </ul>
      </div>

      {reason ? (
        <p role="status" className="flex items-start gap-2 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)] p-3 text-[15px]">
          <Info className="mt-0.5 size-4 shrink-0 vf-brass-text" aria-hidden="true" />
          <span>{reason}</span>
        </p>
      ) : (
        <p className="nw2-ok flex items-center gap-2 text-[15px] font-bold"><Check aria-hidden="true" /> Ready to create the village.</p>
      )}
    </div>
  );
}

export default function MockNewGameF2() {
  const master = session.user.username;
  const [step, setStep] = useState(() => {
    const s = Number(new URLSearchParams(window.location.search).get('step'));
    return s >= 1 && s <= 4 ? s : 2;
  });
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [counts, setCounts] = useState({ ...ZERO_COUNTS, ...INITIAL_COUNTS });
  const [faction, setFaction] = useState(0);
  const [detail, setDetail] = useState(null);
  const [settingsOn, setSettingsOn] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.setting_name, s.enable])));

  const addPlayer = (u) => setPlayers((list) => (list.includes(u) ? list : [...list, u]));
  const removePlayer = (u) => setPlayers((list) => list.filter((x) => x !== u));
  const setCount = (name, n) => setCounts((c) => ({ ...c, [name]: n }));

  const totPlayers = players.length;
  const totRoles = ROLES.reduce((sum, r) => sum + (counts[r.name] ?? 0), 0);
  const enough = totPlayers >= MIN_PLAYERS;
  const matched = totRoles === totPlayers;
  const enabled = enough && matched;
  const diff = Math.abs(totRoles - totPlayers);
  const reason = !enough
    ? `Add ${MIN_PLAYERS - totPlayers} more ${MIN_PLAYERS - totPlayers === 1 ? 'player' : 'players'} (minimum ${MIN_PLAYERS}).`
    : !matched
      ? `Roles ${totRoles} / players ${totPlayers}: ${totRoles > totPlayers ? 'remove' : 'add'} ${plural(diff, 'role')}.`
      : null;

  const go = (s) => { setStep(s); window.scrollTo({ top: 0 }); };
  const suggest = () => setCounts({ ...ZERO_COUNTS, ...suggestCounts(totPlayers) });
  const create = () => notify('success', 'Village created', `${plural(totPlayers, 'player')} and ${plural(totRoles, 'role')} are ready.`);

  return (
    <Layout user={master}>
      <style>{CSS}</style>
      <div className="nw2-page flex flex-col gap-6">
        <PageTitle>Create a new village</PageTitle>
        <Stepper step={step} />

        <Panel as="section" aria-labelledby="nw2-h" className="flex flex-col gap-4 p-4 sm:p-6">
          <div>
            <h2 id="nw2-h" className="vf-title text-lg vf-rubric">{STEPS[step - 1]}</h2>
            <p className="vf-ink2 text-[15px]">
              {['Who is in the village? Pick friends or search for others.', 'Choose the roles, one faction at a time.', 'Optional rules for this village.', 'Check everything before creating the village.'][step - 1]}
            </p>
          </div>
          {step === 1 && <PlayersStep players={players} onAdd={addPlayer} onRemove={removePlayer} />}
          {step === 2 && (
            <RolesStep
              counts={counts}
              totPlayers={totPlayers}
              totRoles={totRoles}
              faction={faction}
              setFaction={setFaction}
              onChange={setCount}
              onSuggest={suggest}
              onDetail={setDetail}
            />
          )}
          {step === 3 && <OptionsStep settingsOn={settingsOn} setSettingsOn={setSettingsOn} />}
          {step === 4 && (
            <SummaryStep players={players} counts={counts} settingsOn={settingsOn} totRoles={totRoles} reason={reason} />
          )}
        </Panel>

        {/* Bottom action bar: thumb-reachable, sticky at the end of the page. */}
        <div className="sticky bottom-0 z-30 -mx-4 -mb-8 mt-2 border-t-[3px] border-double border-[var(--f-brass)] bg-[var(--f-paper)] px-4 pt-3 pb-4 shadow-[0_-4px_12px_rgba(60,40,20,.18)]">
          <div className="nw2-page flex flex-col gap-3">
            <p aria-live="polite" className="text-center text-sm font-bold">
              {plural(totPlayers, 'player')} · {totRoles}/{totPlayers} roles
            </p>
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
                <button type="button" onClick={create} disabled={!enabled} className={cn(primaryBtn, 'h-11 flex-[2] disabled:opacity-40')}>
                  Create village
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        {detail && (
          <DialogContent className="variant-F vf-paper max-w-[min(20rem,calc(100%-2rem))] gap-4 border-[3px] p-5 sm:max-w-xs">
            <DialogTitle className="vf-title text-lg">{cap(detail.name)}</DialogTitle>
            <img
              src={cardSrc(detail.name, false)}
              alt={cap(detail.name)}
              className="mx-auto max-h-[60vh] w-auto rounded-[6px] border-2 border-[var(--f-brass)] shadow-[0_4px_10px_rgba(0,0,0,.3)]"
            />
            <DialogDescription className="text-[15px] leading-snug text-[var(--f-ink)]">{detail.description}</DialogDescription>
          </DialogContent>
        )}
      </Dialog>

      <Toaster />
    </Layout>
  );
}
