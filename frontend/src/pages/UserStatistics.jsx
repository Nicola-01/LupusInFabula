import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SearchPlayer from '../components/SearchPlayer.jsx';
import FriendActionButton from '../components/friend/FriendActionButton.jsx';
import PageNotFound from './PageNotFound.jsx';
import { useLoginChecker } from '../utils/session.js';
import {
    contextPath, genericGETRequest, capitalizeFirstLetter,
    HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_FORBIDDEN, JSON_resource_list,
} from '../utils/utils.js';
import { CONTAINER, ROW, TABLE, cell } from '../components/user/shared.js';
import { useSorttable, loadScript, CHART_URL } from '../components/user/externalScripts.js';

/*
 * Port of jsp/user/userStatistics.jsp + js/user/userStatistics.js (route /habitant/:username).
 * The username is first checked with GET api/habitant/{username} (404 -> PageNotFound), then the same three requests
 * as the old page are made: user/<u>/logs, user/<u>/statistic and user/<u>/logs (general statistics).
 */

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

// Games table rows (cells 0..5 and the public id of the link), in the order of the response.
function computeLogs(list) {
    let sizerounds = 0;
    for (const item of list) {
        const len = item['PlaysJoinGame'].number_of_rounds.toString().length;
        if (len > sizerounds) sizerounds = len;
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
            cells: [
                log.start.split('.')[0],
                log.public_id,
                log.game_duration,
                String(log.number_of_rounds).padStart(sizerounds, '0'),
                log.is_game_finished ? capitalizeFirstLetter(log.name) : '*****',
                outcome,
            ],
        };
    });
}

// Roles table: one row per non-master role, the pie data, and the flags used for the message row.
function computeRoles(list) {
    let sizeCountName = 0;
    let sizeCountWins = 0;
    let size = 0;
    let sizeGamesAsMaster = 0;
    for (const item of list) {
        const stats = item['StatsRole'];
        if (stats.name !== 'master') {
            sizeCountName = Math.max(sizeCountName, stats.countName.toString().length);
            sizeCountWins = Math.max(sizeCountWins, stats.countWins.toString().length);
            size += stats.countName;
        } else {
            sizeGamesAsMaster++;
        }
    }
    const pairs = [];
    const rows = [];
    for (const item of list) {
        const stats = item['StatsRole'];
        if (stats.name === 'master') continue;
        pairs.push([capitalizeFirstLetter(stats.name), stats.countName]);
        const percentage = (stats.countName / ((size === 0) ? 1 : size)) * 100;
        rows.push({
            role: capitalizeFirstLetter(stats.name),
            times: String(stats.countName).padStart(sizeCountName, '0'),
            wins: String(stats.countWins).padStart(sizeCountWins, '0'),
            loss: String(stats.countName - stats.countWins).padStart(sizeCountName),
            rate: fmtPct(percentage),
        });
    }
    const hasData = list.length !== 0 && size !== 0;
    return { rows, sizeGamesAsMaster, pairs, hasData };
}

// General statistics table (computed from the games list).
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
    return [
        ["Total time played", totalPlayTime],
        ["Games Played", totalGamesPlayed + totalPendingGame],
        ["Games Won", totalGamesWon],
        ["Games Lost", totalGamesPlayed - totalGamesWon],
        ["Ratio", fmtPct(percentage)],
        ["Games as master", totalGamesAsMaster],
    ];
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

    const canvasRef = useRef(null);
    const rolesTableRef = useRef(null);
    const logsTableRef = useRef(null);
    useSorttable(rolesTableRef);
    useSorttable(logsTableRef);

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

    // Pie chart of the roles (old completePieChart), Chart.js loaded from the CDN as before.
    const pairs = roleData && roleData.hasData ? roleData.pairs : null;
    useEffect(() => {
        if (!pairs) return;
        let chart = null;
        let cancelled = false;
        loadScript(CHART_URL).then(() => {
            if (cancelled || !canvasRef.current) return;
            chart = new window.Chart(canvasRef.current, {
                type: 'pie',
                data: {
                    labels: pairs.map((p) => p[0]),
                    datasets: [{ label: ' Times', data: pairs.map((p) => p[1]), borderWidth: 1 }],
                },
                options: {},
            });
        }).catch(() => {});
        return () => { cancelled = true; chart?.destroy(); };
    }, [pairs]);

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

    // Games table: the old insertRow(0) put each game above the header row, so the rows come reversed and the
    // header ends at the bottom (kept as is). An empty list appends the message row after the header.
    const logsHeader = (n) => (
        <tr key="header">
            <th className={cell(n)}>Date and time</th>
            <th className={cell(n)}>Village</th>
            <th className={cell(n)}>Duration</th>
            <th className={cell(n)}>Rounds</th>
            <th className={cell(n)}>Role played</th>
            <th className={cell(n)}>Outcome</th>
            <th className={cell(n)}>Game history</th>
        </tr>
    );
    let logsBody;
    if (logRows === null) {
        logsBody = [logsHeader(1)];
    } else if (logRows.length === 0) {
        logsBody = [logsHeader(1), (
            <tr key="message">
                <td colSpan={7} className={cell(2)}>
                    {isOwn ? 'You haven\'t taken part in any games yet, create a game now!' : habitant + ' haven\'t taken part in any games yet, invite him now!'}
                </td>
            </tr>
        )];
    } else {
        const reversed = logRows.slice().reverse();
        logsBody = [
            ...reversed.map((row, i) => (
                <tr key={row.publicId + '-' + i}>
                    {row.cells.map((text, c) => <td key={c} className={cell(i + 1)}>{text}</td>)}
                    <td className={cell(i + 1)}>
                        <a href={contextPath + "village/" + row.publicId} target="_blank" rel="noreferrer">View match</a>
                    </td>
                </tr>
            )),
            logsHeader(reversed.length + 1),
        ];
    }

    // Roles table: header row (it is the first row of the tbody, as in the original), role rows, message row.
    const rolesBody = [(
        <tr key="header">
            <th className={cell(1)}>Role</th>
            <th className={cell(1)}>Times</th>
            <th className={cell(1)}>Wins</th>
            <th className={cell(1)}>Loss</th>
            <th className={cell(1)}>Rate</th>
        </tr>
    )];
    if (roleData) {
        roleData.rows.forEach((r, i) => rolesBody.push(
            <tr key={r.role}>
                <td className={cell(i + 2)}>{r.role}</td>
                <td className={cell(i + 2)}>{r.times}</td>
                <td className={cell(i + 2)}>{r.wins}</td>
                <td className={cell(i + 2)}>{r.loss}</td>
                <td className={cell(i + 2)}>{r.rate}</td>
            </tr>
        ));
        if (roleMessage !== null) {
            const n = roleData.rows.length + 2;
            rolesBody.push(
                <tr key="message">
                    <td colSpan={5} className={cell(n)}>{roleMessage}</td>
                </tr>
            );
        }
    }

    return (
        <div className="min-h-screen flex flex-col font-['Jost',sans-serif] bg-bg-first-color text-text-color">
            <Navbar />

            {failure && (
                <div className="relative min-h-[calc(100vh_-_150px)]">
                    {failure === 'login'
                        ? <h1 className="text-center relative min-h-[70vh] mt-0 mb-2 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2]">Please login to check the statistics</h1>
                        : <h1 className="text-center relative min-h-[70vh] mt-0 mb-2 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2]">An unexpected error occurred. Please try again later.</h1>}
                </div>
            )}

            <main className={`${CONTAINER} grow relative ${mainShown ? '' : 'hidden'}`} id="main_class">
                <div className={`${ROW} justify-center my-6`}>
                    <div className="shrink-0 w-full min-[768px]:w-3/4 px-3 mt-12 relative">
                        <SearchPlayer onSearch={searchThePlayer} buttonText="Search!" />
                    </div>
                </div>

                <div className={`${ROW} mb-2`}>
                    <div className="shrink-0 w-3/4 px-3">
                        <h1 id="title" className="mb-0 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mt-0">
                            {habitant && !loading && (isOwn
                                ? 'Your statistics and history'
                                : <>Statistics and history of <b>{habitant}</b></>)}
                        </h1>
                    </div>
                    <div id="friendButtonContainer" className="shrink-0 w-1/4 px-3 h-[45px]">
                        {habitant && <FriendActionButton username={habitant} />}
                    </div>
                </div>

                <div id="background_container" className="bg-bg-second-color rounded-[.6rem] p-4">
                    <div id="block_container">
                        <h2 className="text-[calc(1.3rem_+_0.6vw)] font-medium leading-[1.2] mt-0 mb-2">Statistics</h2>

                        <div>
                            <div className={ROW}>
                                <div className="shrink-0 w-full p-2 min-[992px]:w-1/3 min-[992px]:px-6 min-[1200px]:px-12">
                                    <table id="general_stats" className="m-auto w-full rounded-[.6em] bg-navbar-second-bg text-text-color-fixed border-collapse">
                                        <tbody>
                                            {general && general.map(([label, value]) => (
                                                <tr key={label}>
                                                    <td className="!p-[3px] text-center align-middle h-[46px]">{label}</td>
                                                    <td className="!p-[3px] text-center align-middle h-[46px]">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="shrink-0 w-full p-2 min-[768px]:w-1/2 min-[992px]:w-1/3">
                                    <div id="roles_table_container" className="overflow-auto max-h-[330px]">
                                        <table id="roles_table" ref={rolesTableRef} className={`sortable ${TABLE} mb-4`}>
                                            <tbody>{rolesBody}</tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="shrink-0 w-full p-2 min-[768px]:w-1/2 min-[992px]:w-1/3">
                                    <canvas id="myChart" ref={canvasRef} className="m-auto !w-full !h-full max-w-[350px] max-h-[350px]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div id="block_container2" className="overflow-auto">
                        <h2 className="text-[calc(1.3rem_+_0.6vw)] font-medium leading-[1.2] mt-0 mb-2">History</h2>
                        <div id="logs_table_container" className="overflow-auto max-h-[420px]">
                            <table id="logs_table" ref={logsTableRef} className={`sortable ${TABLE} mb-0`}>
                                <tbody>{logsBody}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );

    // Search: go to the statistics page of the typed player (old searchThePlayer).
    function searchThePlayer() {
        const username = document.getElementById("playerUsername").value;
        if (username.trim() !== "") {
            window.location.href = contextPath + "habitant/" + username;
        } else {
            console.error("Username cannot be empty");
        }
    }
}
