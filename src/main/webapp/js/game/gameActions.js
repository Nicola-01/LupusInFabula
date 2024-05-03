document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;
    gameID = url.substring(url.lastIndexOf("/gameActions/") + 13, url.lastIndexOf("/"));
    console.log(gameID)

    genericGETRequest(contextPath + "game/actions/" + gameID + "/master", fillGameActions)

    document.getElementById("sendActions").addEventListener("click", sendActions);
});

let gameID;

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

                    // Create wrapper element to contain roleTargetsElem and text
                    let actionWrapper = document.createElement("div");
                    actionWrapper.setAttribute("class", "action-wrapper");

                    let roleTargetsElem = document.createElement("select");
                    roleTargetsElem.id = actionTarget.role + "_targets";
                    roleTargetsElem.name = actionTarget.role + "_targets";
                    roleTargetsElem.setAttribute("class", "roleTargets");

                    let possibleTargets = actionTarget['possibleTargets'];
                    for (let j = 0; j < possibleTargets.length; j++) {
                        let option = document.createElement("option");
                        option.text = possibleTargets[j].player; // Assuming 'player' is the property containing the player name
                        roleTargetsElem.add(option);
                    }

                    // Add text to the wrapper
                    let actionText = document.createTextNode("Who is the target of " + actionTarget.role + "?");
                    actionWrapper.appendChild(actionText);

                    // Add roleTargetsElem to the wrapper
                    actionWrapper.appendChild(roleTargetsElem);

                    // Add wrapper to the gameActions element
                    gameActions.appendChild(actionWrapper);
                }
            }
        } else
            unLoggedUser(req);
    }
}

function sendActions() {
    const role_targets = document.querySelectorAll('[id*="_targets"]');
    const gameAction = [];

    let role;
    let target;
    for (let i = 0; i < role_targets.length; i++) {

        role = role_targets[i].id.replace('_targets', '');
        target = role_targets[i].value;

        gameAction.push({role, target});
    }

    const json = {gameAction};
    console.log(JSON.stringify(json));
    genericPOSTRequest(contextPath + "game/actions/" + gameID, JSON.stringify(json), actionsResponse)
}

function actionsResponse(req){
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_CREATED) {
            let game = JSON.parse(req.responseText)['game'];
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