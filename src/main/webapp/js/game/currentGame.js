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
    console.log(gameID);

    var lastSegment = url.substring(url.lastIndexOf("/") + 1);
    endsWithMaster = lastSegment === "master" || lastSegment === "master/";

    if (document.getElementById("sendActions") !== null) {
        document.getElementById("sendActions").style.display = "none"
        document.getElementById("sendActions").addEventListener("click", sendActions);
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
    if (document.getElementById("sendActions") !== null) {
        document.getElementById("sendActions").disabled = true;
    }

    // recover the data
    const master = endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/players/" + gameID + master, fillPlayersStatus);
    genericGETRequest(contextPath + "game/status/" + gameID, gameStatus);
}

// change max height
handleResize()

window.addEventListener('resize', handleResize);

/**
 * Handles the resizing of elements on the page.
 * Adjusts the height of the players status and game log elements to match the width of the game log element.
 * Recreates circular if it needs.
 */
function handleResize() {
    // Calculate the maximum height based on the width of the game log element
    let maxHeight = document.getElementById("gameLog").getBoundingClientRect().width + "px";

    // Set the height of the players status element to match the maximum height
    document.getElementById("playersStatus").style.height = maxHeight;

    // Set the maximum height of the game log element
    document.getElementById("gameLog").style.maxHeight = maxHeight;

    // Fix circle buttons if the number of player roles is within the threshold
    if (playerRole.length <= maxPlayersforSircularButtons) {
        createCircularButtons();
    }
}