let searchUserContain;
let players = [];

function searchUser() {
    let user = document.getElementById("playerUsername").value;
    if (user.length >= 3) {
        if (user.includes(searchUserContain)) {
            // local research
            populatePlayerList(players.filter(username => username.toLowerCase().includes(user.toLowerCase())), user);
        } else {
            // db request
            searchUserContain = user;
            genericGETRequest(contextPath + "user/search/" + user, savePlayers);
        }
    } else
        hidePlayerListPopup();
}

function savePlayers(req) {
    players = [];
    if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
        let list = JSON.parse(req.responseText)[JSON_resource_list];
        if (list != null)
            for (let i = 0; i < list.length; i++)
                players.push(list[i]['player']['username']);
        populatePlayerList(players, searchUserContain);
    }
}

// Function to show the player list popup
function showPlayerListPopup() {
    document.getElementById("playerListPopup").style.display = "block";
}

// Function to hide the popup
function hidePlayerListPopup() {
    document.getElementById("playerListPopup").style.display = "none";
}

document.getElementById("playerUsername").addEventListener("blur", function () {
    hidePlayerListPopup();
});

document.getElementById("playerUsername").addEventListener("focus", function () {
    searchUser();
});

document.getElementById("playerUsername").addEventListener("keyup", function (event) {
    if (event.key === 'Enter')
        hidePlayerListPopup();
    else
        searchUser();
});

// Function to populate the player list in the popup
function populatePlayerList(players, contains) {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = ""; // Clear the list before populating

    players.forEach(player => {
        const li = document.createElement("li");
        li.innerHTML = highlightContains(player, contains);
        li.addEventListener("mousedown", function () {
            document.getElementById("playerUsername").value = player; // Insert the player name into the search bar
            hidePlayerListPopup(); // Hide the popup after selecting a player
        });
        playerList.appendChild(li);
    });

    if (players.length > 0)
        showPlayerListPopup();
    else
        hidePlayerListPopup();
}

function highlightContains(player, contains) {
    const index = player.toLowerCase().indexOf(contains.toLowerCase());
    if (index !== -1) {
        const prefix = player.substring(0, index);
        const highlighted = player.substring(index, index + contains.length);
        const suffix = player.substring(index + contains.length);
        return prefix + "<b>" + highlighted + "</b>" + suffix;
    } else {
        return player;
    }
}