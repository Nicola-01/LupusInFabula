document.addEventListener('DOMContentLoaded', function (event) {

    loadGameActions();
});

/**
 *
 */
function loadGameActions() {
    genericGETRequest(contextPath + "game/settings", fillGameSettings)
    genericGETRequest(contextPath + "user/me/friend", fillFriends)
}
