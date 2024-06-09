document.addEventListener('DOMContentLoaded', function (event) {
    const gameSettings = document.getElementById("gameSettings");
    if (gameSettings) {
        gameSettings.addEventListener('click', showSettings)
        document.getElementById("endGameBT").addEventListener('click', sendGameSettings);
        document.getElementById("previousRoundBT").addEventListener('click', sendGameSettings);
    }
})

function showSettings() {
    document.getElementById("settingsContainer").classList.toggle("d-none")
}

function sendGameSettings(event) {
    if (confirm((event.target.value === "endGame") ? "Confirm to end the game" : "Confirm to return to previous phase"))
        genericPOSTRequest(`${contextPath}game/settings/${gameID}`, JSON.stringify({ "settings": event.target.value }), settingsCallback)
}

function settingsCallback(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            location.reload();
        }
    }
}