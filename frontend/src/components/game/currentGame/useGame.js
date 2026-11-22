/*
 * State and server traffic of the village page, ported from the old currentGame.js / gameActions.js /
 * playersStatus.js / gameLog.js / gameWebSocket.js. Same requests, same order, same handling of the answers.
 * The model lives in a ref (the old page globals) and every change calls rerender().
 */
import { useEffect, useReducer, useRef } from 'react';
import {
    contextPath, genericGETRequest, genericPOSTRequest, genericPUTRequest, getMessage, getCookie,
    GamePhase, HTTP_STATUS_OK, JSON_resource_list,
} from '../../../utils/utils.js';
import { populateErrorMessage, populateInfoMessage, populateWarningMessage, hideMessagePopup } from '../../../utils/message.js';
import { loadTheme } from '../../Navbar.jsx';
import {
    buildNight, changeDesignatedWolf, enableNight, nightPayload, setValue, buildDay, enableDay, changeSubPhase,
    fillVotes, updatePlague, dayPayload, dayRowById,
} from './gameLogic.js';

/** Maximum number of players for the clickable circle (the old grid above it had no click-to-send). */
export const maxPlayersForCircularButtons = 12;

const done = (req) => req.readyState === XMLHttpRequest.DONE;
const warnBallot = (n) => populateWarningMessage(".warningMessage", "Ballot " + n + " required", "Insert the votes of the " + n + " ballot.");

export function useGame(gameID, endsWithMaster, village) {
    const [, rerender] = useReducer((x) => x + 1, 0);
    const m = useRef(null);
    if (m.current === null) m.current = {
        players: null,          // playsAsIn list
        me: null,               // logged player's playsAsIn
        spectating: false,
        game: null,             // GET game/status answer while the game runs
        over: null,             // GET game/status answer when the game is over
        form: null,             // night or day form (gameLogic.js)
        sendDisabled: true,
        sendShown: false,
        logs: [],
        settings: null,
        config: null,           // GET game/configuration list (players only)
        highlight: new Set(),   // possible targets of the logged player
        noShot: false,
        hidden: false,          // the player's role is hidden (old toggleCard)
        selections: new Map(),  // WS: sender -> target
        sockets: [],
        cur: 0,                 // old state.currentVoteSection
        order: [],              // old state.playersOrder
    };
    const s = m.current;
    const isOver = village?.gameOver != null && village.gameOver >= 0;
    const hasToggle = village != null && !isOver && !village.isMaster; // old #toggleButton

    // ---- WebSocket (old gameWebSocket.js: one socket per players load, the last one sends) -----------------
    const initGameWS = () => {
        const match = window.location.href.match(/(?<room>\w+-\w+-\w+)/);
        if (!(match && match.groups)) { console.warn("No room found"); return; }
        const room = match.groups.room;
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const socket = new WebSocket(protocol + window.location.host + "/gameWS/" + room);
        s.sockets.push(socket);
        socket.onmessage = (event) => {
            const msg = event.data.split(":");
            addSelection(msg[0], msg[1]);
            if (window.location.href.endsWith("master")) updateSelectBox(msg[0], msg[1]);
            rerender();
        };
        socket.onclose = () => console.log("TODO");
    };
    const addSelection = (player, target) => {
        s.selections.delete(player);
        if (s.players?.some((p) => p.username === target)) s.selections.set(player, target);
    };
    const updateSelectBox = (attacker, target) => {
        const raw = localStorage.getItem("playsAsInList");
        const rolesMap = raw ? new Map(JSON.parse(raw)) : new Map();
        const f = s.form;
        if (!f) return;
        // sic: the value is set without running the checks of the form (no change event), as before
        if (localStorage.getItem("phase") === "DAY") {
            const row = f.sections ? dayRowById(f, attacker + "_targets") : null;
            if (row) setValue(row, target);
        } else if (f.slots) {
            const role = rolesMap.get(attacker);
            const slot = f.slots.find((x) => x.id === role + "_targets");
            if (slot) setValue(slot, role === "sheriff" && attacker === target ? "No shot" : target);
        }
    };
    /** Click on a seat (old attachTargetClick): sends the username when the role is visible or during the day. */
    const seatClick = (username) => {
        if (!s.players || s.players.length > maxPlayersForCircularButtons) return;
        const socket = s.sockets[s.sockets.length - 1];
        if (localStorage.getItem("phase") === "DAY" || (hasToggle && !s.hidden))
            if (socket && socket.readyState === WebSocket.OPEN) socket.send(username);
    };

    // ---- loading (old elementsReload / gameStatus / fillPlayersStatus / logElementsReload) ----------------
    const logsReload = (master) => {
        s.logs = [];
        rerender();
        // as before, the last answer wins (no guard between the two requests of the first load)
        genericGETRequest(contextPath + "game/logs/" + gameID + (master ? "/master" : ""), (req) => {
            if (done(req) && req.status === HTTP_STATUS_OK) {
                s.logs = JSON.parse(req.responseText)[JSON_resource_list];
                rerender();
            }
        });
    };

    const fillPlayers = (req) => {
        if (!(done(req) && req.status === HTTP_STATUS_OK)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list == null) { alert("No game settings available"); return; }
        const loggedUser = localStorage.getItem('playerName');
        s.players = list.map((i) => i.playsAsIn);
        localStorage.setItem("playsAsInList", JSON.stringify(Array.from(new Map(s.players.map((p) => [p.username, p.role])).entries())));
        s.me = s.players.find((p) => p.username === loggedUser) ?? null;
        s.spectating = !s.me && !endsWithMaster;
        s.highlight = new Set();
        s.noShot = false;
        s.selections = new Map(); // the old code rebuilt the seats, dropping the vote labels
        genericGETRequest(contextPath + "game/actions/" + gameID, targetHighlight);
        initGameWS();
        if (hasToggle) s.hidden = !s.hidden; // by default, the role is hidden (old toggleCard(true))
        rerender();
    };

    const targetHighlight = (req) => {
        if (endsWithMaster || !(done(req) && req.status === HTTP_STATUS_OK)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list == null) return;
        for (const { actionTarget } of list)
            for (const t of actionTarget.possibleTargets) {
                if (s.players.some((p) => p.username === t.player)) s.highlight.add(t.player);
                else if (t.player === "No shot" && s.me) { s.highlight.add(s.me.username); s.noShot = true; }
            }
        rerender();
    };

    const gameStatus = (req) => {
        if (!(done(req) && req.status === HTTP_STATUS_OK)) return;
        const game = JSON.parse(req.responseText)['game'];
        if (game.who_win !== -1) { s.over = game; rerender(); return; }
        s.game = { round: game.rounds === 0 ? 1 : game.rounds, phase: game.phase };
        localStorage.setItem("phase", game.phase === GamePhase.NIGHT ? "NIGHT" : "DAY");
        logsReload(endsWithMaster);
        if (endsWithMaster) {
            s.sendShown = true;
            genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions);
        }
        rerender();
    };

    const fillGameActions = (req) => {
        if (!(done(req) && req.status === HTTP_STATUS_OK)) return;
        const list = JSON.parse(req.responseText)[JSON_resource_list];
        s.form = null;
        if (list == null) alert("No game settings available");
        else if (s.game.phase === GamePhase.NIGHT) {
            s.form = buildNight(list);
            s.sendDisabled = changeDesignatedWolf(s.form);
        } else s.form = buildDay(list, s.order);
        rerender();
    };

    const elementsReload = () => {
        s.sendDisabled = true;
        const master = endsWithMaster ? "/master" : "";
        genericGETRequest(contextPath + "game/players/" + gameID + master, fillPlayers);
        genericGETRequest(contextPath + "game/status/" + gameID, gameStatus);
        genericGETRequest(contextPath + "game/settings/" + gameID, (req) => {
            // the old page ignored this answer; it is only shown in the Settings tab
            if (done(req) && req.status === HTTP_STATUS_OK) { s.settings = JSON.parse(req.responseText)[JSON_resource_list]; rerender(); }
        });
        rerender();
    };

    useEffect(() => {
        if (!village || village.notFound) return undefined;
        if (hasToggle)
            genericGETRequest(contextPath + "game/configuration/" + gameID, (req) => {
                if (done(req) && req.status === HTTP_STATUS_OK) { s.config = JSON.parse(req.responseText)[JSON_resource_list]; rerender(); }
            });
        // sic (bug.md 38): the first log request is made without /master
        logsReload(false);
        elementsReload();
        return () => { s.sockets.forEach((x) => x.close()); s.sockets = []; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [village]);

    // the dynamic theme reads #gameStatus: apply it after the title is rendered
    const title = s.game ? (s.game.phase === GamePhase.NIGHT ? "NIGHT " : "DAY  ") + s.game.round : null;
    useEffect(() => { if (title) loadTheme(); }, [title]);

    // ---- form events (old change / click listeners) -------------------------------------------------------
    const f = s.form;
    const onNightSelect = (slot, value) => {
        slot.value = value;
        s.sendDisabled = enableNight(f);
        rerender();
    };
    const onDesignated = (value) => {
        f.designated = value;
        enableNight(f);
        s.sendDisabled = changeDesignatedWolf(f);
        rerender();
    };
    const onDaySelect = (row, value) => {
        row.value = value;
        s.sendDisabled = enableDay(f, warnBallot);
        rerender();
    };
    const onRadio = (sub) => {
        if (f.radios.disabled[sub]) return;
        const r = changeSubPhase(f, sub, s.cur, warnBallot);
        s.cur = r.cur;
        if (r.disable !== undefined) s.sendDisabled = r.disable;
        if (r.load)
            genericGETRequest(contextPath + "game/players/" + gameID + "/master", (req) => {
                if (!(done(req) && req.status === HTTP_STATUS_OK)) return;
                const list = JSON.parse(req.responseText)[JSON_resource_list];
                if (list == null) alert("No game settings available");
                else fillVotes(f, list);
                rerender();
            });
        rerender();
    };
    const onPlague = (row) => {
        row.checked = !row.checked;
        updatePlague(f);
        rerender();
    };

    const variableResets = () => {
        s.cur = -1;
        s.order = [];
        s.form = null;
    };

    const sendActions = () => {
        const json = f.phase === GamePhase.NIGHT ? nightPayload(f) : dayPayload(f);
        const phaseWas = f.phase;
        genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), (req) => {
            if (req.status !== HTTP_STATUS_OK) {
                const msg = getMessage(req);
                populateErrorMessage(".errorMessage", msg.message, msg.errorCode, msg.errorDetails);
                return;
            }
            hideMessagePopup(".warningMessage");
            const res = JSON.parse(req.responseText);
            let phaseInfo = "";
            if (Object.prototype.hasOwnProperty.call(res, 'gameWin')) {
                phaseInfo = res.gameWin.players.map((p) => p.player).join(", ");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                populateInfoMessage(".infoMessage", res.gameWin.message, phaseInfo);
                location.reload();
                return;
            }
            let deadPlayers, phase;
            if (phaseWas === GamePhase.NIGHT) {
                const r = res.nightActionsResults;
                phase = "night";
                deadPlayers = r.deadPlayers.length === 0 ? "No deaths during the night."
                    : "Deaths of the night: " + r.deadPlayers.map((p) => p.player).join(", ");
                if (r.dorkyIsWolf) phaseInfo += "<br>The Dorky became a wolf!";
                if (r.puppyIsWolf) phaseInfo += "<br>The puppy became a wolf!";
                if (r.plaguedPlayer !== "") phaseInfo += "<br> " + r.plaguedPlayer + " has the plague!";
            } else {
                const r = res.dayActionsResults;
                phase = "day";
                deadPlayers = r.votedPlayer !== "" ? r.votedPlayer + " was voted out" : "No players were voted out.";
                if (r.samTarget !== "") phaseInfo += "<br>" + r.samTarget + " was killed by sam:";
                if (r.carpenterAbility) phaseInfo += "<br> the carpenter refused to give wood";
                if (r.plaguePlayers.length !== 0)
                    phaseInfo += "<br>Player(s) killed by the plague:<br>" + r.plaguePlayers.map((p) => p.player).join(", ");
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            populateInfoMessage(".infoMessage", "Results of the " + phase + "!", deadPlayers + phaseInfo);
            variableResets();
            elementsReload();
        });
    };

    /** Settings of the master (old gameSettings.js): PUT game/update/<id>, reload on success. */
    const updateSettings = (value, onError) => {
        genericPUTRequest(contextPath + "game/update/" + gameID, JSON.stringify({ "settings": value }), (req) => {
            if (done(req)) {
                if (req.status === HTTP_STATUS_OK) location.reload();
                else {
                    onError?.();
                    const msg = getMessage(req);
                    populateErrorMessage(".errorMessage", msg.message, msg.errorCode, msg.errorDetails);
                }
            }
        });
    };

    const toggleCard = () => { s.hidden = !s.hidden; rerender(); };

    return {
        ...s, isOver, hasToggle, title, endsWithMaster, cardBack: getCookie("selectedCard"),
        onNightSelect, onDesignated, onDaySelect, onRadio, onPlague, sendActions, updateSettings, toggleCard, seatClick,
    };
}
