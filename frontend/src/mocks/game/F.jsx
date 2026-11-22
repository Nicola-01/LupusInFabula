import { useState } from 'react';
import { BookOpen, ClipboardList, Eye, EyeOff, Home, Moon, ScrollText, Sun, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  gameActionsMaster, gameConfiguration, gameLogs, gamePlayers, gamePlayersMaster, gameSettings, gameStatus, roles as rolesFixture, session, villageMaster,
} from '@/mocks/fixtures';
import { Footer, Navbar, Ornament, Panel, Stage, Toaster, UserToken, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Master and player views of the village page, TABS concept: on mobile a bottom tab bar
// (Actions | Players | Log | Roles) with the main CTA above it. Desktop: players | actions | log.
// The real page builds the same blocks (header, actions, players, log, role, settings) with imperative DOM code.
// Plain CSS is not needed: everything is kit `vf-*` classes, Tailwind and the CSS vars of the kit.

const VIEWS = [
  { id: 'night', label: 'Night' },
  { id: 'day', label: 'Day' },
  { id: 'player', label: 'Player' },
  { id: 'over', label: 'Game over' },
];

// Fixture data. Game 6 (gamePlayersMaster, gameActionsMaster) is the live game; game 1 (gamePlayers, gameLogs) is the finished one.
const ME = session.user.username;
const VILLAGE_ID = villageMaster.publicId;
const ROUND = 2;
const PLAYERS = gamePlayersMaster['resource-list'].map((i) => i.playsAsIn);
const ACTIONS = gameActionsMaster['resource-list'].map((i) => i.actionTarget);
const ROLES = rolesFixture.roles.flat();
const SETTINGS = gameSettings['resource-list'].map((i) => i.setting);
const CONFIG = gameConfiguration['resource-list'].map((i) => i.role);
const WHO_WINS = ['farmers', 'wolf pack', 'hamster', 'jester'];
// Faction by role type, same mapping as the other concepts (type 2 = victory stealer, 3 = neutral).
const FACTION = {
  0: { title: 'Good', color: 'var(--roles-bg-good)', icon: 'fas fa-shield-alt' },
  1: { title: 'Evil', color: 'var(--roles-bg-evil)', icon: 'fas fa-paw' },
  2: { title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)', icon: 'fas fa-user-secret' },
  3: { title: 'Neutral', color: 'var(--roles-bg-neutral)', icon: 'fas fa-theater-masks' },
};
// Winner id of game.who_win -> faction type (0 farmers, 1 wolf pack, 2 hamster, 3 jester).
const WIN_TYPE = [0, 1, 2, 2];

const roleOf = (name) => ROLES.find((r) => r.name === name);
const factionOf = (name) => FACTION[roleOf(name)?.type ?? 0];
const roleSrc = (name, low = true) => `/media/cards/${low ? 'lowResolution/' : ''}${encodeURIComponent(name)}.png`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

// Night of round 2 is in progress: round 2 night entries exist only in the day view.
const act = (round, phase, player, typeAction, target = null) => ({
  Action: { gameId: 6, player, round, phase, subphase: 0, typeAction, target, blocked: false },
});
const LOG = [
  act(1, 'night', 'aiorT', 'maul', 'Bubis'),
  act(1, 'night', 'Kevin', 'investigate', 'Hare_Segz'),
  act(1, 'night', 'Matteo', 'protect', 'Japo'),
  act(1, 'night', 'Bubis', 'dead'),
  act(1, 'day', 'aiorT', 'vote', 'Hare_Segz'),
  act(1, 'day', 'Hare_Segz', 'vote', 'Matteo'),
  act(1, 'day', 'Kevin', 'vote', 'Hare_Segz'),
  act(1, 'day', 'Japo', 'vote', 'Matteo'),
  act(1, 'day', 'Matteo', 'vote', 'Kevin'),
  act(2, 'night', 'aiorT', 'maul', 'Japo'),
  act(2, 'night', 'Kevin', 'investigate', 'Matteo'),
  act(2, 'night', 'Matteo', 'protect', 'Kevin'),
  act(2, 'night', 'Japo', 'dead'),
];
// Index of a log entry in time: round 1 night = 0, round 1 day = 1, round 2 night = 2, ...
const idx = (e) => (e.Action.round - 1) * 2 + (e.Action.phase === 'day' ? 1 : 0);
const visibleLog = (upto) => LOG.filter((e) => idx(e) <= upto);

const entryText = ({ player, typeAction, target }) => {
  switch (typeAction) {
    case 'maul': return `Wolves mauled ${target}`;
    case 'investigate': return `Seer probed ${target}`;
    case 'protect': return `Knight protected ${target}`;
    case 'vote': return `${player} voted ${target}`;
    case 'dead': return `${player} died`;
    default: return `${player} ${typeAction}${target ? ` ${target}` : ''}`;
  }
};
const dayDeathText = (e) => (e.Action.typeAction === 'dead' && e.Action.phase === 'day' ? `${e.Action.player} was lynched` : entryText(e.Action));

// Shared log: entries grouped by round and phase, latest round open. Upto/entries come from the caller.
function LogAccordion({ entries, rounds = ROUND, textOf = (e) => entryText(e.Action) }) {
  return (
    <Accordion type="multiple" defaultValue={[`r${rounds}`]}>
      {Array.from({ length: rounds }, (_, i) => i + 1).map((r) => (
        <AccordionItem key={r} value={`r${r}`} className="border-[var(--f-brass)]">
          <AccordionTrigger className="vf-title px-1 text-base hover:no-underline">Round {r}</AccordionTrigger>
          <AccordionContent className="px-1">
            {['night', 'day'].map((phase) => {
              const list = entries.filter((e) => e.Action.round === r && e.Action.phase === phase);
              return (
                <div key={phase} className="mb-2">
                  <p className="vf-title text-xs uppercase tracking-wider vf-ink2">{phase}</p>
                  {list.length ? (
                    <ul className="m-0 list-none p-0 text-[15px]">
                      {list.map((e, i) => <li key={i} className="border-b border-dashed border-[var(--f-brass)] py-1.5">{textOf(e)}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm vf-ink2">{r === rounds && phase === 'day' ? 'In progress.' : 'No entries.'}</p>
                  )}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// Round table, same geometry as newGame F5. Dead players are greyed with a skull; the master also sees faction badges.
function Ring({ players, dead, showRoles = false }) {
  const N = players.length;
  const alive = N - players.filter((p) => dead.includes(p.username)).length;
  return (
    <div className="relative mx-auto mb-10 aspect-square w-full max-w-[300px]">
      <div
        aria-hidden="true"
        className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full border-[3px] border-double border-[var(--f-brass)] text-center text-[var(--f-on-felt)] shadow-[inset_0_0_24px_rgba(0,0,0,.35)]"
        style={{ background: 'radial-gradient(circle at 50% 45%, var(--f-felt) 0 55%, rgba(0,0,0,.25) 100%)' }}
      >
        <span className="vf-title text-sm">{alive} alive</span>
        <span className="text-xs">{N - alive} dead</span>
      </div>
      <ol aria-label={`Players around the table, ${alive} alive, ${N - alive} dead`} className="absolute inset-0 m-0 list-none p-0">
        {players.map((p, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
          const left = 50 + 36 * Math.cos(angle);
          const top = 50 + 36 * Math.sin(angle);
          const isDead = dead.includes(p.username);
          const faction = factionOf(p.role);
          return (
            <li key={p.username} className="absolute size-0" style={{ left: `${left}%`, top: `${top}%` }}>
              <div className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className={cn('relative', isDead && 'grayscale opacity-60')}>
                  <UserToken username={p.username} size="md" />
                  {isDead && (
                    <i role="img" aria-label="dead" className="fas fa-skull absolute -right-1 -top-1 rounded-full bg-[var(--f-paper)] p-0.5 text-[11px] text-[var(--f-rubric)]" />
                  )}
                  {showRoles && (
                    <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-[var(--f-brass)] bg-[var(--f-paper)]">
                      <i className={faction.icon} aria-hidden="true" style={{ color: faction.color, fontSize: 10 }} />
                      <span className="sr-only">{p.role}, {faction.title}</span>
                    </span>
                  )}
                </span>
                <span className={cn('mt-1 whitespace-nowrap text-xs font-bold', isDead && 'line-through vf-ink2')}>{p.username}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Read-only list of the settings that are on (the master's gear popup with skip/previous/end is not in this mock).
function SettingsPanel() {
  return (
    <Panel className="p-4">
      <h2 className="vf-title mb-2 text-base">Game settings</h2>
      <ul className="m-0 list-none space-y-2 p-0 text-sm">
        {SETTINGS.map((s) => (
          <li key={s.setting_name} className={cn('flex gap-2', !s.enable && 'vf-ink2')}>
            <i className={cn('mt-0.5 fas', s.enable ? 'fa-check-square text-[var(--f-felt)] dark:text-[#6fa36f]' : 'fa-square')} aria-hidden="true" />
            <span>
              <span className="font-bold">{s.setting_name}</span>: {s.enable ? 'on' : 'off'}
              <span className="block text-xs vf-ink2">{s.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// Role list for the Roles dialog (roles present in the game, with the configuration descriptions).
function RolesDialog({ open, onOpenChange, names }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="variant-F vf-paper max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="vf-title text-xl">Roles in this game</DialogTitle>
          <DialogDescription className="vf-ink2">The roles of the village, with their power.</DialogDescription>
        </DialogHeader>
        <ul className="m-0 list-none space-y-3 p-0">
          {names.map((n) => {
            const f = factionOf(n);
            const desc = CONFIG.find((c) => c.name === n)?.description ?? '';
            return (
              <li key={n} className="flex gap-3">
                <img src={roleSrc(n)} alt="" className="h-20 w-14 shrink-0 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,.3)]" />
                <div className="min-w-0">
                  <p className="vf-title font-bold capitalize">{n}</p>
                  <p className="text-xs"><i className={cn(f.icon, 'mr-1')} aria-hidden="true" style={{ color: f.color }} />{f.title}</p>
                  <p className="mt-1 text-sm">{desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

// Shared sticky header: navbar + compact phase bar (phase title, village id, optional right slot).
function Header({ icon: Icon, title, right }) {
  return (
    <div className="sticky top-0 z-40">
      <Navbar user={ME} />
      <div className="vf-nav border-b-2 border-[var(--f-nav-brass)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Icon className="size-5 shrink-0 text-[var(--f-nav-brass)]" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="vf-title m-0 text-base leading-tight sm:text-lg">{title}</h1>
              <p className="m-0 truncate font-['Cinzel'] text-xs opacity-80">{VILLAGE_ID}</p>
            </div>
          </div>
          {right}
        </div>
      </div>
    </div>
  );
}

// Main CTA with a confirmation AlertDialog. Mobile: fixed above the tab bar. Desktop: static under the columns.
function ActionCta({ label, title, description, onConfirm, hint }) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t-2 border-[var(--f-brass)] bg-[var(--f-page)] p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
      <div className="mx-auto max-w-6xl">
        {hint && <p className="mb-1 text-center text-xs vf-ink2 md:text-left">{hint}</p>}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className={cn(primaryBtn, 'h-12 w-full text-base')}>{label}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="variant-F vf-paper">
            <AlertDialogHeader>
              <AlertDialogTitle className="vf-title">{title}</AlertDialogTitle>
              <AlertDialogDescription className="vf-ink2">{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={cn(outlineBtn, 'h-11')}>Cancel</AlertDialogCancel>
              <AlertDialogAction className={cn(primaryBtn, 'h-11')} onClick={onConfirm}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// One night action: role card, who plays it, faction, target picker and the live choice.
function NightCard({ action, targets, value, onChange }) {
  const { role, players, action: verb } = action;
  const f = factionOf(role);
  return (
    <Panel className="p-4" style={{ borderLeft: `6px solid ${f.color}` }}>
      <div className="flex gap-3">
        <img src={roleSrc(role)} alt="" className="h-24 w-16 shrink-0 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,.3)]" />
        <div className="min-w-0 flex-1">
          <h3 className="vf-title m-0 text-lg font-bold">{cap(role)}</h3>
          <p className="m-0 text-sm"><i className={cn(f.icon, 'mr-1')} aria-hidden="true" style={{ color: f.color }} />{f.title} · {verb}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs vf-ink2">Played by</span>
            {players.map((p) => (
              <span key={p.player} className="inline-flex items-center gap-1 text-sm"><UserToken username={p.player} size="sm" />{p.player}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor={`target-${role}`} className="vf-title mb-1 text-sm">Target</Label>
        <Select value={value ?? 'none'} onValueChange={(v) => onChange(v === 'none' ? null : v)}>
          <SelectTrigger id={`target-${role}`} className="h-11 w-full border-2 border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)]">
            <SelectValue placeholder="Choose a target" />
          </SelectTrigger>
          <SelectContent className="variant-F vf-paper">
            <SelectItem value="none" className="vf-item min-h-11">No target</SelectItem>
            {targets.map((t) => <SelectItem key={t} value={t} className="vf-item min-h-11">{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <p className="mt-2 text-sm">Chosen: <strong>{value ?? 'nobody yet'}</strong></p>
    </Panel>
  );
}

// Master views (night and day). Night: action cards. Day: per-voter vote selects, tally and suspects.
function MasterView({ view }) {
  const night = view === 'night';
  const dead = night ? ['Bubis'] : ['Bubis', 'Japo'];
  const alive = PLAYERS.filter((p) => !dead.includes(p.username)).map((p) => p.username);
  const [tab, setTab] = useState('actions');
  const [rolesOpen, setRolesOpen] = useState(false);
  const [picks, setPicks] = useState({ wolf: 'Japo', seer: 'Hare_Segz', knight: null });
  const [votes, setVotes] = useState({ aiorT: 'Matteo', Hare_Segz: 'Kevin', Kevin: 'Matteo' });

  // Tally for the day view: votes per alive target; suspects are the two most voted.
  const tally = Object.fromEntries(alive.map((a) => [a, 0]));
  Object.values(votes).forEach((t) => { if (t in tally) tally[t] += 1; });
  const ranked = alive.filter((a) => tally[a] > 0).sort((a, b) => tally[b] - tally[a]);
  const maxVotes = Math.max(1, ...Object.values(tally));
  const topVotes = ranked.length ? tally[ranked[0]] : 0;
  const lynchName = ranked.length && tally[ranked[0]] !== tally[ranked[1]] ? ranked[0] : null;

  const chosen = ACTIONS.filter((a) => picks[a.role]).length;
  const tabBtn = (id) => cn(tab !== id && 'hidden md:block');
  const names = [...new Set(PLAYERS.map((p) => p.role))];

  return (
    <>
      <Header
        icon={night ? Moon : Sun}
        title={`${night ? 'Night' : 'Day'} · Round ${ROUND}`}
        right={(
          <Button variant="ghost" className="vf-ghost hidden gap-2 md:inline-flex" onClick={() => setRolesOpen(true)}>
            <BookOpen className="size-4" aria-hidden="true" />Roles
          </Button>
        )}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-44 pt-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] md:items-start md:gap-6 md:pb-8">
        <section aria-labelledby="players-h" className={tabBtn('players')}>
          <h2 id="players-h" className="vf-title mb-3 text-lg">Players</h2>
          <Ring players={PLAYERS} dead={dead} showRoles />
          <SettingsPanel />
        </section>

        <section aria-labelledby="actions-h" className={cn('mt-6 md:mt-0', tabBtn('actions'))}>
          <h2 id="actions-h" className="vf-title mb-3 text-lg">{night ? 'Night actions' : 'Day vote'}</h2>
          {night ? (
            <div className="space-y-4">
              {ACTIONS.map((a) => (
                <NightCard
                  key={a.role}
                  action={a}
                  targets={a.possibleTargets.map((t) => t.player).filter((t) => !dead.includes(t))}
                  value={picks[a.role]}
                  onChange={(v) => setPicks((p) => ({ ...p, [a.role]: v }))}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Panel className="p-4">
                <p className="mb-2 text-sm vf-ink2">Ballot 1. Pick who each living player votes for.</p>
                <ul className="m-0 list-none p-0">
                  {alive.map((voter) => (
                    <li key={voter} className="flex items-center gap-3 border-b border-dashed border-[var(--f-brass)] py-2 last:border-0">
                      <UserToken username={voter} size="sm" />
                      <span className="flex-1 font-bold">{voter}</span>
                      <Select value={votes[voter] ?? 'none'} onValueChange={(v) => setVotes((s) => ({ ...s, [voter]: v === 'none' ? undefined : v }))}>
                        <SelectTrigger aria-label={`Vote of ${voter}`} className="h-11 w-36 border-2 border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)]">
                          <SelectValue placeholder="No vote" />
                        </SelectTrigger>
                        <SelectContent className="variant-F vf-paper">
                          <SelectItem value="none" className="vf-item min-h-11">No vote</SelectItem>
                          {alive.filter((t) => t !== voter).map((t) => <SelectItem key={t} value={t} className="vf-item min-h-11">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel className="p-4">
                <h3 className="vf-title mb-2 text-base">Tally</h3>
                <ul className="m-0 list-none space-y-2 p-0">
                  {alive.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm">
                      <span className="w-24 shrink-0 truncate font-bold">{a}</span>
                      <span className="relative h-3 flex-1 rounded-sm bg-[var(--f-hl)]" role="img" aria-label={`${plural(tally[a], 'vote')} for ${a}`}>
                        <span className="absolute inset-y-0 left-0 rounded-sm bg-[var(--f-felt)]" style={{ width: `${(tally[a] / maxVotes) * 100}%` }} />
                      </span>
                      <span className="w-5 text-right">{tally[a]}</span>
                      {ranked[0] === a && <span className="vf-rubric text-xs font-bold">1st suspect</span>}
                      {ranked[1] === a && <span className="vf-rubric text-xs font-bold">2nd suspect</span>}
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          )}
        </section>

        <section aria-labelledby="log-h" className={cn('mt-6 md:mt-0', tabBtn('log'))}>
          <h2 id="log-h" className="vf-title mb-3 text-lg">Village logs</h2>
          <LogAccordion entries={visibleLog(night ? 1 : 2)} textOf={dayDeathText} />
        </section>
      </main>

      {night ? (
        <ActionCta
          label="Resolve night"
          hint={`${chosen} of ${ACTIONS.length} actions chosen`}
          title="Resolve the night?"
          description="The actions are applied and the day starts. This cannot be undone."
          onConfirm={() => notify('info', 'Night resolved', 'Japo was mauled by the wolves. Seer probed Hare_Segz: a wolf. Knight protected Matteo.')}
        />
      ) : (
        <ActionCta
          label={lynchName ? `Lynch ${lynchName}` : 'End day'}
          hint={lynchName ? `${plural(topVotes, 'vote')} for ${lynchName}` : 'No single top suspect: the day ends without a lynching.'}
          title={lynchName ? `Lynch ${lynchName}?` : 'End the day?'}
          description={lynchName ? `${lynchName} is sent to the gallows with ${plural(topVotes, 'vote')}.` : 'Nobody is lynched.'}
          onConfirm={() => (lynchName
            ? notify('info', `${lynchName} was lynched`, `${plural(topVotes, 'vote')}. Night ${ROUND + 1} starts next.`)
            : notify('info', 'Day ended', 'Nobody was lynched.'))}
        />
      )}

      {/* Mobile tab bar (thumb zone). Roles opens the dialog, the other tabs switch the columns. */}
      <nav aria-label="Master sections" className="vf-nav fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t-2 border-[var(--f-nav-brass)] md:hidden">
        {[
          { id: 'actions', label: night ? 'Actions' : 'Vote', Icon: ClipboardList },
          { id: 'players', label: 'Players', Icon: Users },
          { id: 'log', label: 'Log', Icon: ScrollText },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className="vf-title flex min-h-11 flex-col items-center justify-center gap-0.5 text-xs aria-pressed:bg-black/25 aria-pressed:shadow-[inset_0_3px_0_var(--f-nav-brass)]"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRolesOpen(true)}
          className="vf-title flex min-h-11 flex-col items-center justify-center gap-0.5 text-xs"
        >
          <BookOpen className="size-5" aria-hidden="true" />
          Roles
        </button>
      </nav>

      <RolesDialog open={rolesOpen} onOpenChange={setRolesOpen} names={names} />
    </>
  );
}

// Player view: own role card (eye toggle), faction and win condition, alive status, table and public log.
function PlayerView() {
  const me = PLAYERS.find((p) => p.username === 'Kevin');
  const role = roleOf(me.role);
  const f = factionOf(me.role);
  const [reveal, setReveal] = useState(true);
  const dead = ['Bubis'];
  const publicLog = visibleLog(1).filter((e) => e.Action.typeAction === 'vote' || e.Action.typeAction === 'dead');
  return (
    <>
      <Header icon={Moon} title={`Night · Round ${ROUND}`} right={<span className="vf-title text-xs">You are alive</span>} />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6">
        <Panel className="flex flex-col items-center gap-4 p-5 sm:flex-row sm:items-start">
          <img
            src={reveal ? roleSrc(me.role, false) : '/media/cards/card_back/standard_red.png'}
            alt={reveal ? `Your role card: ${me.role}` : 'Your role card, hidden'}
            className="w-52 rounded-md shadow-[0_6px_14px_rgba(60,40,20,.35)]"
          />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="vf-title text-sm vf-ink2">You are</p>
            <h2 className="vf-title m-0 text-2xl font-bold">{reveal ? cap(me.role) : 'Hidden role'}</h2>
            {reveal && <p className="mt-1 text-sm"><i className={cn(f.icon, 'mr-1')} aria-hidden="true" style={{ color: f.color }} />{f.title}</p>}
            <p className="mt-2 text-sm">Wins with: <strong>{reveal ? WHO_WINS[role.with_who_wins] ?? 'draw' : '?'}</strong></p>
            <p className="mt-1 text-sm">Status: <strong>{dead.includes(me.username) ? 'dead' : 'alive'}</strong></p>
            <Button
              variant="outline"
              className={cn(outlineBtn, 'mt-4 h-11')}
              aria-pressed={!reveal}
              onClick={() => setReveal((r) => !r)}
            >
              {reveal ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              {reveal ? 'Hide role' : 'Show role'}
            </Button>
          </div>
        </Panel>

        <section aria-labelledby="table-h">
          <h2 id="table-h" className="vf-title mb-3 text-lg">Players</h2>
          <Ring players={PLAYERS} dead={dead} />
        </section>

        <section aria-labelledby="public-h">
          <h2 id="public-h" className="vf-title mb-3 text-lg">Village logs</h2>
          <LogAccordion entries={publicLog} rounds={1} textOf={dayDeathText} />
        </section>
      </main>
    </>
  );
}

// Game over: winner banner, all players with revealed roles, rounds and duration.
function OverView() {
  const game = gameStatus.game;
  const win = game.who_win;
  const f = FACTION[WIN_TYPE[win] ?? 2];
  const players = gamePlayers['resource-list'].map((i) => i.playsAsIn);
  const [date, time] = game.start.split('.')[0].split(' ');
  const [h, m, s] = game.game_duration.split(':').map(Number);
  const duration = [h && `${h} h`, m && `${m} min`, s && `${s} s`].filter(Boolean).join(' ');
  return (
    <>
      <Header icon={Trophy} title="Game over" right={null} />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6">
        <Panel className="flex flex-col items-center gap-3 p-6 text-center">
          <span className="vf-seal vf-seal-warn" aria-hidden="true">
            <i className={cn(f.icon, 'text-xl')} />
          </span>
          <p className="vf-title m-0 text-sm vf-rubric">The game is over</p>
          <h2 className="vf-display m-0 text-3xl">The {WHO_WINS[win]} win!</h2>
          <p className="m-0 text-sm vf-ink2">Started on {date} at {time} · {game.rounds} rounds · {duration}</p>
          <Ornament className="mt-2 w-full max-w-xs" />
        </Panel>

        <section aria-labelledby="final-h">
          <h2 id="final-h" className="vf-title mb-3 text-lg">The village</h2>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
            {players.map((p) => (
              <li key={p.username}>
                <Panel className={cn('flex flex-col items-center gap-2 p-3', p.isDead && 'opacity-80')} as="div">
                  <img src={roleSrc(p.role)} alt={`${p.role} card`} className={cn('h-28 w-20 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,.3)]', p.isDead && 'grayscale')} />
                  <p className="m-0 text-sm font-bold">{p.username}</p>
                  <p className="m-0 text-xs capitalize vf-ink2">{p.role}</p>
                  <p className="m-0 text-xs">
                    {p.isDead
                      ? <><i className="fas fa-skull mr-1 text-[var(--f-rubric)]" aria-hidden="true" />dead</>
                      : <><i className="fas fa-heart mr-1 text-[var(--f-felt)] dark:text-[#6fa36f]" aria-hidden="true" />survived</>}
                  </p>
                </Panel>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex justify-center">
          <Button asChild className={cn(primaryBtn, 'h-12 px-6 text-base')}>
            <a href="/home" className="!text-[var(--f-on-felt)] !no-underline">
              <Home className="size-4" aria-hidden="true" />Back to the village
            </a>
          </Button>
        </div>
      </main>
    </>
  );
}

// Demo switcher: a small segmented control above the page, not part of the real UI. Updates ?view= in the URL.
function ViewSwitcher({ view, onChange }) {
  return (
    <div className="border-b border-[var(--f-brass)] bg-[var(--f-page)] px-4 py-2">
      <div role="group" aria-label="Demo view" className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2">
        <span className="vf-title mr-1 text-xs vf-ink2">Demo view</span>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => onChange(v.id)}
            className={cn(view === v.id ? 'vf-btn vf-btn-primary' : 'vf-btn vf-btn-outline', 'min-h-9 px-3 py-1 text-sm')}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MockGameF() {
  const [view, setView] = useState(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    return VIEWS.some((x) => x.id === v) ? v : 'night';
  });
  const changeView = (v) => {
    setView(v);
    const u = new URL(window.location.href);
    u.searchParams.set('view', v);
    window.history.replaceState(null, '', u);
  };
  return (
    <Stage>
      <ViewSwitcher view={view} onChange={changeView} />
      <div className="flex flex-1 flex-col">
        {view === 'player' ? <PlayerView /> : view === 'over' ? <OverView /> : <MasterView key={view} view={view} />}
      </div>
      <Footer />
      <Toaster />
    </Stage>
  );
}
