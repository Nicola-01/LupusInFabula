/*
 * Port of js/game/currentGame/gameLog.js: the per-round log of the village (round tabs, day/night summaries).
 * Markup is built as HTML strings, as before; Bootstrap classes are replaced by Tailwind classes.
 */
import { state } from './state.js';
import { genericGETRequest, contextPath, capitalizeFirstLetter, rolesColors, evilAction, neutralAction, HTTP_STATUS_OK, JSON_resource_list } from '../../../utils/utils.js';

/** Reloads the log of the village (the /master variant for the master page). */
export function logElementsReload() {
    state.logs = [];
    state.divLogs = document.getElementById("gameLog");
    state.divLogs.innerHTML = "";

    const masterlog = state.endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/logs/" + state.gameID + masterlog, fillGameLog);
}

/** Fills the log from the GET game/logs response. */
function fillGameLog(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            state.logs = JSON.parse(req.responseText)[JSON_resource_list];
            createUl(state.logs);
        }
    }
}

/** Round button (tab) of the log. */
function createButtonRound(round) {
    return '<button class="nav-link rounded-md px-4 py-2 text-start my-1 text-[#0d6efd] [&.active]:text-white ' + (round === 1 ? 'active' : "") + '" id="round-' + round + '-tab" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
        '<span class="block text-[1.25rem] font-bold">' +
        'Round ' + round +
        '</span>' +
        '</button>';
}

/** Expand / reduce button of a day or night block. */
function createButtonRoundExpand(round, text, phase) {
    return '<button class="ml-2 rounded-md border border-solid border-[#0d6efd] bg-[#0d6efd] px-3 py-1.5 text-white" id="round-' + round + '-expand-' + phase + '" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
        '<span class="block text-[1.25rem] font-bold">' +
        text +
        '</span>' +
        '</button>';
}

/** Text in a colour. */
function colText(text, color) {
    return '<span style="color:' + color + '">' + text + '</span>';
}

/** Text of one log row. */
function getStringLog(gamePhase, user, typeOfAction, target, color) {
    let s = '' + user;

    if (typeOfAction === 'dead') {
        if (gamePhase === "night")
            return s + ' is ' + colText(typeOfAction, color);
        else
            return s + ' is at the ' + colText('stake', color);
    } else if (typeOfAction === "last chance")
        return s + ' use ' + colText(typeOfAction, color);
    else if (typeOfAction === "plague") {
        if (gamePhase === "night") {
            if (state.endsWithMaster)
                return s + ' ' + colText(typeOfAction + 's', color) + ' ' + target;
            else
                return target + ' is ' + colText('infected', color);
        } else
            return target + ' died of ' + colText('plague', color);
    } else
        return s + ' ' + colText(typeOfAction + 's', color) + ' ' + target;
}

/** One log row. */
function createActionBlock(gamePhase, phase, subphase, typeOfAction, user, target, color) {
    return '<li class="flex flex-col py-2 min-[768px]:flex-row">' +
        '<span class="phase text-[#6c757d]">' +
        'ㅤ' + phase + 'ㅤ' +
        '</span>' +
        '<div class="grow leftBorder">' +
        ' <p class="mb-0 ml-2">' +
        getStringLog(gamePhase, user, typeOfAction, target, color) +
        '</p>' +
        '</div>' +
        '</li>';
}

/** Title row "Day" / "Night" with its expand button. */
function createRowBlock(phase, round, text) {
    return '<li class="flex flex-col min-[768px]:flex-row">' +
        '<div class="w-full p-0">' +
        '<div class="flex items-center">' +
        '<h3 class="m-0 mr-2 font-medium leading-[1.2] text-[calc(1.3rem+.6vw)]">' +
        'ㅤ' + capitalizeFirstLetter(phase) +
        '</h3>' +
        '<div class="grow m-0 border-t border-solid border-[#dee2e6] dark:border-[#495057]"></div>ㅤ' +
        createButtonRoundExpand(round, text, phase) +
        '</div>' +
        '</div>' +
        '</li>';
}

/** Container of one round (button + tab pane with the day and night spans). */
function createContActionButton(round) {
    return '<div>' +
        createButtonRound(round) +
        '<div class="block" id="round-' + round + '" role="tabpanel">' +
        '<ul class="list-none pt-1 mb-0" id="round-' + round + '-ul">' +
        '<span id="round-' + round + '-night">' +
        '</span>' +
        '<span id="round-' + round + '-day">' +
        '</span>' +
        '</ul>' +
        '</div>' +
        '</div>';
}

/** Wrapper of all the rounds. */
function createCont(ContAction) {
    return ' <div class="relative w-full p-0">' +
        '<div class="flex flex-col" id="tab" role="tablist">' +
        ContAction +
        '</div>' +
        '</div>';
}

/**
 * Builds the summary (sum) and full (ext) html of the day and night of round r.
 * Returns the array `ret` with one {dayExt, daySum, nightSum, nightExt} per round.
 */
function makeData(data, firstDataKey, secondDataKey, r, ret) {
    let phase = "";
    let action = "";
    let subphase = "";
    let nm = "";
    let i = 0;
    let col = null;
    let s = "";
    let gamePhase = "";
    ret.push({dayExt: "", daySum: "", nightSum: "", nightExt: ""});

    while (i < data.length && data[i][firstDataKey[0]][secondDataKey[1]] <= r) {
        if (data[i][firstDataKey[0]][secondDataKey[1]] === r) {
            phase = data[i][firstDataKey[0]][secondDataKey[2]];
            gamePhase = phase;
            action = data[i][firstDataKey[0]][secondDataKey[4]];
            subphase = data[i][firstDataKey[0]][secondDataKey[3]];
            nm = data[i][firstDataKey[0]][secondDataKey[0]];

            // choose the color for the log
            if (action === "vote")
                col = rolesColors.get("vote");
            else if (evilAction.includes(action))
                col = rolesColors.get("evil");
            else if (neutralAction.includes(action))
                col = rolesColors.get("neutral");
            else
                col = rolesColors.get("good");

            // modify the phase of log
            switch (subphase) {
                case 0:
                    phase = (phase === "day") ? "Vote" : "Action";
                    break;
                case 1:
                    phase = "1° ballot";
                    break;
                default:
                    if (action === "vote")
                        phase = "2° ballot";
                    else if (action === "dead" || action === "plague")
                        phase = "Dead";
                    else
                        phase = "Action";
                    break;
            }

            s = createActionBlock(gamePhase, phase, subphase, action, nm, data[i][firstDataKey[0]][secondDataKey[5]], col);

            // check if the real phase is day or night
            if (data[i][firstDataKey[0]][secondDataKey[2]] === "day") {
                // action vote not go in summary
                if (action !== "vote")
                    ret[r - 1].daySum = ret[r - 1].daySum.concat(s);
                // total action
                ret[r - 1].dayExt = ret[r - 1].dayExt.concat(s);
            } else {
                // action plague e dead go in summary
                if (action === "plague" || action === "dead")
                    ret[r - 1].nightSum = ret[r - 1].nightSum.concat(s);
                // total action
                ret[r - 1].nightExt = ret[r - 1].nightExt.concat(s);
            }
        }
        i++;
    }

    // load the data in the return value
    if (ret[r - 1].dayExt !== "") {
        ret[r - 1].daySum = createRowBlock("day", r, 'Expand').concat(ret[r - 1].daySum);
        ret[r - 1].dayExt = createRowBlock("day", r, 'Reduce').concat(ret[r - 1].dayExt);
    }
    if (ret[r - 1].nightExt !== "") {
        ret[r - 1].nightSum = createRowBlock("night", r, 'Expand').concat(ret[r - 1].nightSum);
        ret[r - 1].nightExt = createRowBlock("night", r, 'Reduce').concat(ret[r - 1].nightExt);
    }

    return ret;
}

/** Builds the whole log and wires the round / expand buttons. */
function createUl(data) {
    let bs = '';
    let secondDataKey = ["player", "round", "phase", "subphase", "typeAction", "target"];
    let firstDataKey = data.length > 0 ? Object.keys(data[0]) : [0];
    let roundMax = data.length - 1 >= 0 ? data[data.length - 1][firstDataKey[0]][secondDataKey[1]] : 0;
    let ulData = [];
    let swRound = [];
    let swExpDay = [];
    let swExpNight = [];

    for (let r = 1; r <= roundMax; r++) {
        // add button
        bs = bs.concat(createContActionButton(r));
        // make data r for logs
        ulData = makeData(data, firstDataKey, secondDataKey, r, ulData);
        swExpDay.push(true);
        swExpNight.push(true);
        swRound.push(true);
    }
    // fill the container for round buttons
    state.divLogs.innerHTML = createCont(bs);

    for (let r = 1; r <= roundMax; r++) {
        document.getElementById('round-' + r + '-tab')?.addEventListener("click", function (e) {
            // Bootstrap tab behaviour: the clicked round becomes the active one
            e.currentTarget.classList.add("active");
            let nightContent = document.getElementById('round-' + r + '-night');
            let dayContent = document.getElementById('round-' + r + '-day');
            let fDay = function () {
                // flip the summary flag; false shows the full day, true the summary
                if (!(swExpDay[r - 1] = !swExpDay[r - 1])) dayContent.innerHTML = ulData[r - 1].dayExt;
                else dayContent.innerHTML = ulData[r - 1].daySum;
                // add the action listener to the expand button
                document.getElementById('round-' + r + '-expand-day')?.addEventListener("click", fDay);
            };
            let fNight = function () {
                if (!(swExpNight[r - 1] = !swExpNight[r - 1])) nightContent.innerHTML = ulData[r - 1].nightExt;
                else nightContent.innerHTML = ulData[r - 1].nightSum;
                document.getElementById('round-' + r + '-expand-night')?.addEventListener("click", fNight);
            };

            // open: summary, close: empty
            nightContent.innerHTML = swRound[r - 1] ?
                (swExpNight[r - 1] ?
                    ulData[r - 1].nightSum :
                    ulData[r - 1].nightExt) :
                "";
            dayContent.innerHTML = swRound[r - 1] ?
                (swExpDay[r - 1] ?
                    ulData[r - 1].daySum :
                    ulData[r - 1].dayExt) :
                "";
            document.getElementById('round-' + r + '-expand-day')?.addEventListener("click", fDay);
            document.getElementById('round-' + r + '-expand-night')?.addEventListener("click", fNight);

            // switch the var for the button round view
            swRound[r - 1] = !swRound[r - 1];
        });
    }
    // active the button for last round
    document.getElementById('round-' + roundMax + '-tab')?.click();
}
