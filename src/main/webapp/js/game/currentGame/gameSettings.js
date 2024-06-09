document.addEventListener('DOMContentLoaded', function (event) {
    const gameSettings = document.getElementById("gameSettings");
    if (gameSettings) {
        gameSettings.addEventListener('click', showSettings)
        document.getElementById("endGameBT").addEventListener('click', sendGameSettings);
        document.getElementById("previousRoundBT").addEventListener('click', sendGameSettings);
    }
})

/**
 * Toggles the visibility of the settings container.
 * This function is called when the game settings button is clicked.
 */
function showSettings() {
    document.getElementById("settingsContainer").classList.toggle("d-none")
}

/**
 * Sends the game settings to the server.
 * This function is called when either the "End Game" or "Previous Round" button is clicked.
 *
 * @param {Event} event - The event object representing the button click.
 */
function sendGameSettings(event) {
    if (confirm((event.target.value === "endGame") ? "Confirm to end the game" : "Confirm to return to previous phase"))
        genericPOSTRequest(`${contextPath}game/settings/${gameID}`, JSON.stringify({ "settings": event.target.value }), settingsCallback)
}

/**
 * Callback function for handling the server's response to the game settings request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object representing the server's response.
 */
function settingsCallback(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            location.reload();
        }
        else {
            document.getElementById("settingsContainer").classList.add("d-none");
            const msg = getMessage(req);
            populateErrorMessage(".errorMessage", msg.message, msg.errorCode, msg.errorDetails);
        }
    }
}