import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FACTIONS, FactionBadge, Ornament, Panel, RoleIcon } from '@/components/lupus';
import Navbar from '../components/Navbar.jsx';
import SearchPlayer from '../components/SearchPlayer.jsx';
import FriendActionButton from '../components/friend/FriendActionButton.jsx';
import PageNotFound from './PageNotFound.jsx';
import { useLoginChecker } from '../utils/session.js';
import {
    contextPath, genericGETRequest, capitalizeFirstLetter,
    HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_FORBIDDEN, JSON_resource_list,
} from '../utils/utils.js';

/*
 * Port of jsp/user/userStatistics.jsp + js/user/userStatistics.js (route /habitant/:username).
 * The username is first checked with GET api/habitant/{username} (404 -> PageNotFound), then the same three requests
 * as the old page are made: user/<u>/logs, user/<u>/statistic and user/<u>/logs (general statistics).
 * Charts and sorting are plain SVG/CSS and a React-sorted table (no Chart.js / sorttable).
 */

// shortcut: static role -> faction map, the statistic API has no role type; upgrade by adding the type to the response.
const FACTION_OF_ROLE = {
    carpenter: 'good', farmer: 'good', hobbit: 'good', kamikaze: 'good', knight: 'good', mason: 'good',
    medium: 'good', sam: 'good', seer: 'good', sheriff: 'good',
    berserker: 'evil', dorky: 'evil', explorer: 'evil', giuda: 'evil', puppy: 'evil', wolf: 'evil',
    hamster: 'stealer', jester: 'stealer',
    illusionist: 'neutral', 'plague spreader': 'neutral',
};
const factionColor = (role) => FACTIONS.find((f) => f.id === FACTION_OF_ROLE[role])?.color;
const STRIPES = 'repeating-linear-gradient(45deg, rgba(0,0,0,.22) 0 3px, transparent 3px 7px)';

// Ratio/percentage text as the old code: one decimal only when not a whole number.
function fmtPct(percentage) {
    const rounded = Math.round(percentage * 10) / 10;
    return (rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)) + "%";
}

// Sum of two HH:MM:SS strings.
function sumTime(times1, times2) {
    const getSeconds = (t) => {
        const p = t.split(':');
        return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60 + parseInt(p[2], 10);
    };
    const format = (seconds) => [
        Math.floor(seconds / 3600),
        Math.floor(seconds % 3600 / 60),
        seconds % 60,
    ].map((v) => v < 10 ? '0' + v : v).join(':');
    return format(getSeconds(times1) + getSeconds(times2));
}

// Game rows in the order of the response (roundsText is zero-padded as in the old table).
function computeLogs(list) {
    let sizerounds = 0;
    for (const item of list) {
        sizerounds = Math.max(sizerounds, item['PlaysJoinGame'].number_of_rounds.toString().length);
    }
    return list.map((item) => {
        const log = item['PlaysJoinGame'];
        let outcome = '-';
        if (log.is_game_finished) {
            if (log.name !== 'master')
                outcome = log.who_wins === 'draw' ? 'Draw' : (log.has_won ? 'Victory' : 'Defeat');
            else
                outcome = capitalizeFirstLetter(log.who_wins);
        }
        return {
            publicId: log.public_id,
            start: log.start.split('.')[0],
            duration: log.game_duration,
            rounds: log.number_of_rounds,
            roundsText: String(log.number_of_rounds).padStart(sizerounds, '0'),
            role: log.is_game_finished ? capitalizeFirstLetter(log.name) : '*****',
            outcome,
        };
    });
}

// One entry per non-master role, plus the counts used for the message texts.
function computeRoles(list) {
    let size = 0;
    let sizeGamesAsMaster = 0;
    const rows = [];
    for (const item of list) {
        const stats = item['StatsRole'];
        if (stats.name === 'master') {
            sizeGamesAsMaster++;
            continue;
        }
        size += stats.countName;
        rows.push({
            key: stats.name,
            role: capitalizeFirstLetter(stats.name),
            times: stats.countName,
            wins: stats.countWins,
            losses: stats.countName - stats.countWins,
        });
    }
    return { rows, sizeGamesAsMaster, hasData: list.length !== 0 && size !== 0 };
}

// General statistics (computed from the games list).
function computeGeneral(list) {
    let totalPlayTime = "00:00:00";
    let totalGamesAsMaster = 0;
    let totalGamesWon = 0;
    let totalPendingGame = 0;
    for (const item of list) {
        const log = item['PlaysJoinGame'];
        totalPendingGame += (log.is_game_finished) ? 0 : 1;
        if (log.name !== "master") {
            totalPlayTime = sumTime(totalPlayTime, log.is_game_finished ? log.game_duration : "00:00:00");
            totalGamesWon += (log.has_won && log.is_game_finished) ? 1 : 0;
        } else {
            totalGamesAsMaster += (log.is_game_finished) ? 1 : 0;
        }
    }
    const totalGamesPlayed = list.length - totalGamesAsMaster - totalPendingGame;
    const percentage = ((totalGamesPlayed === 0) ? 0 : (totalGamesWon / totalGamesPlayed)) * 100;
    return {
        totalPlayTime,
        gamesPlayed: totalGamesPlayed + totalPendingGame,
        gamesWon: totalGamesWon,
        gamesLost: totalGamesPlayed - totalGamesWon,
        winRate: percentage,
        gamesAsMaster: totalGamesAsMaster,
    };
}

const SORTS = {
    start: (a, b) => a.start.localeCompare(b.start),
    publicId: (a, b) => a.publicId.localeCompare(b.publicId),
    duration: (a, b) => a.duration.localeCompare(b.duration),
    rounds: (a, b) => a.rounds - b.rounds,
    role: (a, b) => a.role.localeCompare(b.role),
    outcome: (a, b) => a.outcome.localeCompare(b.outcome),
};

const COLUMNS = [
    { key: 'start', label: 'Date and time' },
    { key: 'publicId', label: 'Village' },
    { key: 'duration', label: 'Duration' },
    { key: 'rounds', label: 'Rounds' },
    { key: 'role', label: 'Role played' },
    { key: 'outcome', label: 'Outcome' },
];

function SortHead({ col, sort, onSort }) {
    const active = sort.key === col.key;
    const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
    return (
        <TableHead
            aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="font-lf-heading text-[13px] tracking-wide text-lf-ink"
        >
            <button
                type="button"
                onClick={() => onSort(col.key)}
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lf-focus"
            >
                {col.label}
                <Icon className={cn('size-3.5', active ? 'text-lf-rubric' : 'text-lf-ink2')} aria-hidden="true" />
            </button>
        </TableHead>
    );
}

// Victory: green ribbon. Defeat: wax seal. Other values: plain italic.
function Outcome({ value }) {
    if (value === 'Victory') {
        return (
            <span className="inline-flex items-center gap-1 bg-lf-felt px-4 py-0.5 text-sm font-bold text-lf-on-felt [clip-path:polygon(0_0,100%_0,calc(100%-8px)_50%,100%_100%,0_100%,8px_50%)]">
                <Check className="size-3.5" aria-hidden="true" />{value}
            </span>
        );
    }
    if (value === 'Defeat') {
        return <span className="inline-flex items-center rounded-[48%_52%_50%_50%] bg-lf-wax px-2.5 py-0.5 text-sm font-bold text-lf-wax-text">{value}</span>;
    }
    return <span className="text-sm italic text-lf-ink2">{value}</span>;
}

// Wins (solid) and losses (striped) of one role, coloured by its faction.
function Bar({ role, max }) {
    const color = factionColor(role.key);
    return (
        <li className="grid grid-cols-[7rem_1fr_4.5rem] items-center gap-3 text-sm">
            <span className="flex items-center gap-2 font-lf-heading font-semibold">
                <RoleIcon role={role.key} className="w-4 text-center" />
                {role.role}
            </span>
            <div className="flex h-6 overflow-hidden rounded-[2px] border border-lf-ink2 bg-black/5"
                role="img" aria-label={`${role.role}: ${role.wins} wins, ${role.losses} losses`}>
                <div style={{ width: `${(role.wins / max) * 100}%`, backgroundColor: color }} />
                <div style={{ width: `${(role.losses / max) * 100}%`, backgroundColor: color, backgroundImage: STRIPES }} />
            </div>
            <span className="text-right tabular-nums">{role.wins}W {role.losses}L</span>
        </li>
    );
}

// Donut: wins arc over a losses track. r=15.9155 gives a circumference of 100, so dash values are percentages.
function WinRing({ pct }) {
    return (
        <div className="relative mx-auto size-44">
            <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`Win rate ${fmtPct(pct)}`}>
                <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="5" style={{ stroke: 'var(--lf-wax)' }} />
                <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="5" pathLength="100"
                    strokeDasharray={`${pct} ${100 - pct}`} style={{ stroke: 'var(--lf-felt)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-lf-title text-3xl">{fmtPct(pct)}</span>
                <span className="text-xs uppercase tracking-widest text-lf-ink2">win rate</span>
            </div>
        </div>
    );
}

function Tile({ label, value, sub }) {
    return (
        <Panel className="flex flex-col gap-1 p-4 text-center">
            <span className="font-lf-heading text-xs uppercase tracking-widest text-lf-ink2">{label}</span>
            <span className="font-lf-title text-2xl">{value}</span>
            {sub && <span className="text-sm text-lf-ink2">{sub}</span>}
        </Panel>
    );
}

export default function UserStatistics() {
    const { username: requested } = useParams();
    const { user, loading } = useLoginChecker();

    const [habitant, setHabitant] = useState(undefined); // undefined = checking, null = not found, string = canonical name
    const [failure, setFailure] = useState(null);        // null | 'login' | 'unexpected' (old #error_message)
    const [mainShown, setMainShown] = useState(false);   // old #main_class display
    const [logRows, setLogRows] = useState(null);        // null = not loaded / failed
    const [roleData, setRoleData] = useState(null);      // null = not loaded / failed
    const [general, setGeneral] = useState(null);        // null = not loaded / failed
    const [sort, setSort] = useState({ key: 'start', dir: 'desc' });

    const handleError = (status) => {
        setFailure(status === HTTP_STATUS_FORBIDDEN ? 'login' : 'unexpected');
        if (status !== HTTP_STATUS_FORBIDDEN) alert("Unexpected error");
    };

    const handleHttpStatus = (req) => {
        if (req.status === HTTP_STATUS_OK) {
            setMainShown(true);
            return true;
        }
        handleError(req.status);
        return false;
    };

    useEffect(() => {
        genericGETRequest(contextPath + "api/habitant/" + requested, (req) => {
            if (req.readyState !== XMLHttpRequest.DONE) return;
            if (req.status === HTTP_STATUS_OK) setHabitant(JSON.parse(req.responseText).username);
            else if (req.status === HTTP_STATUS_NOT_FOUND) setHabitant(null);
            else if (req.status === 401 || req.status === HTTP_STATUS_FORBIDDEN) setFailure('login');
            else handleError(req.status);
        });
    }, [requested]);

    const getLogs = (req) => {
        if (req.readyState !== XMLHttpRequest.DONE) return;
        if (!handleHttpStatus(req)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list == null) {
            alert("User Not Existing");
            return;
        }
        setLogRows(computeLogs(list));
    };

    const getStatsRole = (req) => {
        if (req.readyState !== XMLHttpRequest.DONE) return;
        if (!handleHttpStatus(req)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list == null) {
            alert("User Not Existing");
            return;
        }
        setRoleData(computeRoles(list));
    };

    const getGeneralStats = (req) => {
        if (req.readyState !== XMLHttpRequest.DONE) return;
        if (!handleHttpStatus(req)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list == null) {
            alert("User Not Existing");
            return;
        }
        setGeneral(computeGeneral(list));
    };

    useEffect(() => {
        if (!habitant) return;
        genericGETRequest(contextPath + "user/" + habitant + "/logs", getLogs);
        genericGETRequest(contextPath + "user/" + habitant + "/statistic", getStatsRole);
        genericGETRequest(contextPath + "user/" + habitant + "/logs", getGeneralStats);
    }, [habitant]);

    const sortedLogs = useMemo(() => {
        if (logRows === null) return null;
        const cmp = SORTS[sort.key];
        const dir = sort.dir === 'asc' ? 1 : -1;
        return [...logRows].sort((a, b) => dir * cmp(a, b));
    }, [logRows, sort]);

    const onSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));

    if (habitant === null) return <PageNotFound />;

    const isOwn = habitant !== undefined && habitant === user?.username;
    // Old message texts: the requested name is lower-cased in these (same as the original code).
    const requestedLower = (habitant ?? '').toLowerCase();
    const loggedLower = (user?.username ?? '').toLowerCase();
    const logsEmpty = logRows !== null && logRows.length === 0;

    let roleMessage = null;
    if (roleData && !roleData.hasData) {
        const same = requestedLower === loggedLower;
        if (roleData.sizeGamesAsMaster > 0)
            roleMessage = same ? "You have played only as master, play a game now!" : requestedLower + " has only played as master, invite him now!";
        else if (!logsEmpty)
            roleMessage = same ? "The match is not finished yet" : requestedLower + " is still in a match";
        else
            roleMessage = same ? "You haven't taken part in any games yet, create a game now!" : requestedLower + " haven't taken part in any games yet, invite him now!";
    }

    const topRole = roleData?.hasData
        ? [...roleData.rows].sort((a, b) => b.times - a.times)[0]
        : null;
    const tiedWithTop = topRole ? roleData.rows.filter((r) => r.times === topRole.times).length - 1 : 0;
    const barMax = roleData ? Math.max(1, ...roleData.rows.map((r) => r.times)) : 1;
    const dash = '–';

    // Search: go to the statistics page of the typed player (old searchThePlayer).
    function searchThePlayer() {
        const username = document.getElementById("playerUsername").value;
        if (username.trim() !== "") {
            window.location.href = contextPath + "habitant/" + username;
        } else {
            console.error("Username cannot be empty");
        }
    }

    return (
        <div className="lf-page min-h-screen flex flex-col font-lf-body text-lf-ink">
            <Navbar />

            {failure && (
                <div className="relative min-h-[calc(100vh_-_150px)]">
                    <h1 className="text-center relative min-h-[70vh] mt-0 mb-2 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2]">
                        {failure === 'login'
                            ? 'Please login to check the statistics'
                            : 'An unexpected error occurred. Please try again later.'}
                    </h1>
                </div>
            )}

            <main className={cn('mx-auto w-full max-w-[1100px] grow flex flex-col gap-6 px-4 py-6', mainShown ? '' : 'hidden')} id="main_class">
                <div className="mx-auto w-full max-w-md">
                    <SearchPlayer onSearch={searchThePlayer} buttonText="Search!" />
                </div>

                <Panel className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
                    <h1 id="title" className="min-w-0 text-center font-lf-title text-2xl sm:text-left sm:text-3xl">
                        {habitant && !loading && (isOwn
                            ? 'Your statistics and history'
                            : <>Statistics and history of <span className="text-lf-rubric">{habitant}</span></>)}
                    </h1>
                    <div id="friendButtonContainer" className="shrink-0 min-h-11">
                        {habitant && <FriendActionButton username={habitant} />}
                    </div>
                </Panel>

                <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Tile
                        label="Games played"
                        value={general ? general.gamesPlayed : dash}
                        sub={general ? `${general.totalPlayTime} played · ${general.gamesAsMaster} as master` : undefined}
                    />
                    <Tile
                        label="Wins"
                        value={general ? general.gamesWon : dash}
                        sub={general ? `${general.gamesLost} losses` : undefined}
                    />
                    <Tile label="Win rate" value={general ? fmtPct(general.winRate) : dash} />
                    <Tile
                        label="Usually plays as"
                        value={topRole ? topRole.role : dash}
                        sub={topRole && (tiedWithTop > 0
                            ? `tied with ${tiedWithTop} other${tiedWithTop > 1 ? 's' : ''}`
                            : `${topRole.times} games`)}
                    />
                </section>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <Panel className="flex flex-col gap-4">
                        <h2 className="font-lf-heading text-xl text-lf-rubric">Wins and losses by role</h2>
                        <Ornament />
                        {roleData?.hasData && (
                            <ul className="flex flex-col gap-3">
                                {roleData.rows.map((r) => <Bar key={r.key} role={r} max={barMax} />)}
                            </ul>
                        )}
                        {roleMessage !== null && <p className="text-sm italic text-lf-ink2">{roleMessage}</p>}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-lf-ink2">
                            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-5 border border-lf-ink2 bg-lf-ink2" />Wins (solid)</span>
                            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-5 border border-lf-ink2 bg-lf-ink2" style={{ backgroundImage: STRIPES }} />Losses (striped)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {FACTIONS.map((f) => <FactionBadge key={f.id} faction={f.id} />)}
                        </div>
                    </Panel>

                    <Panel className="flex flex-col gap-4">
                        <h2 className="font-lf-heading text-xl text-lf-rubric">Win rate</h2>
                        <Ornament />
                        <WinRing pct={general ? general.winRate : 0} />
                        <p className="text-center text-sm text-lf-ink2">
                            {general ? `${general.gamesWon} wins out of ${general.gamesWon + general.gamesLost} games` : dash}
                        </p>
                    </Panel>
                </div>

                <Panel className="flex flex-col gap-4">
                    <h2 className="font-lf-heading text-xl text-lf-rubric">Game history</h2>
                    <Ornament />
                    {logsEmpty && (
                        <p className="text-sm italic text-lf-ink2">
                            {isOwn ? 'You haven\'t taken part in any games yet, create a game now!' : habitant + ' haven\'t taken part in any games yet, invite him now!'}
                        </p>
                    )}
                    {/* The ui Table scrolls horizontally on its own wrapper (390px). */}
                    <Table id="logs_table" className="min-w-[640px]">
                        <TableHeader>
                            <TableRow className="border-b-2 border-lf-brass hover:bg-transparent">
                                {COLUMNS.map((c) => <SortHead key={c.key} col={c} sort={sort} onSort={onSort} />)}
                                <TableHead className="font-lf-heading text-[13px] tracking-wide text-lf-ink">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedLogs?.map((g, i) => (
                                <TableRow key={g.publicId + '-' + i} className="border-lf-brass/40 even:bg-black/5">
                                    <TableCell>{g.start}</TableCell>
                                    <TableCell className="font-mono text-[13px]">{g.publicId}</TableCell>
                                    <TableCell className="tabular-nums">{g.duration}</TableCell>
                                    <TableCell className="tabular-nums">{g.roundsText}</TableCell>
                                    <TableCell>{g.role}</TableCell>
                                    <TableCell><Outcome value={g.outcome} /></TableCell>
                                    <TableCell>
                                        <a href={contextPath + "village/" + g.publicId} target="_blank" rel="noreferrer"
                                            className="inline-flex min-h-11 items-center !text-lf-rubric underline decoration-lf-brass underline-offset-4">
                                            View match
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Panel>
            </main>

        </div>
    );
}
