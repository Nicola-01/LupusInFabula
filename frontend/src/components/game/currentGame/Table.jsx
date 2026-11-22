import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleIcon, userColor } from '@/components/lupus';
import { cap } from './gameLogic.js';

// Seat i of n, clockwise from the top, as % of the table (square, so % maps evenly to the SVG).
const R = 37;
const seatPos = (i, n) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
};
const centroid = (ps) => ({ x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length });
function trim(a, b, pad = 6) {
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    return { x1: a.x + ux * pad, y1: a.y + uy * pad, x2: b.x - ux * (pad + 2), y2: b.y - uy * (pad + 2), ux, uy };
}
const initials = (n) => (n.match(/[A-Za-z0-9]/g) || ['?']).slice(0, 2).join('').toUpperCase();
const TONE = { evil: '#ff8c7a', good: '#a6e6a0', neutral: '#f2d27a', ws: '#8fc3ff' };

/**
 * The round table: one seat per player (id "<username>_status", the old hook), arrows for the picks / votes.
 * seat(name) -> {glow, target, selected, count, note}; arrows: [{key, from: [names], to, tone, curved}].
 * showRole(p) decides whether the role icon of p is shown. labels: WS selections (sender -> target).
 */
export default function Table({ players, night, title, seat, arrows, showRole, me, labels, onTap }) {
    const n = players.length;
    const alive = players.filter((p) => !p.isDead).length;
    const pos = Object.fromEntries(players.map((p, i) => [p.username, seatPos(i, n)]));
    const byTarget = new Map();
    labels.forEach((target, sender) => byTarget.set(target, [...(byTarget.get(target) || []), sender]));
    const small = n > 12;

    const lines = arrows.filter((a) => pos[a.to] && a.from.every((f) => pos[f])).map((a) => {
        const from = centroid(a.from.map((f) => pos[f]));
        const seg = trim(from, pos[a.to]);
        const mx = (from.x + pos[a.to].x) / 2, my = (from.y + pos[a.to].y) / 2;
        return { ...a, ...seg, cx: mx + (50 - mx) * 0.35 - seg.uy * 6, cy: my + (50 - my) * 0.35 + seg.ux * 6 };
    });

    return (
        <div className={cn('gt-stage', night ? 'gt-night' : 'gt-day')} role="group" aria-label={`Round table, ${alive} alive`}>
            <div className="gt-fire" aria-hidden="true" />
            <div className="gt-center">
                <Flame className="size-6" style={{ color: night ? '#f0b25a' : '#9a4a16' }} aria-hidden="true" />
                {title && <span className="font-lf-heading text-xs font-bold">{title}</span>}
                <span className="text-[11px] font-bold">{alive} alive</span>
            </div>
            {lines.length > 0 && (
                <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
                    <defs>
                        {Object.entries(TONE).map(([k, c]) => (
                            <marker key={k} id={`gt-h-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                <path d="M0,0 L10,5 L0,10 z" fill={c} />
                            </marker>
                        ))}
                        <marker id="gt-h-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
                        </marker>
                    </defs>
                    {lines.map((a) => (a.curved ? (
                        <path key={a.key} className="gt-arrow" d={`M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`}
                              stroke={TONE[a.tone] ?? 'currentColor'} markerEnd={`url(#gt-h-${TONE[a.tone] ? a.tone : 'ink'})`} />
                    ) : (
                        <line key={a.key} className="gt-arrow" x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                              stroke={TONE[a.tone] ?? 'currentColor'} markerEnd={`url(#gt-h-${TONE[a.tone] ? a.tone : 'ink'})`} />
                    )))}
                </svg>
            )}
            {players.map((p) => {
                const st = seat(p.username);
                const mine = me === p.username;
                const role = showRole(p) ? p.role : '';
                const voters = byTarget.get(p.username) || [];
                const aria = [p.username, mine && 'you', role && cap(role), p.isDead && 'dead', st.count ? `${st.count} votes` : null,
                    st.target && 'possible target', st.note, voters.length ? `selected by ${voters.join(', ')}` : null].filter(Boolean).join(', ');
                return (
                    <div key={p.username} className="absolute" style={{ left: `${pos[p.username].x}%`, top: `${pos[p.username].y}%`, transform: 'translate(-50%, -50%)' }}>
                        <button type="button" id={`${p.username}_status`} aria-label={aria} onClick={() => onTap(p.username)}
                                className={cn('lf-token gt-token relative text-[#fbf6ea]', small ? 'size-10 text-xs' : 'size-11 text-sm',
                                    st.glow && 'gt-glow', st.selected && 'gt-selected', st.target && 'gt-target', mine && 'gt-mine')}
                                style={{ backgroundColor: p.isDead ? '#6b6259' : userColor(p.username) }}>
                            {p.isDead ? <i className="fas fa-skull text-[15px]" aria-hidden="true" /> : initials(p.username)}
                            {role && (
                                <span className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-lf-paper bg-lf-paper text-[11px] text-lf-ink" aria-hidden="true">
                                    <RoleIcon role={role} />
                                </span>
                            )}
                            {st.count > 0 && (
                                <span className="absolute -left-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-lf-paper bg-lf-wax px-1 text-xs font-bold text-lf-wax-text" aria-hidden="true">
                                    {st.count}
                                </span>
                            )}
                        </button>
                        <span className="gt-name pointer-events-none absolute left-1/2 top-full mt-0.5 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-[12px] font-bold leading-tight" aria-hidden="true">
                            <span>{p.username}{mine && ' (you)'}</span>
                            {st.note && <span className="font-normal">{st.note}</span>}
                            {voters.length > 0 && <span className="vote-label rounded-sm bg-lf-paper px-1 text-[11px] font-normal text-lf-ink">{voters.join(', ')}</span>}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
