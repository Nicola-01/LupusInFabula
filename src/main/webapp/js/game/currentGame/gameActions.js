/**
 * Used on the currentGame page to handle game actions. This is primarily used by the game master
 * to insert actions during the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * List of players in the wolf pack.
 * @type {[string]}
 */
let wolfPack = []

/**
 * The current round of the game.
 * @type {number}
 */
let gameRound

/**
 * The current phase of the game.
 * @type {number}
 */
let gamePhase

/**
 * The current vote section.
 * @type {number}
 */
let currentVoteSection = 0;

/**
 * Order of players in the game.
 * @type {[String]}
 */
let playersOrder = []

/**
 * The player acting as Sam.
 * @type {string}
 */
let samPlayer;

/**
 * The player acting as the plague spreader.
 * @type {string}
 */
let plagueSpreaderPlayer;

/**
 * List of roles seen as evil.
 * @type {string[]}
 */
const rolesSeeAsEvil = ["berserker", "dorky", "explorer", "wolf"]

/**
 * List of factions in the game.
 * @type {string[]}
 */
const factions = ["farmers", "wolf pack", "hamster", "jester"];

/**
 * Corresponding colors for each faction.
 * @type {string[]}
 */
const factions_color = ["green", "red", "#ffcc00", "#ffcc00"];

/**
 * Handles the response from the game status GET request.
 * Updates the game status on the page, determines if the game is over,
 * and updates the display accordingly.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object containing the response data.
 */
function gameStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let game = JSON.parse(req.responseText)['game'];
            // Check if the game has ended
            if (game.who_win !== -1)
                setGameOver(game)
            else {
                const bt_gameStatus = document.getElementById("gameStatus");
                const bt_text = document.getElementById("textActionsBt");
                // Determine the current round and phase of the game
                gameRound = (game.rounds === 0) ? 1 : game.rounds;
                gamePhase = game.phase;
                if (gamePhase === GamePhase.NIGHT) {
                    if (bt_text !== null) bt_text.textContent = "NEW DAY!";
                    bt_gameStatus.textContent = "NIGHT " + gameRound;
                    logElementsReload()
                } else {
                    if (bt_text !== null) bt_text.textContent = "NEW NIGHT!";
                    bt_gameStatus.textContent = "DAY  " + gameRound;
                    logElementsReload()
                }

                // Change theme dynamically if enabled
                loadTheme();

                // If URL ends with 'master/', update actions for the game master
                if (endsWithMaster) {
                    document.getElementById("sendActions").style.display = "flex";
                    return genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions);
                }
            }
        }
    }
}

/**
 * Handles setting the game over message and updating the UI elements accordingly.
 *
 * @param {Object} game - The game object containing game information.
 * @param {string} game.start - The start time of the game.
 * @param {number} game.who_win - The index of the winning faction.
 * @param {number} game.rounds - The number of rounds played in the game.
 * @param {string} game.game_duration - The duration of the game.
 */
function setGameOver(game) {
    // Determine if 's' should be appended to the win message
    const s = game.who_win < 2 ? "" : "s";

    // set game over message
    const win_faction_div = document.getElementById("winning_faction");
    const gameTime = document.getElementById("gameTime")

    if (win_faction_div !== null && gameTime !== null) {
        win_faction_div.innerHTML = "The ";
        if (game.who_win !== 10) { // the game is a draw
            const faction_div = document.createElement('span');
            faction_div.id = "faction_name";
            faction_div.innerHTML = factions[game.who_win];
            faction_div.style.color = factions_color[game.who_win];
            win_faction_div.appendChild(faction_div);
            win_faction_div.innerHTML += " win" + s + "!";
        }
        else
            win_faction_div.innerHTML = "The game ended in a draw!";

        // Format and display game start time and duration
        const gameStart = (((game.start).split(".")[0])).split(" ")
        const gameDuration = (game.game_duration).split(":").map(Number)
        gameTime.innerHTML = "The game started on " + gameStart[0] + " at " + gameStart[1] + " and lasted for " + game.rounds + " round" + (game.rounds > 1 ? "s" : "") + ".<br>Total duration of "

        let timeStamp = gameDuration[1] + " minutes, and " + gameDuration[2] + " seconds."
        if (gameDuration[0] !== 0)
            timeStamp = gameDuration[0] + " hours, " + timeStamp

        gameTime.innerHTML += timeStamp
    }
}

/**
 * Handles the response from the game actions GET request.
 * Updates the game actions on the page based on the current game phase (Night/Day).
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object containing the response data.
 */
function fillGameActions(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            // Parse the response to get the list of actions
            let list = JSON.parse(req.responseText)[JSON_resource_list];

            // Clear the current game actions display
            document.getElementById("gameActions").innerHTML = "";

            if (list == null) {
                alert("No game settings available");
            } else {
                // Fill actions based on the current game phase
                if (gamePhase === GamePhase.NIGHT)
                    fillNightActions(list);
                else
                    fillDayActions(list);
            }
        }
    }
}

/**
 * Enables or disables the "sendActions" button based on the current game phase
 * and the selections made by the player. Ensures that all required inputs are
 * filled out before enabling the button.
 */
function enableButtons() {
    let disable = false;

    // Check the game phase
    if (gamePhase === GamePhase.NIGHT) {
        const role_targets = document.querySelectorAll('[id*="_targets"]');

        // Get the designated wolf player and role
        const designatedWolfSB = document.getElementById("designatedWolf");
        const designatedWolfPlayer = designatedWolfSB.value
        const designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

        // Iterate through the role targets
        for (let i = 0; i < role_targets.length; i++) {
            let role = role_targets[i].getAttribute("role");

            // Handle special cases for certain roles
            if (role === "illusionist") {
                const illusionistTarget = role_targets[i].value

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

                // Handle targets based on whether the illusionist's target is in the wolf pack
                if (wolfPackContainPlayer(illusionistTarget)) {
                    let targetRole = playerWolfPackRole(illusionistTarget);
                    let targetElem = document.getElementById(targetRole + "_targets")
                    const defaultOption = targetElem.querySelector('option[value=""]');
                    if (designatedWolfPlayer === illusionistTarget) {
                        defaultOption.textContent = "BLOCKED";
                        defaultOption.selected = true;
                        const firstTarget = targetElem.options[1].textContent;
                        targetElem.setAttribute("blocked", firstTarget)
                        targetElem.style.backgroundColor = ""
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
                            role_targets[j].setAttribute("blocked", firstTarget)
                            role_targets[j].style.backgroundColor = ""
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
                    role_targets[i].style.backgroundColor = 'var(--target-color-evil)'
                else
                    role_targets[i].style.backgroundColor = 'var(--target-color-good)'
            }
        }

        // Check if the designated wolf player is selected and if the required targets are chosen based on the player's role
        if (designatedWolfPlayer === "")
            disable = true
        for (let i = 0; i < role_targets.length && !disable; i++) {
            let role = role_targets[i].getAttribute("role");
            if (wolfPackContainRole(role)) {
                if (role_targets[i].hasAttribute("blocked"))
                    continue;
                else if (designatedRole === role)
                    disable = (role_targets[i].value === "")
                else
                    disable = (role_targets[i].value !== "")
            } else {
                if (role_targets[i].hasAttribute("blocked") ||
                    role_targets[i].hasAttribute('dead'))
                    continue;
                else
                    disable = (role_targets[i].value === "")
            }
        }

    } else { // Day phase
        let samDivDisplay = "none";

        // Maximum one vote and 2 ballots => 3
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
                // If there are at least 2 players, it is a ballot
                if ((votedPlayers.length) < 2) {
                    // the player is sam => enable his input box
                    if (votedPlayers[0].player === samPlayer)
                        samDivDisplay = "block"
                    if (i + 1 < maxPhase)
                        document.getElementById("voteRadio_" + (i + 1)).disabled = true
                    disable = false
                    break;
                } else {
                    if (i + 1 < maxPhase) {
                        document.getElementById("voteRadio_" + (i + 1)).disabled = false
                        populateWarningMessage(".warningMessage", "Ballot " + (i + 1) + " required", "Insert the votes of the " + (i + 1) + " ballot.")
                    }
                    disable = true
                }
            } else {
                for (let j = i + 1; j < 3; j++)
                    document.getElementById("voteRadio_" + j).disabled = true
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
    // Set the disabled state of the "sendActions" button
    document.getElementById("sendActions").disabled = disable;
}

/**
 * Determines whether a player is perceived as evil by certain roles in the game.
 *
 * @param {string} player - The username of the player being checked.
 * @returns {boolean} - True if the player is seen as evil by certain roles, false otherwise.
 */
function isPlayerSeesAsEvil(player) {
    let role;
    if (wolfPackContainPlayer(player))
        role = playerWolfPackRole(player)
    else
        // Split the string by <br> tags or spaces
        role = document.getElementById(player + "_status").innerHTML.split(/<br\s*\/?>|\s+/)[1].toLowerCase()
    return rolesSeeAsEvil.includes(role)
}

/**
 * Changes the current sub-phase of the voting process.
 * Handles the creation of new sub-phase elements or display an existing ones.
 *
 * @param {HTMLElement} radioBT - The radio button element that triggers the sub-phase change.
 */
function changeSubPhase(radioBT) {
    let subPhase = Number(radioBT.getAttribute("subPhase"));

    // If the sub-phase is the same as the current, do nothing
    if (subPhase === currentVoteSection)
        return;

    // Moving to a new sub-phase
    if (subPhase > currentVoteSection) {
        let gameActions = document.getElementById("gameActions");

        // Create a new div element for the new sub-phase
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
        genericGETRequest(contextPath + "game/players/" + gameID + "/master", fillVotes);

    } else { // Moving to a previous sub-phase
        // Display the selected sub-phase
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
    currentVoteSection = subPhase;
}

/**
 * Fills the votes section with living players who can vote, excluding those who are dead or already voted out.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object containing the response data.
 */
function fillVotes(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                // Get the current sub-phase section from the checked radio button
                let currentSection = document.querySelector('input[name="radio"]:checked').getAttribute("subphase");
                let votesDiv = document.getElementById("votes_" + currentSection);
                let votedPlayers = getMostVotedPlayers(currentSection - 1);
                playerRole = [];

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

/**
 * Retrieves the players with the most votes in the current voting section.
 *
 * @param {number} [currentSection] - The current voting section. Defaults to the section of the checked radio button.
 * @returns {Array<Object>} An array of objects representing the players with the most votes.
 */
function getMostVotedPlayers(currentSection = Number(document.querySelector('input[name="radio"]:checked').getAttribute("subPhase"))) {
    // Select all vote target elements in the current voting section
    const role_targets = document.querySelectorAll('#votes_' + currentSection + ' [id*="_targets"]');

    // Map to store vote results
    let voteResults = new Map();

    // Collect votes from all role target elements
    for (let i = 0; i < role_targets.length; i++) {
        let target = role_targets[i].value;

        // Increment the vote count for the target player
        let votesOfPlayer = voteResults.has(target) ? voteResults.get(target) + 1 : 1;
        voteResults.set(target, votesOfPlayer);
    }

    // Sort the vote results in descending order
    const mapSort = new Map([...voteResults.entries()].sort((a, b) => b[1] - a[1]));

    // Identify the players with the highest number of votes, at least two players
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

    // Collect the players with the most votes
    let votedPlayers = [];
    for (let i = 0; i < selected; i++)
        votedPlayers.push({"player": Array.from(mapSort.keys())[i]});
    return votedPlayers;
}

/**
 * Checks if a given role exists in the wolfPack array.
 *
 * @param {string} role - The role to check for in the wolfPack array.
 * @returns {boolean} True if the role exists in the wolfPack array; otherwise, false.
 */
function wolfPackContainRole(role) {
    for (const wp of wolfPack)
        if (wp.role === role)
            return true;
    return false;
}

/**
 * Checks if a given player exists in the wolfPack array.
 *
 * @param {string} player - The player to check for in the wolfPack array.
 * @returns {boolean} True if the role exists in the wolfPack array; otherwise, false.
 */
function wolfPackContainPlayer(player) {
    for (const wp of wolfPack)
        if (wp.player === player)
            return true;
    return false;
}

/**
 * Return a role of given player of wolf pack.
 *
 * @param {string} player - The player to get the role.
 * @returns {boolean|null} True if the role exists in the wolfPack array; otherwise, false.
 */
function playerWolfPackRole(player) {
    for (const wp of wolfPack)
        if (wp.player === player)
            return wp.role;
    return null;
}

/**
 * Updates the options and enables/disables select boxes associated with the designated wolf role.
 */
function changeDesignatedWolf() {
    let designatedWolfSB = document.getElementById("designatedWolf");
    let designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

    // Iterate over each select box associated with a role
    const designatedWolves = document.querySelectorAll('#designatedWolves [id$="_targets"]');
    for (let i = 0; i < designatedWolves.length; i++) {
        const defaultOption = designatedWolves[i].querySelector('option[value=""]');
        if (designatedWolves[i].getAttribute("role") !== designatedRole) {
            // Update options for non-designated roles
            defaultOption.textContent = "Not the designated role";
            defaultOption.selected = true;
            designatedWolves[i].disabled = true;
        } else {
            // Enable select box for designated role and reset default option
            designatedWolves[i].disabled = false;
            defaultOption.textContent = "Select a target";
            defaultOption.selected = true;
        }
    }
    // Enable/disable action buttons based on the selected wolf and other conditions
    enableButtons()
}

/**
 * Fills the night actions on the game page based on the provided list of actions.
 *
 * @param {Array} list - The list of actions to be processed and displayed.
 */
function fillNightActions(list) {
    let gameActions = document.getElementById("gameActions");

    // Create div elements for different role types
    let evilDiv = document.createElement("div");
    let neutralDiv = document.createElement("div");
    let goodDiv = document.createElement("div");
    let vicStealDiv = document.createElement("div");

    evilDiv.classList.add("evilRoles", "mt-0");
    neutralDiv.classList.add("neutralRoles", "mt-0");
    goodDiv.classList.add("goodRoles", "mt-0");
    vicStealDiv.classList.add("victoryStealerRoles", "mt-0");

    // Create a div to contain designated wolves
    let designatedWolfDiv = document.createElement("div");
    designatedWolfDiv.id = "designatedWolfDiv";

    let designatedWolvesDiv = document.createElement("div");
    designatedWolvesDiv.id = "designatedWolves";

    // Create a div to contain all designated wolves
    designatedWolvesDiv.appendChild(designatedWolfDiv);
    designatedWolvesDiv.appendChild(document.createElement("hr"));

    evilDiv.appendChild(designatedWolvesDiv);

    // Map role types to their respective div elements
    const divMap = {
        "good": goodDiv,
        "evil": evilDiv,
        "victory stealer": vicStealDiv,
        "neutral": neutralDiv
    };

    let berserkAlreadyInsert = false;
    let text;

    // Iterate over each action in the list
    for (let i = 0; i < list.length; i++) {
        let actionTarget = list[i]['actionTarget'];

        // get the wolves that can do ad action for kill someone
        if (actionTarget.action === "maul" || actionTarget.action === "rage" || actionTarget.action === "explore") {
            let wolfPlayers = actionTarget['players'];
            for (let j = 0; j < wolfPlayers.length; j++) {
                if (!wolfPack.some(p => p.player === wolfPlayers[j].player))
                    wolfPack.push({
                        player: wolfPlayers[j].player,
                        role: actionTarget.role
                    });
            }

            // Insert action wrapper for wolf-related actions
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
            // Add action wrapper to the respective div based on role type
            const targetDiv = divMap[getRoleType(actionTarget.role)];
            if (targetDiv) {
                text = "Who is the target of <u style='color: " + rolesColors.get(actionTarget.role) + ";'>" + actionTarget.role + "</u>?";
                targetDiv.appendChild(getActionWrapper(actionTarget, text, GamePhase.NIGHT));
            }
        }
    }

    // Create elements for selecting the designated wolf
    let actionWrapperWolf = document.createElement("div");
    actionWrapperWolf.classList.add("action-wrapper", "row");

    let designatedWolf = document.createElement("select");
    designatedWolf.id = "designatedWolf";
    designatedWolf.setAttribute("required", "required");
    designatedWolf.classList.add("roleTargets");
    designatedWolf.addEventListener('change', enableButtons);

    // Create default option
    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.setAttribute("disabled", "disabled");
    defaultOption.setAttribute("selected", "selected");
    defaultOption.textContent = "Select option";
    designatedWolf.append(defaultOption);

    // Populate the designated wolf select box
    for (let i = 0; i < wolfPack.length; i++) {
        let option = document.createElement("option");
        option.text = wolfPack[i].player; // Assuming 'player' is the property containing the player name
        option.setAttribute("role", wolfPack[i].role)
        designatedWolf.add(option);
    }

    designatedWolf.addEventListener('change', changeDesignatedWolf);

    // Add text to the wrapper
    let actionTextWolf = document.createElement("span");
    actionTextWolf.innerHTML = "Which <u style='color: " + rolesColors.get("wolf") + ";'> wolf</u> will do the action?";
    actionTextWolf.classList.add("col-12", "col-sm-8", "col-md-7")
    actionWrapperWolf.appendChild(actionTextWolf);

    insertSelectionBox(actionWrapperWolf, designatedWolf);
    designatedWolfDiv.appendChild(actionWrapperWolf);

    // Append role divs to the game actions element (only if contains something)
    if (evilDiv.innerHTML !== "") gameActions.appendChild(evilDiv);
    if (neutralDiv.innerHTML !== "") gameActions.appendChild(neutralDiv);
    if (goodDiv.innerHTML !== "") gameActions.appendChild(goodDiv);
    if (vicStealDiv.innerHTML !== "") gameActions.appendChild(vicStealDiv);

    // Update designated wolf select box
    changeDesignatedWolf()
}

/**
 * Fills the actions for the day phase, including voting and special actions like Sam's revenge or plague spreading.
 *
 * @param {Object[]} list - The list of actions for the day phase.
 */
function fillDayActions(list) {
    let gameActions = document.getElementById("gameActions");

    // Create a section for changing voting phases
    let sectionChange = document.createElement("div");
    let voteDiv = document.createElement("div");
    let samDiv = document.createElement("div");
    let plagueDiv = document.createElement("div");

    sectionChange.classList.add("sections", "radio-inputs", "m-0", "mb-2", "row");
    // Add HTML content to the section for changing voting phases
    sectionChange.innerHTML =
        "  <label class='radio col-4' for='voteRadio_0'>" +
        "    <input type='radio' name='radio' id='voteRadio_0' checked='' subPhase='0'>" +
        "    <span>VOTE</span>" +
        "  </label>"
    sectionChange.innerHTML +=
        "  <label class='radio col-4' for='voteRadio_1'>" +
        "    <input type='radio' name='radio' id='voteRadio_1' subPhase='1' disabled=''>" +
        "    <span>1 BALLOT</span>" +
        "  </label>"
    sectionChange.innerHTML +=
        "  <label class='radio col-4' for='voteRadio_2'>" +
        "    <input type='radio' name='radio' id='voteRadio_2' subPhase='2' disabled=''>" +
        "    <span>2 BALLOT</span>" +
        "  </label>"
    gameActions.appendChild(sectionChange);

    // Add event listeners to the voting phase radio buttons
    const voteRadio = document.querySelectorAll('[id*="voteRadio_"]');
    for (let i = 0; i < voteRadio.length; i++)
        voteRadio[i].addEventListener('click', function () {
            changeSubPhase(voteRadio[i]);
        });

    // Create a container for displaying voting actions
    voteDiv.classList.add("votes");
    voteDiv.id = "votes_0";
    gameActions.appendChild(voteDiv);

    // Create a container for Sam and plague spreader action
    samDiv.classList.add("samDiv");
    plagueDiv.classList.add("plagueDiv");

    // Iterate through the list of actions for the day phase
    for (let i = 0; i < list.length; i++) {
        let text;
        switch (list[i]['actionTarget']['action']) {
            case "revenge": // Sam's revenge action
                samPlayer = list[i]['actionTarget'].player;
                gameActions.appendChild(samDiv);
                text = "Who does <u style='color: " + rolesColors.get("sam") + ";'> Sam </u> want to kill?";
                samDiv.appendChild(getActionWrapper(list[i]['actionTarget'], text, GamePhase.DAY));

                let samSB = document.querySelector(".samDiv select");
                samSB.id = "sam_SB";

                samDiv.style.display = "none";
                break;
            case "plague":// Plague spreading action
                plagueSpreaderPlayer = list[i]['actionTarget'].player;

                let tmpList = list[i]['actionTarget']['possibleTargets'];
                for (let j = 0; j < tmpList.length; j++)
                    playersOrder.push(tmpList[j].player)
                let plaguedPlayer = playersOrder[0];

                // the plagueSpreader did not infect anyone
                if (plaguedPlayer == null) break;

                // Remove the first player, which is the one with the plague
                playersOrder.splice(0, 1);

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

/**
 * Creates a wrapper element to contain a select element for selecting action targets and accompanying text.
 *
 * @param {Object} actionTarget - The action target object containing information about the target.
 * @param {string} text - The text to be displayed alongside the select element.
 * @param {string} gamePhase - The current phase of the game ('NIGHT' or 'DAY').
 * @param {boolean} memberOfWolfPack - Indicates whether the player is a member of the wolf pack (default: false).
 * @returns {HTMLElement} - The wrapper element containing the select element and text.
 */
function getActionWrapper(actionTarget, text, gamePhase, memberOfWolfPack = false) {
    // Create wrapper element to contain roleTargetsElem and text
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action-wrapper", "row");

    // Create select element
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

    // Create default option
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

    // Add text to the wrapper
    let actionText = document.createElement("span");
    actionText.innerHTML = text
    actionText.classList.add("col-12", "col-sm-8", "col-md-7", "mb-2", "mb-sm-0")
    actionWrapper.appendChild(actionText);

    roleTargetsElem.addEventListener('change', enableButtons);

    // Add roleTargetsElem to the wrapper
    insertSelectionBox(actionWrapper, roleTargetsElem);

    return actionWrapper;
}

/**
 * Inserts a selection box into an action wrapper.
 *
 * @param {HTMLElement} actionWrapper - The wrapper element for the action.
 * @param {HTMLElement} selectBox - The select box element to be inserted.
 */
function insertSelectionBox(actionWrapper, selectBox) {
    // Create label element
    const label = document.createElement("label");
    label.classList.add("select", "roleTargets", "col-12", "col-sm-4", "col-md-5");
    label.setAttribute("for", selectBox.id);

    // Append select to label
    label.appendChild(selectBox);

    // Add roleTargetsElem to the wrapper
    actionWrapper.appendChild(label);
    // actionWrapper.appendChild(svgSprites);
}

/**
 * Updates the display of plague victims based on the current plague spreader's selection.
 */
function updatePlaguesVictims() {
    // Get the plagueDiv element
    let plagueDiv = document.getElementsByClassName("plagueDiv")[0];

    let original = ""
    let playersPlague = []

    // Loop through all players to get their plagued status
    for (let i = 0; i < playersOrder.length; i++) {
        let value = false
        let CB_ofPlayer = document.getElementById(playersOrder[i] + "_plaguedCB");

        // Check if the checkbox exists for the current player
        if (CB_ofPlayer !== null) {
            value = CB_ofPlayer.checked;
            if (CB_ofPlayer.getAttribute("original") === "true")
                original = CB_ofPlayer.getAttribute("player");
        }

        // Add player and their plagued status to playersPlague array
        playersPlague.push({
            player: playersOrder[i],
            value: value
        })
    }

    // Remove existing content from plagueDiv
    plagueDiv.innerText = "";

    // Initialize variables for number of players and index of original plague spreader
    let nPlayers = playersOrder.length;
    let indexOriginal = playersOrder.indexOf(original);

    // Create and append the checkbox for the original plague spreader
    let plagueCB = createActionWrapperForPlague(original, true);
    plagueDiv.appendChild(plagueCB)
    plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[indexOriginal].value;

    let insertPlayers = 1

    // Loop through players after the original plague spreader
    for (let i = indexOriginal; i < nPlayers + indexOriginal - 1; i++) {
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            // Create and append a checkbox for the next player if they are plagued
            plagueCB = createActionWrapperForPlague(playersOrder[(i + 1) % nPlayers]);
            plagueDiv.appendChild(plagueCB);
            plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[(i + 1) % nPlayers].value;
            insertPlayers++;
        } else break;
    }

    // Loop through players before the original plague spreader
    for (let i = indexOriginal; i > indexOriginal - nPlayers + 1; i--) {
        // Check if all players have been inserted
        if (insertPlayers >= nPlayers)
            break
        if (playersPlague[(i + nPlayers) % nPlayers].value) {
            // Prepend a checkbox for the previous player if they are plagued
            plagueCB = createActionWrapperForPlague(playersOrder[(i + nPlayers - 1) % nPlayers])
            plagueDiv.prepend(plagueCB);
            plagueCB.getElementsByClassName("plague_CB")[0].checked = playersPlague[(i + nPlayers - 1) % nPlayers].value;
            insertPlayers++;
        } else break;
    }
    // Add listeners to the plague checkboxes
    addPlaguesListener();
}

/**
 * Creates an action wrapper for displaying a checkbox related to plague victims.
 *
 * @param {string} plaguedPlayer - The name of the plagued player.
 * @param {boolean} original - Indicates if the player is the original plague spreader.
 * @returns {HTMLElement} The action wrapper containing the checkbox.
 */
function createActionWrapperForPlague(plaguedPlayer, original = false) {
    // Create the action wrapper element
    let actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action-wrapper", "row");

    // Create the text indicating the player's status
    let actionText = document.createElement("span");
    actionText.innerHTML = "<u>" + plaguedPlayer + "</u> died of the plague?"
    actionText.classList.add("col-12", "col-sm-8", "col-md-7", "mb-2", "mb-sm-0")
    actionWrapper.appendChild(actionText);

    // Create the checkbox element
    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.id = plaguedPlayer + "_plaguedCB"
    checkBox.setAttribute("original", original.toString());
    if (original)
        checkBox.classList.add("originalPlagued")
    checkBox.setAttribute("player", plaguedPlayer);
    checkBox.classList.add("inp-cbx", "plague_CB") //), "col-12", "col-sm-4", "col-md-5");

    // Wrap the checkbox element
    actionWrapper.appendChild(wrapPlaguedCheckBox(checkBox));
    return actionWrapper;
}

/**
 * Adds click event listeners to the plague checkboxes.
 */
function addPlaguesListener() {
    // Select all plague checkboxes and add click event listener to each checkbox
    $('.plague_CB').click(updatePlaguesVictims);
}

/**
 * Wraps the given checkbox element in a container div with specific classes and adds label elements using plain JavaScript.
 * @param {HTMLElement} checkbox - The checkbox element to wrap.
 * @returns {HTMLElement} The container div wrapping the checkbox.
 */
function wrapPlaguedCheckBox(checkbox) {
    const divCont = document.createElement("div")
    divCont.classList.add("checkbox-wrapper", "col-12", "col-sm-4", "col-md-5", "d-flax");
    divCont.appendChild(checkbox)

    divCont.innerHTML +=
        "  <label class='cbx' for='" + checkbox.id + "'><span>" +
        "  <svg width='12px' height='10px'>" +
        "    <use xlink:href='#check-4'></use>" +
        "  </svg></span><span>Died of plague</span></label>" +
        "  <svg class='inline-svg'>" +
        "    <symbol id='check-4' viewbox='0 0 12 10'>" +
        "      <polyline points='1.5 6 4.5 9 10.5 1'></polyline>" +
        "    </symbol>" +
        "  </svg>"

    return divCont;
}

/**
 * Sends the actions performed by players during the game to the server.
 */
function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');

    let player;
    let role;
    let target;

    let designatedPlayer;
    let designatedRole;

    let json = {};

    if (gamePhase === GamePhase.NIGHT) {
        // Get designated wolf and their role
        let designatedWolfSB = document.getElementById("designatedWolf");
        designatedPlayer = designatedWolfSB.value;
        designatedRole = designatedWolfSB.options[designatedWolfSB.selectedIndex].getAttribute("role");

        let gameAction = [];

        // Collect actions for each player
        for (let i = 0; i < role_targets.length; i++) {
            if (role_targets[i].hasAttribute('dead'))
                continue;
            const role_target = role_targets[i];
            player = role_target.getAttribute("player");
            role = role_target.getAttribute('role');

            // Determine target based on role and whether it's blocked
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

        // Collect votes for each phase
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
            // console.log({samPlayer, sam, target});
            extraActions.push({
                "player": samPlayer,
                "role": sam,
                "target": target
            });
        }

        // add plague spreader's actions if present
        let plagueDiv = document.getElementsByClassName("plagueDiv")[0];
        if (plagueDiv !== null) {
            let CB_ofPlayer = document.getElementsByClassName("plague_CB");
            let plague_spreader = "plague spreader"
            for (let i = 0; i < CB_ofPlayer.length; i++) {
                let infectedPlayer = CB_ofPlayer[i].getAttribute("player");
                if (CB_ofPlayer[i].checked) {
                    // console.log({plagueSpreaderPlayer, plague_spreader, infectedPlayer})
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

    // Send the JSON object via a POST request to the server
    genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), actionsResponse)
}

/**
 * Handles the response received from the server after sending actions during the game.
 * Processes the response to display relevant information to the players.
 * If the game is over, displays the game results and reloads the page.
 * If the game is ongoing, displays the results of the night or day phase actions.
 * @param {XMLHttpRequest} req - The XMLHttpRequest object containing the response from the server.
 */
function actionsResponse(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            hideMessagePopup(".warningMessage"); // hide ballot popup
            let actionResults;
            let phase;
            let deadPlayers;
            let phaseInfo = "";
            // Check if the game is over
            if (JSON.parse(req.responseText).hasOwnProperty('gameWin')) {
                let gameWin = JSON.parse(req.responseText)['gameWin']
                let message = gameWin.message;

                let players = gameWin['players'];
                // Construct phase information for game-over message
                for (let i = 0; i < players.length; i++)
                    phaseInfo += players[i].player + ", ";
                phaseInfo = phaseInfo.substring(0, phaseInfo.length - 2);

                window.scrollTo({top: 0, behavior: 'smooth'})
                populateInfoMessage(".infoMessage", message, phaseInfo)
                location.reload()
            } else {
                // Game is ongoing
                if (gamePhase === GamePhase.NIGHT) {
                    actionResults = JSON.parse(req.responseText)['nightActionsResults'];
                    phase = "night";

                    let deadPlayersList = actionResults['deadPlayers'];

                    // Determine if any deaths occurred during the night
                    if (deadPlayersList.length === 0)
                        deadPlayers = "No deaths during the night."
                    else {
                        deadPlayers = "Deaths of the night: ";
                        for (let i = 0; i < deadPlayersList.length; i++)
                            deadPlayers += deadPlayersList[i].player + ", ";
                        deadPlayers = deadPlayers.substring(0, deadPlayers.length - 2);
                    }

                    // Check for additional night action results
                    if (actionResults.dorkyIsWolf)
                        phaseInfo += "<br>The Dorky became a wolf!";
                    if (actionResults.puppyIsWolf)
                        phaseInfo += "<br>The puppy became a wolf!";
                    if (actionResults.plaguedPlayer !== "")
                        phaseInfo += "<br> " + actionResults.plaguedPlayer + " has the plague!";
                } else {
                    // Day phase
                    actionResults = JSON.parse(req.responseText)['dayActionsResults'];
                    phase = "day";

                    // Determine if any players were voted out during the day
                    if (actionResults.votedPlayer !== "")
                        deadPlayers = actionResults.votedPlayer + " was voted out";
                    else
                        deadPlayers = "No players were voted out.";

                    // Check for additional day action results
                    if (actionResults.samTarget !== "")
                        phaseInfo += "<br>" + actionResults.samTarget + " was killed by sam:"
                    if (actionResults.carpenterAbility)
                        phaseInfo += "<br> the carpenter refused to give wood"

                    // Determine if any players were killed by the plague
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
            // Error handling
            let message = getMessage(req)
            populateErrorMessage(".errorMessage", message.message, message.errorCode, message.errorDetails);
        }
    }
}

/**
 * Resets game variables to their initial values.
 */
function variableResets() {
    wolfPack = [];
    gameRound = -1;
    gamePhase = -1;
    currentVoteSection = -1
    playersOrder = [];
    samPlayer = "";
    plagueSpreaderPlayer = "";
}