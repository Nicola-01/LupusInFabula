document.addEventListener('DOMContentLoaded', function (event) {
    let gameID = window.location.href;
    gameID = gameID.substring(gameID.lastIndexOf("/gameActions/") + 13);
    genericGETRequest(contextPath + "game/players/" + gameID, fillGameLog)
});

function fillGameLog(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {

        }
    }
}