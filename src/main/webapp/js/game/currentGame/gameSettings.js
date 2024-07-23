document.addEventListener('DOMContentLoaded', function (event) {
    const gameSettings = document.getElementById("gameSettings");
    if (gameSettings) {
        gameSettings.addEventListener('click', showSettings)
        $("#settingsContainer > button").on('click', sendGameStatusUpdate);
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
function sendGameStatusUpdate(event) {
    let text;
    switch (event.target.value) {
        case "skipDay":
            text = "Confirm to skip first Day.";
            break;

        case "previousRound":
            text = "Confirm to return to previous phase.";
            break;
        case "endGame":
            text = "Confirm to end the game.";
            break;
        default:
            text = "Not valid value.";
            break;
    }

    // const text = (event.target.value === "endGame") ? "Confirm to end the game." : "";
    setModalTitle("Confirmation required");
    setModalText(text);
    setModalButtonValue(event.target.value);
}

/**
 * Handles the modal confirm button click event.
 * Sends the appropriate game settings request to the server based on the modal body text.
 */
function modalConfirmEvent() {
    genericPUTRequest(`${contextPath}game/update/${gameID}`, JSON.stringify({"settings": getModalButtonValue()}), settingsCallback)
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

// Add a document event listener for closing the settings
document.addEventListener('click', function (event) {
    // If there is a click outside settingsContainer and settingsContainer is visible, close it
    if(event.target.id === "gameSettings" || event.target.parentElement.id === "gameSettings")
        return;

    if(event.target.id === "settingsContainer" || event.target.parentElement.id === "settingsContainer" )
        return;

    if (document.getElementById("settingsContainer") && !document.getElementById("settingsContainer").classList.contains("d-none"))
        document.getElementById("settingsContainer").classList.add("d-none")
});