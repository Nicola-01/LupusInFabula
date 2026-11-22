/*
 * Port of js/game/currentGame/playersStatus.js and playerCardToggle.js: the circle (<=12 players) or grid
 * of the players with their roles and status, the logged player's card, and the hide/show of the roles.
 */
import { state } from './state.js';
import { genericGETRequest, contextPath, capitalizeFirstLetter, getCookie, rolesColors, HTTP_STATUS_OK, JSON_resource_list } from '../../../utils/utils.js';
import { initGameWS } from './gameWebSocket.js';

/** Maximum number of players for displaying circular buttons. */
const maxPlayersForCircularButtons = 12;

/** Fills the players area from the GET game/players response. */
export function fillPlayersStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null)
                alert("No game settings available");
            else {
                document.getElementById("playersStatus").innerHTML = "";
                state.playerRole = [];
                const loggedUser = localStorage.getItem('playerName');
                let isPlayerInGame = false;

                const rolesMap = new Map(
                    list.map(item => [
                        item.playsAsIn.username,
                        item.playsAsIn.role
                    ])
                );
                const mapAsArray = Array.from(rolesMap.entries());
                const jsonString = JSON.stringify(mapAsArray);
                localStorage.setItem("playsAsInList", jsonString);

                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn'];

                    // when receiving the logged-in users' role
                    if (playsAsIn.username === loggedUser) {
                        let playerRoleElement = document.getElementById("playerRole");
                        if (playerRoleElement !== null)
                            playerRoleElement.innerHTML = "Your role is <b>" + playsAsIn.role + "</b>";

                        const frontCard = document.querySelector(".card-front");
                        if (frontCard !== null)
                            frontCard.style.backgroundImage = "url('../media/cards/" + playsAsIn.role + ".png')";

                        const selectedBack = getCookie("selectedCard");
                        const cardBack = document.querySelector(".card-back");
                        if (cardBack && selectedBack)
                            cardBack.style.backgroundImage = "url('../media/cards/card_back/" + selectedBack + "')";

                        isPlayerInGame = true;
                    }

                    state.playerRole.push(playsAsIn);
                }

                // if the player doesn't participate, and it's not the master
                if (!isPlayerInGame && !state.endsWithMaster) {
                    const cardContainer = document.getElementById("cardContainer");
                    if (cardContainer) {
                        cardContainer.style.display = "none";
                    }
                    const playerRoleElement = document.getElementById("playerRole");
                    if (playerRoleElement)
                        playerRoleElement.innerHTML = "You are <b>spectating</b>";
                }

                if (state.playerRole.length <= maxPlayersForCircularButtons)
                    circularPlayersStatus();
                else
                    gridPlayersStatus();

                // by default, the role is hidden
                if (document.getElementById("toggleButton")) {
                    const toggleElement = document.getElementById("toggleButton");

                    if (toggleElement.style.display !== "none") {
                        toggleCard(true);
                    }
                }
            }
        }
    }
}

/** Creates the div of one player (username, role, dead flag, colour). */
function createUserDiv(playerRole, className) {
    const player = document.createElement('div');

    player.innerHTML = playerRole.username + "<br><div class='playerRole_internalDiv'>" + capitalizeFirstLetter(playerRole.role) + "</div>";
    if (playerRole.isDead) {
        player.innerHTML += " (dead)";
        player.style.filter = `saturate(25%)`;
    }
    player.className = className;
    player.id = playerRole.username + "_status";
    player.setAttribute("username", playerRole.username);
    player.style.backgroundColor = rolesColors.get(playerRole.role);
    if (className === "circular-player")
        player.style.position = 'absolute';
    // use only light theme
    player.setAttribute("data-bs-theme", "light");

    return player;
}

/** Positions the players on a circle. */
function circularPlayersStatus() {
    const epsilon = 0.05;
    const numButtons = state.playerRole.length;

    let circleDiv = document.createElement("div");
    circleDiv.id = 'circle';
    circleDiv.classList.add("p-0");
    document.getElementById("playersStatus").appendChild(circleDiv);

    for (let i = 0; i < numButtons; i++) {
        const angle = (Math.PI * 2 / numButtons) * i;

        const player = createUserDiv(state.playerRole[i], "circular-player");
        circleDiv.appendChild(player);

        let modX = Math.abs(Math.sin(angle));
        let modY = Math.abs(Math.cos(angle));

        let epsilon_angle = 0;
        if (!(modX === 0 || modX === 1 || modY === 0 || modY === 1)) {
            if (angle < Math.PI / 2 || (angle > Math.PI && angle < (3 / 2) * Math.PI))
                epsilon_angle = (-Math.PI) * epsilon;
            else
                epsilon_angle = (Math.PI) * epsilon;
        }

        player.style.left = (Math.sin(angle - epsilon_angle) * 50 + 50) + '%';
        player.style.top = (-Math.cos(angle - epsilon_angle) * 50 + 50) + '%';
    }

    // if TODO: check game settings
    genericGETRequest(contextPath + "game/actions/" + state.gameID, targetHighlight);
    initGameWS();
}

/** Positions the players in a grid. */
function gridPlayersStatus() {
    let playersStatusDiv = document.getElementById("playersStatus");

    for (let i = 0; i < state.playerRole.length; i++) {
        let playerRoleDiv = document.createElement("div");
        playerRoleDiv.classList.add("w-1/4", "min-[768px]:w-1/3", "min-[992px]:w-1/4", "shrink-0", "p-1", "m-auto");

        const player = createUserDiv(state.playerRole[i], "grid-player");

        playerRoleDiv.appendChild(player);
        playersStatusDiv.appendChild(playerRoleDiv);
    }

    genericGETRequest(contextPath + "game/actions/" + state.gameID, targetHighlight);
    initGameWS();
}

/** Highlights the possible targets of the actions (not on the master page). */
function targetHighlight(req) {
    if (!state.endsWithMaster && req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
        let list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list != null) {
            for (let i = 0; i < list.length; i++) {
                let actionTarget = list[i]['actionTarget'];
                let possibleTargets = actionTarget['possibleTargets'];

                for (let j = 0; j < possibleTargets.length; j++) {
                    let targetDiv = document.getElementById(possibleTargets[j].player + "_status");
                    if (!!targetDiv)
                        targetDiv.classList.add("playerTargetHighlight", "playerTargetHighlight_Hide");
                    else if (possibleTargets[j].player === "No shot") {
                        var user = localStorage.getItem("playerName");
                        document.getElementById(user + "_status").classList.add("playerTargetHighlight", "playerTargetHighlight_Hide");
                        document.getElementById(user + "_status").getElementsByClassName("playerRole_internalDiv")[0].innerHTML += "<br><b>(No shot)</b>";
                    }
                }
            }
        }
    }
}

/**
 * Shows or hides the logged player's role (card flip, blur, eye icon, players colours and role names).
 * Port of playerCardToggle.js; the double click on the card and the eye button call it without argument.
 *
 * @param {boolean} [skipAnimation=false] - true disables the card transition
 */
export function toggleCard(skipAnimation = false) {
    const card = document.getElementById("card");

    if (skipAnimation === true)
        card.style.transition = "none";
    else
        card.style.transition = "";

    card.classList.toggle("is-flipped");
    const playerRole = document.getElementById("playerRole");
    playerRole.classList.toggle("blur-name");

    const roleBoldTag = document.querySelector("#playerRole b");

    if (roleBoldTag) {
        if (!roleBoldTag.dataset.originalRole) {
            roleBoldTag.dataset.originalRole = roleBoldTag.innerText;
        }

        if (roleBoldTag.innerText === "****") {
            roleBoldTag.innerText = roleBoldTag.dataset.originalRole;
        } else {
            roleBoldTag.innerText = "****";
        }
    }

    const eyeIcon = document.getElementById("eyeIcon");

    // change the eye icon
    if (!eyeIcon.classList.contains("fa-eye")) {
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }

    // hide the color of all the circular listed players
    let players = document.querySelectorAll('.circular-player');
    players.forEach(function (element) {
        element.classList.toggle('hide-background');
    });

    // hide the color of all the grid listed players
    players = document.querySelectorAll('.grid-player');
    players.forEach(function (element) {
        element.classList.toggle('hide-background');
    });

    // hide the written role of all the players
    const elements = document.querySelectorAll('.playerRole_internalDiv');
    elements.forEach(function (element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });

    const targets = document.querySelectorAll('.playerTargetHighlight');
    targets.forEach(function (element) {
        element.classList.toggle("playerTargetHighlight_Hide");
    });
}
