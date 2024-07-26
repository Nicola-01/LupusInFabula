/**
 * This script manages the game interface.
 * It handles the basic interactions for managing other JavaScript
 * files and the basic graphics of the game.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * Indicates whether the URL ends with "master" or "master/"
 *
 * @type {boolean} endsWithMaster
 */
let endsWithMaster;

/**
 * The current game ID, extracted from the URL
 *
 * @type {string} gameID
 */
let gameID;

/**
 * This function is executed once the DOM is fully loaded.
 * It extracts the game ID from the URL, determines if the URL ends with "master",
 * hides the "sendActions" element if it exists, and sets up an event listener
 * for it. It also calls the elementsReload function.
 *
 * @param {Event} event - The event object for the DOMContentLoaded event.
 */
document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;

    // extract gameID
    const startIndex = url.lastIndexOf("/village/") + 9;
    let endIndex = url.indexOf("/", startIndex);
    // if url doesn't end with /
    if (endIndex === -1)
        endIndex = url.length;

    gameID = url.substring(startIndex, endIndex);

    const lastSegment = url.substring(url.lastIndexOf("/") + 1);
    endsWithMaster = (lastSegment.endsWith("master") || lastSegment.endsWith("master/"));

    if (document.getElementById("sendActions") !== null) {
        document.getElementById("sendActions").style.display = "none";
        document.getElementById("sendActions").addEventListener("click", sendActions);
    } else if (document.getElementById("gameConfBT")) {
        genericGETRequest(contextPath + "game/configuration/" + gameID, fillGameConf);
    }

    elementsReload();
});

/**
 * Reloads the elements on the page by resetting variables and state,
 * disabling the "sendActions" button if it exists, and recovering data
 * from the server by making GET requests to retrieve player status and game status.
 */
function elementsReload() {
    // reset of variables and state
    wolfPack = []
    if (document.getElementById("sendActions") !== null)
        document.getElementById("sendActions").disabled = true;

    // recover the data
    const master = endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/players/" + gameID + master, fillPlayersStatus);
    genericGETRequest(contextPath + "game/status/" + gameID, gameStatus);

    genericGETRequest(contextPath + "game/settings/" + gameID, empty);
}

// todo
function empty() {
    console.log("todo");
}

/**
 * Fill the popup with the game configuration.
 */
function fillGameConf(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let gameConfGood = document.getElementById("gameConfGood");
            let gameConfEvil = document.getElementById("gameConfEvil");
            let gameConfNeutral = document.getElementById("gameConfNeutral");
            let gameConfVictoryStealer = document.getElementById("gameConfVictoryStealer");

            let list = JSON.parse(req.responseText)[JSON_resource_list];

            for (let i = 0; i < list.length; i++) {
                let role = list[i]['role'];
                // Choose the div element based on the role type
                let targetDiv;
                // console.log(role.name + " " + role.type);
                switch (role.type) {
                    case 0:
                        targetDiv = gameConfGood;
                        break;
                    case 1:
                        targetDiv = gameConfEvil;
                        break;
                    case 2:
                        targetDiv = gameConfVictoryStealer;
                        break;
                    case 3:
                        targetDiv = gameConfNeutral;
                        break;
                    default:
                        continue;
                }

                targetDiv.classList.remove("d-none");
                let text = capitalizeFirstLetter(role.name);
                if (role.max_number > 1) {
                    text += " (" + role.max_number + ")";
                }
                targetDiv.innerHTML += text + "<br>";

            }
        }
    }
}

/**
 * Handles the resizing of elements on the page.
 * Adjusts the height of the players status and game log elements to match the width of the game log element.
 */
function handleResize() {
    // Calculate the maximum height based on the width of the game log element
    let maxHeight = (document.getElementById("gameLog").getBoundingClientRect().width + 35 + 8) + "px"; // plus the h2 text and margin

    // Set the height of the players status element to match the maximum height
    document.getElementById("playersStatusExternal").style.height = maxHeight;

    // Set the maximum height of the game log element
    document.getElementById("gameLogExternal").style.height = maxHeight;
}

/**
 * Copies the current page URL to the clipboard after removing the '/master' or '/master/' suffix if present.
 */
function copyGameLink() {
    let URL = window.location.href;
    URL = URL.replace(/\/master\/?$/, ''); // This will replace both '/master' and '/master/' at the end of the URL
    navigator.clipboard.writeText(URL).then(function () {
        console.log('URL copied to clipboard: ' + URL);
    }).catch(function (err) {
        console.error('Could not copy text: ', err);
    });
}

// change max height of playersStatus and gameLog
handleResize()

window.addEventListener('resize', handleResize);
