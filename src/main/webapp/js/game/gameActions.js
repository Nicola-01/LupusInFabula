document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;
    gameID = url.substring(url.lastIndexOf("/gtmp/") + 6, url.lastIndexOf("/"));
    console.log(gameID)

    genericGETRequest(contextPath + "game/status/" + gameID, gameStatus)
    genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions)

    document.getElementById("sendActions").addEventListener("click", sendActions);
});

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
                if (gamePhase === 0) {
                    bt_text.textContent += "DAY!";
                    bt_gameStatus.textContent = "NIGHT " + gameRound;
                } else {
                    bt_text.textContent += "NIGHT!";
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

            if (list == null) {
                alert("No game settings available");
            } else {
                let gameActions = document.getElementById("gameActions");

                // Loop through the list of friends
                for (let i = 0; i < list.length; i++) {
                    let actionTarget = list[i]['actionTarget'];

                    // get the wolves that can do ad action for kill someone
                    if (actionTarget.action === "maul" || actionTarget.action === "rage" || actionTarget.action === "explore") {
                        let wolfPlayers = actionTarget['players'];
                        for (let j = 0; j < wolfPlayers.length; j++)
                            wolfPack.push(wolfPlayers[j].player);
                    }

                    // Create wrapper element to contain roleTargetsElem and text
                    let actionWrapper = document.createElement("div");
                    actionWrapper.setAttribute("class", "action-wrapper");

                    let roleTargetsElem = document.createElement("select");
                    roleTargetsElem.id = actionTarget.role + "_targets";
                    roleTargetsElem.setAttribute("player", actionTarget['players'][0].player);
                    roleTargetsElem.setAttribute("class", "roleTargets");

                    let possibleTargets = actionTarget['possibleTargets'];
                    for (let j = 0; j < possibleTargets.length; j++) {
                        let option = document.createElement("option");
                        option.text = possibleTargets[j].player; // Assuming 'player' is the property containing the player name
                        roleTargetsElem.add(option);
                    }

                    // Add text to the wrapper
                    let actionText = document.createElement("span");
                    actionText.innerHTML = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                    actionWrapper.appendChild(actionText);

                    // Add roleTargetsElem to the wrapper
                    actionWrapper.appendChild(roleTargetsElem);

                    // Add wrapper to the gameActions element
                    gameActions.appendChild(actionWrapper);

                }

                let actionWrapperWolf = document.createElement("div");
                actionWrapperWolf.setAttribute("class", "action-wrapper");

                let designatedWolf = document.createElement("select");
                designatedWolf.id = "designatedWolf";
                designatedWolf.setAttribute("class", "roleTargets");

                for (let i = 0; i < wolfPack.length; i++) {
                    let option = document.createElement("option");
                    option.text = wolfPack[i]; // Assuming 'player' is the property containing the player name
                    designatedWolf.add(option);
                }

                // Add text to the wrapper
                let actionTextWolf = document.createElement("span");
                actionTextWolf.innerHTML = "Who is the <u style='color: " + rolesColors.get("wolf") + ";'> wolf</u> that will make the action?";
                actionWrapperWolf.appendChild(actionTextWolf);

                // Add roleTargetsElem to the wrapper
                actionWrapperWolf.appendChild(designatedWolf);

                // Add wrapper to the gameActions element
                gameActions.appendChild(actionWrapperWolf);

            }
        } else
            unLoggedUser(req);
    }
}

function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');
    const gameAction = [];

    const designatedWolf = document.getElementById("designatedWolf").value

    let player;
    let role;
    let target;
    for (let i = 0; i < role_targets.length; i++) {

        player = role_targets[i].getAttribute("player");
        role = role_targets[i].id.replace('_targets', '');
        target = role_targets[i].value;

        if (wolfPack.includes(player) && designatedWolf !== player) {
            console.log("Discard the action of " + player + " it's not the designated wolf")
            continue;
        }

        gameAction.push({player, role, target});
    }

    const json = {gameAction};
    console.log(JSON.stringify(json));
    genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), actionsResponse)
}

function actionsResponse(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            if(gamePhase === 0) {
                let nightActionResults = JSON.parse(req.responseText)['nightActionResults'];
                console.log(nightActionResults)
                location.reload()
            }
            else {
                let dayActionResults = JSON.parse(req.responseText)['dayActionResults'];
                console.log(dayActionResults)
                location.reload()
            }

        } else {
            let message = getMessage(req)

            console.log(message.message);
            console.log(message.errorCode);
            console.log(message.errorDetails);

            if (req.status === HTTP_STATUS_CONFLICT) {

            } else if (req.status === HTTP_STATUS_NOT_FOUND) {

            } else if (req.status === HTTP_STATUS_BAD_REQUEST) {

            } else if (req.status === HTTP_STATUS_INTERNAL_SERVER_ERROR) {

            }
        }
    }
}