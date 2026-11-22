import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { habitantMatteo, logsMatteo, session, statsMatteo } from '@/mocks/fixtures';
import { Layout, Ornament, Panel, Toaster, notify, outlineBtn, primaryBtn } from '../shell/kit/F.jsx';

// Real page: pages/UserStatistics.jsx (Chart.js pie + sortable tables). Here: inline SVG charts and a
// shadcn Table with local sort. The fixtures have no registration date, so the header shows the date of
// the first match instead.

// Faction of the roles present in the fixture (the real app's role groups; getRoleType is not imported).
const FACTION_VAR = {
  good: 'var(--roles-bg-good)',
  evil: 'var(--roles-bg-evil)',
  neutral: 'var(--roles-bg-neutral)',
  victoryStealer: 'var(--roles-db-victoryStealer-)',
};
const FACTION = { sam: 'good', sheriff: 'good', wolf: 'evil', dorky: 'evil', hamster: 'victoryStealer', jester: 'victoryStealer' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const CSS = `
.mock-stats-row:nth-child(even) { background: rgba(120, 80, 30, .08); }
.mock-stats-stripes { background-image: repeating-linear-gradient(45deg, rgba(0,0,0,.22) 0 3px, transparent 3px 7px); }
.mock-stats-th-btn { display: inline-flex; align-items: center; gap: .35rem; font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .04em; }
.mock-stats-th-btn:focus-visible { outline: 2px solid var(--f-focus); outline-offset: 2px; }
`;

// Game rows, newest first by default (same order as the real page).
const games = logsMatteo['resource-list'].map((r) => {
  const g = r.PlaysJoinGame;
  const outcome = g.is_game_finished ? (g.has_won ? 'Victory' : 'Defeat') : 'Pending';
  return {
    id: g.public_id,
    start: g.start.split('.')[0],
    duration: g.game_duration,
    rounds: g.number_of_rounds,
    role: cap(g.name),
    outcome,
  };
});

// Per-role counts from the statistics fixture (master rows are not in it).
const roles = statsMatteo['resource-list'].map((r) => r.StatsRole).map((s) => ({
  name: cap(s.name),
  key: s.name,
  times: s.countName,
  wins: s.countWins,
  losses: s.countName - s.countWins,
}));

const played = roles.reduce((n, r) => n + r.times, 0);
const wins = roles.reduce((n, r) => n + r.wins, 0);
const rate = played ? Math.round((wins / played) * 100) : 0;
const top = [...roles].sort((a, b) => b.times - a.times)[0];
const tiedWithTop = roles.filter((r) => r.times === top.times).length - 1;
const firstMatch = games.map((g) => g.start.slice(0, 10)).sort()[0];

const SORTS = {
  start: (a, b) => a.start.localeCompare(b.start),
  duration: (a, b) => a.duration.localeCompare(b.duration),
  rounds: (a, b) => a.rounds - b.rounds,
  role: (a, b) => a.role.localeCompare(b.role),
  outcome: (a, b) => a.outcome.localeCompare(b.outcome),
};

const COLUMNS = [
  { key: 'start', label: 'Date and time' },
  { key: 'id', label: 'Village' },
  { key: 'duration', label: 'Duration' },
  { key: 'rounds', label: 'Rounds' },
  { key: 'role', label: 'Role played' },
  { key: 'outcome', label: 'Outcome' },
];

function SortHead({ col, sort, onSort, className = '' }) {
  const active = sort.key === col.key;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <TableHead aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn('vf-title text-[13px] tracking-wide', className)}>
      <button type="button" className="mock-stats-th-btn" onClick={() => onSort(col.key)}>
        {col.label}
        <Icon className={cn('size-3.5', active ? 'vf-rubric' : 'vf-ink2')} aria-hidden="true" />
      </button>
    </TableHead>
  );
}

// Victory: green ribbon. Defeat: small wax seal.
function Outcome({ value }) {
  if (value === 'Victory') {
    return (
      <span className="vf-seal-ok inline-flex items-center gap-1 px-4 py-0.5 text-sm font-bold [clip-path:polygon(0_0,100%_0,calc(100%-8px)_50%,100%_100%,0_100%,8px_50%)]">
        <Check className="size-3.5" aria-hidden="true" />{value}
      </span>
    );
  }
  if (value === 'Defeat') {
    return <span className="vf-wax inline-flex items-center rounded-[48%_52%_50%_50%] px-2.5 py-0.5 text-sm font-bold shadow-[inset_0_0_0_1.5px_rgba(212,178,90,.4)]">{value}</span>;
  }
  return <span className="vf-ink2 text-sm italic">{value}</span>;
}

function Bar({ role }) {
  const max = Math.max(...roles.map((r) => r.times));
  const color = FACTION_VAR[FACTION[role.key]];
  const winPct = (role.wins / max) * 100;
  const lossPct = (role.losses / max) * 100;
  return (
    <li className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 text-sm">
      <span className="vf-title font-semibold">{role.name}</span>
      <div className="flex h-6 overflow-hidden rounded-[2px] border border-[var(--f-ink2)] bg-[rgba(120,80,30,.1)]"
        role="img" aria-label={`${role.name}: ${role.wins} wins, ${role.losses} losses`}>
        <div style={{ width: `${winPct}%`, backgroundColor: color }} />
        <div className="mock-stats-stripes" style={{ width: `${lossPct}%`, backgroundColor: color }} />
      </div>
      <span className="text-right tabular-nums">{role.wins}W {role.losses}L</span>
    </li>
  );
}

// Donut: wins arc over a losses track. circumference of r=15.9155 is 100, so dash values are percentages.
function WinRing({ pct }) {
  return (
    <div className="relative mx-auto size-44">
      <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`Win rate ${pct}%`}>
        <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="5" style={{ stroke: 'var(--f-wax)' }} />
        <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="5" pathLength="100"
          strokeDasharray={`${pct} ${100 - pct}`} style={{ stroke: 'var(--f-felt)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="vf-display text-3xl">{pct}%</span>
        <span className="vf-ink2 text-xs uppercase tracking-widest">win rate</span>
      </div>
    </div>
  );
}

function Tile({ label, value, sub }) {
  return (
    <Panel className="flex flex-col gap-1 p-4 text-center">
      <span className="vf-title text-xs tracking-widest uppercase vf-ink2">{label}</span>
      <span className="vf-display text-2xl">{value}</span>
      {sub && <span className="vf-ink2 text-sm">{sub}</span>}
    </Panel>
  );
}

export default function MockStatsF() {
  const me = session.user.username;
  const username = habitantMatteo.username;
  const [friend, setFriend] = useState(false);
  const [sort, setSort] = useState({ key: 'start', dir: 'desc' });

  const sorted = useMemo(() => {
    const cmp = SORTS[sort.key === 'id' ? 'start' : sort.key];
    const list = [...games].sort(cmp);
    return sort.dir === 'asc' ? list : list.reverse();
  }, [sort]);

  const onSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  const toggleFriend = () => {
    const next = !friend;
    setFriend(next);
    if (next) notify('success', 'Friend added', `${username} is now in your friends list.`);
    else notify('info', 'Friend removed', `${username} has been removed from your friends.`);
  };

  return (
    <Layout user={me}>
      <style>{CSS}</style>
      <div className="mock-stats flex flex-col gap-6">
        <Panel className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20 shadow-[0_0_0_3px_var(--f-paper),0_0_0_5px_var(--f-brass)]">
            <AvatarFallback className="vf-display bg-[var(--f-felt)] text-2xl text-[var(--f-on-felt)]">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <h1 className="vf-display text-3xl">Statistics and history of <span className="vf-rubric">{username}</span></h1>
            <p className="vf-ink2 text-sm">Member of the village since {firstMatch} (first match)</p>
          </div>
          <button
            type="button"
            aria-pressed={friend}
            onClick={toggleFriend}
            className={cn(friend ? outlineBtn : primaryBtn, 'inline-flex items-center gap-2 px-4 py-2 text-base')}
          >
            {friend ? <Check className="size-4" aria-hidden="true" /> : <UserPlus className="size-4" aria-hidden="true" />}
            {friend ? 'Friend ✓' : 'Add friend'}
          </button>
        </Panel>

        <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile label="Games played" value={played} />
          <Tile label="Wins" value={wins} sub={`${played - wins} losses`} />
          <Tile label="Win rate" value={`${rate}%`} />
          <Tile label="Usually plays as" value={top.name} sub={tiedWithTop > 0 ? `tied with ${tiedWithTop} other${tiedWithTop > 1 ? 's' : ''}` : `${top.times} games`} />
        </section>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Panel className="flex flex-col gap-4">
            <h2 className="vf-title text-xl vf-rubric">Wins and losses by role</h2>
            <Ornament />
            <ul className="flex flex-col gap-3">
              {roles.map((r) => <Bar key={r.key} role={r} />)}
            </ul>
            <div className="vf-ink2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-5 border border-[var(--f-ink2)] bg-[var(--roles-bg-good)]" />Wins (solid)</span>
              <span className="inline-flex items-center gap-2"><span className="mock-stats-stripes inline-block h-3 w-5 border border-[var(--f-ink2)] bg-[var(--roles-bg-good)]" />Losses (striped)</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 bg-[var(--roles-bg-good)]" />Good</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 bg-[var(--roles-bg-evil)]" />Evil</span>
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <h2 className="vf-title text-xl vf-rubric">Win rate</h2>
            <Ornament />
            <WinRing pct={rate} />
            <p className="vf-ink2 text-center text-sm">{wins} wins out of {played} games</p>
          </Panel>
        </div>

        <Panel className="flex flex-col gap-4">
          <h2 className="vf-title text-xl vf-rubric">Game history</h2>
          <Ornament />
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-b-2 border-[var(--f-brass)] hover:bg-transparent">
                {COLUMNS.map((c) => <SortHead key={c.key} col={c} sort={sort} onSort={onSort} />)}
                <TableHead className="vf-title text-[13px] tracking-wide">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((g) => (
                <TableRow key={g.id} className="mock-stats-row border-[var(--f-brass)]/40">
                  <TableCell>{g.start}</TableCell>
                  <TableCell className="font-mono text-[13px]">{g.id}</TableCell>
                  <TableCell className="tabular-nums">{g.duration}</TableCell>
                  <TableCell className="tabular-nums">{String(g.rounds).padStart(2, '0')}</TableCell>
                  <TableCell>{g.role}</TableCell>
                  <TableCell><Outcome value={g.outcome} /></TableCell>
                  <TableCell>
                    <a href={`/village/${g.id}`} className="vf-a underline decoration-[var(--f-brass)] underline-offset-4">View match</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>
      <Toaster />
    </Layout>
  );
}
