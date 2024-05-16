document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;

    // extract gameID
    var startIndex = url.lastIndexOf("/gtmp/") + 6;
    var endIndex = url.indexOf("/", startIndex);
    // if url doesn't end with /
    if (endIndex === -1) {
        endIndex = url.length;
    }
    gameID = url.substring(startIndex, endIndex);
    console.log(gameID);

    var lastSegment = url.substring(url.lastIndexOf("/") + 1);
    endsWithMaster = lastSegment === "master" || lastSegment === "master/";

    if (document.getElementById("sendActions") !== null) {
        document.getElementById("sendActions").style.display = "none"
        document.getElementById("sendActions").addEventListener("click", sendActions);
    }

    elementsReload();
});

function elementsReload() {
    // reset of variables and state
    wolfPack = []
    if (document.getElementById("sendActions") !== null) {
        document.getElementById("sendActions").disabled = true;
    }

    // recover the data
    var master = endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/players/" + gameID + master, fillPlayersStatus);
    genericGETRequest(contextPath + "game/status/" + gameID, gameStatus);
}

let endsWithMaster; // whether the url ends with /master
let gameID;
let wolfPack = []
let gameRound
let gamePhase
let gameOver = false

function gameStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let game = JSON.parse(req.responseText)['game'];
            wait = true
            if (game.who_win !== -1) {
                // todo -> the game is over
                var factions = ["farmers", "wolf pack", "hamster", "jester"];
                var s = game.who_win < 2? "" : "s";
                var msg = "The " + factions[game.who_win] + " win" + s + "!";
                populateInfoMessage("THE GAME IS OVER", msg);
            } else {
                const bt_gameStatus = document.getElementById("gameStatus");
                const bt_text = document.getElementById("textActionsBt");
                gameRound = (game.rounds === 0) ? 1 : game.rounds;
                gamePhase = game.phase;
                if (gamePhase === GamePhase.NIGHT) {
                    if (bt_text !== null) bt_text.textContent = "NEW DAY!";
                    bt_gameStatus.textContent = "NIGHT " + gameRound;
                } else {
                    if (bt_text !== null) bt_text.textContent = "NEW NIGHT!";
                    bt_gameStatus.textContent = "DAY  " + gameRound;
                }

                // if url ends with master/, update actions
                if (endsWithMaster) {
                    document.getElementById("sendActions").style.display = "flex";
                    return genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions);
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
        } else {
            document.getElementById("sendActions").style.display = "none"
            isLoggedUser(req);
        }
    }
}

let currentVoteSection = 0;

function enableButton() {
    let disable = false;

    if (gamePhase === GamePhase.NIGHT) { // night
        const role_targets = document.querySelectorAll('[id*="_targets"]');

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

        let samDivDisplay = "none";

        // maximum one vote and 2 ballot => 3
        const maxPhase = 3
        for (let i = 0; i < maxPhase; i++) {
            const role_targets = document.querySelectorAll('#votes_' + i + ' [id*="_targets"]');
            if (role_targets.length === 0)
                break;

            let allSelected = true
            for (let i = 0; i < role_targets.length && allSelected; i++)
                allSelected = (role_targets[i].value !== "")

            if (allSelected) {
                let votedPlayers = getMostVotedPlayers(i)
                // if there are at least 2 players is a ballot
                if ((votedPlayers.length) < 2) {
                    // the player is sam => enable his input box
                    if (votedPlayers[0].player === samPlayer)
                        samDivDisplay = "block"
                    if (i + 1 < maxPhase)
                        document.getElementById("voteRadio_" + (i + 1)).disabled = true
                    disable = false
                    break;
                } else {
                    if (i + 1 < maxPhase)
                        document.getElementById("voteRadio_" + (i + 1)).disabled = false
                    disable = true
                }
            } else {
                for (let j = i + 1; j < 3; j++)
                    document.getElementById("voteRadio_" + j).disabled = true
                disable = true;
                break;
            }
        }
        document.querySelector(".samDiv").style.display = samDivDisplay;

        // if the player to voted out is sam, check if his input is not null
        if (samDivDisplay === "block")
            disable = (document.getElementById("sam_SB").value === "");
        else // reset the default value
            document.getElementById("sam_SB").querySelector('option[value=""]').selected = true;

    }
    document.getElementById("sendActions").disabled = disable;
}

function changeSubPhase(radioBT) {
    let subPhase = Number(radioBT.getAttribute("subPhase"));

    // go in a new empty subphase
    if (subPhase === currentVoteSection)
        return;
    if (subPhase > currentVoteSection) {
        let gameActions = document.getElementById("gameActions");

        let voteDiv = document.createElement("div");

        voteDiv.classList.add("votes");
        voteDiv.id = "votes_" + (subPhase);
        // insert the element after the radio buttons
        gameActions.insertBefore(voteDiv, gameActions.childNodes[1]);

        let index = subPhase - 1;
        while (document.getElementById("votes_" + index) !== null) {
            document.getElementById("votes_" + index).style.display = "none"
            index--;
        }
        genericGETRequest(contextPath + "game/players/" + gameID + "/master", fillVotes);

    } else {
        // if the game master go to a previous subPhase, all subPhase after will be reset
        document.getElementById("votes_" + subPhase).style.display = "block"
        let index = subPhase + 1;
        while (document.getElementById("votes_" + index) !== null) {
            document.getElementById("votes_" + index).remove()
            document.getElementById("voteRadio_" + index).disabled = true
            index++;
        }
        enableButton()
    }
    currentVoteSection = subPhase;
}

function fillVotes(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {

                let currentSection = document.querySelector('input[name="radio"]:checked').getAttribute("subphase")
                let votesDiv = document.getElementById("votes_" + currentSection);
                let votedPlayers = getMostVotedPlayers(currentSection - 1);
                playerRole = [];

                // populate the vote only for the living players
                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend
                    // If the player is not dead or not in the ballot.
                    if (!playsAsIn.isDead && !votedPlayers.some(item => item.player === playsAsIn.username)) {
                        let text = "Who <u>" + playsAsIn.username + "</u> voted out?";
                        let actionTarget = {
                            "player": playsAsIn.username,
                            "role": playsAsIn.role,
                            "possibleTargets": votedPlayers
                        }
                        votesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.DAY))
                    }
                }
            }
        }
    }
}

function getMostVotedPlayers(currentSection = Number(document.querySelector('input[name="radio"]:checked').getAttribute)) {
    const role_targets = document.querySelectorAll('#votes_' + currentSection + ' [id*="_targets"]');

    let voteResults = new Map()

    // get the votes of the players
    for (let i = 0; i < role_targets.length; i++) {
        let target = role_targets[i].value;

        // get the votes of the current player, 0 if is not yet present
        let votesOfPlayer = voteResults.has(target) ? voteResults.get(target) + 1 : 1;

        voteResults.set(target, votesOfPlayer)
    }

    const mapSort = new Map([...voteResults.entries()].sort((a, b) => b[1] - a[1]));

    // get the players with the highest number of vote, at lest 2 player
    let previousValue = Array.from(mapSort.values())[0]
    let selected = 0;
    for (let [key, value] of mapSort) {
        if (previousValue === value)
            selected++;
        // if is the first ballot, will take only the players with the sam max number of votes
        else if (selected < 2 && currentSection === 0) {
            previousValue = value;
            if (value === 0)
                break;
            selected++
        } else break;
    }

    let votedPlayers = []
    for (let i = 0; i < selected; i++)
        votedPlayers.push({"player": Array.from(mapSort.keys())[i]})
    return votedPlayers;
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
            for (let j = 0; j < wolfPlayers.length && !berserkAlreadyInsert; j++)
                wolfPack.push({
                    player: wolfPlayers[j].player,
                    role: actionTarget.role
                });

            if (berserkAlreadyInsert) {
                text = "Against whom the <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u> rages?"
                designatedWolvesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT, true))
            } else {
                if (actionTarget.action === "rage")
                    berserkAlreadyInsert = true;
                text = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                designatedWolvesDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT, true))
            }
        } else {
            // Add wrapper to the gameActions element
            const targetDiv = divMap[getRoleType(actionTarget.role)];
            if (targetDiv) {
                text = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                targetDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT));
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
    actionTextWolf.innerHTML = "Which <u style='color: " + rolesColors.get("wolf") + ";'> wolf</u> will do the action?";
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

// order of players in the game
let playersOrder = []

// if Sam was voted out
let samPlayer;
let plagueSpreaderPlayer;

function fillDayActions(list) {
    let gameActions = document.getElementById("gameActions");

    let sectionChange = document.createElement("div");
    let voteDiv = document.createElement("div");
    let samDiv = document.createElement("div");
    let plagueDiv = document.createElement("div");

    sectionChange.classList.add("sections", "radio-inputs");
    sectionChange.innerHTML =
        "  <label class='radio' for='voteRadio_0'>" +
        "    <input type='radio' name='radio' id='voteRadio_0' onclick='changeSubPhase(this)' checked='' subPhase='0'>" +
        "    <span class='name'>VOTE</span>" +
        "  </label>"
    sectionChange.innerHTML +=
        "  <label class='radio' for='voteRadio_1'>" +
        "    <input type='radio' name='radio' id='voteRadio_1' onclick='changeSubPhase(this)' subPhase='1' disabled=''>" +
        "    <span class='name'>1 BALLOT</span>" +
        "  </label>"
    sectionChange.innerHTML +=
        "  <label class='radio' for='voteRadio_2'>" +
        "    <input type='radio' name='radio' id='voteRadio_2' onclick='changeSubPhase(this)' subPhase='2' disabled=''>" +
        "    <span class='name'>2 BALLOT</span>" +
        "  </label>"
    gameActions.appendChild(sectionChange);

    voteDiv.classList.add("votes");
    voteDiv.id = "votes_0";
    gameActions.appendChild(voteDiv);

    samDiv.classList.add("samDiv");
    plagueDiv.classList.add("plagueDiv");

    for (let i = 0; i < list.length; i++) {
        let text;
        switch (list[i]['actionTarget']['action']) {
            case "revenge": // is Sam
                samPlayer = list[i]['actionTarget'].player;
                gameActions.appendChild(samDiv);
                text = "Who does <u style='color: " + rolesColors.get("sam") + ";'> Sam </u> want to kill?";
                samDiv.appendChild(getActionWrapper(list[i]['actionTarget'], text, GamePhase.DAY));

                let samSB = document.querySelector(".samDiv select")
                samSB.id = "sam_SB";

                samDiv.style.display = "none"
                break;
            case "plague": // is Plague spreader
                plagueSpreaderPlayer = list[i]['actionTarget'].player;

                gameActions.appendChild(plagueDiv);
                let tmpList = list[i]['actionTarget']['possibleTargets'];
                for (let j = 0; j < tmpList.length; j++)
                    playersOrder.push(tmpList[j].player)
                let plaguedPlayer = playersOrder[0];
                // remove the first player, is the one with the plagued
                playersOrder.splice(0, 1);

                plagueDiv.appendChild(createActionWrapperForPlague(plaguedPlayer, false, true))
                break;
            default:
                text = "Who <u>" + list[i]['actionTarget'].player + "</u> voted out?";
                voteDiv.appendChild(getActionWrapper(list[i]['actionTarget'], text, GamePhase.DAY));
                break;
        }
    }
}

function getActionWrapper(actionTarget, text, gamePhase, memberOfWolfPack = false) {
    // Create wrapper element to contain roleTargetsElem and text
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action-wrapper", "row");

    // Create select element
    let roleTargetsElem = document.createElement("select");
    if (gamePhase === GamePhase.NIGHT) {
        roleTargetsElem.id = actionTarget.role + "_targets";
        if (!memberOfWolfPack)
            roleTargetsElem.setAttribute("player", actionTarget.players[0].player);
        roleTargetsElem.setAttribute("memberOfWolfPack", memberOfWolfPack.toString());
    } else {
        roleTargetsElem.id = actionTarget.player + "_targets";
        roleTargetsElem.setAttribute("player", actionTarget.player);
    }
    roleTargetsElem.setAttribute("required", "required");
    roleTargetsElem.setAttribute("role", actionTarget.role);


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
    actionText.innerHTML = text
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

function updatePlaguesVictims() {
    let plagueDiv = document.getElementsByClassName("plagueDiv")[0];

    let original = ""

    let playersPlague = []
    for (let i = 0; i < playersOrder.length; i++) {
        let value = false
        let CB_ofPlayer = document.getElementById(playersOrder[i] + "_plaguedCB");

        if (CB_ofPlayer !== null) {
            value = CB_ofPlayer.checked;
            if (CB_ofPlayer.getAttribute("original") === "true")
                original = CB_ofPlayer.getAttribute("player");
        }

        playersPlague.push({
            player: playersOrder[i],
            value: value
        })
    }

    // remove contet
    plagueDiv.innerText = "";

    let nPlayers = playersOrder.length;
    let inxedOriginal = playersOrder.indexOf(original);

    plagueDiv.appendChild(createActionWrapperForPlague(original, playersPlague[inxedOriginal].value, true))

    let insertPlayers = 1
    // next player
    for (let i = inxedOriginal; i < nPlayers + inxedOriginal - 1; i++) {
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            plagueDiv.appendChild(createActionWrapperForPlague(playersOrder[(i + 1) % nPlayers], playersPlague[(i + 1) % nPlayers].value))
            insertPlayers++;
        } else break;
    }

    // previous player
    for (let i = inxedOriginal; i > inxedOriginal - nPlayers + 1; i--) {
        if (insertPlayers >= nPlayers)
            break
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            plagueDiv.prepend(createActionWrapperForPlague(playersOrder[(i + nPlayers - 1) % nPlayers], playersPlague[(i + nPlayers - 1) % nPlayers].value))
            insertPlayers++;
        } else break;
    }
}

function createActionWrapperForPlague(plaguedPlayer, checked, original = false) {
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action-wrapper", "row");

    let actionText = document.createElement("span");
    actionText.innerHTML = "<u>" + plaguedPlayer + "</u> died of the plague?"
    actionText.classList.add("col-12", "col-sm-8", "col-md-7", "mb-2", "mb-sm-0")
    actionWrapper.appendChild(actionText);

    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.id = plaguedPlayer + "_plaguedCB"
    checkBox.setAttribute("original", original.toString());
    if (original)
        checkBox.classList.add("originalPlagued")
    checkBox.setAttribute("player", plaguedPlayer);
    checkBox.checked = checked;
    checkBox.classList.add("plague_CB", "col-12", "col-sm-4", "col-md-5");
    checkBox.addEventListener("click", updatePlaguesVictims)
    actionWrapper.appendChild(checkBox);

    return actionWrapper;
}

function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');

    let player;
    let role;
    let target;

    let designatedPlayer;
    let designatedRole;

    let json = {};

    if (gamePhase === GamePhase.NIGHT) {
        let designatedWolfSB = document.getElementById("designatedWolf");
        designatedPlayer = designatedWolfSB.value
        designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].classList[0];

        let gameAction = [];

        for (let i = 0; i < role_targets.length; i++) {
            const role_target = role_targets[i];
            player = role_target.getAttribute("player");
            role = role_target.getAttribute('role');
            target = role_target.value;

            if (role_target.getAttribute("memberOfWolfPack") === "true")
                if (designatedRole === role_target.getAttribute("role")) {
                    player = designatedPlayer;
                } else
                    continue;

            if ((role === "sheriff" && target.toLowerCase() === "no shot")
                || (role === "berserker" && target.toLowerCase() === "no rage"))
                continue;

            gameAction.push({player, role, target});
        }
        json = {gameAction}
    } else {
        // day phase

        // 3 -> 1 vote + two ballot
        for (let i = 0; i < 3; i++) {
            const role_targets = document.querySelectorAll('#votes_' + i + ' [id*="_targets"]');
            if (role_targets.length === 0)
                break;

            let votes = []

            for (let i = 0; i < role_targets.length; i++) {
                const role_target = role_targets[i];
                player = role_target.getAttribute("player");
                role = role_target.getAttribute('role');
                target = role_target.value;
                votes.push({player, role, target});
            }
            json['votes_' + i] = votes;
        }

        console.log(json)

        let sem_SB = document.getElementById("sam_SB")

        let extraActions = []

        if (sem_SB !== null && sem_SB.value !== "") {
            let sam = "sam";
            let target = sem_SB.value;
            console.log({samPlayer, sam, target});
            extraActions.push({
                "player": samPlayer,
                "role": sam,
                "target": target
            });
        }

        let plagueDiv = document.getElementsByClassName("plagueDiv")[0];
        if (plagueDiv !== null) {
            let CB_ofPlayer = document.getElementsByClassName("plague_CB");
            let plague_spreader = "plague spreader"
            for (let i = 0; i < CB_ofPlayer.length; i++) {
                let infectedPlayer = CB_ofPlayer[i].getAttribute("player");
                if (CB_ofPlayer[i].checked) {
                    console.log({
                        plagueSpreaderPlayer,
                        plague_spreader,
                        infectedPlayer
                    })
                    extraActions.push({
                        "player": plagueSpreaderPlayer,
                        "role": plague_spreader,
                        "target": infectedPlayer
                    });
                }
            }
        }
        if (extraActions.length > 0)
            json['extraActions'] = extraActions;
    }

    console.log(JSON.stringify(json));
    genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), actionsResponse)
}

function actionsResponse(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let actionResults;
            let phase;
            let deadPlayers;
            let phaseInfo = "";
            if (JSON.parse(req.responseText).hasOwnProperty('gameWin')) { // the game is over
                let gameWin = JSON.parse(req.responseText)['gameWin']
                let message = gameWin.message;

                let players = gameWin['players'];
                for (let i = 0; i < players.length; i++)
                    phaseInfo += players[i].player + ", ";
                phaseInfo = phaseInfo.substring(0, phaseInfo.length - 2);

                gameOver = true

                window.scrollTo({top: 0, behavior: 'smooth'})
                console.log(gameWin)
                populateInfoMessage(message, phaseInfo)
                // location.reload()
                elementsReload()

            } else {
                if (gamePhase === GamePhase.NIGHT) {
                    actionResults = JSON.parse(req.responseText)['nightActionsResults'];
                    phase = "night";

                    let deadPlayersList = actionResults['deadPlayers'];

                    if (deadPlayersList.length === 0)
                        deadPlayers = "No deaths during the night."
                    else {
                        deadPlayers = "Deaths of the night:<br>";
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
                        deadPlayers = actionResults.votedPlayer + " was voted out:";
                    else
                        deadPlayers = "No players were voted out.";

                    if (actionResults.samTarget !== "")
                        phaseInfo += "<br>" + actionResults.samTarget + " was killed by sam:"

                    if(actionResults.carpenterAbility)
                        phaseInfo += "<br> the carpenter refused to give wood"

                    let deadPlayersList = actionResults['plaguePlayers'];
                    if (deadPlayersList.length !== 0) {
                        phaseInfo += "<br>Player(s) killed by the plague:<br>";
                        for (let i = 0; i < deadPlayersList.length; i++)
                            phaseInfo += deadPlayersList[i].player + ", ";
                        phaseInfo = phaseInfo.substring(0, phaseInfo.length - 2);
                    }
                }
                window.scrollTo({top: 0, behavior: 'smooth'})
                console.log(actionResults)
                populateInfoMessage("Results of the " + phase, deadPlayers + phaseInfo)
                // location.reload()
                elementsReload()
            }
        } else {
            let message = getMessage(req)
            populateErrorMessage(message.message, message.errorCode, message.errorDetails);
        }
    }
}