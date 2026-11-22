/*
 * Port of js/game/currentGame/gameActions.js: the actions form of the master (night actions, day votes,
 * Sam's revenge, plague). Logic is the original one; the DOM is built as before with the same ids and
 * hook classes, using Tailwind classes instead of the Bootstrap grid classes. jQuery is replaced by addEventListener.
 */
import { state } from './state.js';
import { genericPOSTRequest, contextPath, getMessage, getRoleType, rolesColors, GamePhase, HTTP_STATUS_OK, JSON_resource_list } from '../../../utils/utils.js';
import { populateErrorMessage, populateInfoMessage, populateWarningMessage, hideMessagePopup } from '../../../utils/message.js';
import { elementsReload } from './currentGame.js';

/** List of roles seen as evil. */
const rolesSeeAsEvil = ["berserker", "dorky", "explorer", "wolf"];

// Bootstrap grid replaced by Tailwind (same breakpoints: 576 = sm, 768 = md)
const ROW = "action-wrapper flex flex-wrap items-center -mx-3";
const COL_TEXT = "w-full px-3 min-[576px]:w-2/3 min-[768px]:w-7/12";
const COL_TEXT_MB = COL_TEXT + " mb-2 min-[576px]:mb-0";
const COL_SELECT = "select roleTargets w-full px-3 min-[576px]:w-1/3 min-[768px]:w-5/12";
const COL_CHECK = "checkbox-wrapper w-full px-3 min-[576px]:w-1/3 min-[768px]:w-5/12";

/** Handles the response from GET game/actions/<id>/master (the master's form). */
export function fillGameActions(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];

            document.getElementById("gameActions").innerHTML = "";

            if (list == null) {
                alert("No game settings available");
            } else {
                if (state.gamePhase === GamePhase.NIGHT)
                    fillNightActions(list);
                else
                    fillDayActions(list);
            }
        }
    }
}

/** Enables or disables the sendActions button and applies the night/day input rules. */
function enableButtons() {
    let disable = false;

    if (state.gamePhase === GamePhase.NIGHT) {
        const role_targets = document.querySelectorAll('[id*="_targets"]');

        const designatedWolfSB = document.getElementById("designatedWolf");
        const designatedWolfPlayer = designatedWolfSB.value;
        const designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

        for (let i = 0; i < role_targets.length; i++) {
            let role = role_targets[i].getAttribute("role");

            if (role === "illusionist") {
                const illusionistTarget = role_targets[i].value;

                // Remove previous target selections
                for (let j = 0; j < role_targets.length; j++) {
                    const defaultOption = role_targets[j].querySelector('option[value=""]');
                    if (role_targets[j].hasAttribute("blocked")) {
                        role_targets[j].disabled = false;
                        role_targets[j].removeAttribute("blocked");
                        defaultOption.textContent = "Select a target";
                        defaultOption.selected = true;
                    }
                }

                if (wolfPackContainPlayer(illusionistTarget)) {
                    let targetRole = playerWolfPackRole(illusionistTarget);
                    let targetElem = document.getElementById(targetRole + "_targets");
                    const defaultOption = targetElem.querySelector('option[value=""]');
                    if (designatedWolfPlayer === illusionistTarget) {
                        defaultOption.textContent = "BLOCKED";
                        defaultOption.selected = true;
                        const firstTarget = targetElem.options[1].textContent;
                        targetElem.setAttribute("blocked", firstTarget);
                        targetElem.style.backgroundColor = "";
                        targetElem.disabled = true;
                    }
                } else {
                    for (let j = 0; j < role_targets.length; j++) {
                        const defaultOption = role_targets[j].querySelector('option[value=""]');
                        if (role_targets[j].getAttribute("player") === illusionistTarget) {
                            defaultOption.textContent = "BLOCKED";
                            defaultOption.selected = true;
                            // Send the first element as default if the user is blocked;
                            // the backend discards that action since the user is blocked.
                            const firstTarget = role_targets[j].options[1].textContent;
                            role_targets[j].setAttribute("blocked", firstTarget);
                            role_targets[j].style.backgroundColor = "";
                            role_targets[j].disabled = true;
                        }
                    }
                }
            } else if (role === "seer" || role === "medium") {
                // they cannot use their ability if they are blocked
                if (role_targets[i].hasAttribute("blocked"))
                    continue;

                // Set background colors based on the target's alignment
                const target = role_targets[i].value;
                if (target === "")
                    continue;
                if (isPlayerSeesAsEvil(target))
                    role_targets[i].style.backgroundColor = 'var(--target-color-evil)';
                else
                    role_targets[i].style.backgroundColor = 'var(--target-color-good)';
            }
        }

        if (designatedWolfPlayer === "")
            disable = true;
        for (let i = 0; i < role_targets.length && !disable; i++) {
            let role = role_targets[i].getAttribute("role");
            if (wolfPackContainRole(role)) {
                if (role_targets[i].hasAttribute("blocked"))
                    continue;
                else if (designatedRole === role)
                    disable = (role_targets[i].value === "");
                else
                    disable = (role_targets[i].value !== "");
            } else {
                if (role_targets[i].hasAttribute("blocked") ||
                    role_targets[i].hasAttribute('dead'))
                    continue;
                else
                    disable = (role_targets[i].value === "");
            }
        }

    } else { // Day phase
        let samDivDisplay = "none";

        // Maximum one vote and 2 ballots => 3
        const maxPhase = 3;
        for (let i = 0; i < maxPhase; i++) {
            const role_targets = document.querySelectorAll('#votes_' + i + ' [id*="_targets"]');
            if (role_targets.length === 0)
                break;

            let allSelected = true;
            for (let i = 0; i < role_targets.length && allSelected; i++)
                allSelected = (role_targets[i].value !== "");

            if (allSelected) {
                let votedPlayers = getMostVotedPlayers(i);
                // If there are at least 2 players, it is a ballot
                if ((votedPlayers.length) < 2) {
                    // the player is sam => enable his input box
                    if (votedPlayers[0].player === state.samPlayer)
                        samDivDisplay = "block";
                    if (i + 1 < maxPhase)
                        document.getElementById("voteRadio_" + (i + 1)).disabled = true;
                    disable = false;
                    break;
                } else {
                    if (i + 1 < maxPhase) {
                        document.getElementById("voteRadio_" + (i + 1)).disabled = false;
                        populateWarningMessage(".warningMessage", "Ballot " + (i + 1) + " required", "Insert the votes of the " + (i + 1) + " ballot.");
                    }
                    disable = true;
                }
            } else {
                for (let j = i + 1; j < 3; j++)
                    document.getElementById("voteRadio_" + j).disabled = true;
                disable = true;
                break;
            }
        }

        // Show or hide the SAM div based on display value
        if (document.querySelector(".samDiv") != null) {
            document.querySelector(".samDiv").style.display = samDivDisplay;

            // if the player to voted out is sam, check if his input is not null
            if (samDivDisplay === "block")
                disable = (document.getElementById("sam_SB").value === "");
            else // reset the default value
                document.getElementById("sam_SB").querySelector('option[value=""]').selected = true;
        }
    }
    document.getElementById("sendActions").disabled = disable;
}

/** True if the player is seen as evil by the roles that check alignment. */
function isPlayerSeesAsEvil(player) {
    let role;
    if (wolfPackContainPlayer(player))
        role = playerWolfPackRole(player);
    else
        // Split the string by <br> tags or spaces
        role = document.getElementById(player + "_status").innerHTML.split(/<br\s*\/?>|\s+/)[1].toLowerCase();
    return rolesSeeAsEvil.includes(role);
}

/** Switches the vote / ballot section (radio buttons). */
function changeSubPhase(radioBT) {
    let subPhase = Number(radioBT.getAttribute("subPhase"));

    // If the sub-phase is the same as the current, do nothing
    if (subPhase === state.currentVoteSection)
        return;

    // Moving to a new sub-phase
    if (subPhase > state.currentVoteSection) {
        let gameActions = document.getElementById("gameActions");

        let voteDiv = document.createElement("div");
        voteDiv.classList.add("votes");
        voteDiv.id = "votes_" + subPhase;

        // Insert the new element after the radio buttons
        gameActions.insertBefore(voteDiv, gameActions.childNodes[1]);

        // Hide previous sub-phases
        let index = subPhase - 1;
        while (document.getElementById("votes_" + index) !== null) {
            document.getElementById("votes_" + index).style.display = "none";
            index--;
        }

        // Request to get players for the new sub-phase
        genericGETRequest(contextPath + "game/players/" + state.gameID + "/master", fillVotes);

    } else { // Moving to a previous sub-phase
        document.getElementById("votes_" + subPhase).style.display = "block";

        // Remove all sub-phases after the selected one
        let index = subPhase + 1;
        while (document.getElementById("votes_" + index) !== null) {
            document.getElementById("votes_" + index).remove();
            document.getElementById("voteRadio_" + index).disabled = true;
            index++;
        }

        enableButtons();
    }

    // Update the current vote section
    state.currentVoteSection = subPhase;
}

/** Fills the votes section with the living players that can vote. */
function fillVotes(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                let currentSection = document.querySelector('input[name="radio"]:checked').getAttribute("subphase");
                let votesDiv = document.getElementById("votes_" + currentSection);
                let votedPlayers = getMostVotedPlayers(currentSection - 1);
                state.playerRole = [];

                // Populate the vote only for the living players
                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn'];
                    // If the player is not dead or not in the ballot
                    if (!playsAsIn.isDead && !votedPlayers.some(item => item.player === playsAsIn.username)) {
                        let text = "Who <u>" + playsAsIn.username + "</u> voted out?";
                        let actionTarget = {
                            "player": playsAsIn.username,
                            "role": playsAsIn.role,
                            "possibleTargets": votedPlayers
                        };
                        votesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.DAY));
                    }
                }
            }
        }
    }
}

/** Players with the most votes in a section (at least two, except the first section). */
function getMostVotedPlayers(currentSection = Number(document.querySelector('input[name="radio"]:checked').getAttribute("subPhase"))) {
    const role_targets = document.querySelectorAll('#votes_' + currentSection + ' [id*="_targets"]');

    let voteResults = new Map();

    for (let i = 0; i < role_targets.length; i++) {
        let target = role_targets[i].value;

        let votesOfPlayer = voteResults.has(target) ? voteResults.get(target) + 1 : 1;
        voteResults.set(target, votesOfPlayer);
    }

    const mapSort = new Map([...voteResults.entries()].sort((a, b) => b[1] - a[1]));

    let previousValue = Array.from(mapSort.values())[0];
    let selected = 0;
    for (let [key, value] of mapSort) {
        if (previousValue === value)
            selected++;
        else if (selected < 2 && currentSection === 0) {
            previousValue = value;
            if (value === 0)
                break;
            selected++;
        } else break;
    }

    let votedPlayers = [];
    for (let i = 0; i < selected; i++)
        votedPlayers.push({"player": Array.from(mapSort.keys())[i]});
    return votedPlayers;
}

/** True if a wolf of the pack has the given role. */
function wolfPackContainRole(role) {
    for (const wp of state.wolfPack)
        if (wp.role === role)
            return true;
    return false;
}

/** True if the given player is in the wolf pack. */
function wolfPackContainPlayer(player) {
    for (const wp of state.wolfPack)
        if (wp.player === player)
            return true;
    return false;
}

/** Role of a wolf pack member, or null. */
function playerWolfPackRole(player) {
    for (const wp of state.wolfPack)
        if (wp.player === player)
            return wp.role;
    return null;
}

/** Updates the designated-wolf dependent select boxes. */
function changeDesignatedWolf() {
    let designatedWolfSB = document.getElementById("designatedWolf");
    let designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

    const designatedWolves = document.querySelectorAll('#designatedWolves [id$="_targets"]');
    for (let i = 0; i < designatedWolves.length; i++) {
        const defaultOption = designatedWolves[i].querySelector('option[value=""]');
        if (designatedWolves[i].getAttribute("role") !== designatedRole) {
            defaultOption.textContent = "Not the designated role";
            defaultOption.selected = true;
            designatedWolves[i].disabled = true;
        } else {
            designatedWolves[i].disabled = false;
            defaultOption.textContent = "Select a target";
            defaultOption.selected = true;
        }
    }
    enableButtons();
}

/** Builds the night form from the actions list. */
function fillNightActions(list) {
    let gameActions = document.getElementById("gameActions");

    let evilDiv = document.createElement("div");
    let neutralDiv = document.createElement("div");
    let goodDiv = document.createElement("div");
    let vicStealDiv = document.createElement("div");

    evilDiv.classList.add("evilRoles", "mt-0");
    neutralDiv.classList.add("neutralRoles", "mt-0");
    goodDiv.classList.add("goodRoles", "mt-0");
    vicStealDiv.classList.add("victoryStealerRoles", "mt-0");

    let designatedWolfDiv = document.createElement("div");
    designatedWolfDiv.id = "designatedWolfDiv";

    let designatedWolvesDiv = document.createElement("div");
    designatedWolvesDiv.id = "designatedWolves";

    designatedWolvesDiv.appendChild(designatedWolfDiv);
    designatedWolvesDiv.appendChild(document.createElement("hr"));

    evilDiv.appendChild(designatedWolvesDiv);

    const divMap = {
        "good": goodDiv,
        "evil": evilDiv,
        "victory stealer": vicStealDiv,
        "neutral": neutralDiv
    };

    let berserkAlreadyInsert = false;
    let text;

    for (let i = 0; i < list.length; i++) {
        let actionTarget = list[i]['actionTarget'];

        // get the wolves that can do ad action for kill someone
        if (actionTarget.action === "maul" || actionTarget.action === "rage" || actionTarget.action === "explore") {
            let wolfPlayers = actionTarget['players'];
            for (let j = 0; j < wolfPlayers.length; j++) {
                if (!state.wolfPack.some(p => p.player === wolfPlayers[j].player))
                    state.wolfPack.push({
                        player: wolfPlayers[j].player,
                        role: actionTarget.role
                    });
            }

            if (berserkAlreadyInsert) {
                text = "Against whom the <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u> rages?";
                designatedWolvesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT, true));
            } else {
                if (actionTarget.action === "rage")
                    berserkAlreadyInsert = true;
                text = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                designatedWolvesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT, true));
            }
        } else {
            const targetDiv = divMap[getRoleType(actionTarget.role)];
            if (targetDiv) {
                text = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                targetDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT));
            }
        }
    }

    // select for the designated wolf
    let actionWrapperWolf = document.createElement("div");
    actionWrapperWolf.classList.add(...ROW.split(" "));

    let designatedWolf = document.createElement("select");
    designatedWolf.id = "designatedWolf";
    designatedWolf.setAttribute("required", "required");
    designatedWolf.classList.add("roleTargets");
    designatedWolf.addEventListener('change', enableButtons);

    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.setAttribute("disabled", "disabled");
    defaultOption.setAttribute("selected", "selected");
    defaultOption.textContent = "Select option";
    designatedWolf.append(defaultOption);

    for (let i = 0; i < state.wolfPack.length; i++) {
        let option = document.createElement("option");
        option.text = state.wolfPack[i].player;
        option.setAttribute("role", state.wolfPack[i].role);
        designatedWolf.add(option);
    }

    designatedWolf.addEventListener('change', changeDesignatedWolf);

    let actionTextWolf = document.createElement("span");
    actionTextWolf.innerHTML = "Which <u style='color: " + rolesColors.get("wolf") + ";'> wolf</u> will do the action?";
    actionTextWolf.classList.add(...COL_TEXT.split(" "));
    actionWrapperWolf.appendChild(actionTextWolf);

    insertSelectionBox(actionWrapperWolf, designatedWolf);
    designatedWolfDiv.appendChild(actionWrapperWolf);

    // Append role divs to the game actions element (only if contains something)
    if (evilDiv.innerHTML !== "") gameActions.appendChild(evilDiv);
    if (neutralDiv.innerHTML !== "") gameActions.appendChild(neutralDiv);
    if (goodDiv.innerHTML !== "") gameActions.appendChild(goodDiv);
    if (vicStealDiv.innerHTML !== "") gameActions.appendChild(vicStealDiv);

    changeDesignatedWolf();
}

/** Builds the day form: vote section radios, votes, Sam's revenge and plague. */
function fillDayActions(list) {
    let gameActions = document.getElementById("gameActions");

    let sectionChange = document.createElement("div");
    let voteDiv = document.createElement("div");
    let samDiv = document.createElement("div");
    let plagueDiv = document.createElement("div");

    sectionChange.classList.add("sections", "radio-inputs", "m-0", "mb-2", "-mx-3", "flex", "flex-wrap");
    sectionChange.innerHTML =
        "  <label class='radio w-1/3' for='voteRadio_0'>" +
        "    <input type='radio' name='radio' id='voteRadio_0' checked='' subPhase='0'>" +
        "    <span>VOTE</span>" +
        "  </label>";
    sectionChange.innerHTML +=
        "  <label class='radio w-1/3' for='voteRadio_1'>" +
        "    <input type='radio' name='radio' id='voteRadio_1' subPhase='1' disabled=''>" +
        "    <span>1 BALLOT</span>" +
        "  </label>";
    sectionChange.innerHTML +=
        "  <label class='radio w-1/3' for='voteRadio_2'>" +
        "    <input type='radio' name='radio' id='voteRadio_2' subPhase='2' disabled=''>" +
        "    <span>2 BALLOT</span>" +
        "  </label>";
    gameActions.appendChild(sectionChange);

    const voteRadio = document.querySelectorAll('[id*="voteRadio_"]');
    for (let i = 0; i < voteRadio.length; i++)
        voteRadio[i].addEventListener('click', function () {
            changeSubPhase(voteRadio[i]);
        });

    voteDiv.classList.add("votes");
    voteDiv.id = "votes_0";
    gameActions.appendChild(voteDiv);

    samDiv.classList.add("samDiv");
    plagueDiv.classList.add("plagueDiv");

    for (let i = 0; i < list.length; i++) {
        let text;
        switch (list[i]['actionTarget']['action']) {
            case "revenge": // Sam's revenge action
                state.samPlayer = list[i]['actionTarget'].player;
                gameActions.appendChild(samDiv);
                text = "Who does <u style='color: " + rolesColors.get("sam") + ";'> Sam </u> want to kill?";
                samDiv.appendChild(getActionWrapper(list[i]['actionTarget'], text, GamePhase.DAY));

                let samSB = document.querySelector(".samDiv select");
                samSB.id = "sam_SB";

                samDiv.style.display = "none";
                break;
            case "plague": // Plague spreading action
                state.plagueSpreaderPlayer = list[i]['actionTarget'].player;

                let tmpList = list[i]['actionTarget']['possibleTargets'];
                for (let j = 0; j < tmpList.length; j++)
                    state.playersOrder.push(tmpList[j].player);
                let plaguedPlayer = state.playersOrder[0];

                // the plagueSpreader did not infect anyone
                if (plaguedPlayer == null) break;

                // Remove the first player, which is the one with the plague
                state.playersOrder.splice(0, 1);

                gameActions.appendChild(plagueDiv);
                plagueDiv.appendChild(createActionWrapperForPlague(plaguedPlayer, true));
                addPlaguesListener();
                break;
            default: // Regular voting action
                text = "Who <u>" + list[i]['actionTarget'].player + "</u> voted out?";
                voteDiv.appendChild(getActionWrapper(list[i]['actionTarget'], text, GamePhase.DAY));
                break;
        }
    }
}

/** A row with the text and a select box (target of an action or a vote). */
function getActionWrapper(actionTarget, text, gamePhase, memberOfWolfPack = false) {
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add(...ROW.split(" "));

    let roleTargetsElem = document.createElement("select");
    if (gamePhase === GamePhase.NIGHT) {
        roleTargetsElem.id = actionTarget.role + "_targets";
        if (!memberOfWolfPack && actionTarget.players.length > 0)
            roleTargetsElem.setAttribute("player", actionTarget.players[0].player);
        roleTargetsElem.setAttribute("memberOfWolfPack", memberOfWolfPack.toString());
    } else {
        roleTargetsElem.id = actionTarget.player + "_targets";
        roleTargetsElem.setAttribute("player", actionTarget.player);
    }
    roleTargetsElem.setAttribute("required", "required");
    roleTargetsElem.setAttribute("role", actionTarget.role);

    let possibleTargets = actionTarget['possibleTargets'];

    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.setAttribute("selected", "selected");
    if (possibleTargets.length === 0 || (possibleTargets.length === 1 && (possibleTargets[0].player === "No rage"))) {
        defaultOption.textContent = "DEAD";
        roleTargetsElem.setAttribute("dead", "dead");
        roleTargetsElem.disabled = true;
    } else {
        defaultOption.setAttribute("disabled", "disabled");
        defaultOption.textContent = "Select option";
    }
    roleTargetsElem.append(defaultOption);

    for (let j = 0; j < possibleTargets.length; j++) {
        let option = document.createElement("option");
        option.text = possibleTargets[j].player;
        roleTargetsElem.add(option);
    }

    let actionText = document.createElement("span");
    actionText.innerHTML = text;
    actionText.classList.add(...COL_TEXT_MB.split(" "));
    actionWrapper.appendChild(actionText);

    roleTargetsElem.addEventListener('change', enableButtons);

    insertSelectionBox(actionWrapper, roleTargetsElem);

    return actionWrapper;
}

/** Wraps a select box in a label (.select) inside the row. */
function insertSelectionBox(actionWrapper, selectBox) {
    const label = document.createElement("label");
    label.classList.add(...COL_SELECT.split(" "));
    label.setAttribute("for", selectBox.id);

    label.appendChild(selectBox);

    actionWrapper.appendChild(label);
}

/** Rebuilds the plague checkboxes around the original spreader, following the checked players. */
function updatePlaguesVictims() {
    let plagueDiv = document.getElementsByClassName("plagueDiv")[0];

    let original = "";
    let playersPlague = [];

    for (let i = 0; i < state.playersOrder.length; i++) {
        let value = false;
        let CB_ofPlayer = document.getElementById(state.playersOrder[i] + "_plaguedCB");

        if (CB_ofPlayer !== null) {
            value = CB_ofPlayer.checked;
            if (CB_ofPlayer.getAttribute("original") === "true")
                original = CB_ofPlayer.getAttribute("player");
        }

        playersPlague.push({
            player: state.playersOrder[i],
            value: value
        });
    }

    // Remove existing content from plagueDiv
    plagueDiv.innerText = "";

    let nPlayers = state.playersOrder.length;
    let indexOriginal = state.playersOrder.indexOf(original);

    let plagueCB = createActionWrapperForPlague(original, true);
    plagueDiv.appendChild(plagueCB);
    plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[indexOriginal].value;

    let insertPlayers = 1;

    // Loop through players after the original plague spreader
    for (let i = indexOriginal; i < nPlayers + indexOriginal - 1; i++) {
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            plagueCB = createActionWrapperForPlague(state.playersOrder[(i + 1) % nPlayers]);
            plagueDiv.appendChild(plagueCB);
            plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[(i + 1) % nPlayers].value;
            insertPlayers++;
        } else break;
    }

    // Loop through players before the original plague spreader
    for (let i = indexOriginal; i > indexOriginal - nPlayers + 1; i--) {
        if (insertPlayers >= nPlayers)
            break;
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            plagueCB = createActionWrapperForPlague(state.playersOrder[(i + nPlayers - 1) % nPlayers]);
            plagueDiv.prepend(plagueCB);
            plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[(i + nPlayers - 1) % nPlayers].value;
            insertPlayers++;
        } else break;
    }
    addPlaguesListener();
}

/** One "X died of the plague?" row with its checkbox. */
function createActionWrapperForPlague(plaguedPlayer, original = false) {
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add(...ROW.split(" "));

    let actionText = document.createElement("span");
    actionText.innerHTML = "<u>" + plaguedPlayer + "</u> died of the plague?";
    actionText.classList.add(...COL_TEXT_MB.split(" "));
    actionWrapper.appendChild(actionText);

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = plaguedPlayer + "_plaguedCB";
    checkBox.setAttribute("original", original.toString());
    if (original)
        checkBox.classList.add("originalPlagued");
    checkBox.setAttribute("player", plaguedPlayer);
    checkBox.classList.add("inp-cbx", "plague_CB");

    actionWrapper.appendChild(wrapPlaguedCheckBox(checkBox));
    return actionWrapper;
}

/** Click listener on every plague checkbox (was jQuery .click). */
function addPlaguesListener() {
    document.querySelectorAll('.plague_CB').forEach((el) => el.addEventListener('click', updatePlaguesVictims));
}

/** Wraps the checkbox with its styled label. */
function wrapPlaguedCheckBox(checkbox) {
    const divCont = document.createElement("div");
    divCont.classList.add(...COL_CHECK.split(" "));
    divCont.appendChild(checkbox);

    divCont.innerHTML +=
        "  <label class='cbx' for='" + checkbox.id + "'><span>" +
        "  <svg width='12px' height='10px'>" +
        "    <use xlink:href='#check-4'></use>" +
        "  </svg></span><span>Died of plague</span></label>" +
        "  <svg class='inline-svg'>" +
        "    <symbol id='check-4' viewbox='0 0 12 10'>" +
        "      <polyline points='1.5 6 4.5 9 10.5 1'></polyline>" +
        "    </symbol>" +
        "  </svg>";

    return divCont;
}

/** Sends the actions of the master (POST game/actions/<id>). */
export function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');

    let player;
    let role;
    let target;

    let designatedPlayer;
    let designatedRole;

    let json = {};

    if (state.gamePhase === GamePhase.NIGHT) {
        let designatedWolfSB = document.getElementById("designatedWolf");
        designatedPlayer = designatedWolfSB.value;
        designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

        let gameAction = [];

        for (let i = 0; i < role_targets.length; i++) {
            if (role_targets[i].hasAttribute('dead'))
                continue;
            const role_target = role_targets[i];
            player = role_target.getAttribute("player");
            role = role_target.getAttribute('role');

            if (role_target.hasAttribute("blocked"))
                target = role_target.getAttribute("blocked");
            else
                target = role_target.value;

            // Check if the player is a member of the wolf pack and adjust if needed
            if (role_target.getAttribute("memberOfWolfPack") === "true") {
                if (designatedRole === role_target.getAttribute("role"))
                    player = designatedPlayer;
                else
                    continue;
            }

            // Exclude certain special actions
            if ((role === "sheriff" && target.toLowerCase() === "no shot")
                || (role === "berserker" && target.toLowerCase() === "no rage"))
                continue;

            gameAction.push({player, role, target});
        }
        json = {gameAction};
    } else { // Day phase actions

        for (let i = 0; i < 3; i++) {
            const role_targets = document.querySelectorAll('#votes_' + i + ' [id*="_targets"]');
            if (role_targets.length === 0)
                break;

            let votes = [];

            for (let i = 0; i < role_targets.length; i++) {
                const role_target = role_targets[i];
                player = role_target.getAttribute("player");
                role = role_target.getAttribute('role');
                target = role_target.value;
                votes.push({player, role, target});
            }
            json['votes_' + i] = votes;
        }

        let sem_SB = document.getElementById("sam_SB");
        let extraActions = [];

        // add Sam's action if present
        if (sem_SB !== null && sem_SB.value !== "") {
            let sam = "sam";
            let target = sem_SB.value;
            extraActions.push({
                "player": state.samPlayer,
                "role": sam,
                "target": target
            });
        }

        // add plague spreader's actions if present
        let plagueDiv = document.getElementsByClassName("plagueDiv")[0];
        if (plagueDiv !== null) {
            let CB_ofPlayer = document.getElementsByClassName("plague_CB");
            let plague_spreader = "plague spreader";
            for (let i = 0; i < CB_ofPlayer.length; i++) {
                let infectedPlayer = CB_ofPlayer[i].getAttribute("player");
                if (CB_ofPlayer[i].checked) {
                    extraActions.push({
                        "player": state.plagueSpreaderPlayer,
                        "role": plague_spreader,
                        "target": infectedPlayer
                    });
                }
            }
        }
        if (extraActions.length > 0)
            json['extraActions'] = extraActions;
    }

    genericPOSTRequest(contextPath + "game/actions/" + state.gameID, JSON.stringify(json), actionsResponse);
}

/** Shows the result of the night / day (or the game over) and reloads the state. */
function actionsResponse(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            hideMessagePopup(".warningMessage"); // hide ballot popup
            let actionResults;
            let phase;
            let deadPlayers;
            let phaseInfo = "";
            if (JSON.parse(req.responseText).hasOwnProperty('gameWin')) {
                let gameWin = JSON.parse(req.responseText)['gameWin'];
                let message = gameWin.message;

                let players = gameWin['players'];
                for (let i = 0; i < players.length; i++)
                    phaseInfo += players[i].player + ", ";
                phaseInfo = phaseInfo.substring(0, phaseInfo.length - 2);

                window.scrollTo({top: 0, behavior: 'smooth'});
                populateInfoMessage(".infoMessage", message, phaseInfo);
                location.reload();
            } else {
                if (state.gamePhase === GamePhase.NIGHT) {
                    actionResults = JSON.parse(req.responseText)['nightActionsResults'];
                    phase = "night";

                    let deadPlayersList = actionResults['deadPlayers'];

                    if (deadPlayersList.length === 0)
                        deadPlayers = "No deaths during the night.";
                    else {
                        deadPlayers = "Deaths of the night: ";
                        for (let i = 0; i < deadPlayersList.length; i++)
                            deadPlayers += deadPlayersList[i].player + ", ";
                        deadPlayers = deadPlayers.substring(0, deadPlayers.length - 2);
                    }

                    if (actionResults.dorkyIsWolf)
                        phaseInfo += "<br>The Dorky became a wolf!";
                    if (actionResults.puppyIsWolf)
                        phaseInfo += "<br>The puppy became a wolf!";
                    if (actionResults.plaguedPlayer !== "")
                        phaseInfo += "<br> " + actionResults.plaguedPlayer + " has the plague!";
                } else {
                    actionResults = JSON.parse(req.responseText)['dayActionsResults'];
                    phase = "day";

                    if (actionResults.votedPlayer !== "")
                        deadPlayers = actionResults.votedPlayer + " was voted out";
                    else
                        deadPlayers = "No players were voted out.";

                    if (actionResults.samTarget !== "")
                        phaseInfo += "<br>" + actionResults.samTarget + " was killed by sam:";
                    if (actionResults.carpenterAbility)
                        phaseInfo += "<br> the carpenter refused to give wood";

                    let deadPlayersList = actionResults['plaguePlayers'];
                    if (deadPlayersList.length !== 0) {
                        phaseInfo += "<br>Player(s) killed by the plague:<br>";
                        for (let i = 0; i < deadPlayersList.length; i++)
                            phaseInfo += deadPlayersList[i].player + ", ";
                        phaseInfo = phaseInfo.substring(0, phaseInfo.length - 2);
                    }
                }
                window.scrollTo({top: 0, behavior: 'smooth'});
                populateInfoMessage(".infoMessage", "Results of the " + phase + "!", deadPlayers + phaseInfo);
                variableResets();
                elementsReload();
            }
        } else {
            let message = getMessage(req);
            populateErrorMessage(".errorMessage", message.message, message.errorCode, message.errorDetails);
        }
    }
}

/** Resets the actions state to its initial values. */
function variableResets() {
    state.wolfPack = [];
    state.gameRound = -1;
    state.gamePhase = -1;
    state.currentVoteSection = -1;
    state.playersOrder = [];
    state.samPlayer = "";
    state.plagueSpreaderPlayer = "";
}
