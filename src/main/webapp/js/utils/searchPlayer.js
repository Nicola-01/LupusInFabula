let searchUserContain;
let players = [];

const minSizeSearch = 1

const playerUsername = document.getElementById("playerUsername");
const playerListPopup = document.getElementById("playerListPopup");
const addPlayerBT = document.getElementById("addPlayer");

const playerList = document.getElementById('playerList');
const playerListItems = playerList.getElementsByTagName('li');
let selectedItem;
document.getElementById("addPlayer").addEventListener("click", addPlayer);

let keyDownTimer = null;
playerUsername.addEventListener("keyup", handleKeyDown);

let startedText = "";

function handleKeyDown(event) {
    selectedItem = document.querySelector('li.selected');
    switch (event.key) {
        case "ArrowUp":
            if (selectedItem) {
                const prevItem = selectedItem.previousElementSibling;
                if (prevItem) {
                    selectedItem.classList.remove('selected');
                    prevItem.classList.add('selected');
                    playerUsername.value = prevItem.textContent;
                    prevItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                } else {
                    selectedItem.classList.remove('selected');
                    playerUsername.value = startedText;
                }
            }
            break;
        case "ArrowDown":
            if (selectedItem) {
                const nextItem = selectedItem.nextElementSibling;
                if (nextItem) {
                    selectedItem.classList.remove('selected');
                    nextItem.classList.add('selected');
                    playerUsername.value = nextItem.textContent;
                    nextItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                }
            } else {
                playerListItems[0].classList.add('selected');
                playerUsername.value = playerListItems[0].textContent;
                playerListItems[0].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
            }
            break;
        case "Enter":
            searchUserContain = null;
            addPlayer();
            hidePlayerListPopup();
            break;
        default:
            startedText = playerUsername.value;
            searchUser();
            break;
    }
}

playerUsername.addEventListener("blur", function () {
    hidePlayerListPopup();
});

playerUsername.addEventListener("focus", function () {
    searchUser();
});

function searchUser() {
    let user = playerUsername.value;
    if (user.length >= minSizeSearch) {
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
    playerListPopup.style.width = playerUsername.clientWidth + "px";
    playerListPopup.style.display = "block";
    playerUsername.classList.add("focus");
    addPlayerBT.classList.add("focusBT");
}

// Function to hide the popup
function hidePlayerListPopup() {
    playerListPopup.style.display = "none";
    playerUsername.classList.remove("focus");
    addPlayerBT.classList.remove("focusBT");
    if(selectedItem)
        selectedItem.classList.remove('selected');
}

// Function to populate the player list in the popup
function populatePlayerList(players, contains) {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = ""; // Clear the list before populating

    players.forEach(player => {
        const li = document.createElement("li");
        li.innerHTML = highlightContains(player, contains);
        li.addEventListener("mousedown", function () {
            playerUsername.value = player;
            searchUserContain = null;
            addPlayer();
            hidePlayerListPopup();
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

window.addEventListener('resize', handleResize);

function handleResize() {
    playerListPopup.style.width = playerUsername.clientWidth + "px";
}