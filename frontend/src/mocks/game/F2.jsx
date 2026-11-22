import { useEffect, useState } from 'react';
import { ChevronUp, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Ornament, Panel, RoleIcon, Toaster, UserToken, notify, outlineBtn, primaryBtn, dangerBtn, userColor } from '@/mocks/shell/kit/F.jsx';
import {
  gameActionsMaster, gameConfiguration, gameLogs, gamePlayers, gamePlayersMaster, gameStatus, roles as rolesFixture, session, settings as settingsFixture,
} from '@/mocks/fixtures';

// F2 (variant F): THE TABLE IS THE INTERFACE. The round table is the main control; secondary info lives in a
// bottom sheet (mobile) or a right panel (lg+). Plain CSS scoped to the `f2-` prefix; colours from the kit vars.
const CSS = `
.f2-stage {
  position: relative; width: 100%; max-width: 620px; aspect-ratio: 1; margin: 0 auto; border-radius: 9999px;
  border: 3px double var(--f-brass); box-shadow: inset 0 0 40px rgba(0, 0, 0, .35), 0 6px 14px rgba(60, 40, 20, .2);
}
.f2-night { background: radial-gradient(circle at 50% 50%, #3b2a18 0%, #140f0a 60%, #060403 100%); color: #f3e6c8; --f2-shadow: 0 1px 2px #000; }
.f2-day { background: radial-gradient(circle at 50% 50%, #fbe9c0 0%, #ecd29c 64%, #d9b775 100%); color: #2b1d12; --f2-shadow: 0 0 3px #f4e9d1; }
[data-bs-theme="dark"] .f2-day { background: radial-gradient(circle at 50% 50%, #4a3a24 0%, #2f261c 64%, #231c14 100%); color: #efe2c4; --f2-shadow: 0 0 3px #2f261c; }
.f2-fire { position: absolute; left: 50%; top: 50%; width: 44%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 9999px; background: radial-gradient(circle, rgba(255, 150, 60, .5) 0%, rgba(255, 150, 60, 0) 70%); }
.f2-center { position: absolute; left: 50%; top: 50%; width: 34%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; }
.f2-token { box-shadow: 0 2px 4px rgba(0, 0, 0, .3); }
.f2-token:disabled { cursor: default; }
.f2-target { outline: 2px dashed #ffd27a; outline-offset: 4px; }
.f2-selected { box-shadow: 0 0 0 3px var(--f-paper), 0 0 0 6px var(--f-rubric); }
.f2-mine { outline: 3px solid #f0c85a; outline-offset: 3px; }
.f2-glow { box-shadow: 0 0 0 3px #ffd27a, 0 0 12px 4px rgba(255, 190, 90, .7); }
.f2-suspect { box-shadow: 0 0 0 3px #e07a6e, 0 0 14px 5px rgba(224, 122, 110, .7); }
.f2-arrow { stroke-dasharray: 2.5 1.5; fill: none; stroke-width: 1.3; stroke-linecap: round; }
.f2-flip-inner { position: absolute; inset: 0; transform-style: preserve-3d; }
.f2-face { position: absolute; inset: 0; border-radius: 4px; border: 1px solid var(--f-brass); background-size: cover; background-position: top; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.f2-face-role { transform: rotateY(180deg); }
@media (prefers-reduced-motion: no-preference) {
  .f2-arrow { animation: f2-march 1.2s linear infinite; }
  .f2-glow { animation: f2-pulse 1.6s ease-in-out infinite; }
  .f2-suspect { animation: f2-pulse-red 1.6s ease-in-out infinite; }
  .f2-flip-inner { transition: transform 500ms ease; }
  .f2-token { transition: filter 150ms; }
}
@keyframes f2-march { to { stroke-dashoffset: -8; } }
@keyframes f2-pulse { 0%, 100% { box-shadow: 0 0 0 3px #ffd27a, 0 0 8px 2px rgba(255, 190, 90, .5); } 50% { box-shadow: 0 0 0 5px #ffd27a, 0 0 20px 8px rgba(255, 190, 90, .8); } }
@keyframes f2-pulse-red { 0%, 100% { box-shadow: 0 0 0 3px #e07a6e, 0 0 8px 2px rgba(224, 122, 110, .5); } 50% { box-shadow: 0 0 0 5px #e07a6e, 0 0 20px 8px rgba(224, 122, 110, .8); } }
`;

// ---- Fixture-derived data -------------------------------------------------------------------------------
const VIEWS = ['night', 'day', 'player', 'over'];
const VIEW_LABEL = { night: 'Night', day: 'Day', player: 'Player', over: 'Over' };
const TITLE = { night: 'Night 1', day: 'Day 1', player: 'Day 1', over: 'Game over' };
const HINT = {
  night: 'Pick a role, then tap its target. Tap the same target again to clear it.',
  player: 'Your seat is outlined. Your role stays secret from the others.',
  over: 'Every card is face up. Thanks for playing.',
};

const PLAYERS = gamePlayersMaster['resource-list'].map((i) => i.playsAsIn);
const NAMES = PLAYERS.map((p) => p.username);
const ROLE_OF = Object.fromEntries(PLAYERS.map((p) => [p.username, p.role]));
const ME = 'Kevin'; // the logged-in player in the player view (the seer in the fixture)
const ME_ROLE = ROLE_OF[ME];
const GAME = gamePlayers['resource-list'].map((i) => i.playsAsIn); // 8-player game for the game-over chapter
// Fixture has nobody dead; one player is marked dead for the demo, so the dead state shows.
const DEAD = new Set(['Bubis']);

const ROLE_TYPE = Object.fromEntries(rolesFixture.roles.flat().map((r) => [r.name, r.type]));
// Same mapping as the real page: type 0 good, 1 evil, 2 victory stealer, 3 neutral.
const FACTION = {
  0: { name: 'Good', icon: 'fas fa-shield-alt', bg: 'var(--roles-bg-good)', tone: '#a6e6a0' },
  1: { name: 'Evil', icon: 'fas fa-paw', bg: 'var(--roles-bg-evil)', tone: '#ff8c7a' },
  2: { name: 'Victory stealer', icon: 'fas fa-user-secret', bg: 'var(--roles-db-victoryStealer-)', tone: '#f2d27a' },
  3: { name: 'Neutral', icon: 'fas fa-theater-masks', bg: 'var(--roles-bg-neutral)', tone: '#f2d27a' },
};

// Acting roles with their actors and the targets the fixture allows (dead players cannot be targeted).
const ACT = gameActionsMaster['resource-list'].map(({ actionTarget: a }) => ({
  role: a.role,
  actors: a.players.map((p) => p.player),
  targets: a.possibleTargets.map((p) => p.player).filter((n) => !DEAD.has(n)),
}));

const LOG_GROUPS = (() => {
  const groups = new Map();
  gameLogs['resource-list'].forEach(({ Action: a }) => {
    const key = `${a.round}-${a.phase}`;
    if (!groups.has(key)) groups.set(key, { key, title: `Round ${a.round} · ${cap(a.phase)}`, rows: [] });
    groups.get(key).rows.push(logText(a));
  });
  return [...groups.values()];
})();

const CONFIG = gameConfiguration['resource-list'].map((i) => i.role);
// The settings fixture has every option off; one is switched on so the Settings tab shows an active option.
const OPTIONS = settingsFixture['resource-list']
  .map((i) => (i.setting.setting_name === 'largerRoleNumber' ? { ...i.setting, enable: true } : i.setting))
  .filter((s) => s.enable);

const SETTING_CONFIRM = {
  skip: { title: 'Skip first day?', body: 'Confirm to skip first Day.', label: 'Skip day', tone: 'outline' },
  previous: { title: 'Return to previous phase?', body: 'Confirm to return to previous phase.', label: 'Go back', tone: 'outline' },
  end: { title: 'End the game?', body: 'Confirm to end the game. Nobody can act afterwards.', label: 'End game', tone: 'danger' },
};

const TONE = { evil: '#ff8c7a', good: '#a6e6a0', neutral: '#f2d27a' };
const TONE_KEY = { 0: 'good', 1: 'evil', 2: 'neutral', 3: 'neutral' };

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
// Same wording rules as gameLog.js (getStringLog).
function logText({ player, typeAction, target, phase }) {
  if (typeAction === 'dead') return `${player} is ${phase === 'night' ? 'dead' : 'at the stake'}`;
  if (typeAction === 'vote') return `${player} votes ${target}`;
  if (typeAction === 'plague') return phase === 'night' ? `${target} is infected` : `${target} died of plague`;
  return `${player} ${typeAction}s ${target}`;
}
const label = (role) => (role === 'wolf' ? 'Wolves' : cap(role));
const cardSrc = (role, low = true) => `/media/cards/${low ? 'lowResolution/' : ''}${encodeURIComponent(role)}.png`;
const BACK = '/media/cards/card_back/standard_red.png';
const initials = (n) => (n.match(/[A-Za-z0-9]/g) || ['?']).slice(0, 2).join('').toUpperCase();

// Seat i of n, clockwise from the top, as % of the table (the table is a square, so % maps evenly to the SVG).
const R = 37;
const seatPos = (i, n) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
};
const centroid = (ps) => ({ x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length });
// Shortens a segment at both ends so arrows stop at the token edges.
function trim(a, b, pad = 6) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  return { x1: a.x + ux * pad, y1: a.y + uy * pad, x2: b.x - ux * (pad + 2), y2: b.y - uy * (pad + 2), ux, uy };
}

// Desktop (lg+): the sheet becomes a right side panel.
function useWide() {
  const q = '(min-width: 1024px)';
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

// ---- Pieces ---------------------------------------------------------------------------------------------
/** Card that flips between the card back and the role face. up=true shows the role face. */
function FlipCard({ role, up, delay = 0, className = 'h-16 w-11' }) {
  return (
    <span className={cn('relative block [perspective:600px]', className)} aria-hidden="true">
      <span className="f2-flip-inner" style={{ transform: up ? 'rotateY(180deg)' : 'rotateY(0deg)', transitionDelay: `${delay}ms` }}>
        <span className="f2-face" style={{ backgroundImage: `url(${BACK})` }} />
        <span className="f2-face f2-face-role" style={{ backgroundImage: `url(${cardSrc(role)})` }} />
      </span>
    </span>
  );
}

/** One seat on the table: a token (button when interactive), a name, and optional pin / vote count. */
function Seat({ name, pos, view, state, onTap }) {
  const { dead, disabled, glow, target, selected, suspect, mine, count, pin, role } = state;
  const shadow = { textShadow: 'var(--f2-shadow)' };
  const pos$ = { left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' };
  const name$ = (
    <span className="pointer-events-none absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap text-[12px] font-bold leading-tight" style={shadow}>
      {name}{mine && ' (you)'}
    </span>
  );

  const cls = cn(
    'vf-token f2-token relative size-11 text-sm',
    glow && 'f2-glow', suspect && 'f2-suspect', selected && 'f2-selected', target && 'f2-target', mine && 'f2-mine',
    disabled && !glow && !target && 'opacity-50',
  );
  const aria = [name, dead && 'dead', mine && 'you', count ? `${count} votes` : null, target && 'valid target'].filter(Boolean).join(', ');
  return (
    <div className="absolute" style={pos$}>
      <button type="button" aria-label={aria} disabled={disabled} onClick={() => onTap(name)} className={cls}
              style={{ backgroundColor: dead ? '#6b6259' : userColor(name) }}>
        {dead ? <i className="fas fa-skull text-[15px]" aria-hidden="true" /> : initials(name)}
        {pin && (
          <span className="absolute -right-2 -top-2 size-7 overflow-hidden rounded-full border-2 border-[var(--f-brass)] bg-[var(--f-paper)]" aria-hidden="true">
            <img alt="" src={cardSrc(pin)} className="size-full object-cover object-top" />
          </span>
        )}
        {pin && (
          <span className="absolute -bottom-2 -left-2 flex size-6 items-center justify-center rounded-full border-2 border-[var(--f-paper)] bg-[var(--f-felt)] text-[11px] text-[var(--f-on-felt)]" aria-hidden="true">
            <RoleIcon role={pin} />
          </span>
        )}
        {role && (
          <span className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-[var(--f-paper)] bg-[var(--f-paper)] text-[11px] text-[var(--f-ink)]" aria-hidden="true">
            <RoleIcon role={role} />
          </span>
        )}
        {count > 0 && (
          <span className="absolute -left-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[var(--f-paper)] bg-[var(--f-wax)] px-1 text-xs font-bold text-[var(--f-wax-text)]" aria-hidden="true">
            {count}
          </span>
        )}
      </button>
      {name$}
    </div>
  );
}

/** The round table. Night draws the pick arrows, day the vote arrows. */
function Table({ view, picks, activeRole, votes, voter, counts, suspects, onTap }) {
  const n = NAMES.length;
  const alive = n - DEAD.size;
  const pos = Object.fromEntries(NAMES.map((name, i) => [name, seatPos(i, n)]));
  const act = ACT.find((a) => a.role === activeRole);
  const night = view === 'night';
  const day = view === 'day';
  const pinOf = (name) => Object.keys(picks).find((r) => picks[r] === name);

  const seatState = (name) => {
    const dead = DEAD.has(name);
    // The master sees every role on the table; a player sees only their own seat.
    const base = { dead, mine: view === 'player' && name === ME, role: view === 'night' || view === 'day' ? ROLE_OF[name] : null };
    if (night) {
      const isActor = !!act && act.actors.includes(name);
      const isTarget = !!act && act.targets.includes(name);
      return { ...base, disabled: dead || (!!act && !isTarget), glow: isActor, target: isTarget, pin: pinOf(name) };
    }
    if (day) {
      return { ...base, disabled: dead, selected: voter === name, suspect: suspects.has(name) && counts[name] > 0, count: counts[name] || 0 };
    }
    return { ...base, disabled: true };
  };

  const arrows = [];
  if (night) {
    Object.entries(picks).forEach(([role, target]) => {
      const a = ACT.find((x) => x.role === role);
      if (!a) return;
      const from = centroid(a.actors.map((x) => pos[x]));
      const seg = trim(from, pos[target]);
      arrows.push({ key: role, tone: TONE_KEY[ROLE_TYPE[role]] || 'evil', ...seg, straight: true });
    });
  }
  if (day) {
    Object.entries(votes).forEach(([voterName, target]) => {
      const seg = trim(pos[voterName], pos[target]);
      const mx = (pos[voterName].x + pos[target].x) / 2, my = (pos[voterName].y + pos[target].y) / 2;
      // Bend the arrow: control point pulled toward the fire and offset sideways, so arrows do not overlap.
      const cx = mx + (50 - mx) * 0.35 - seg.uy * 6, cy = my + (50 - my) * 0.35 + seg.ux * 6;
      arrows.push({ key: voterName, tone: 'ink', ...seg, cx, cy, straight: false });
    });
  }

  const centreTop = night ? 'Night 1' : 'Day 1';
  return (
    <div className={cn('f2-stage', night ? 'f2-night' : 'f2-day')} role="group" aria-label={`Round table, ${alive} alive`}>
      <div className="f2-fire" aria-hidden="true" />
      <div className="f2-center">
        <Flame className="size-6" style={{ color: night ? '#f0b25a' : '#9a4a16' }} aria-hidden="true" />
        <span className="vf-title text-xs">{centreTop}</span>
        <span className="text-[11px] font-bold">{alive} alive</span>
      </div>
      {arrows.length > 0 && (
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <defs>
            {Object.entries(TONE).map(([k, c]) => (
              <marker key={k} id={`f2-h-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={c} />
              </marker>
            ))}
            <marker id="f2-h-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>
          {arrows.map((a) => (
            a.straight ? (
              <line key={a.key} className="f2-arrow" x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                    stroke={TONE[a.tone]} markerEnd={`url(#f2-h-${a.tone})`} />
            ) : (
              <path key={a.key} className="f2-arrow" d={`M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`}
                    stroke="currentColor" markerEnd="url(#f2-h-ink)" />
            )
          ))}
        </svg>
      )}
      {NAMES.map((name) => (
        <Seat key={name} name={name} pos={pos[name]} view={view} onTap={onTap}
              state={seatState(name)} />
      ))}
    </div>
  );
}

/** Log / Roles / Settings. Shared by the bottom sheet (mobile) and the right panel (lg+). */
function Secondary({ master, onAsk }) {
  const tab = 'min-h-11 rounded-sm border-2 border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)] font-bold data-[state=active]:border-[var(--f-felt)] data-[state=active]:bg-[var(--f-felt)] data-[state=active]:text-[var(--f-on-felt)]';
  return (
    <Tabs defaultValue="log" className="gap-3">
      <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0">
        <TabsTrigger value="log" className={tab}>Log</TabsTrigger>
        <TabsTrigger value="roles" className={tab}>Roles</TabsTrigger>
        <TabsTrigger value="settings" className={tab}>Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="log">
        <Accordion type="multiple" defaultValue={[LOG_GROUPS[LOG_GROUPS.length - 1].key]}>
          {[...LOG_GROUPS].reverse().map((g) => (
            <AccordionItem key={g.key} value={g.key}>
              <AccordionTrigger className="vf-title py-3 text-base">{g.title}</AccordionTrigger>
              <AccordionContent>
                <ol className="flex list-none flex-col gap-2 pl-1">
                  {g.rows.map((r, i) => (
                    <li key={i} className="flex gap-2 text-[15px] leading-snug"><span aria-hidden="true">›</span><span>{r}</span></li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="roles">
        <ul className="flex list-none flex-col gap-2">
          {[...CONFIG].sort((a, b) => a.type - b.type).map((r) => (
            <li key={r.name} className="flex items-center gap-3 rounded-sm border border-[var(--f-brass)] px-3 py-2 text-[15px] text-[var(--f-ink)]">
              <RoleIcon role={r.name} className="w-5 text-center text-base" />
              <span className="min-w-0 flex-1 font-bold">{cap(r.name)}{r.max_number > 1 && ` (${r.max_number})`}</span>
              <span className="inline-flex items-center gap-1 rounded-sm border border-[var(--f-brass)] px-1.5 py-0.5 text-xs font-bold" style={{ background: FACTION[r.type].bg }}>
                <i className={FACTION[r.type].icon} aria-hidden="true" />{FACTION[r.type].name}
              </span>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="settings" className="flex flex-col gap-4">
        <section>
          <h3 className="vf-title mb-2 text-sm">Active options</h3>
          {OPTIONS.length ? (
            <ul className="flex list-none flex-col gap-2 text-[15px]">
              {OPTIONS.map((s) => <li key={s.setting_name}><b>{s.setting_name}</b>: {s.description}</li>)}
            </ul>
          ) : (
            <p className="text-[15px] text-[var(--f-ink2)]">No optional rules are active.</p>
          )}
        </section>
        {master && (
          <section className="flex flex-col gap-2">
            <h3 className="vf-title text-sm">Master actions</h3>
            <button type="button" className={cn(outlineBtn, 'min-h-11')} onClick={() => onAsk('skip')}>Skip first day</button>
            <button type="button" className={cn(outlineBtn, 'min-h-11')} onClick={() => onAsk('previous')}>Previous phase</button>
            <button type="button" className={cn(dangerBtn, 'min-h-11')} onClick={() => onAsk('end')}>End game</button>
          </section>
        )}
      </TabsContent>
    </Tabs>
  );
}

// ---- Game over (F3's "The End" chapter) -----------------------------------------------------------------
// who_win uses the same index as the faction type (0 good, 1 evil, 2 victory stealer, 3 neutral); the fixture says 2.
const WIN_LINE = ['The farmers have won.', 'The wolves have won.', 'The hamster has won.', 'The jester has won.'];
const LOG_ROWS = gameLogs['resource-list'].map(({ Action: a }) => logText(a));

function GameOver() {
  const winType = gameStatus.game.who_win;
  const winners = GAME.filter((p) => ROLE_TYPE[p.role] === winType);
  return (
    <div className="flex flex-col gap-4">
      <Panel className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <p className="vf-title text-xs tracking-[.2em] uppercase vf-rubric">The last chapter</p>
        <h1 className="vf-display text-4xl sm:text-5xl">The End</h1>
        <Ornament className="w-full max-w-xs" />
        <p className="text-lg">{WIN_LINE[winType]}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {winners.map((p) => <UserToken key={p.username} username={p.username} size="md" />)}
        </div>
      </Panel>

      <Panel className="p-5 sm:p-7">
        <h2 className="vf-title mb-3 text-xl">Revealed roles</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GAME.map((p) => {
            const f = FACTION[ROLE_TYPE[p.role]];
            return (
              <li key={p.username} className="flex items-center gap-3 rounded-sm border border-[var(--f-brass)] p-2" style={{ borderLeft: `6px solid ${f.tone}` }}>
                <UserToken username={p.username} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.username}{p.username === ME && ' (you)'}</p>
                  <p className="flex items-center gap-1.5 text-sm">
                    <RoleIcon role={p.role} />{cap(p.role)}
                    <span className="text-[var(--f-ink2)]">· {f.name}</span>
                  </p>
                </div>
                {DEAD.has(p.username) && <i className="fas fa-skull" role="img" aria-label="dead" />}
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel className="p-5 sm:p-7">
        <h2 className="vf-title mb-3 text-xl">Chronicle</h2>
        <p className="mb-4 text-sm text-[var(--f-ink2)]">{LOG_ROWS.length} entries over {LOG_GROUPS.length} phases. The last ones:</p>
        <ol className="flex flex-col gap-2">
          {LOG_ROWS.slice(-3).map((r, i) => <li key={i} className="border-l-2 border-[var(--f-brass)] pl-3 text-[16px] leading-snug">{r}</li>)}
        </ol>
      </Panel>

      <a href="/home" className={cn(primaryBtn, 'flex min-h-12 w-full items-center justify-center text-base !text-[var(--f-on-felt)] !no-underline')}>
        Back to the village
      </a>
    </div>
  );
}

// ---- Page -----------------------------------------------------------------------------------------------
function initialView() {
  const v = new URLSearchParams(location.search).get('view');
  return VIEWS.includes(v) ? v : 'night';
}

export default function F2() {
  const [view, setViewState] = useState(initialView);
  const [picks, setPicks] = useState({ wolf: 'Japo' });
  const [activeRole, setActiveRole] = useState('wolf');
  const [votes, setVotes] = useState({ Kevin: 'Hare_Segz', Japo: 'Hare_Segz', aiorT: 'Matteo', Matteo: 'Hare_Segz' });
  const [voter, setVoter] = useState(null);
  const [shown, setShown] = useState(true); // player view: own card face up
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const wide = useWide();

  const setView = (v) => {
    setViewState(v);
    const u = new URL(location.href);
    u.searchParams.set('view', v);
    history.replaceState(null, '', u);
  };

  const ask = (c) => { setSheetOpen(false); setConfirm(c); };
  const demoRun = () => notify('info', 'Demo only', 'The real request is not sent in this mock.');
  const askSetting = (kind) => ask({ ...SETTING_CONFIRM[kind], run: demoRun });

  // Night
  const act = ACT.find((a) => a.role === activeRole);
  const missing = ACT.filter((a) => !picks[a.role]).length;
  const ready = missing === 0;
  const onNight = (name) => {
    if (!act) return notify('info', 'Pick a role first', 'Select a role in "Now acting", then tap its target.');
    if (!act.targets.includes(name)) return;
    const next = { ...picks };
    if (next[activeRole] === name) delete next[activeRole];
    else next[activeRole] = name;
    setPicks(next);
    const pending = ACT.find((a) => !next[a.role]);
    setActiveRole(pending ? pending.role : activeRole);
  };
  const askResolve = () => ask({
    title: 'Resolve night?',
    body: ACT.map((a) => `${label(a.role)} → ${picks[a.role]}`).join(' · '),
    label: 'Resolve night',
    tone: 'primary',
    run: () => { notify('success', 'Night resolved', 'Demo only: nothing is saved. Showing the day.'); setView('day'); },
  });

  // Day
  const counts = {};
  Object.values(votes).forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const suspects = new Set(ranked.slice(0, 2));
  const leaders = ranked.filter((n) => counts[n] === counts[ranked[0]]);
  const lynchTarget = leaders.length === 1 ? ranked[0] : null;
  const onDay = (name) => {
    if (!voter) return setVoter(name);
    if (name === voter) return setVoter(null);
    const next = { ...votes };
    if (votes[voter] === name) delete next[voter];
    else next[voter] = name;
    setVotes(next);
    setVoter(null);
  };
  const askLynch = () => ask({
    title: `Lynch ${lynchTarget}?`,
    body: 'The village sends them to the stake. Their role is revealed.',
    label: `Lynch ${lynchTarget}`,
    tone: 'danger',
    run: () => notify('success', `${lynchTarget} is at the stake`, 'Demo only: nothing is saved.'),
  });

  const onTap = view === 'night' ? onNight : view === 'day' ? onDay : () => {};
  const hint = view === 'day'
    ? (voter ? `Now tap who ${voter} votes for. Tap ${voter} again to cancel.` : 'Tap a voter, then the player they vote for. Tap the same vote again to remove it.')
    : HINT[view];

  const master = view !== 'player';
  const secondaryProps = { master, onAsk: askSetting };

  const demo = (
    <div role="group" aria-label="Demo view" className="vf-paper mx-auto flex w-full max-w-md gap-1 p-1">
      {VIEWS.map((v) => (
        <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
                className={cn('vf-title min-h-11 flex-1 rounded-sm text-sm font-bold', view === v ? 'bg-[var(--f-felt)] text-[var(--f-on-felt)]' : 'hover:bg-[var(--f-hl)]')}>
          {VIEW_LABEL[v]}
        </button>
      ))}
    </div>
  );

  if (view === 'over') {
    return (
      <Layout user={session.user.username}>
        <Toaster />
        <style>{CSS}</style>
        <div className="variant-F f2-root flex flex-col gap-4">
          {demo}
          <GameOver />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={session.user.username}>
      <Toaster />
      <div className="variant-F f2-root flex flex-col gap-4">
        {demo}

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <style>{CSS}</style>

            <header className="flex flex-col gap-1">
              <h1 className="vf-display text-[1.75rem] leading-tight">{TITLE[view]}</h1>
              <p className="text-sm text-[var(--f-ink2)]">{hint}</p>
            </header>

            {view === 'night' && (
              <div>
                <h2 className="vf-title mb-2 text-sm">Now acting</h2>
                <div role="group" aria-label="Now acting" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                  {ACT.map((a) => {
                    const on = activeRole === a.role;
                    const pick = picks[a.role];
                    return (
                      <button key={a.role} type="button" aria-pressed={on} onClick={() => setActiveRole(a.role)}
                              className={cn('flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-3 text-sm font-bold',
                                on ? 'border-[var(--f-felt)] bg-[var(--f-felt)] text-[var(--f-on-felt)]' : 'border-[var(--f-brass)] bg-[var(--f-paper)] text-[var(--f-ink)]')}>
                        <RoleIcon role={a.role} />
                        {label(a.role)}
                        <span className="font-normal opacity-85">{pick ? `→ ${pick}` : 'pick'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Table view={view} picks={picks} activeRole={view === 'night' ? activeRole : null} votes={votes} voter={voter}
                   counts={counts} suspects={suspects} onTap={onTap} />

            {view === 'player' && (
              <div className="vf-paper flex items-center gap-4 p-3">
                <button type="button" aria-pressed={shown} aria-label={shown ? 'Hide your card' : 'Show your card'}
                        onClick={() => setShown((s) => !s)} className="shrink-0 rounded-sm">
                  <FlipCard role={ME_ROLE} up={shown} className="h-28 w-20" />
                </button>
                <div className="min-w-0">
                  <p className="text-sm text-[var(--f-ink2)]">Your role</p>
                  <p className="vf-title flex items-center gap-2 text-lg font-bold">{shown && <RoleIcon role={ME_ROLE} />}{shown ? cap(ME_ROLE) : 'Hidden'}</p>
                  <p className="text-sm">{shown ? 'Tap the card to hide it.' : 'Tap the card to show it.'}</p>
                </div>
              </div>
            )}

            <div className="sticky bottom-0 z-30 -mx-4 flex flex-col gap-2 border-t-[3px] border-double border-[var(--f-brass)] bg-[var(--f-page)] px-4 pb-4 pt-3 lg:mx-0 lg:px-0">
              {view === 'night' && (
                <button type="button" disabled={!ready} onClick={askResolve} className={cn(primaryBtn, 'min-h-12 w-full text-base disabled:opacity-60')}>
                  {ready ? 'Resolve night' : `Pick ${missing} more target${missing > 1 ? 's' : ''}`}
                </button>
              )}
              {view === 'day' && (
                <button type="button" disabled={!lynchTarget} onClick={askLynch} className={cn(dangerBtn, 'min-h-12 w-full text-base disabled:opacity-60')}>
                  {lynchTarget ? `Lynch ${lynchTarget}` : 'No clear suspect yet'}
                </button>
              )}
              {!wide && (
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button type="button" className={cn(outlineBtn, 'flex min-h-11 w-full items-center justify-center gap-2')}>
                      <ChevronUp className="size-4" aria-hidden="true" /> Log · Roles · Settings
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="variant-F vf-paper max-h-[85vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="vf-title">Log · Roles · Settings</SheetTitle>
                      <SheetDescription className="sr-only">Game details</SheetDescription>
                    </SheetHeader>
                    <div className="px-1 pb-4"><Secondary {...secondaryProps} /></div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          {wide && (
            <aside className="vf-paper sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-4" aria-label="Game details">
              <h2 className="vf-title mb-3 text-base">Log · Roles · Settings</h2>
              <Secondary {...secondaryProps} />
            </aside>
          )}
        </div>
      </div>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
        <AlertDialogContent className="variant-F vf-paper">
          <AlertDialogHeader>
            <AlertDialogTitle className="vf-title">{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-[var(--f-ink)]">{confirm?.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(outlineBtn, 'min-h-11')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(confirm?.tone === 'danger' ? dangerBtn : primaryBtn, 'min-h-11')}
              onClick={() => { confirm?.run(); setConfirm(null); }}>
              {confirm?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
