import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, Info, Minus, RotateCcw, RotateCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Panel, UserToken, FACTIONS, factionFromType } from '@/components/lupus';
import Navbar from '../components/Navbar.jsx';
import SearchPlayer from '../components/SearchPlayer.jsx';
import { ErrorMessage } from '../components/Messages.jsx';
import ToggleSwitch from '../components/game/newGame/ToggleSwitch.jsx';
import AddFriendCheckbox from '../components/game/newGame/AddFriendCheckbox.jsx';
import { useLoginChecker } from '../utils/session.js';
import {
    contextPath, genericGETRequest, genericPOSTRequest, getMessage, capitalizeFirstLetter,
    HTTP_STATUS_OK, HTTP_STATUS_CREATED, JSON_resource_list,
} from '../utils/utils.js';
import { populateErrorMessage } from '../utils/message.js';
import { playersToIgnore } from '../utils/searchPlayer.js';

/* Port of jsp/game/createNewGame.jsp + js/game/createNewGame.js. Wizard layout: players -> roles -> options -> summary (?step=). */

const MIN_PLAYERS = 5;
// Same order as the JSP columns in the JSON sent to the server: good, evil, neutral, victory stealer (lupus FACTIONS types).
const TYPE_ORDER = [0, 1, 3, 2];
const STEPS = [
    { key: 'players', title: 'Players', hint: 'Who is in the village? Set the seating order, pick friends or search for others.' },
    { key: 'roles', title: 'Roles', hint: 'Pick a preset or build the deck, one card at a time.' },
    { key: 'options', title: 'Options', hint: 'Optional rules for this village.' },
    { key: 'summary', title: 'Summary', hint: 'Check the seating and the roles before creating the village.' },
];
// shortcut: presets are local only, saving to DB is a TODO (docs/ui-redesign/TODO.md)
const PRESET_KEY = 'lupus-role-presets';
const AVAIL = { available: '\u{1F7E2}', inGame: '\u{1F534}' }; // green / red circle, as the old Available column
const AVAIL_LABEL = { available: 'Available', inGame: 'In game' };

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const sameCounts = (a, b, roles) => roles.every((r) => (a[r.name] ?? 0) === (b[r.name] ?? 0));
const totalOf = (counts, roles) => roles.reduce((sum, r) => sum + (counts[r.name] ?? 0), 0);
// Moves the seat at `from` to `to` (the others shift), as on the round table.
const reorder = (list, from, to) => {
    const next = [...list];
    const [u] = next.splice(from, 1);
    next.splice(to, 0, u);
    return next;
};
const TAU = Math.PI * 2;

// Built-in presets, computed for N players: about one wolf every 4 players.
const wolves = (n) => Math.min(5, Math.max(1, Math.round(n / 4)));
const PRESETS = [
    { id: 'classic', name: 'Classic', comp: (n) => ({ wolf: wolves(n), seer: 1, farmer: n - wolves(n) - 1 }) },
    { id: 'chaos', name: 'Chaos', comp: (n) => ({ wolf: wolves(n), seer: 1, illusionist: 1, jester: 1, farmer: n - wolves(n) - 3 }) },
];
// Full counts for every role of the game: the preset value clamped to the role's max_number.
const countsFor = (comp, roles) => Object.fromEntries(roles.map((r) => [r.name, Math.max(0, Math.min(r.max_number, comp[r.name] ?? 0))]));

const loadPresets = () => {
    try {
        const list = JSON.parse(localStorage.getItem(PRESET_KEY));
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
};

const roleSrc = (name, low = true) => `/media/cards/${low ? 'lowResolution/' : ''}${encodeURIComponent(name)}.png`;

// Round table. Seats run clockwise from the top; seat i is at i * 360 / N degrees.
function Ring({ players, interactive = false, selected = null, drag = null, tableRef, avail, onPress, onTap, onKey, onNudge }) {
    const N = players.length;
    const step = N ? 360 / N : 0;
    const label = (u) => (N > 8 ? u.slice(0, 6) : u);
    return (
        <div ref={tableRef} className="relative mx-auto aspect-square w-[min(100%,360px)]">
            <div aria-hidden="true"
                 className="absolute inset-[24%] flex flex-col items-center justify-center gap-0.5 rounded-full border-[3px] border-double border-lf-brass px-2 text-center text-lf-on-felt shadow-[inset_0_0_24px_rgba(0,0,0,.35),0_4px_10px_rgba(60,40,20,.25)]"
                 style={{ background: 'radial-gradient(circle at 50% 45%, var(--lf-felt) 0 55%, rgba(0,0,0,.25) 100%)' }}>
                <Flame className="size-7 text-[#f0b25a]" />
                <span className="font-lf-title text-sm">{N ? `${N} seated` : 'Empty fire'}</span>
            </div>
            <ol aria-label={`Seating around the fire, ${N} players, seat 1 at the top, clockwise`} className="absolute inset-0 m-0 list-none p-0">
                {drag && (
                    <li className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-[260ms]" style={{ transform: `rotate(${drag.target * step}deg)` }} aria-hidden="true">
                        <div className="absolute top-[9%] left-1/2 size-0" style={{ transform: `rotate(${-drag.target * step}deg)` }}>
                            <span className="absolute top-0 left-0 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-lf-brass bg-lf-hl" />
                        </div>
                    </li>
                )}
                {players.map((u, i) => {
                    const deg = i * step;
                    const isSel = selected === u;
                    const seatLabel = `${u}, seat ${i + 1} of ${N}${avail(u) ? `, ${AVAIL_LABEL[avail(u)]}` : ''}`;
                    const token = <UserToken username={u} size="md" />;
                    const seatNo = <span aria-hidden="true" className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full border-[1.5px] border-lf-brass bg-lf-paper text-[11px] leading-none font-bold text-lf-ink">{i + 1}</span>;
                    const seatCls = cn(
                        'absolute top-0 left-0 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 text-[15px]',
                        i === 0 && 'outline-[3px] outline-offset-[3px] outline-lf-brass',
                    );
                    return (
                        <li key={u} className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-[260ms]" style={{ transform: `rotate(${deg}deg)` }}>
                            <div className="absolute top-[9%] left-1/2 size-0" style={{ transform: `rotate(${-deg}deg)` }}>
                                {interactive ? (
                                    <button
                                        type="button"
                                        className={cn(seatCls, 'cursor-grab touch-none select-none hover:brightness-110 aria-[pressed=true]:shadow-[0_0_0_3px_var(--lf-paper),0_0_0_6px_var(--lf-rubric)]', drag?.name === u && 'opacity-35')}
                                        aria-pressed={isSel}
                                        aria-label={seatLabel}
                                        title={u}
                                        onPointerDown={(e) => onPress(e, u)}
                                        onClick={() => onTap(u)}
                                        onKeyDown={(e) => onKey(e, u)}
                                    >
                                        {token}
                                        {seatNo}
                                    </button>
                                ) : (
                                    <span className={seatCls}>
                                        {token}
                                        {seatNo}
                                    </span>
                                )}
                                {interactive && isSel && (
                                    <>
                                        <button type="button" aria-label={`Move ${u} to seat ${((i - 1 + N) % N) + 1}`}
                                                className="absolute top-0 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-lf-brass bg-lf-paper text-lf-ink shadow hover:bg-lf-hl"
                                                style={{ left: -72 }} onClick={() => onNudge(u, -1)}>
                                            <RotateCcw className="size-5" aria-hidden="true" />
                                        </button>
                                        <button type="button" aria-label={`Move ${u} to seat ${((i + 1) % N) + 1}`}
                                                className="absolute top-0 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-lf-brass bg-lf-paper text-lf-ink shadow hover:bg-lf-hl"
                                                style={{ left: 72 }} onClick={() => onNudge(u, 1)}>
                                            <RotateCw className="size-5" aria-hidden="true" />
                                        </button>
                                    </>
                                )}
                                <span aria-hidden="true" className="absolute top-[1.6rem] left-1/2 flex max-w-20 -translate-x-1/2 items-center gap-1 text-xs font-bold whitespace-nowrap text-lf-ink [text-shadow:0_0_3px_var(--lf-paper)]">
                                    <span className="truncate">{label(u)}</span>
                                    {avail(u) && <span>{AVAIL[avail(u)]}</span>}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
            {drag && (
                <span aria-hidden="true" className="pointer-events-none fixed z-[60] flex size-11 -translate-x-1/2 -translate-y-1/2 shadow-[0_8px_18px_rgba(0,0,0,.4)]"
                      style={{ left: drag.x, top: drag.y }}>
                    <UserToken username={drag.name} size="md" />
                </span>
            )}
        </div>
    );
}

function Stepper({ step }) {
    return (
        <ol aria-label="Steps" className="flex items-start">
            {STEPS.map((s, i) => {
                const n = i + 1;
                const state = n < step ? 'done' : n === step ? 'current' : 'todo';
                return (
                    <li key={s.key} aria-current={state === 'current' ? 'step' : undefined} className="relative flex flex-1 flex-col items-center gap-1">
                        {i > 0 && (
                            <span aria-hidden="true" className={cn('absolute top-[15px] right-1/2 z-0 h-0.5 w-full', i < step ? 'bg-lf-brass' : 'bg-[rgba(176,138,46,.35)]')} />
                        )}
                        <span className={cn(
                            'relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold',
                            state === 'done' && 'border-lf-brass bg-lf-brass text-lf-seal-warn-text',
                            state === 'current' && 'border-lf-felt bg-lf-felt text-lf-on-felt shadow-[0_0_0_3px_var(--lf-hl)]',
                            state === 'todo' && 'border-lf-brass bg-lf-paper text-lf-ink2',
                        )}>
                            {state === 'done' ? <Check className="size-4" aria-hidden="true" /> : n}
                            <span className="sr-only">{state === 'done' ? ', done' : state === 'current' ? ', current' : ''}</span>
                        </span>
                        <span className={cn('font-lf-title text-xs sm:text-sm', state === 'current' ? 'font-bold text-lf-ink' : 'text-lf-ink2')}>{s.title}</span>
                    </li>
                );
            })}
        </ol>
    );
}

function PlayersStep({ players, friends, checked, availOf, onSelectAll, onFriend, onRemove, onMove, onSearch }) {
    const [selected, setSelected] = useState(null);
    const [drag, setDrag] = useState(null);
    const tableRef = useRef(null);
    const suppressClick = useRef(false);
    const N = players.length;
    const sel = selected && players.includes(selected) ? selected : null;
    const seatedFriends = (friends ?? []).filter((f) => checked[f]).length;
    const allFriends = friends?.length > 0 && seatedFriends === friends.length;
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
        const from = players.indexOf(u);
        onMove(from, (from + dir + N) % N);
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
            onMove(players.indexOf(u), seatAt(ev.clientX, ev.clientY));
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
                    avail={availOf}
                    onPress={onPress}
                    onTap={onTap}
                    onKey={onKey}
                    onNudge={nudge}
                />
                <p aria-live="polite" className="text-center text-[15px] text-lf-ink2">
                    {sel
                        ? <><b className="text-lf-ink">{sel}</b> · Seat {players.indexOf(sel) + 1} of {N}</>
                        : N === 0
                            ? 'Here you will see the players who will be in the game. Add at least 5!'
                            : `Tap a player to select, then drag it or use the arrows. ${N} seated.`}
                </p>
                {sel && (
                    <Button type="button" variant="brass" size="touch" onClick={() => { onRemove(sel); setSelected(null); }} className="gap-2">
                        <X aria-hidden="true" /> Remove {sel}
                    </Button>
                )}
            </div>

            <div>
                <h3 className="mb-1 font-lf-heading text-sm font-bold">Your friends</h3>
                {friends === null && <p className="py-2 text-[15px] text-lf-ink2">Loading friends...</p>}
                {friends !== null && friends.length === 0 && <p className="py-2 text-[15px] text-lf-ink2">Here you can find your friends.</p>}
                {friends?.length > 0 && (
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-dashed border-[rgba(92,70,48,.4)] text-[16px] font-bold">
                        <Checkbox
                            aria-label="Select all friends"
                            className="size-6 rounded border-2 border-lf-brass bg-lf-paper data-[state=checked]:border-lf-felt data-[state=checked]:bg-lf-felt data-[state=checked]:text-lf-on-felt data-[state=indeterminate]:border-lf-felt data-[state=indeterminate]:bg-lf-felt"
                            checked={allFriends ? true : someFriends ? 'indeterminate' : false}
                            onCheckedChange={(v) => onSelectAll(!!v)}
                        />
                        <span>Select all ({friends.length})</span>
                    </label>
                )}
                {(friends ?? []).map((f) => {
                    const state = availOf(f, true);
                    return (
                        <div key={f} className="flex min-h-11 items-center gap-3 border-b border-dashed border-[rgba(92,70,48,.4)] last:border-0">
                            <AddFriendCheckbox username={f} checked={!!checked[f]} onChange={(v) => onFriend(f, v)} />
                            {state && <span role="img" aria-label={AVAIL_LABEL[state]} className="shrink-0">{AVAIL[state]}</span>}
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="mb-2 font-lf-heading text-sm font-bold">Add other players</h3>
                <div className="rounded-sm border-2 border-lf-brass bg-lf-paper p-2">
                    <SearchPlayer onSearch={onSearch} buttonText="Add!" />
                </div>
            </div>
        </div>
    );
}

// Card with the count badge and the info button. The main button adds one copy, the "−" lives on the badge.
function RoleCard({ role, count, onAdd, onRemove, onInfo }) {
    const faction = factionFromType(role.type);
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
                style={selected ? { boxShadow: '0 0 0 3px var(--lf-felt), 0 0 16px 4px rgba(63, 122, 77, .55)' } : undefined}
                className="flex w-full flex-col overflow-hidden rounded-sm border-2 border-lf-brass bg-lf-paper p-1.5 text-left transition-transform motion-safe:duration-150 not-disabled:active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-80"
            >
                <img src={roleSrc(role.name)} alt="" className="block aspect-[5/7] w-full rounded-[2px] object-cover drop-shadow-[0_2px_3px_rgba(0,0,0,.3)]" />
                <span className="flex items-center justify-between gap-1 px-1 pt-1.5 pb-1 font-lf-heading text-sm font-bold">
                    {capitalizeFirstLetter(role.name)}
                    {full && <span className="text-xs font-normal text-lf-rubric">max</span>}
                </span>
                <span className="block h-2 rounded-[1px]" style={{ background: faction?.color }} aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={() => onInfo(role)}
                aria-label={`About ${role.name}`}
                className="absolute top-1.5 left-1.5 z-10 grid size-11 place-items-center rounded-full border-2 border-lf-brass bg-lf-paper text-lf-ink shadow"
            >
                <Info className="size-4" aria-hidden="true" />
            </button>

            {selected && (
                <div className="absolute top-1 right-1 z-10 flex items-center rounded-full border-2 border-lf-brass bg-lf-brass font-bold text-[#1f160f] shadow-[0_2px_4px_rgba(0,0,0,.35)]">
                    <button
                        type="button"
                        onClick={() => onRemove(role.name)}
                        aria-label={`Remove one ${role.name}`}
                        className="grid size-11 place-items-center rounded-full hover:bg-black/10"
                    >
                        <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span className="pr-2 text-sm" aria-hidden="true">×{count}</span>
                </div>
            )}
        </div>
    );
}

function RolesStep({ roles, roleOrder, totRoles, counts, filter, setFilter, presets, N, applyPreset, savePreset, deletePreset, addCard, removeCard }) {
    const [info, setInfo] = useState(null);
    const [saveOpen, setSaveOpen] = useState(false);
    const [name, setName] = useState('');
    const equal = totRoles === N && N > 0;
    const visibleRoles = roleOrder.filter((r) => filter === 'all' || r.type === filter);
    const filters = [{ key: 'all', label: 'All' }, ...FACTIONS.map((f) => ({ key: f.type, label: f.label, color: f.color }))];

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
                <p role="status" className="font-lf-title text-base font-bold">Deck {totRoles}/{N}</p>
                {equal && <span className="flex items-center gap-1 text-sm font-bold text-lf-seal-ok"><Check aria-hidden="true" className="size-4" /> Balanced</span>}
            </div>

            {/* Presets fill the deck in one tap. Saved presets are local to this browser. */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="font-lf-heading text-sm font-bold">Presets</h3>
                    <Button type="button" variant="brass" size="touch" onClick={() => setSaveOpen(true)} disabled={totRoles === 0}>
                        Save as preset
                    </Button>
                </div>
                <div role="group" aria-label="Role presets" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                    {presets.map((p) => {
                        const comp = countsFor(p.comp(N), roles);
                        const on = sameCounts(comp, counts, roles);
                        const size = totalOf(comp, roles);
                        return (
                            <div key={p.id} className={cn(
                                'flex shrink-0 items-center rounded-full border-2',
                                on ? 'border-lf-felt bg-lf-felt text-lf-on-felt' : 'border-lf-brass bg-lf-paper text-lf-ink',
                            )}>
                                <button type="button" aria-pressed={on} onClick={() => applyPreset(comp)}
                                        className="flex min-h-11 items-center gap-2 px-4 text-sm font-bold">
                                    {on && <Check className="size-4" aria-hidden="true" />}
                                    {p.name}
                                    <span className="font-normal opacity-80">· {size} roles</span>
                                </button>
                                {p.saved && (
                                    <button type="button" aria-label={`Delete preset ${p.name}`} onClick={() => deletePreset(p.id)}
                                            className="mr-0.5 grid size-11 place-items-center rounded-full hover:bg-lf-hl">
                                        <X className="size-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div role="group" aria-label="Filter by faction" className="flex flex-wrap gap-2">
                    {filters.map((f) => {
                        const active = filter === f.key;
                        return (
                            <button key={f.key} type="button" aria-pressed={active} onClick={() => setFilter(f.key)}
                                    className={cn(
                                        'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 text-sm font-bold',
                                        active ? 'border-lf-felt bg-lf-felt text-lf-on-felt' : 'border-lf-brass bg-lf-paper text-lf-ink',
                                    )}>
                                {f.color && <span className="size-3 rounded-full border border-black/30" style={{ background: f.color }} aria-hidden="true" />}
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {visibleRoles.map((r) => (
                        <RoleCard key={r.name} role={r} count={counts[r.name] ?? 0} onAdd={addCard} onRemove={removeCard} onInfo={setInfo} />
                    ))}
                </div>
            </div>

            <Dialog open={info !== null} onOpenChange={(o) => !o && setInfo(null)}>
                {info && (
                    <DialogContent className="lf-paper max-h-[90vh] overflow-y-auto p-5 sm:max-w-md">
                        <DialogTitle className="font-lf-title text-xl text-lf-rubric capitalize">{info.name}</DialogTitle>
                        <DialogDescription className="text-[15px] text-lf-ink2">
                            {factionFromType(info.type)?.label} · max {info.max_number} per village
                        </DialogDescription>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                            <img src={roleSrc(info.name, false)} alt="" className="w-44 shrink-0 rounded-[3px] border-2 border-lf-brass shadow-[0_4px_10px_rgba(0,0,0,.3)] sm:w-40" />
                            <p className="text-[15px] leading-relaxed">{info.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="brass" size="touch" className="flex-1" onClick={() => setInfo(null)}>Close</Button>
                            <Button type="button" variant="felt" size="touch" className="flex-1"
                                    disabled={(counts[info.name] ?? 0) >= info.max_number}
                                    onClick={() => { addCard(info.name); setInfo(null); }}>
                                Add to deck
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
                <DialogContent className="lf-paper max-w-[min(22rem,calc(100%-2rem))] gap-4 p-5">
                    <DialogTitle className="font-lf-title text-lg text-lf-rubric">Save as preset</DialogTitle>
                    <DialogDescription className="text-[15px] text-lf-ink2">Keeps the current deck ({totRoles} roles) in the preset list.</DialogDescription>
                    <form className="flex flex-col gap-3" onSubmit={submitPreset}>
                        <Label htmlFor="cng-preset-name" className="text-[15px]">Preset name</Label>
                        <Input id="cng-preset-name" value={name} maxLength={30} onChange={(e) => setName(e.target.value)}
                               className="h-11 border-2 border-lf-brass bg-lf-paper text-base text-lf-ink" />
                        <div className="flex gap-2">
                            <Button type="button" variant="brass" size="touch" className="flex-1" onClick={() => setSaveOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="felt" size="touch" className="flex-1" disabled={name.trim() === ''}>Save preset</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function OptionsStep({ settings, gameSettings, setGameSettings }) {
    return (
        <div className="flex flex-col">
            {settings.map((s) => (
                <div key={s.setting_name} className="flex min-h-14 items-center justify-between gap-4 border-b border-dashed border-[rgba(92,70,48,.4)] py-3 last:border-0">
                    <label htmlFor={`set-${s.setting_name}`} className="cursor-pointer text-[16px] leading-snug">{s.description}</label>
                    <ToggleSwitch
                        id={`set-${s.setting_name}`}
                        checked={!!gameSettings[s.setting_name]}
                        onChange={(v) => setGameSettings((g) => ({ ...g, [s.setting_name]: v }))}
                    />
                </div>
            ))}
        </div>
    );
}

function SummaryStep({ players, availOf, roleOrder, counts, settings, gameSettings, totRoles, reason }) {
    const active = settings.filter((s) => gameSettings[s.setting_name]);
    return (
        <div className="flex flex-col gap-6">
            <section aria-labelledby="cng-sum-seats" className="flex flex-col gap-3">
                <h3 id="cng-sum-seats" className="font-lf-heading text-sm font-bold">Seating ({players.length})</h3>
                {/* overflow-hidden: the rotated seat boxes reach past the ring at 390px (summary has no arrows to keep). */}
                <div className="overflow-hidden"><Ring players={players} avail={availOf} /></div>
            </section>

            <section aria-labelledby="cng-sum-roles" className="flex flex-col gap-4">
                <h3 id="cng-sum-roles" className="font-lf-heading text-sm font-bold">Roles ({totRoles})</h3>
                {FACTIONS.map((f) => {
                    const list = roleOrder.filter((r) => r.type === f.type && (counts[r.name] ?? 0) > 0);
                    if (list.length === 0) return null;
                    return (
                        <div key={f.id} className="flex flex-col gap-2 pl-3" style={{ borderLeft: `6px solid ${f.color}` }}>
                            <h4 className="flex items-center gap-2 font-lf-title text-xs text-lf-ink2">
                                <i className={cn('fas', f.icon)} aria-hidden="true" />
                                {f.label}
                            </h4>
                            <ul className="flex flex-wrap gap-3">
                                {list.map((r) => (
                                    <li key={r.name} title={capitalizeFirstLetter(r.name)} className="flex w-[4.5rem] flex-col items-center gap-1 text-center">
                                        <span className="relative">
                                            <img src={roleSrc(r.name)} alt={capitalizeFirstLetter(r.name)} width={40} height={56}
                                                 className="h-14 w-10 rounded-[3px] border-2 border-lf-brass object-cover" />
                                            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-lf-brass bg-lf-brass px-1 text-[11px] font-bold text-[#1f160f]">×{counts[r.name]}</span>
                                        </span>
                                        <span className="w-full truncate text-xs">{capitalizeFirstLetter(r.name)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </section>

            <section aria-labelledby="cng-sum-opts" className="flex flex-col gap-2">
                <h3 id="cng-sum-opts" className="font-lf-heading text-sm font-bold">Options</h3>
                {active.length === 0 ? (
                    <p className="text-[15px] text-lf-ink2">No extra options</p>
                ) : (
                    <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px]">
                        {active.map((s) => <li key={s.setting_name}>{s.description}</li>)}
                    </ul>
                )}
            </section>

            {reason ? (
                <p id="cng-reason" role="status" className="rounded-sm border-2 border-lf-brass bg-lf-paper p-3 text-[15px]">{reason}</p>
            ) : (
                <p className="flex items-center gap-2 text-[15px] font-bold text-lf-seal-ok"><Check aria-hidden="true" className="size-4" /> Ready to create the village.</p>
            )}
            <ErrorMessage />
        </div>
    );
}

export default function CreateNewGame() {
    useLoginChecker();

    // ?step=players|roles|options|summary (invalid or missing -> players). The URL follows the current step.
    const [step, setStep] = useState(() => {
        const i = STEPS.findIndex((s) => s.key === new URLSearchParams(window.location.search).get('step'));
        return i >= 0 ? i + 1 : 1;
    });
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('step', STEPS[step - 1].key);
        window.history.replaceState(window.history.state, '', url);
    }, [step]);

    const [roles, setRoles] = useState([]);            // sorted role objects from GET game/create
    const [settings, setSettings] = useState([]);      // setting objects from GET game/settings
    const [counts, setCounts] = useState({});          // role name -> cardinality
    const [gameSettings, setGameSettings] = useState({}); // setting_name -> bool
    const [friends, setFriends] = useState(null);      // friend usernames, null until loaded
    const [checked, setChecked] = useState({});        // friend username -> checkbox state
    const [players, setPlayers] = useState([]);        // usernames in table order
    const [avail, setAvail] = useState(null);          // Map(lower username -> gameId | null), null before 1st answer
    const [filter, setFilter] = useState('all');
    const [saved, setSaved] = useState(loadPresets);   // shortcut: local presets only, see PRESET_KEY

    // Latest values for the XHR callbacks (the old page globals).
    const playersRef = useRef([]);
    const friendsRef = useRef([]);
    const loaded = useRef(false);

    const setPlayersAll = (list) => { playersRef.current = list; setPlayers(list); };
    const setCheckedFor = (name, value) => setChecked((c) => ({ ...c, [name]: value }));
    const setCount = (name, value) => setCounts((c) => ({ ...c, [name]: value }));

    const sendAvailabilityRequest = () => {
        genericGETRequest(contextPath + "user/search/", updateAvailability);
    };

    // Same as updateAvailability(): players not in the server list are removed from the table.
    const updateAvailability = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const map = new Map();
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null)
                for (let i = 0; i < list.length; i++)
                    map.set(list[i]['player']['username'].toLowerCase(), list[i]['player']['gameId']);

            [...playersRef.current].forEach((p) => {
                if (!map.has(p.toLowerCase())) removeFromPlayersTable(p);
            });
            setAvail(map);
        }
    };

    // Same as addToPlayersTable().
    const addToPlayersTable = (username) => {
        const list = playersRef.current;
        if (list.some((p) => p.toLowerCase() === username.toLowerCase()))
            return;

        playersToIgnore.push(username.toLowerCase());
        setPlayersAll([...list, username]);

        if (friendsRef.current.includes(username))
            setCheckedFor(username, true);

        sendAvailabilityRequest();
    };

    // Same as removeFromPlayersTable().
    const removeFromPlayersTable = (username) => {
        const list = playersRef.current;
        const i = list.indexOf(username);
        if (i !== -1) {
            setPlayersAll(list.filter((_, j) => j !== i));
            // sic: misplaced paren, kept from js/game/createNewGame.js:543
            playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1));
        }
    };

    // Same as removeRow() (remove from the table, used by the seat's Remove and the keyboard).
    const removeRow = (username) => {
        const list = playersRef.current;
        const index = list.indexOf(username);
        if (index === -1) return;
        setPlayersAll(list.filter((_, j) => j !== index));

        // sic: misplaced paren, kept from js/game/createNewGame.js:562
        playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1));

        friendsRef.current.forEach((f) => { if (f === username) setCheckedFor(f, false); });
    };

    // Same as checkBoxPress() (friend "add" toggle).
    const checkBoxPress = (name, value) => {
        setCheckedFor(name, value);
        if (value) addToPlayersTable(name);
        else removeFromPlayersTable(name);
    };

    // Seat move (drag, arrows): the seat at `from` goes to `to`. Replaces moveUp()/moveDown() of the old table.
    const moveRow = (from, to) => {
        const list = playersRef.current;
        if (from < 0 || to < 0 || to >= list.length || from === to) return;
        setPlayersAll(reorder(list, from, to));
    };

    // Select all friends: same toggles as the friend checkboxes.
    const selectAllFriends = (on) => friendsRef.current.forEach((f) => checkBoxPress(f, on));

    // Used by SearchPlayer (onSearch): same as searchThePlayer().
    const searchThePlayer = () => {
        const input = document.getElementById("playerUsername");
        const username = input.value;
        if (username !== "") {
            addToPlayersTable(username);
            input.value = "";
        }
        friendsRef.current.forEach((f) => { if (f === username) setCheckedFor(f, true); });
    };

    const fillFriends = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                const names = list.map((item) => item['friend'].username);
                friendsRef.current = names;
                setFriends(names);
                sendAvailabilityRequest();
            }
        }
    };

    const fillGameRoles = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                const sorted = [...list].sort((a, b) => b.role.max_number - a.role.max_number);
                setRoles(sorted.map((item) => item['role']));
            }
        }
    };

    const fillGameSettings = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
                return;
            }
            setSettings(list.map((item) => item['setting']));
        }
    };

    const gameCreation = (req) => {
        if (req.readyState !== XMLHttpRequest.DONE) return;
        if (req.status === HTTP_STATUS_CREATED) {
            const game = JSON.parse(req.responseText)['game'];
            window.location.replace(contextPath + "village/" + game.public_ID);
        } else {
            const message = getMessage(req);
            if (message != null) {
                populateErrorMessage(".errorMessage", message.message, message.errorCode, message.errorDetails);
            } else {
                const listMsg = JSON.parse(req.responseText)[JSON_resource_list];
                if (listMsg != null) {
                    let msgs = "";
                    let errorCodes = "";
                    let errorDetails = "";
                    for (let i = 0; i < listMsg.length; i++) {
                        const m = listMsg[i]['message'];
                        msgs += m.message + "<br>";
                        if (!errorCodes.includes(m['error-code']))
                            errorCodes += ", " + m['error-code'];
                        if (!errorDetails.includes(m['error-details']))
                            errorDetails += "<br>" + m['error-details'];
                    }
                    populateErrorMessage(".errorMessage", msgs, errorCodes.substring(2), errorDetails.substring(4));
                }
            }
        }
    };

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        genericGETRequest(contextPath + "game/create", fillGameRoles);
        genericGETRequest(contextPath + "game/settings", fillGameSettings);
        genericGETRequest(contextPath + "user/me/friend", fillFriends);

        // list of players to be ignored by the search player (the current player)
        const me = localStorage.getItem("playerName");
        if (me) playersToIgnore.push(me.toLowerCase());
    }, []);

    // Role cards in the JSP order (good, evil, neutral, victory stealer).
    const roleOrder = TYPE_ORDER.flatMap((t) => roles.filter((r) => r.type === t));
    const totRoles = totalOf(counts, roleOrder);
    const totPlayers = players.length;
    const enough = totPlayers >= MIN_PLAYERS;
    const matched = totPlayers === totRoles;
    const enabled = enough && matched;
    const diff = Math.abs(totRoles - totPlayers);
    const reason = !enough
        ? `Add ${MIN_PLAYERS - totPlayers} more ${MIN_PLAYERS - totPlayers === 1 ? 'player' : 'players'} (minimum ${MIN_PLAYERS}).`
        : !matched
            ? `Roles ${totRoles} / players ${totPlayers}: ${totRoles > totPlayers ? 'remove' : 'add'} ${plural(diff, 'role')}.`
            : null;

    // Availability marker per player (green free, red in a game); friends not in the server list count as in game.
    const availOf = (name, forFriend = false) => {
        if (!avail) return null;
        if (!forFriend && !avail.has(name.toLowerCase())) return null;
        return avail.get(name.toLowerCase()) === null ? 'available' : 'inGame';
    };

    const presets = [...PRESETS, ...saved.map((p) => ({ id: p.id, name: p.name, saved: true, comp: () => p.comp }))];
    const addCard = (name) => {
        const role = roles.find((r) => r.name === name);
        setCounts((c) => ({ ...c, [name]: Math.min(role.max_number, (c[name] ?? 0) + 1) }));
    };
    const removeCard = (name) => setCounts((c) => ({ ...c, [name]: Math.max(0, (c[name] ?? 0) - 1) }));
    const applyPreset = (comp) => setCounts(comp);
    const savePreset = (presetName, comp) => {
        // shortcut: presets are local only, saving to DB is a TODO (docs/ui-redesign/TODO.md)
        const next = [...saved, { id: `saved-${Date.now()}`, name: presetName, comp }];
        setSaved(next);
        localStorage.setItem(PRESET_KEY, JSON.stringify(next));
    };
    const deletePreset = (id) => {
        const next = saved.filter((p) => p.id !== id);
        setSaved(next);
        localStorage.setItem(PRESET_KEY, JSON.stringify(next));
    };

    // Same as sendSettings().
    const sendSettings = () => {
        const roleCardinality = roleOrder.map((r) => ({ role: r.name, cardinality: counts[r.name] ?? 0 }));
        const player = playersRef.current.map((username) => ({ username: username.trim() }));
        const gameSettingsList = settings.map((s) => ({ setting: s.setting_name, status: gameSettings[s.setting_name] ?? false }));
        const json = { roleCardinality, player, gameSettings: gameSettingsList };
        genericPOSTRequest(contextPath + "game/create", JSON.stringify(json), gameCreation);
    };

    const go = (s) => { setStep(s); window.scrollTo({ top: 0 }); };

    return (
        <div className="lf-page flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />

            <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-6 px-4 pt-4 pb-6 sm:px-6">
                <header className="text-center">
                    <h1 className="font-lf-title text-3xl font-bold tracking-[.02em] sm:text-4xl">Create a new village</h1>
                </header>
                <Stepper step={step} />

                <Panel as="section" aria-labelledby="cng-h" className="flex flex-col gap-4 p-4 sm:p-6">
                    <div>
                        <h2 id="cng-h" className="font-lf-title text-lg text-lf-rubric">{STEPS[step - 1].title}</h2>
                        <p className="text-[15px] text-lf-ink2">{STEPS[step - 1].hint}</p>
                    </div>
                    {step === 1 && (
                        <PlayersStep
                            players={players}
                            friends={friends}
                            checked={checked}
                            availOf={availOf}
                            onSelectAll={selectAllFriends}
                            onFriend={checkBoxPress}
                            onRemove={removeRow}
                            onMove={moveRow}
                            onSearch={searchThePlayer}
                        />
                    )}
                    {step === 2 && (
                        <RolesStep
                            roles={roles}
                            roleOrder={roleOrder}
                            totRoles={totRoles}
                            N={totPlayers}
                            counts={counts}
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
                    {step === 3 && <OptionsStep settings={settings} gameSettings={gameSettings} setGameSettings={setGameSettings} />}
                    {step === 4 && (
                        <SummaryStep
                            players={players}
                            availOf={availOf}
                            roleOrder={roleOrder}
                            counts={counts}
                            settings={settings}
                            gameSettings={gameSettings}
                            totRoles={totRoles}
                            reason={reason}
                        />
                    )}
                </Panel>
            </main>

            {/* Bottom bar: counts, the deck tray on the roles step, then Back / Next (thumb reach, sticky). */}
            <div className="sticky bottom-0 z-30 border-t-[3px] border-double border-lf-brass bg-lf-paper px-4 pt-3 pb-4 shadow-[0_-4px_12px_rgba(60,40,20,.18)]">
                <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3">
                    <p aria-live="polite" className="text-center text-sm font-bold">
                        <span id="playersCount">{plural(totPlayers, 'player')}</span> · <span id="rolesCount">{totRoles}/{totPlayers} roles</span>
                    </p>
                    {step === 2 && (
                        <ul aria-label="Cards in the deck" className="flex items-center overflow-x-auto px-1 py-1">
                            {totRoles === 0 && <li className="text-sm text-lf-ink2">Deck is empty</li>}
                            {roleOrder.filter((r) => counts[r.name] > 0).map((r) => (
                                <li key={r.name} className="relative -ml-3 w-9 shrink-0 first:ml-0">
                                    <img src={roleSrc(r.name)} alt={`${counts[r.name]} × ${r.name}`}
                                         className="block aspect-[5/7] w-full rounded-[3px] border-2 border-lf-brass object-cover shadow-[0_2px_3px_rgba(0,0,0,.3)]" />
                                    <span className="absolute -top-1 -right-1 rounded-full bg-lf-brass px-1 text-[10px] leading-4 font-bold text-[#1f160f]" aria-hidden="true">
                                        ×{counts[r.name]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex gap-3">
                        <Button type="button" variant="brass" size="touch" onClick={() => go(step - 1)} disabled={step === 1} className="flex-1 gap-2">
                            <ArrowLeft aria-hidden="true" /> Back
                        </Button>
                        {step < 4 ? (
                            <Button type="button" variant="felt" size="touch" onClick={() => go(step + 1)} className="flex-[2] gap-2">
                                Next <ArrowRight aria-hidden="true" />
                            </Button>
                        ) : (
                            <Button
                                id="sendSettings"
                                type="button"
                                variant="felt"
                                size="touch"
                                onClick={sendSettings}
                                disabled={!enabled}
                                aria-describedby={reason ? 'cng-reason' : undefined}
                                className="flex-[2]"
                            >
                                Create village
                            </Button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
