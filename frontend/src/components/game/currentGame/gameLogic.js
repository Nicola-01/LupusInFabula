/*
 * Game logic of the master's form, ported 1:1 from the old imperative gameActions.js / gameLog.js.
 * The old code kept its state in the DOM (select values, attributes, element order); here the same state is a
 * plain object ("form") that the functions mutate in the same order as the old code mutated the DOM.
 * DOM lookups are mapped as: getElementById(x) -> first element with that id in DOM order,
 * querySelectorAll('#votes_i [id*="_targets"]') -> rows of every section with that sub-phase, in DOM order.
 */
import { capitalizeFirstLetter, getRoleType, GamePhase, rolesColors, evilAction, neutralAction } from '../../../utils/utils.js';

/** List of roles seen as evil. */
const rolesSeeAsEvil = ["berserker", "dorky", "explorer", "wolf"];
const TYPE_ORDER = ["evil", "neutral", "good", "victory stealer"]; // order of the role divs in #gameActions

/** A select of the form (old getActionWrapper). */
function makeSelect(actionTarget, text, gamePhase, memberOfWolfPack = false) {
    const possibleTargets = actionTarget.possibleTargets;
    const dead = possibleTargets.length === 0 || (possibleTargets.length === 1 && possibleTargets[0].player === "No rage");
    const s = {
        id: gamePhase === GamePhase.NIGHT ? actionTarget.role + "_targets" : actionTarget.player + "_targets",
        role: actionTarget.role,
        player: null,
        wolf: memberOfWolfPack,
        dead,
        disabled: dead,
        defaultDisabled: !dead,
        defaultText: dead ? "DEAD" : "Select option",
        options: possibleTargets.map((t) => t.player),
        value: "",
        blocked: null,
        bg: "",
        text,
    };
    if (gamePhase === GamePhase.NIGHT) {
        if (!memberOfWolfPack && actionTarget.players.length > 0) s.player = actionTarget.players[0].player;
    } else s.player = actionTarget.player;
    return s;
}

/** Sets a select value like `select.value = v` does (unknown values give ""). */
export function setValue(s, v) {
    s.value = s.options.includes(v) ? v : "";
}

// ---- night ---------------------------------------------------------------------------------------------

/** Builds the night form from GET game/actions/<id>/master (old fillNightActions, without the final changeDesignatedWolf). */
export function buildNight(list) {
    const wolfPack = [];
    const groups = { evil: [], neutral: [], good: [], "victory stealer": [] };
    const wolves = [];
    let berserkAlreadyInsert = false;
    for (const { actionTarget } of list) {
        const u = (role) => ({ role, color: rolesColors.get(role) });
        if (["maul", "rage", "explore"].includes(actionTarget.action)) {
            for (const w of actionTarget.players)
                if (!wolfPack.some((p) => p.player === w.player)) wolfPack.push({ player: w.player, role: actionTarget.role });
            let text;
            if (berserkAlreadyInsert) text = { pre: "Against whom the ", ...u(actionTarget.role), post: " rages?" };
            else {
                if (actionTarget.action === "rage") berserkAlreadyInsert = true;
                text = { pre: "Who is the target of ", ...u(actionTarget.role), post: "?" };
            }
            wolves.push(makeSelect(actionTarget, text, GamePhase.NIGHT, true));
        } else {
            const g = groups[getRoleType(actionTarget.role)];
            if (g) g.push(makeSelect(actionTarget, { pre: "Who is the target of ", ...u(actionTarget.role), post: "?" }, GamePhase.NIGHT));
        }
    }
    const slots = [...wolves, ...TYPE_ORDER.flatMap((t) => groups[t].map((s) => ({ ...s, group: t })))];
    wolves.forEach((s) => { s.group = "wolves"; });
    return { phase: GamePhase.NIGHT, wolfPack, designated: "", slots };
}

const byId = (form, id) => form.slots.find((s) => s.id === id);
const wolfPackContainRole = (form, role) => form.wolfPack.some((w) => w.role === role);
const wolfPackContainPlayer = (form, player) => form.wolfPack.some((w) => w.player === player);
const playerWolfPackRole = (form, player) => form.wolfPack.find((w) => w.player === player)?.role ?? null;
export const designatedRole = (form) => playerWolfPackRole(form, form.designated);

/** sic: the old code read the role from the "#<player>_status" innerHTML split on <br>/spaces, which gives "<div"
 * for everyone outside the wolf pack, so only wolf pack members can be seen as evil. Kept as is. */
function isPlayerSeesAsEvil(form, player) {
    return wolfPackContainPlayer(form, player) && rolesSeeAsEvil.includes(playerWolfPackRole(form, player));
}

function block(s) {
    s.defaultText = "BLOCKED";
    s.value = "";
    // Send the first element as default if the user is blocked; the backend discards that action.
    s.blocked = s.options[0] ?? "";
    s.bg = "";
    s.disabled = true;
}

/** Old enableButtons() for the night. Returns the `disabled` flag of #sendActions. */
export function enableNight(form) {
    const slots = form.slots;
    const dRole = designatedRole(form);
    for (const cur of slots) {
        if (cur.role === "illusionist") {
            const illusionistTarget = cur.value;
            for (const s of slots) {
                if (s.blocked !== null) {
                    s.disabled = false;
                    s.blocked = null;
                    s.defaultText = "Select a target";
                    s.value = "";
                }
            }
            if (wolfPackContainPlayer(form, illusionistTarget)) {
                const targetElem = byId(form, playerWolfPackRole(form, illusionistTarget) + "_targets");
                if (form.designated === illusionistTarget) block(targetElem);
            } else {
                for (const s of slots) if (s.player === illusionistTarget) block(s);
            }
        } else if (cur.role === "seer" || cur.role === "medium") {
            if (cur.blocked !== null || cur.value === "") continue;
            cur.bg = isPlayerSeesAsEvil(form, cur.value) ? 'var(--target-color-evil)' : 'var(--target-color-good)';
        }
    }

    let disable = form.designated === "";
    for (let i = 0; i < slots.length && !disable; i++) {
        const s = slots[i];
        if (wolfPackContainRole(form, s.role)) {
            if (s.blocked !== null) continue;
            else if (dRole === s.role) disable = s.value === "";
            else disable = s.value !== "";
        } else {
            if (s.blocked !== null || s.dead) continue;
            disable = s.value === "";
        }
    }
    return disable;
}

/** Old changeDesignatedWolf(): resets the wolf pack selects, then enableButtons(). */
export function changeDesignatedWolf(form) {
    const dRole = designatedRole(form);
    for (const s of form.slots) {
        if (!s.wolf) continue;
        s.disabled = s.role !== dRole;
        s.defaultText = s.role !== dRole ? "Not the designated role" : "Select a target";
        s.value = "";
    }
    return enableNight(form);
}

/** Body of POST game/actions/<id> for the night (old sendActions). */
export function nightPayload(form) {
    const dRole = designatedRole(form);
    const gameAction = [];
    for (const s of form.slots) {
        if (s.dead) continue;
        let player = s.player;
        const role = s.role;
        const target = s.blocked !== null ? s.blocked : s.value;
        if (s.wolf) {
            if (dRole === s.role) player = form.designated;
            else continue;
        }
        if ((role === "sheriff" && target.toLowerCase() === "no shot") || (role === "berserker" && target.toLowerCase() === "no rage"))
            continue;
        gameAction.push({ player, role, target });
    }
    return { gameAction };
}

// ---- day -----------------------------------------------------------------------------------------------

/** Builds the day form (old fillDayActions). `order` is the plague players order (old state.playersOrder). */
export function buildDay(list, order) {
    const form = {
        phase: GamePhase.DAY,
        sections: [{ sub: 0, hidden: false, rows: [] }],
        radios: { checked: 0, disabled: [false, true, true] },
        sam: null,
        samShown: false,
        plague: null,
        samPlayer: undefined,
        plagueSpreader: undefined,
        order,
    };
    for (const { actionTarget } of list) {
        switch (actionTarget.action) {
            case "revenge":
                form.samPlayer = actionTarget.player;
                form.sam = { ...makeSelect(actionTarget, { pre: "Who does ", role: "sam", color: rolesColors.get("sam"), label: "Sam", post: " want to kill?" }, GamePhase.DAY), id: "sam_SB" };
                break;
            case "plague": {
                form.plagueSpreader = actionTarget.player;
                for (const t of actionTarget.possibleTargets) order.push(t.player);
                const plagued = order[0];
                if (plagued == null) break;
                order.splice(0, 1); // the first player is the one with the plague
                form.plague = [{ player: plagued, original: true, checked: false }];
                break;
            }
            default:
                form.sections[0].rows.push(makeSelect(actionTarget, { pre: "Who ", voter: actionTarget.player, post: " voted out?" }, GamePhase.DAY));
        }
    }
    return form;
}

/** Rows of `#votes_<sub> [id*="_targets"]`. */
export const rowsOf = (form, sub) => form.sections.filter((s) => s.sub === sub).flatMap((s) => s.rows);
const firstSection = (form, sub) => form.sections.find((s) => s.sub === sub);
/** First day select with that id (old getElementById). */
export const dayRowById = (form, id) => form.sections.flatMap((s) => s.rows).find((r) => r.id === id);

/** Old getMostVotedPlayers(section). */
export function getMostVotedPlayers(form, currentSection) {
    const voteResults = new Map();
    for (const r of rowsOf(form, currentSection)) voteResults.set(r.value, voteResults.has(r.value) ? voteResults.get(r.value) + 1 : 1);
    const mapSort = new Map([...voteResults.entries()].sort((a, b) => b[1] - a[1]));
    let previousValue = Array.from(mapSort.values())[0];
    let selected = 0;
    for (const value of mapSort.values()) {
        if (previousValue === value) selected++;
        else if (selected < 2 && currentSection === 0) {
            previousValue = value;
            if (value === 0) break;
            selected++;
        } else break;
    }
    return Array.from(mapSort.keys()).slice(0, selected).map((player) => ({ player }));
}

/** Old enableButtons() for the day. `warn(n)` shows the "Ballot n required" popup. Returns the #sendActions disabled flag. */
export function enableDay(form, warn) {
    let samShown = false;
    let disable = false;
    const maxPhase = 3; // one vote and 2 ballots
    for (let i = 0; i < maxPhase; i++) {
        const rows = rowsOf(form, i);
        if (rows.length === 0) break;
        if (rows.every((r) => r.value !== "")) {
            const voted = getMostVotedPlayers(form, i);
            if (voted.length < 2) {
                if (voted[0].player === form.samPlayer) samShown = true;
                if (i + 1 < maxPhase) form.radios.disabled[i + 1] = true;
                disable = false;
                break;
            } else {
                if (i + 1 < maxPhase) {
                    form.radios.disabled[i + 1] = false;
                    warn(i + 1);
                }
                disable = true;
            }
        } else {
            for (let j = i + 1; j < 3; j++) form.radios.disabled[j] = true;
            disable = true;
            break;
        }
    }
    if (form.sam) {
        form.samShown = samShown;
        if (samShown) disable = form.sam.value === "";
        else form.sam.value = "";
    }
    return disable;
}

/**
 * Old changeSubPhase(). `cur` is the current vote section (old state.currentVoteSection).
 * Returns {cur, load, disable}: load = true when the players must be requested (fillVotes),
 * disable = new #sendActions flag or undefined when unchanged.
 */
export function changeSubPhase(form, sub, cur, warn) {
    form.radios.checked = sub; // the click checks the radio before the handler runs
    if (sub === cur) return { cur, load: false };
    if (sub > cur) {
        form.sections.unshift({ sub, hidden: false, rows: [] }); // inserted right after the radio buttons
        for (let index = sub - 1; firstSection(form, index); index--) firstSection(form, index).hidden = true;
        return { cur: sub, load: true };
    }
    const shown = firstSection(form, sub);
    if (shown) shown.hidden = false;
    for (let index = sub + 1; firstSection(form, index); index++) {
        form.sections.splice(form.sections.indexOf(firstSection(form, index)), 1);
        form.radios.disabled[index] = true;
    }
    return { cur: sub, load: false, disable: enableDay(form, warn) };
}

/** Old fillVotes(): adds the ballot rows to the section of the checked radio. */
export function fillVotes(form, list) {
    const currentSection = form.radios.checked;
    const section = firstSection(form, currentSection);
    if (!section) return;
    const voted = getMostVotedPlayers(form, currentSection - 1);
    for (const { playsAsIn: p } of list) {
        if (!p.isDead && !voted.some((v) => v.player === p.username))
            section.rows.push(makeSelect({ player: p.username, role: p.role, possibleTargets: voted }, { pre: "Who ", voter: p.username, post: " voted out?" }, GamePhase.DAY));
    }
}

/** Old updatePlaguesVictims(), run after the click toggled the checkbox. */
export function updatePlague(form) {
    const order = form.order;
    const first = (p) => form.plague.find((r) => r.player === p);
    let original = "";
    const playersPlague = order.map((p) => {
        const cb = first(p);
        if (cb && cb.original) original = p;
        return { player: p, value: cb ? cb.checked : false };
    });
    const n = order.length;
    const io = order.indexOf(original);
    if (io < 0) return; // old code threw a TypeError here
    const rows = [{ player: original, original: true, checked: playersPlague[io].value }];
    let insertPlayers = 1;
    for (let i = io; i < n + io - 1; i++) {
        if (playersPlague[(i + n) % n].value) {
            rows.push({ player: order[(i + 1) % n], original: false, checked: playersPlague[(i + 1) % n].value });
            insertPlayers++;
        } else break;
    }
    for (let i = io; i > io - n + 1; i--) {
        if (insertPlayers >= n) break;
        if (playersPlague[(i + n) % n].value) {
            rows.unshift({ player: order[(i + n - 1) % n], original: false, checked: playersPlague[(i + n - 1) % n].value });
            insertPlayers++;
        } else break;
    }
    form.plague = rows;
}

/** Body of POST game/actions/<id> for the day (old sendActions). */
export function dayPayload(form) {
    const json = {};
    for (let i = 0; i < 3; i++) {
        const rows = rowsOf(form, i);
        if (rows.length === 0) break;
        json['votes_' + i] = rows.map((r) => ({ player: r.player, role: r.role, target: r.value }));
    }
    const extraActions = [];
    if (form.sam && form.sam.value !== "") extraActions.push({ player: form.samPlayer, role: "sam", target: form.sam.value });
    for (const r of form.plague ?? []) if (r.checked) extraActions.push({ player: form.plagueSpreader, role: "plague spreader", target: r.player });
    if (extraActions.length > 0) json['extraActions'] = extraActions;
    return json;
}

// ---- log -----------------------------------------------------------------------------------------------

/** Pieces of one log row (old getStringLog): [{text, color?}]. */
export function logPieces(gamePhase, user, typeOfAction, target, color, master) {
    const c = (text) => ({ text, color });
    if (typeOfAction === 'dead')
        return gamePhase === "night" ? [{ text: user + ' is ' }, c(typeOfAction)] : [{ text: user + ' is at the ' }, c('stake')];
    if (typeOfAction === "last chance") return [{ text: user + ' use ' }, c(typeOfAction)];
    if (typeOfAction === "plague") {
        if (gamePhase === "night")
            return master ? [{ text: user + ' ' }, c(typeOfAction + 's'), { text: ' ' + target }] : [{ text: target + ' is ' }, c('infected')];
        return [{ text: target + ' died of ' }, c('plague')];
    }
    return [{ text: user + ' ' }, c(typeOfAction + 's'), { text: ' ' + target }];
}

/**
 * Old createUl/makeData: one entry per round with the night and day rows ({label, pieces}),
 * `sum` = rows of the summary (night: dead/plague only; day: everything but votes).
 */
export function buildLog(data, master) {
    if (!data || data.length === 0) return [];
    const key = Object.keys(data[0])[0];
    const roundMax = data[data.length - 1][key].round;
    const rounds = [];
    for (let r = 1; r <= roundMax; r++) {
        const ret = { round: r, night: { ext: [], sum: [] }, day: { ext: [], sum: [] } };
        for (let i = 0; i < data.length && data[i][key].round <= r; i++) {
            const a = data[i][key];
            if (a.round !== r) continue;
            const action = a.typeAction;
            const col = action === "vote" ? rolesColors.get("vote") : evilAction.includes(action) ? rolesColors.get("evil")
                : neutralAction.includes(action) ? rolesColors.get("neutral") : rolesColors.get("good");
            let label;
            switch (a.subphase) {
                case 0: label = a.phase === "day" ? "Vote" : "Action"; break;
                case 1: label = "1° ballot"; break;
                default: label = action === "vote" ? "2° ballot" : (action === "dead" || action === "plague") ? "Dead" : "Action";
            }
            const row = { label, pieces: logPieces(a.phase, a.player, action, a.target, col, master) };
            if (a.phase === "day") {
                if (action !== "vote") ret.day.sum.push(row);
                ret.day.ext.push(row);
            } else {
                if (action === "plague" || action === "dead") ret.night.sum.push(row);
                ret.night.ext.push(row);
            }
        }
        rounds.push(ret);
    }
    return rounds;
}

/** Plain text of a log row (for the chronicle of the game-over view). */
export const rowText = (row) => row.pieces.map((p) => p.text).join('');

// ---- game over -----------------------------------------------------------------------------------------

const factions = ["farmers", "wolf pack", "hamster", "jester", "", "", "", "", "", "", "draw"];
const factions_color = ["green", "red", "#ffcc00", "#ffcc00", "", "", "", "", "", "", "#7b7b7b"];

/** Texts of the old setGameOver(): {pre, faction, color, post, started, duration}. */
export function gameOverTexts(game) {
    const s = game.who_win < 2 ? "" : "s";
    const draw = game.who_win === 10;
    const gameStart = game.start.split(".")[0].split(" ");
    const d = game.game_duration.split(":").map(Number);
    let timeStamp = d[1] + " minutes and " + d[2] + " seconds.";
    if (d[0] !== 0) timeStamp = d[0] + " hours, " + timeStamp;
    return {
        pre: draw ? "The game ended in a " : "The ",
        faction: factions[game.who_win],
        color: factions_color[game.who_win],
        post: draw ? "!" : " win" + s + "!",
        started: "The game started on " + gameStart[0] + " at " + gameStart[1] + " and lasted for " + game.rounds + " round" + (game.rounds > 1 ? "s" : "") + ".",
        duration: "Total duration of " + timeStamp,
    };
}

export const cap = capitalizeFirstLetter;
