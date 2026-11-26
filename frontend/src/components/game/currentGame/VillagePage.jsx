import { useEffect, useRef, useState } from 'react';
import { ChevronUp, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Panel, RoleIcon } from '@/components/lupus';
import { InfoMessage, ErrorMessage, WarningMessage } from '../../Messages.jsx';
import { GamePhase, getRoleType } from '../../../utils/utils.js';
import { useGame } from './useGame.js';
import { cap, rowsOf } from './gameLogic.js';
import Table from './Table.jsx';
import MasterActions, { NowActing, nightChips } from './MasterActions.jsx';
import Secondary from './Secondary.jsx';
import TheEnd from './TheEnd.jsx';
import './game.css';

const CONFIRM = {
    skipDay: { title: 'Skip first day?', body: 'Confirm to skip first Day.' },
    previousRound: { title: 'Return to previous phase?', body: 'Confirm to return to previous phase.' },
    endGame: { title: 'End the game?', body: 'Confirm to end the game.' },
};
const TYPE_ID = { good: 0, evil: 1, 'victory stealer': 2, neutral: 3 };
const TONE = { good: 'good', evil: 'evil', neutral: 'neutral', 'victory stealer': 'neutral' };

// Desktop (lg+): the bottom sheet becomes a side panel.
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

/** Copies the game link without the /master suffix (old copyGameLink). */
function CopyLink() {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = () => {
        const URL = window.location.href.replace(/\/master\/?$/, '');
        navigator.clipboard.writeText(URL).then(() => {
            console.log('URL copied to clipboard: ' + URL);
            setCopied(true);
            timer.current = setTimeout(() => setCopied(false), 1500);
        }).catch((err) => console.error('Could not copy text: ', err));
    };
    return (
        <Button type="button" id="copyLink" variant="brass" size="touch" onClick={copy} aria-live="polite">
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? 'Copied' : 'Copy link'}
        </Button>
    );
}

/** The logged player's card: tap to show / hide the role (old toggleCard). */
function PlayerCard({ g }) {
    if (g.spectating) return <Panel className="p-4"><p id="playerRole" className="text-lg">You are <b>spectating</b></p></Panel>;
    const role = g.me?.role;
    const shown = !g.hidden;
    const back = '/media/cards/card_back/' + (g.cardBack || 'lupusBack.png');
    return (
        <Panel id="cardContainer" className="flex items-center gap-4 p-3">
            <button type="button" id="card" aria-pressed={shown} aria-label={shown ? 'Hide your card' : 'Show your card'}
                    onClick={g.toggleCard} className="shrink-0 rounded-sm" disabled={!role}>
                <span className="relative block h-28 w-20 [perspective:600px]" aria-hidden="true">
                    <span className="gt-flip-inner" style={{ transform: shown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                        <span className="gt-face" style={{ backgroundImage: `url(${back})` }} />
                        {role && <span className="gt-face gt-face-role" style={{ backgroundImage: `url(/media/cards/${encodeURIComponent(role)}.png)` }} />}
                    </span>
                </span>
            </button>
            <div className="min-w-0">
                <p className="text-sm text-lf-ink2">Your role</p>
                <p id="playerRole" className="flex items-center gap-2 font-lf-heading text-lg font-bold">
                    {role && shown && <RoleIcon role={role} />}{role ? (shown ? cap(role) : 'Hidden') : '…'}
                </p>
                <p className="text-sm">{shown ? 'Tap the card to hide it.' : 'Tap the card to show it.'}</p>
                {g.me?.isDead && <p className="text-sm font-bold text-lf-rubric">You are dead: stay silent.</p>}
            </div>
        </Panel>
    );
}

export default function VillagePage({ gameId, isMasterRoute, village, onReload }) {
    const g = useGame(gameId, isMasterRoute, village, onReload);
    const wide = useWide();
    const [active, setActive] = useState('designatedWolf'); // night: chip that the next tap fills
    const [voter, setVoter] = useState(null);               // day: voter picked on the table
    const [sheetOpen, setSheetOpen] = useState(false);
    const [confirm, setConfirm] = useState(null);

    const master = village.isMaster;
    const f = g.form;
    const night = g.game ? g.game.phase === GamePhase.NIGHT : true;

    // ---- table state -------------------------------------------------------------------------------------
    const players = g.players ?? [];
    let seat = () => ({});
    let arrows = [];
    let onTable = () => {};
    let hint = '';
    // master, day: the rows of the open vote / ballot, one per voter (the form can show a voter twice)
    const dayRows = master && f && f.phase !== GamePhase.NIGHT
        ? rowsOf(f, f.radios.checked).filter((r, i, all) => all.findIndex((x) => x.player === r.player) === i) : null;
    const pairs = dayRows ? dayRows.filter((r) => r.value).map((r) => [r.player, r.value]) : null;
    const pairsKey = JSON.stringify(pairs) + '|' + (dayRows ? f.radios.checked : '');
    // the players see the votes as the master sees them (useGame.sendVotes skips unchanged content)
    useEffect(() => { if (pairs) g.sendVotes(pairs); }, [pairsKey]); // eslint-disable-line react-hooks/exhaustive-deps
    if (master && f && f.phase === GamePhase.NIGHT) {
        const chips = nightChips(f);
        const key = chips.some((c) => c.key === active) ? active : chips[0].key;
        const slot = typeof key === 'number' ? f.slots[key] : null;
        const actors = slot ? (slot.wolf ? (f.designated ? [f.designated] : f.wolfPack.filter((w) => w.role === slot.role).map((w) => w.player)) : [slot.player].filter(Boolean))
            : f.wolfPack.map((w) => w.player);
        const targets = slot ? (slot.disabled ? [] : slot.options) : f.wolfPack.map((w) => w.player);
        seat = (name) => ({ glow: actors.includes(name), target: targets.includes(name) });
        // ids can repeat (two berserker selects, a voter in the vote and in the ballot): key by position
        arrows = f.slots.filter((s) => s.value && players.some((p) => p.username === s.value)).map((s) => ({
            key: f.slots.indexOf(s), from: s.wolf ? [f.designated].filter(Boolean) : [s.player].filter(Boolean), to: s.value, tone: TONE[getRoleType(s.role)] ?? 'evil',
        })).filter((a) => a.from.length);
        onTable = (name) => {
            if (slot) { if (!slot.disabled && slot.options.includes(name)) g.onNightSelect(slot, name); }
            else if (f.wolfPack.some((w) => w.player === name)) g.onDesignated(name);
            else return;
            const next = nightChips(f).find((c) => !c.value);
            if (next) setActive(next.key);
        };
        hint = 'Pick who acts in "Now acting", then tap the target on the table, or use the form below.';
    } else if (master && f) {
        const rows = dayRows;
        const row = voter && rows.find((r) => r.player === voter);
        const counts = {};
        rows.forEach((r) => { if (r.value) counts[r.value] = (counts[r.value] || 0) + 1; });
        seat = (name) => ({ selected: voter === name, target: !!row && row.options.includes(name), count: counts[name] || 0 });
        arrows = rows.filter((r) => r.value).map((r, i) => ({ key: i, from: [r.player], to: r.value, tone: 'ink', curved: true }));
        onTable = (name) => {
            if (!voter) { if (rows.some((r) => r.player === name && !r.disabled)) setVoter(name); return; }
            if (name !== voter && row && !row.disabled && row.options.includes(name)) g.onDaySelect(row, name);
            setVoter(null);
        };
        hint = voter ? `Now tap who ${voter} votes for. Tap ${voter} again to cancel.` : 'Tap a voter, then the player they vote for, or use the form below.';
    } else if (!master) {
        const shown = !g.hidden;
        // the day votes of the master (#votes:), shown as the master shows them
        const counts = {};
        if (!night) g.votes.forEach((to) => { counts[to] = (counts[to] || 0) + 1; });
        seat = (name) => ({ target: shown && g.highlight.has(name), note: shown && g.noShot && name === g.me?.username ? '(No shot)' : null, count: counts[name] || 0 });
        arrows = [...g.selections].map(([from, to]) => ({ key: from, from: [from], to, tone: 'ws', curved: true }));
        if (!night) arrows.push(...[...g.votes].map(([from, to]) => ({ key: 'v' + from, from: [from], to, tone: 'ink', curved: true })));
        hint = g.spectating ? 'You are watching this village.' : 'Your seat is outlined. Show your card to see your targets, then tap one to point at it.';
    }
    const showRole = (p) => master || (!g.hidden && !!p.role);
    const tap = (name) => { g.seatClick(name); onTable(name); };

    // ---- roles in game -----------------------------------------------------------------------------------
    // the master has no GET game/configuration (as before): the roles come from the players list
    const roles = master
        ? Object.values(players.reduce((acc, p) => {
            if (p.role) (acc[p.role] ||= { name: p.role, type: TYPE_ID[getRoleType(p.role)], max_number: 0 }).max_number++;
            return acc;
        }, {}))
        : g.config?.map((i) => i.role);

    const ask = (value) => { setSheetOpen(false); setConfirm(value); };
    const secondary = <Secondary g={g} master={master} roles={roles} onAsk={ask} />;

    const messages = (
        <>
            <InfoMessage />
            {!g.isOver && (master ? <><WarningMessage /><ErrorMessage /></> : <ErrorMessage />)}
            <div id="actionResults"></div>
        </>
    );

    if (g.isOver) {
        return (
            <div className="flex flex-col gap-4">
                {messages}
                <TheEnd game={g.over} players={g.players} me={g.me?.username} logs={g.logs} master={isMasterRoute} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
            <div className="flex min-w-0 flex-col gap-4">
                <header className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h1 id="gameStatus" className="font-lf-title text-[1.75rem] font-bold leading-tight">{g.title}</h1>
                        <p className="text-sm text-lf-ink2">{hint}</p>
                    </div>
                    <div className="flex gap-2">
                        {g.hasToggle && !g.spectating && (
                            <Button type="button" id="toggleButton" variant="brass" size="touch" onClick={g.toggleCard}
                                    aria-label={g.hidden ? 'Show your role' : 'Hide your role'} aria-pressed={!g.hidden}>
                                {g.hidden ? <EyeOff id="eyeIcon" aria-hidden="true" /> : <Eye id="eyeIcon" aria-hidden="true" />}
                            </Button>
                        )}
                        <CopyLink />
                    </div>
                </header>

                {messages}

                {master && f && f.phase === GamePhase.NIGHT && <NowActing f={f} active={nightChips(f).some((c) => c.key === active) ? active : 'designatedWolf'} setActive={setActive} />}

                {g.players && (
                    <Table players={players} night={night} title={g.title && cap(g.title.toLowerCase().replace(/\s+/, ' '))} seat={seat} arrows={arrows}
                           showRole={showRole} me={g.me?.username} labels={g.selections} onTap={tap} />
                )}

                {!master && g.players && <PlayerCard g={g} />}
                {master && <MasterActions g={g} />}

                <div className="sticky bottom-0 z-30 -mx-4 flex flex-col gap-2 border-t-[3px] border-double border-lf-brass bg-lf-page px-4 pb-4 pt-3 lg:mx-0 lg:px-0">
                    {master && (
                        <Button type="button" id="sendActions" variant="felt" className="min-h-12 w-full text-base disabled:opacity-60"
                                style={{ display: g.sendShown ? 'flex' : 'none' }} disabled={g.sendDisabled} onClick={g.sendActions}>
                            <span className="text" id="textActionsBt">{g.game ? (night ? 'NEW DAY!' : 'NEW NIGHT!') : ''}</span>
                        </Button>
                    )}
                    {!wide && (
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button type="button" id="openDetails" variant="brass" size="touch" className="w-full">
                                    <ChevronUp aria-hidden="true" /> Log · Roles · Settings
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="lf-paper max-h-[85vh] overflow-y-auto !bg-lf-paper text-lf-ink">
                                <SheetHeader>
                                    <SheetTitle className="font-lf-heading">Log · Roles · Settings</SheetTitle>
                                    <SheetDescription className="sr-only">Game details</SheetDescription>
                                </SheetHeader>
                                <div className="px-4 pb-4">{secondary}</div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>

            {wide && (
                <Panel as="aside" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-4" aria-label="Game details">
                    <h2 className="mb-3 font-lf-heading text-base font-bold">Log · Roles · Settings</h2>
                    {secondary}
                </Panel>
            )}

            <AlertDialog open={confirm !== null} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
                <AlertDialogContent className="lf-paper !bg-lf-paper text-lf-ink">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-lf-heading">{CONFIRM[confirm]?.title ?? 'Confirmation required'}</AlertDialogTitle>
                        <AlertDialogDescription id="modalBodyText" className="text-[15px] text-lf-ink">{CONFIRM[confirm]?.body ?? 'Not valid value.'}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel id="modalCancel" className={cn(buttonVariants({ variant: 'brass', size: 'touch' }))}>Cancel</AlertDialogCancel>
                        <AlertDialogAction id="modalConfirm" className={cn(buttonVariants({ variant: confirm === 'endGame' ? 'wax' : 'felt', size: 'touch' }))}
                                           onClick={() => { const v = confirm; setConfirm(null); g.updateSettings(v); }}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

