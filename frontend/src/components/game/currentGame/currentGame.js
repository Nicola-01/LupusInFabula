/*
 * Port of js/game/currentGame.js: game status, game over, element reload, resize, copy link.
 * Engine functions work on the DOM ids rendered by the React components (same ids as the JSP).
 */
import { state } from './state.js';
import { contextPath, genericGETRequest, HTTP_STATUS_OK, GamePhase } from '../../../utils/utils.js';
import { loadTheme } from '../../Navbar.jsx';
import { fillPlayersStatus } from './playersStatus.js';
import { fillGameActions } from './gameActions.js';
import { logElementsReload } from './gameLog.js';
import { stopGameWS, attachTargetClick } from './gameWebSocket.js';

const factions = ["farmers", "wolf pack", "hamster", "jester", "", "", "", "", "", "", "draw"];
const factions_color = ["green", "red", "#ffcc00", "#ffcc00", "", "", "", "", "", "", "#7b7b7b"];

/** Handles the game status response: game over, or round/phase and the actions of the master. */
export function gameStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let game = JSON.parse(req.responseText)['game'];
            if (game.who_win !== -1)
                setGameOver(game);
            else {
                const bt_gameStatus = document.getElementById("gameStatus");
                const bt_text = document.getElementById("textActionsBt");
                state.gameRound = (game.rounds === 0) ? 1 : game.rounds;
                state.gamePhase = game.phase;
                if (state.gamePhase === GamePhase.NIGHT) {
                    if (bt_text !== null) bt_text.textContent = "NEW DAY!";
                    bt_gameStatus.textContent = "NIGHT " + state.gameRound;
                    localStorage.setItem("phase", "NIGHT");
                    logElementsReload();
                } else {
                    if (bt_text !== null) bt_text.textContent = "NEW NIGHT!";
                    bt_gameStatus.textContent = "DAY  " + state.gameRound;
                    localStorage.setItem("phase", "DAY");
                    logElementsReload();
                }

                if (document.getElementById("skipDayBT"))
                    document.getElementById("skipDayBT").disabled = state.gameRound > 1 || state.gamePhase === GamePhase.NIGHT;

                loadTheme();

                if (state.endsWithMaster) {
                    document.getElementById("sendActions").style.display = "flex";
                    return genericGETRequest(contextPath + "game/actions/" + state.gameID + "/master", fillGameActions);
                }
            }
        }
    }
}

/** Fills the game-over texts (#winning_faction, #gameTime). */
function setGameOver(game) {
    const s = game.who_win < 2 ? "" : "s";

    const win_faction_div = document.getElementById("winning_faction");
    const gameTime = document.getElementById("gameTime");

    if (win_faction_div !== null && gameTime !== null) {
        const faction_div = document.createElement('span');
        faction_div.id = "faction_name";
        faction_div.innerHTML = factions[game.who_win];
        faction_div.style.color = factions_color[game.who_win];

        if (game.who_win === 10) {// the game is a draw
            win_faction_div.innerHTML = "The game ended in a ";
            win_faction_div.appendChild(faction_div);
            win_faction_div.innerHTML += "!";
        } else {
            win_faction_div.innerHTML = "The ";
            win_faction_div.appendChild(faction_div);
            win_faction_div.innerHTML += " win" + s + "!";
        }

        const gameStart = (((game.start).split(".")[0])).split(" ");
        const gameDuration = (game.game_duration).split(":").map(Number);
        gameTime.innerHTML = "The game started on " + gameStart[0] + " at " + gameStart[1] + " and lasted for " + game.rounds + " round" + (game.rounds > 1 ? "s" : "") + ".<br>Total duration of ";

        let timeStamp = gameDuration[1] + " minutes and " + gameDuration[2] + " seconds.";
        if (gameDuration[0] !== 0)
            timeStamp = gameDuration[0] + " hours, " + timeStamp;

        gameTime.innerHTML += timeStamp;
    }
}

/** Resets the state and reloads players, status and settings. */
export function elementsReload() {
    state.wolfPack = [];
    if (document.getElementById("sendActions") !== null)
        document.getElementById("sendActions").disabled = true;

    const master = state.endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/players/" + state.gameID + master, fillPlayersStatus);
    genericGETRequest(contextPath + "game/status/" + state.gameID, gameStatus);
    genericGETRequest(contextPath + "game/settings/" + state.gameID, () => {});
}

/** Sizes #playersStatusExternal and #gameLogExternal to the width of the game log. */
export function handleResize() {
    const maxHeight = (document.getElementById("gameLog").getBoundingClientRect().width + 35 + 8) + "px"; // plus the h2 text and margin
    document.getElementById("playersStatusExternal").style.height = maxHeight;
    document.getElementById("gameLogExternal").style.height = maxHeight;
}

/** Copies the game link (without the /master suffix) to the clipboard. */
export function copyGameLink() {
    let URL = window.location.href;
    URL = URL.replace(/\/master\/?$/, '');
    navigator.clipboard.writeText(URL).then(function () {
        console.log('URL copied to clipboard: ' + URL);
    }).catch(function (err) {
        console.error('Could not copy text: ', err);
    });
}

/**
 * Starts the engine once the page is rendered (old DOMContentLoaded handlers).
 * The first log request is made before endsWithMaster is known, as in the old load order
 * (gameLog.js ran its DOMContentLoaded before currentGame.js set endsWithMaster).
 *
 * @returns {function} cleanup for unmount
 */
export function startGame(gameID, endsWithMaster) {
    state.gameID = gameID;
    state.endsWithMaster = false;
    logElementsReload();
    state.endsWithMaster = endsWithMaster;
    elementsReload();

    handleResize();
    window.addEventListener('resize', handleResize);
    const detachClick = attachTargetClick();

    return () => {
        window.removeEventListener('resize', handleResize);
        detachClick();
        stopGameWS();
    };
}
