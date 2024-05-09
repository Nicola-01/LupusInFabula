document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;
    gameID = url.substring(url.lastIndexOf("/gtmp/") + 6, url.lastIndexOf("/")); // todo work only if the url finish with /master
    console.log(gameID)

    document.getElementById("sendActions").addEventListener("click", sendActions);
    document.getElementById("sendActions").disabled = true;

    elementSReload();
});

function elementSReload() {
    genericGETRequest(contextPath + "game/status/" + gameID, gameStatus)
    genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions)
    genericGETRequest(contextPath + "game/players/" + gameID + "/master", fillPlayersStatus)
}

let gameID;
let wolfPack = []
let gameRound
let gamePhase

function gameStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let game = JSON.parse(req.responseText)['game'];
            if (game.who_win !== -1) {
                // todo -> the game is over
            } else {
                const bt_gameStatus = document.getElementById("gameStatus");
                const bt_text = document.getElementById("textActionsBt");
                gameRound = (game.rounds === 0) ? 1 : game.rounds;
                gamePhase = game.phase;
                if (gamePhase === GamePhase.NIGHT) {
                    bt_text.textContent = "NEW DAY!";
                    bt_gameStatus.textContent = "NIGHT " + gameRound;
                } else {
                    bt_text.textContent = "NEW NIGHT!";
                    bt_gameStatus.textContent = "DAY  " + gameRound;
                }
            }
        }
    }
}

function fillGameActions(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];

            document.getElementById("gameActions").innerHTML = "";

            if (list == null) {
                alert("No game settings available");
            } else {
                if (gamePhase === GamePhase.NIGHT)
                    fillNightActions(list)
                else
                    fillDayActions(list)
            }
        } else
            unLoggedUser(req);
    }
}

function enableButton() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');
    let disable = false;

    if (gamePhase === GamePhase.NIGHT) { // night

        const designatedWolfSB = document.getElementById("designatedWolf");
        const designatedPlayer = designatedWolfSB.value
        const designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].classList[0];

        if (designatedPlayer === "")
            disable = true

        for (let i = 0; i < role_targets.length && !disable; i++) {
            let role = role_targets[i].getAttribute("role");
            if (wolfPackContainRole(role)) {
                if (designatedRole === role)
                    disable = (role_targets[i].value === "")
                else
                    disable = (role_targets[i].value !== "")
            } else
                disable = (role_targets[i].value === "")
        }
    } else { // day
        for (let i = 0; i < role_targets.length && !disable; i++)
            disable = (role_targets[i].value === "")
    }


    document.getElementById("sendActions").disabled = disable;
}

function wolfPackContainRole(role) {
    for (const wp of wolfPack)
        if (wp.role === role)
            return true;
    return false;
}

function changeDesignatedWolf() {
    let designatedWolfSB = document.getElementById("designatedWolf");
    let designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].classList[0];

    // for each select box associate to a role
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
}

function fillNightActions(list) {
    let gameActions = document.getElementById("gameActions");

    let goodDiv = document.createElement("div");
    let evilDiv = document.createElement("div");
    let neutralDiv = document.createElement("div");
    let vicStealDiv = document.createElement("div");

    goodDiv.classList.add("goodRoles");
    evilDiv.classList.add("evilRoles");
    neutralDiv.classList.add("neutralRoles");
    vicStealDiv.classList.add("victoryStealerRoles");

    let designatedWolfDiv = document.createElement("div");
    designatedWolfDiv.id = "designatedWolfDiv";
    evilDiv.appendChild(designatedWolfDiv);
    evilDiv.appendChild(document.createElement("hr"));

    let designatedWolvesDiv = document.createElement("div");
    designatedWolvesDiv.id = "designatedWolves";
    evilDiv.appendChild(designatedWolvesDiv);

    const divMap = {
        "good": goodDiv,
        "evil": evilDiv,
        "victory stealer": vicStealDiv,
        "neutral": neutralDiv
    };

    for (let i = 0; i < list.length; i++) {
        let actionTarget = list[i]['actionTarget'];

        // get the wolves that can do ad action for kill someone
        if (actionTarget.action === "maul" || actionTarget.action === "rage" || actionTarget.action === "explore") {
            let wolfPlayers = actionTarget['players'];
            for (let j = 0; j < wolfPlayers.length; j++)
                wolfPack.push({
                    player: wolfPlayers[j].player,
                    role: actionTarget.role
                });

            designatedWolvesDiv.appendChild(getActionWrapper(actionTarget, true))
        } else {
            // Add wrapper to the gameActions element
            const targetDiv = divMap[getRoleType(actionTarget.role)];
            if (targetDiv) {
                targetDiv.appendChild(getActionWrapper(actionTarget));
            }
        }
    }

    let actionWrapperWolf = document.createElement("div");
    actionWrapperWolf.classList.add("action-wrapper", "row");

    let designatedWolf = document.createElement("select");
    designatedWolf.id = "designatedWolf";
    designatedWolf.setAttribute("required", "required");
    designatedWolf.classList.add("roleTargets");
    designatedWolf.addEventListener('change', enableButton);

    // Create default option
    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.setAttribute("disabled", "disabled");
    defaultOption.setAttribute("selected", "selected");
    defaultOption.textContent = "Select option";
    designatedWolf.append(defaultOption);

    for (let i = 0; i < wolfPack.length; i++) {
        let option = document.createElement("option");
        option.text = wolfPack[i].player; // Assuming 'player' is the property containing the player name
        option.classList.add(wolfPack[i].role)
        designatedWolf.add(option);
    }

    designatedWolf.addEventListener('change', changeDesignatedWolf);

    // Add text to the wrapper
    let actionTextWolf = document.createElement("span");
    actionTextWolf.innerHTML = "Who is the <u style='color: " + rolesColors.get("wolf") + ";'> wolf</u> that will make the action?";
    actionTextWolf.classList.add("col-12", "col-sm-8", "col-md-7")
    actionWrapperWolf.appendChild(actionTextWolf);

    // Add roleTargetsElem to the wrapper
    insertSelectionBox(actionWrapperWolf, designatedWolf);

    // Add wrapper to the gameActions element
    designatedWolfDiv.appendChild(actionWrapperWolf);

    if (evilDiv.innerHTML !== "") gameActions.appendChild(evilDiv);
    if (goodDiv.innerHTML !== "") gameActions.appendChild(goodDiv);
    if (neutralDiv.innerHTML !== "") gameActions.appendChild(neutralDiv);
    if (vicStealDiv.innerHTML !== "") gameActions.appendChild(vicStealDiv);

    changeDesignatedWolf()
}

function fillDayActions(list) {
    let gameActions = document.getElementById("gameActions");
    for (let i = 0; i < list.length; i++)
        gameActions.appendChild(getActionWrapper(list[i]['actionTarget']));

}

function getActionWrapper(actionTarget, memberOfWolfPack = false) {
    // Create wrapper element to contain roleTargetsElem and text
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action-wrapper", "row");

    // Create select element
    let roleTargetsElem = document.createElement("select");
    roleTargetsElem.id = actionTarget.role + "_targets";
    // roleTargetsElem.setAttribute("required", "required");
    roleTargetsElem.setAttribute("role", actionTarget.role);
    if (!memberOfWolfPack)
        roleTargetsElem.setAttribute("player", actionTarget.players[0].player);
    roleTargetsElem.setAttribute("memberOfWolfPack", memberOfWolfPack.toString());

    // Create default option
    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.setAttribute("disabled", "disabled");
    defaultOption.setAttribute("selected", "selected");
    defaultOption.textContent = "Select option";
    roleTargetsElem.append(defaultOption);

    let possibleTargets = actionTarget['possibleTargets'];
    for (let j = 0; j < possibleTargets.length; j++) {
        let option = document.createElement("option");
        option.text = possibleTargets[j].player;
        roleTargetsElem.add(option);
    }

    // Add text to the wrapper
    let actionText = document.createElement("span");
    if (gamePhase === GamePhase.NIGHT)
        actionText.innerHTML = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
    else
        actionText.innerHTML = "Which player does <u>" + actionTarget.player + "</u>  want to vote out?";
    actionText.classList.add("col-12", "col-sm-8", "col-md-7", "mb-2", "mb-sm-0")
    actionWrapper.appendChild(actionText);

    roleTargetsElem.addEventListener('change', enableButton);

    // Add roleTargetsElem to the wrapper
    insertSelectionBox(actionWrapper, roleTargetsElem);

    return actionWrapper;
}

function insertSelectionBox(actionWrapper, selectBox) {
    // Create label element
    const label = document.createElement("label");
    label.classList.add("select", "roleTargets", "col-12", "col-sm-4", "col-md-5");
    label.setAttribute("for", selectBox.id);

    // // Create SVG
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.innerHTML = '<use xlink:href="#select-arrow-down"></use>';
    //
    // const svgSprites = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // const symbol = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    // symbol.setAttribute("viewBox", "0 0 10 6");
    // symbol.innerHTML = '<polyline points="1 1 5 5 9 1"></polyline>';
    // svgSprites.appendChild(symbol);
    // svg.appendChild(svgSprites)
    //
    // // Append SVG to label
    // label.appendChild(svg);

    // Append select to label
    label.appendChild(selectBox);

    // Add roleTargetsElem to the wrapper
    actionWrapper.appendChild(label);
    // actionWrapper.appendChild(svgSprites);
}

function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');
    const gameAction = [];

    let player;
    let role;
    let target;

    let designatedPlayer;
    let designatedRole;
    if (gamePhase === GamePhase.NIGHT) {
        let designatedWolfSB = document.getElementById("designatedWolf");
        designatedPlayer = designatedWolfSB.value
        designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].classList[0];
    }

    for (let i = 0; i < role_targets.length; i++) {
        const role_target = role_targets[i];
        player = role_target.getAttribute("player");
        role = role_target.getAttribute('role');
        target = role_target.value;

        if (gamePhase === GamePhase.NIGHT) {
            console.log(role_target.getAttribute("memberOfWolfPack"))
            if (role_target.getAttribute("memberOfWolfPack") === "true")
                if (designatedRole === role_target.getAttribute("role")) {
                    player = designatedPlayer;
                } else {
                    console.log("Discard the action of " + player + " it's not the designated wolf")
                    continue;
                }
        }
        if (role === "sheriff" && target.toLowerCase() === "no shot")
            continue;
        gameAction.push({player, role, target});
    }

    const json = {gameAction};
    console.log(JSON.stringify(json));
    genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), actionsResponse)
}

function actionsResponse(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let actionResults
            if (gamePhase === GamePhase.NIGHT)
                actionResults = JSON.parse(req.responseText)['nightActionResults'];
            else
                actionResults = JSON.parse(req.responseText)['dayActionResults'];
            console.log(actionResults)
            // location.reload()
            elementSReload()

        } else {
            let message = getMessage(req)
            populateErrorMessage(message.message, message.errorCode, message.errorDetails);
        }
    }
}