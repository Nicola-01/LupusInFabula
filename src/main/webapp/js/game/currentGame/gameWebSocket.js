var socket;

console.log("LOADED");

function initGameWS(){
    const currentUrl = window.location.href;
    const regex = /(?<room>\w+-\w+-\w+)/;
    const match = currentUrl.match(regex);
    let room = null;

    if (match && match.groups) {
        room = match.groups.room;
        console.log("Room:", room);
    } else {
        console.warn("No room found");
        return;
    }

    var protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    var host = window.location.host;
    var path = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1)); // /lupus

    var wsUrl = protocol + host + path + "/gameWS/" + room;
    console.log(wsUrl)

    socket = new WebSocket(wsUrl);

    socket.onopen = function() {};

    socket.onmessage = function(event) {
        const msg = event.data.split(":");
        addSelection(msg[0], msg[1]);
    };

    socket.onclose = function() {
        console.log("TODO")
//        location.reload();
    };

}

document.addEventListener('click', function(event) {
    const targetDiv = event.target.closest('.circular-player');

    if (targetDiv && !!document.getElementById("eyeIcon") && document.getElementById("eyeIcon").classList.contains("fa-eye")) { // the role is visible
        const username = targetDiv.getAttribute('username');
        if (username && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(username);
        }
    }
});

function addSelection(player, targetName) {
    const oldSelection = document.querySelector(`.vote-label[data-player="${player}"]`);
    if (oldSelection)
        oldSelection.remove();
    const targetDiv = document.getElementById(targetName + "_status");
    if (targetDiv) {
        let container = targetDiv.querySelector('.vote-container');
        if (!container) {
            container = document.createElement("div");
            container.className = "vote-container";
            targetDiv.appendChild(container);
        }

        const label = document.createElement("div");
        label.innerText = player;
        label.className = "vote-label";
        label.setAttribute("data-player", player);
        container.appendChild(label);
    }
}
