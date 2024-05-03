document.addEventListener('DOMContentLoaded', function (event) {
    let gameID = window.location.href;
    gameID = gameID.substring(gameID.lastIndexOf("/gameActions/") + 13);
    console.log(gameID)

    genericGETRequest(contextPath + "game/actions/" + gameID, fillGameActions)
});

function fillGameActions(req) {

}