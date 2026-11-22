import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookMarked, ChevronLeft, ChevronRight, Eye, EyeOff, Pause, Pencil, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { gameActionsMaster, gameLogs, gamePlayers, gamePlayersMaster, roles, session } from '@/mocks/fixtures';
import { Layout, Ornament, Panel, Seal, Toaster, UserToken, dangerBtn, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Data. Night/day use the 6-player master game (all alive, then one mauled). Player/over use the 8-player game.
const toRoster = (fx) => fx['resource-list'].map((e) => e.playsAsIn);
const MASTER = toRoster(gamePlayersMaster);
const MAULED = 'Japo'; // night 1 result, so the day view starts with one dead player
const DAY = MASTER.map((p) => (p.username === MAULED ? { ...p, isDead: true } : p));
const GAME = toRoster(gamePlayers);
const ME = 'Polterino';
const ROLE = Object.fromEntries(roles.roles.flat().map((r) => [r.name, r]));
const LOG = gameLogs['resource-list'].map((e) => e.Action);
// Night steps in the order the fixture lists them (wolves, seer, knight), as the master calls them.
const ACTIONS = gameActionsMaster['resource-list'].map(({ actionTarget: t }) => ({
  role: t.role, action: t.action, players: t.players.map((p) => p.player), targets: t.possibleTargets.map((p) => p.player),
}));
const CALL = {
  maul: { title: 'Wolves', open: 'Wolves, wake up and choose a victim.', close: 'Wolves, close your eyes.' },
  investigate: { title: 'Seer', open: 'Seer, open your eyes and choose whom to investigate.', close: 'Seer, close your eyes.' },
  protect: { title: 'Knight', open: 'Knight, open your eyes and choose whom to protect.', close: 'Knight, close your eyes.' },
};
const VIEWS = [
  { id: 'night', label: 'Night' },
  { id: 'day', label: 'Day' },
  { id: 'player', label: 'Player' },
  { id: 'over', label: 'Game over' },
];
const TOTAL = 180; // discussion, seconds
const RADIUS = 54;
const CARD_BACK = '/media/cards/card_back/standard_red.png';

// Colours are the --roles-* vars (pastel in light, dark in dark), so the badge text uses the ink colour.
const FACTIONS = {
  0: { label: 'Good', icon: 'fas fa-shield-alt', color: 'var(--roles-bg-good)' },
  1: { label: 'Evil', icon: 'fas fa-paw', color: 'var(--roles-bg-evil)' },
  2: { label: 'Victory stealer', icon: 'fas fa-user-secret', color: 'var(--roles-db-victoryStealer-)' },
  3: { label: 'Neutral', icon: 'fas fa-theater-masks', color: 'var(--roles-bg-neutral)' },
};
const factionOf = (role) => FACTIONS[ROLE[role]?.type ?? 0];
const initials = (n) => n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
const countBy = (list) => list.reduce((m, n) => ({ ...m, [n]: (m[n] ?? 0) + 1 }), {});
// Stable sort: ties keep the seating order.
const topTwo = (names, counts) => [...names].sort((x, y) => (counts[y] ?? 0) - (counts[x] ?? 0)).slice(0, 2);
const VERB = { vote: 'votes for', maul: 'mauls', investigate: 'investigates', protect: 'protects', plague: 'infects', explore: 'explores', shot: 'shoots' };
const describe = (a) => {
  if (a.typeAction === 'dead') return `${a.player} died`;
  return `${a.player} ${VERB[a.typeAction] ?? a.typeAction} ${a.target ?? ''}`.trim();
};
// Log grouped by round, night before day (the fixture lists day first).
const LOG_GROUPS = Object.values(LOG.reduce((acc, a) => {
  const key = `${a.round}-${a.phase}`;
  (acc[key] ??= { round: a.round, phase: a.phase, items: [] }).items.push(a);
  return acc;
}, {})).sort((x, y) => x.round - y.round || (x.phase === 'night' ? -1 : 1));

// Script text: the line read aloud, in Cinzel italics between quotes.
function ReadAloud({ children }) {
  return (
    <div>
      <p className="vf-title text-xs tracking-[.2em] uppercase vf-rubric">Read aloud</p>
      <p className="vf-title mt-1 border-l-4 vf-brass-border pl-4 text-lg leading-snug italic">&ldquo;{children}&rdquo;</p>
    </div>
  );
}

function FactionBadge({ role }) {
  const f = factionOf(role);
  return (
    <span className="inline-flex items-center gap-2 self-center rounded-sm px-3 py-1 text-sm font-bold" style={{ background: f.color, color: 'var(--f-ink)' }}>
      <i className={f.icon} aria-hidden="true" />
      {f.label} · <span className="capitalize">{role}</span>
    </span>
  );
}

// Who plays the role, as tokens.
function WhoPlays({ names }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="vf-title text-xs tracking-widest uppercase vf-ink2">Who plays</span>
      {names.map((n) => <UserToken key={n} username={n} size="sm" />)}
      <span className="text-base">{names.join(', ')}</span>
    </div>
  );
}

function ChosenNote({ name }) {
  return (
    <div className="vf-paper flex items-center gap-4 px-4 py-3">
      <Seal>{initials(name)}</Seal>
      <div>
        <p className="vf-title text-xs tracking-widest uppercase vf-rubric">Chosen target</p>
        <p className="text-xl font-bold">{name}</p>
      </div>
    </div>
  );
}

// Reference panel: the same content in the mobile Sheet and the desktop side column.
function Reference({ roster }) {
  const inGame = [...new Set(roster.map((p) => p.role))];
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="vf-title mb-2 text-base">Players</h3>
        <ul className="grid grid-cols-2 gap-2">
          {roster.map((p) => (
            <li key={p.username} className="flex items-center gap-2 text-sm">
              <UserToken username={p.username} size="sm" />
              <span className="min-w-0 flex-1 truncate">{p.username}</span>
              {p.isDead ? <span className="whitespace-nowrap"><i className="fas fa-skull" aria-hidden="true" /> dead</span> : <span className="whitespace-nowrap">alive</span>}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="vf-title mb-2 text-base">Roles in game</h3>
        <ul className="flex flex-col gap-1.5 text-sm">
          {inGame.map((r) => {
            const f = factionOf(r);
            return (
              <li key={r} className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-sm" style={{ background: f.color, color: 'var(--f-ink)' }}>
                  <i className={f.icon} aria-hidden="true" />
                </span>
                <span className="capitalize">{r}</span>
                <span className="vf-ink2">({f.label})</span>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h3 className="vf-title mb-2 text-base">Log</h3>
        <div className="flex flex-col gap-4">
          {LOG_GROUPS.map((g) => (
            <div key={`${g.round}-${g.phase}`}>
              <p className="vf-title text-xs tracking-widest uppercase vf-rubric">Round {g.round} · <span className="capitalize">{g.phase}</span></p>
              <ul className="mt-1 flex flex-col gap-1 text-[15px]">
                {g.items.map((a, i) => <li key={i} className="border-l-2 vf-brass-border pl-2">{describe(a)}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Top bar of the page: label, step segments, and the bookmark tab (opens the reference Sheet below lg).
function Band({ label, roster, steps }) {
  return (
    <div className="vf-nav flex items-center gap-3 rounded-sm px-4 py-2 shadow-[0_4px_10px_rgba(0,0,0,.25)]">
      <div className="min-w-0 flex-1">
        <p className="vf-title text-sm tracking-widest uppercase text-[var(--f-navtext)]">
          {label}{steps && ` · step ${steps.index + 1}/${steps.total}`}
        </p>
        {steps && (
          <div className="mt-1.5 flex gap-1" aria-hidden="true">
            {Array.from({ length: steps.total }, (_, i) => (
              <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= steps.index ? 'var(--f-nav-brass)' : 'rgba(243,230,200,.25)' }} />
            ))}
          </div>
        )}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="vf-ghost min-h-11 gap-2 lg:hidden">
            <BookMarked aria-hidden="true" /> Reference
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="variant-F vf-paper w-[min(22rem,100vw)] overflow-y-auto p-5">
          <SheetTitle className="vf-title text-lg vf-rubric">Reference</SheetTitle>
          <SheetDescription className="sr-only">Players, roles and the full log of the game.</SheetDescription>
          <Reference roster={roster} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// One parchment page with the sticky Back/Next bar in the thumb zone.
function PageSheet({ page, index, total, setIndex }) {
  return (
    <>
      <article className="vf-paper flex min-h-[50vh] flex-col gap-5 p-5 sm:p-7">
        <div>
          <p className="vf-title text-xs tracking-[.2em] uppercase vf-rubric">{page.kicker}</p>
          <h2 className="vf-title mt-1 text-2xl leading-tight sm:text-3xl">{page.title}</h2>
        </div>
        <Ornament />
        {page.body}
      </article>
      <nav aria-label="Page steps" className="sticky bottom-0 z-10 flex gap-3 border-t-2 vf-brass-border bg-[var(--f-page)] py-3">
        <Button className={cn(outlineBtn, 'min-h-12 flex-1 gap-1')} disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ChevronLeft aria-hidden="true" /> Back
        </Button>
        {!page.hideNext && (
          <Button
            className={cn(primaryBtn, 'min-h-12 flex-[1.4] gap-1')}
            disabled={page.canNext === false}
            onClick={() => (page.onNext ? page.onNext() : setIndex(index + 1))}
          >
            {page.next ?? 'Next'} <ChevronRight aria-hidden="true" />
          </Button>
        )}
      </nav>
    </>
  );
}

// Night.
function RoleCall({ action, pick, onPick }) {
  const call = CALL[action.action];
  return (
    <>
      <img src={`/media/cards/lowResolution/${action.role}.png`} alt={`${action.role} card`} className="mx-auto h-44 w-auto rounded-sm shadow-md" />
      <div className="flex justify-center"><FactionBadge role={action.role} /></div>
      <ReadAloud>{call.open}</ReadAloud>
      <WhoPlays names={action.players} />
      <div role="group" aria-label="Targets" className="grid grid-cols-2 gap-2">
        {action.targets.map((t) => {
          const on = pick === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(t)}
              className={cn('vf-btn flex min-h-14 items-center gap-3 px-3 text-left text-base', on ? 'vf-btn-primary' : 'vf-btn-outline')}
            >
              <UserToken username={t} size="sm" />
              <span className="truncate">{t}</span>
            </button>
          );
        })}
      </div>
      {pick ? (
        <>
          <ChosenNote name={pick} />
          <p className="vf-ink2 text-sm">When they have decided, read aloud: <em>&ldquo;{call.close}&rdquo;</em></p>
        </>
      ) : (
        <p className="vf-ink2 text-sm">Tap a target to continue.</p>
      )}
    </>
  );
}

function NightBook({ roster, onDay }) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState({});
  const [confirm, setConfirm] = useState(false);
  const setPick = (action, name) => setPicks((p) => ({ ...p, [action]: name }));
  const ready = ACTIONS.every((a) => picks[a.action]);
  const roleOf = (name) => roster.find((p) => p.username === name)?.role;
  const RESOLVE = ACTIONS.length + 2; // intro, one page per role, summary, then resolve
  const mauled = picks.maul && picks.maul !== picks.protect ? picks.maul : null;

  const pages = [
    {
      kicker: 'Start of the night',
      title: 'Everyone closes their eyes',
      body: (
        <>
          <ReadAloud>It is night. Everyone, close your eyes.</ReadAloud>
          <p className="vf-ink2 text-sm">Wait in silence until every eye is closed before you call the first role.</p>
        </>
      ),
    },
    ...ACTIONS.map((a, k) => ({
      kicker: 'Role call',
      title: CALL[a.action].title,
      canNext: Boolean(picks[a.action]),
      body: <RoleCall action={a} pick={picks[a.action]} onPick={(t) => setPick(a.action, t)} />,
    })),
    {
      kicker: 'Check before resolving',
      title: 'Night summary',
      next: 'Continue',
      body: (
        <ul className="flex flex-col">
          {ACTIONS.map((a, k) => (
            <li key={a.action} className="flex items-center gap-3 border-b vf-brass-border py-3">
              <div className="min-w-0 flex-1">
                <p className="vf-title text-sm">{CALL[a.action].title}</p>
                <p className="truncate text-base">{picks[a.action] ?? <span className="vf-rubric">not chosen</span>}</p>
              </div>
              <Button className={cn(outlineBtn, 'min-h-11 gap-1')} onClick={() => setIndex(k + 1)}>
                <Pencil aria-hidden="true" /> Edit
              </Button>
            </li>
          ))}
        </ul>
      ),
    },
    {
      kicker: 'Locks the choices',
      title: 'Resolve the night',
      hideNext: true,
      body: (
        <>
          <p>Resolving locks the choices and computes the dawn.</p>
          <Button className={cn(primaryBtn, 'min-h-12 w-full')} disabled={!ready} onClick={() => setConfirm(true)}>Resolve night</Button>
        </>
      ),
    },
    {
      kicker: 'Results',
      title: 'Dawn',
      next: 'Go to day',
      onNext: onDay,
      body: (
        <>
          <ReadAloud>{mauled ? `Dawn breaks. ${mauled} was mauled.` : 'Dawn breaks. Nobody was mauled.'}</ReadAloud>
          <div className="rounded-sm border-2 border-dashed vf-brass-border p-3 text-sm">
            <p className="vf-title mb-1 text-xs tracking-widest uppercase vf-rubric">Master only, do not read aloud</p>
            {picks.protect && picks.protect === picks.maul && <p>The knight protected {picks.protect}, so nobody died.</p>}
            {picks.investigate && (
              <p>Seer learned that {picks.investigate} has {ROLE[roleOf(picks.investigate)]?.type === 1 ? 'a bad' : 'a good'} role.</p>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Band label="Night 1" roster={roster} steps={{ index, total: pages.length }} />
      <PageSheet page={pages[index]} index={index} total={pages.length} setIndex={setIndex} />
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="variant-F vf-paper">
          <AlertDialogHeader>
            <AlertDialogTitle className="vf-title">Resolve the night?</AlertDialogTitle>
            <AlertDialogDescription>The choices are locked and the results are announced at dawn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={outlineBtn}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={primaryBtn}
              onClick={() => {
                setIndex(RESOLVE + 1);
                notify('success', 'Night resolved', 'Read the dawn to the village.');
              }}
            >
              Resolve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Day.
// Discussion timer: the ring animates only with motion-safe.
function Discussion() {
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => { if (left <= 0) setRunning(false); }, [left]);
  const circ = 2 * Math.PI * RADIUS;
  const time = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-44">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--f-hl)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--f-felt)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - left / TOTAL)}
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-linear"
          />
        </svg>
        <p className="vf-title absolute inset-0 flex items-center justify-center text-3xl" aria-live="off">{time}</p>
      </div>
      <div className="flex gap-3">
        <Button className={cn(primaryBtn, 'min-h-12 gap-2 px-5')} disabled={left === 0} onClick={() => setRunning((r) => !r)}>
          {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{running ? 'Pause' : 'Start'}
        </Button>
        <Button className={cn(outlineBtn, 'min-h-12 gap-2')} onClick={() => { setRunning(false); setLeft(TOTAL); }}>
          <RotateCcw aria-hidden="true" /> Reset
        </Button>
      </div>
      {left === 0 && <p className="vf-rubric text-sm">Time is up. Move to voting.</p>}
    </div>
  );
}

// One row: token, name, and a native select (big touch target, works on phones).
function VoteRow({ name, value, options, onChange, label, placeholder }) {
  return (
    <li className="flex items-center gap-3 border-b vf-brass-border py-2">
      <UserToken username={name} size="sm" />
      <span className="min-w-0 flex-1 truncate text-base font-bold">{name}</span>
      <select
        aria-label={`${label} ${name}`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="vf-input h-11 min-w-0 max-w-[11rem] px-2 text-base"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </li>
  );
}

function DayBook({ roster, onNight }) {
  const [index, setIndex] = useState(0);
  const [dead, setDead] = useState(() => new Set(roster.filter((p) => p.isDead).map((p) => p.username)));
  const [votes, setVotes] = useState({}); // voter -> accused
  const [ballot, setBallot] = useState({}); // voter -> suspect
  const [lynched, setLynched] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const alive = roster.filter((p) => !dead.has(p.username)).map((p) => p.username);
  const counts = countBy(Object.values(votes).filter(Boolean));
  const [a, b] = topTwo(alive, counts);
  const ballotCounts = countBy(Object.values(ballot).filter(Boolean));
  const winner = (ballotCounts[b] ?? 0) > (ballotCounts[a] ?? 0) ? b : a;
  const setVote = (voter, target) => setVotes((v) => ({ ...v, [voter]: target }));
  const setBallotFor = (voter, target) => setBallot((v) => ({ ...v, [voter]: target }));

  const pages = [
    {
      kicker: 'Morning',
      title: 'Announce the night',
      body: (
        <>
          <ReadAloud>It is day. Everybody, open your eyes.</ReadAloud>
          <ReadAloud>Dawn: {MAULED} was mauled.</ReadAloud>
          <p className="vf-ink2 text-sm">Recap what happened, not how. Dead: {[...dead].join(', ') || 'nobody'}.</p>
        </>
      ),
      next: 'Start discussion',
    },
    {
      kicker: 'Three minutes',
      title: 'Discussion',
      body: (
        <>
          <ReadAloud>You have three minutes. Discuss, but never show your card.</ReadAloud>
          <Discussion />
        </>
      ),
      next: 'Start voting',
    },
    {
      kicker: 'Vote',
      title: 'Voting',
      next: 'Open the ballot',
      body: (
        <>
          <ReadAloud>Each of you, tell me who you accuse.</ReadAloud>
          <section aria-label="Live tally" className="flex flex-col gap-2">
            <h3 className="vf-title text-xs tracking-widest uppercase vf-rubric">Live tally</h3>
            <ul className="flex flex-wrap gap-2">
              {alive.map((n) => (
                <li key={n} className="vf-paper inline-flex items-center gap-2 px-2 py-1 text-sm">
                  {n} <strong className="vf-rubric text-base">{counts[n] ?? 0}</strong>
                </li>
              ))}
            </ul>
          </section>
          <ul>
            {alive.map((n) => (
              <VoteRow
                key={n}
                name={n}
                value={votes[n]}
                options={alive.filter((o) => o !== n)}
                onChange={(t) => setVote(n, t)}
                label="Vote of"
                placeholder="Not yet"
              />
            ))}
          </ul>
        </>
      ),
    },
    {
      kicker: 'Between the two',
      title: a && b ? `Ballot: ${a} or ${b}` : 'Ballot',
      next: 'Lynch',
      body: a && b ? (
        <>
          <ReadAloud>{a} and {b}, you may each speak briefly in your defence.</ReadAloud>
          <p className="vf-ink2 text-sm">Each remaining player votes for one of the two.</p>
          <ul>
            {alive.filter((n) => n !== a && n !== b).map((n) => (
              <VoteRow
                key={n}
                name={n}
                value={ballot[n]}
                options={[a, b]}
                onChange={(t) => setBallotFor(n, t)}
                label="Ballot of"
                placeholder="Not yet"
              />
            ))}
          </ul>
          <p className="text-base">Tally: {a} {ballotCounts[a] ?? 0} · {b} {ballotCounts[b] ?? 0}</p>
        </>
      ) : null,
    },
    {
      kicker: 'Verdict',
      title: 'Lynch',
      hideNext: true,
      body: winner ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Seal className="size-16 text-lg">{initials(winner)}</Seal>
          <p className="vf-title text-2xl">{winner}</p>
          <p>Most votes on the ballot. Lynch them?</p>
          <Button className={cn(dangerBtn, 'min-h-12 w-full')} onClick={() => setConfirm(true)}>Lynch {winner}</Button>
        </div>
      ) : null,
    },
    {
      kicker: 'Day summary',
      title: 'Summary',
      next: 'Begin the night',
      onNext: onNight,
      body: (
        <div className="flex flex-col gap-3">
          <p className="text-base">{lynched ? <>{lynched} was lynched. They were a <span className="capitalize">{roster.find((p) => p.username === lynched)?.role}</span>.</> : 'Nobody has been lynched yet.'}</p>
          <p className="vf-ink2 text-sm">Dead players no longer speak or show their card.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Band label="Day 1" roster={roster} steps={{ index, total: pages.length }} />
      <PageSheet page={pages[index]} index={index} total={pages.length} setIndex={setIndex} />
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="variant-F vf-paper">
          <AlertDialogHeader>
            <AlertDialogTitle className="vf-title">Lynch {winner}?</AlertDialogTitle>
            <AlertDialogDescription>{winner} leaves the game and cannot speak or show their card again.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={outlineBtn}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={dangerBtn}
              onClick={() => {
                setDead((d) => new Set([...d, winner]));
                setLynched(winner);
                setIndex(pages.length - 1);
                notify('warning', `${winner} is lynched`);
              }}
            >
              Lynch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Player.
function Chronicle({ limit }) {
  if (limit) {
    return (
      <ol className="flex flex-col gap-2">
        {LOG.slice(-limit).map((a, i) => <li key={i} className="border-l-2 vf-brass-border pl-3 text-[16px] leading-snug">{describe(a)}</li>)}
      </ol>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {LOG_GROUPS.map((g) => (
        <section key={`${g.round}-${g.phase}`}>
          <p className="vf-title text-xs tracking-widest uppercase vf-rubric">Round {g.round} · <span className="capitalize">{g.phase}</span></p>
          <ol className="mt-2 flex flex-col gap-2">
            {g.items.map((a, i) => (
              <li key={i} className="border-l-2 vf-brass-border pl-3 text-[16px] leading-snug">{describe(a)}</li>
            ))}
          </ol>
          <Ornament className="my-4" />
        </section>
      ))}
    </div>
  );
}

function PlayerView() {
  const me = GAME.find((p) => p.username === ME);
  const [shown, setShown] = useState(true);
  return (
    <>
      <Band label="Round 1 · Day" roster={GAME} />
      <Panel className="flex flex-col items-center gap-4 p-5 sm:p-7">
        <p className="vf-title text-xs tracking-[.2em] uppercase vf-rubric">Your card</p>
        <img
          src={shown ? `/media/cards/lowResolution/${me.role}.png` : CARD_BACK}
          alt={shown ? `${me.role} card` : 'Card face down'}
          className="h-56 w-auto rounded-sm shadow-md"
        />
        {shown && <FactionBadge role={me.role} />}
        <Button className={cn(outlineBtn, 'min-h-12 gap-2')} onClick={() => setShown((s) => !s)}>
          {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          {shown ? 'Hide card' : 'Show card'}
        </Button>
      </Panel>
      <Panel className="flex flex-col gap-2 p-5 sm:p-7">
        <p className="text-base"><strong>Status:</strong> {me.isDead ? 'dead, you must stay silent' : 'alive'}</p>
        <p className="text-base"><strong>Phase:</strong> Round 1 · Day, voting</p>
      </Panel>
      <Panel className="p-5 sm:p-7">
        <h2 className="vf-title mb-3 text-xl">Chronicle</h2>
        <Chronicle />
      </Panel>
    </>
  );
}

function GameOverView() {
  const winners = GAME.filter((p) => ROLE[p.role]?.type === 0);
  return (
    <>
      <Band label="Game over" roster={GAME} />
      <Panel className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <p className="vf-title text-xs tracking-[.2em] uppercase vf-rubric">The last chapter</p>
        <h2 className="vf-display text-4xl">The End</h2>
        <Ornament className="w-full max-w-xs" />
        <p className="text-lg">The villagers have won.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {winners.map((p) => <UserToken key={p.username} username={p.username} size="md" />)}
        </div>
      </Panel>
      <Panel className="p-5 sm:p-7">
        <h2 className="vf-title mb-3 text-xl">Revealed roles</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GAME.map((p) => {
            const f = factionOf(p.role);
            return (
              <li key={p.username} className="flex items-center gap-3 rounded-sm border vf-brass-border p-2" style={{ borderLeft: `6px solid ${f.color}` }}>
                <UserToken username={p.username} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.username}</p>
                  <p className="text-sm capitalize">{p.role} · {f.label}</p>
                </div>
                {p.isDead && <i className="fas fa-skull" aria-label="dead" />}
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel className="p-5 sm:p-7">
        <h2 className="vf-title mb-3 text-xl">Chronicle</h2>
        <p className="mb-4 text-sm vf-ink2">{LOG.length} entries over {LOG_GROUPS.length} phases. The last ones:</p>
        <Chronicle limit={3} />
      </Panel>
      <a
        href="/home"
        className={cn(primaryBtn, 'inline-flex min-h-12 w-full items-center justify-center gap-2 !text-[var(--f-on-felt)] !no-underline')}
      >
        Back to the village
      </a>
    </>
  );
}

export default function GameF3() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('view');
  const view = VIEWS.some((v) => v.id === requested) ? requested : 'night';
  const go = (id) => {
    const next = new URLSearchParams(params);
    next.set('view', id);
    setParams(next);
  };
  const roster = view === 'night' ? MASTER : view === 'day' ? DAY : GAME;

  return (
    <Layout user={session.user.username}>
      <Toaster />
      <div role="radiogroup" aria-label="Demo view" className="vf-paper mx-auto mb-5 grid max-w-[720px] grid-cols-4 gap-1 p-1">
        {VIEWS.map(({ id, label }) => {
          const on = id === view;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => go(id)}
              className={cn('vf-btn min-h-11 px-1 text-sm', on ? 'vf-btn-primary' : 'vf-btn-outline')}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mx-auto grid max-w-[1040px] gap-6 lg:grid-cols-[minmax(0,720px)_280px] lg:justify-center">
        <div className="flex min-w-0 flex-col gap-4">
          {view === 'night' && <NightBook roster={roster} onDay={() => go('day')} />}
          {view === 'day' && <DayBook roster={roster} onNight={() => go('night')} />}
          {view === 'player' && <PlayerView />}
          {view === 'over' && <GameOverView />}
        </div>
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="vf-paper max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
            <Reference roster={roster} />
          </div>
        </aside>
      </div>
    </Layout>
  );
}
