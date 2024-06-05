/**
 * Handles player search and selection.
 * It includes functions for handling key events, searching users, and manipulating the player list.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * The string that contains the user search
 */
let searchUserContain;

/**
 * The list of players
 * @type {[string]}
 */
let players = [];

/**
 * The minimum size of the search string
 * @type {number}
 */
const minSizeSearch = 1

const playerUsername = document.getElementById("playerUsername");
const playerListPopup = document.getElementById("playerListPopup");
const addPlayerBT = document.getElementById("addPlayer");

const playerList = document.getElementById('playerList');
const playerListItems = playerList.getElementsByTagName('li');
let selectedItem;

playerUsername.addEventListener("keyup", handleKeyDown);

let startedText = "";

/**
 * list of players to be ignored by search player element
 * @type {[string]}
 */
let playersToIgnore = []

document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("addPlayer").addEventListener("click", searchThePlayer);
});

/**
 * Handles key down events for the player search input.
 *
 * @param {Event} event - The key down event.
 */
function handleKeyDown(event) {
    selectedItem = document.querySelector('li.selected');
    switch (event.key) {
        case "ArrowUp": // scroll down the list
            if (selectedItem) {
                const prevItem = selectedItem.previousElementSibling;
                if (prevItem) { // if previous element exits, select that
                    selectedItem.classList.remove('selected');
                    prevItem.classList.add('selected');
                    playerUsername.value = prevItem.id;
                    prevItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                } else { // if not exist previous element, remove selection (exit from the list)
                    selectedItem.classList.remove('selected');
                    playerUsername.value = startedText;
                }
            }
            break;
        case "ArrowDown": // scroll up the list
            if (selectedItem) { // if an element is already select
                const nextItem = selectedItem.nextElementSibling;
                if (nextItem) { // if next element exist, select that
                    selectedItem.classList.remove('selected');
                    nextItem.classList.add('selected');
                    playerUsername.value = nextItem.id;
                    nextItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                }
            } else if (playerListItems.length > 0) { // no element select, is there are al least 1 element, select the first
                playerListItems[0].classList.add('selected');
                playerUsername.value = playerListItems[0].id;
                playerListItems[0].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
            }
            break;
        case "Enter": // if is Enter key, is like press the button "search"
            searchUserContain = null;
            searchThePlayer();
            hidePlayerListPopup();
            break;
        default:
            startedText = playerUsername.value;
            searchUser();
            break;
    }
}

// event listener for focus, for hide or show the list of players
playerUsername.addEventListener("blur", function () {
    hidePlayerListPopup();
});
playerUsername.addEventListener("focus", function () {
    searchUser();
});

/**
 * Searches for a user based on the input in the player search field.
 */
function searchUser() {
    let user = playerUsername.value;
    if (user.length >= minSizeSearch) {
        if (user.includes(searchUserContain)) { // local research
            populatePlayerList(players.filter(player => player.username.toLowerCase().includes(user.toLowerCase())), user);
        } else { // database request
            searchUserContain = user;
            genericGETRequest(contextPath + "user/search/" + user, savePlayers);
        }
    } else
        hidePlayerListPopup();
}

/**
 * Saves the players returned from the server and populates the player list.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function savePlayers(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            players = [];
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null)
                for (let i = 0; i < list.length; i++)
                    players.push({
                        username: list[i]['player']['username'],
                        gameId: list[i]['player']['gameId']
                    });
            populatePlayerList(players, searchUserContain);
        }
    }
}

/**
 * Show the player list popup
 */
function showPlayerListPopup() {
    playerListPopup.style.display = "block";
    playerUsername.classList.add("focus");
    addPlayerBT.classList.add("focusBT");
}

/**
 * Hide the player list popup
 */
function hidePlayerListPopup() {
    playerListPopup.style.display = "none";
    playerUsername.classList.remove("focus");
    addPlayerBT.classList.remove("focusBT");
    if (selectedItem)
        selectedItem.classList.remove('selected');
}

/**
 * Populates the player list in the popup with the given players.
 *
 * @param {Array} players - The players to populate the list with.
 * @param {string} contains - The string to highlight in the player usernames.
 */
function populatePlayerList(players, contains) {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = ""; // Clear the list before populating

    players.forEach(player => {
        if (playersToIgnore.includes(player.username.toLowerCase()))
            return; // Skip this iteration if player is to be ignored

        const li = document.createElement("li");
        let element = "<div class='playerContainer'>" + highlightContains(player.username, contains);
        if (player.gameId === null)
            element += "<span class='playerStatus available'>Available &#128994;</span></div>";
        else
            element += "<span class='playerStatus inGame'>In game   &#128308; </span></div>";
        li.innerHTML = element
        li.id = player.username;
        li.addEventListener("mousedown", function () {
            playerUsername.value = player.username;
            searchUserContain = null;
            searchThePlayer();
            hidePlayerListPopup();
        });
        playerList.appendChild(li);
    });

    if (players.length > 0)
        showPlayerListPopup();
    else
        hidePlayerListPopup();
}

/**
 * Highlights the part of the player username that contains the given string.
 *
 * @param {string} player - The player username.
 * @param {string} contains - The string to highlight.
 * @returns {string} The player username with the contains string highlighted.
 */
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

/**
 * Clears the search bar.
 */
function clearSearchBar() {
    playerUsername.value = "";
}