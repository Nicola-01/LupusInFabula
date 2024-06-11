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
    const text = (event.target.value === "endGame") ? "Confirm to end the game." : "Confirm to return to previous phase.";
    setModalTitle("Confirmation required");
    setModalText(text);
}

/**
 * Handles the modal confirm button click event.
 * Sends the appropriate game settings request to the server based on the modal body text.
 */
function modalConfirmEvent() {
    let button = (getModalText() === "Confirm to end the game.") ? "endGameBT" : "previousRoundBT";
    let value = document.getElementById(button).value;
    genericPOSTRequest(`${contextPath}game/settings/${gameID}`, JSON.stringify({"settings": value}), settingsCallback)
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
        } else {
            document.getElementById("settingsContainer").classList.add("d-none");
            const msg = getMessage(req);
            populateErrorMessage(".errorMessage", msg.message, msg.errorCode, msg.errorDetails);
        }
    }
}