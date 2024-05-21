document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("sendSettings").addEventListener("click", sendSettings);
    genericGETRequest(contextPath + "game/settings", fillGameSettings)
    genericGETRequest(contextPath + "user/me/friend", fillFriends)

    document.getElementById("sendSettings").disabled = true;

    // list of players to be ignored by search player element, used in searchPlayer.js
    // ignore the current player
    playersToIgnore.push(localStorage.getItem("playerName").toLowerCase())
});

function HTML_switch(name) {
    return "<label class='toggle-switch'>" +
        "  <input type='checkbox' id='" + name + "_roleCard_switch'>" +
        "  <div class='toggle-switch-background'>" +
        "    <div class='toggle-switch-handle'></div>" +
        "  </div>\n" +
        "</label>\n";
}

function HTML_number_input(name, max) {
    return "<div class='number_container'>\n" +
        "  <button type='button' class='minus'><svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'> <path d='M6 12L18 12' stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path> </g></svg></button>\n" +
        "  <input type='number' class='number' id='" + name + "_roleCard_num' value='0' min='0' max='" + max + "' disabled>\n" +
        "  <button type='button' class='add'><svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'> <path d='M6 12H18M12 6V18' stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path> </g></svg></button>\n" +
        "</div>"
}

const HTML_remove_button =
    "  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' height='25' width='25'>\n" +
    "    <path fill='#6361D9' d='M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z' clip-rule='evenodd' fill-rule='evenodd'></path>\n" +
    "  </svg>\n";

function HTML_add_button(username) {
    return "<input type='checkbox' id='addCheckbox_" + username + "' class='addCheckbox visually-hidden' name='" + username + "' onclick='checkBoxPress(this)'>\n" +
        "<label for='addCheckbox_" + username + "' class='checkbox-label'>\n" +
        "  <svg xmlns='http://www.w3.org/2000/svg' width='50px' height='50px' viewBox='0 0 24 24' class='addButton'>\n" +
        "    <path d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z' stroke-width='1.5'></path>\n" +
        "    <path d='M8 12H16' stroke-width='1.5'></path>\n" +
        "    <path d='M12 16V8' stroke-width='1.5'></path>\n" +
        "  </svg>\n" +
        "</label>\n"
}

function fillFriends(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null) {
                alert("No game settings available");
            } else {
                let tbody = document.getElementById("friends_tb").querySelector("tbody");

                // Loop through the list of friends
                for (let i = 0; i < list.length; i++) {
                    let friend = list[i]['friend']; // Use let instead of let to create a new scope for friend

                    // Create a new row
                    let row = tbody.insertRow();
                    let usernameCell = row.insertCell(0);
                    row.insertCell(1);
                    let addButtonCell = row.insertCell(2);

                    // Fill cells with data
                    usernameCell.textContent = friend.username;
                    addButtonCell.innerHTML = HTML_add_button(friend.username);
                }
                sendAvailabilityRequest()
            }
        } else
            isLoggedUser(req);
    }
}

// Set interval to send request every 30 seconds
setInterval(sendAvailabilityRequest, 30000);

function sendAvailabilityRequest() {
    genericGETRequest(contextPath + "user/search/", updateAvailability)
}

function updateAvailability(req) {
// Since the database is small, I retrieve all users every time.
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {

            let players = new Map();
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null)
                for (let i = 0; i < list.length; i++)
                    players.set(list[i]['player']['username'].toLowerCase(), list[i]['player']['gameId']);

            let rows = document.getElementById("players_tb").querySelector("tbody").rows;
            for (let i = 0; i < rows.length; i++) {
                if (players.has(rows[i].cells[1].textContent.toLowerCase()))
                    rows[i].cells[2].innerHTML = (players.get(rows[i].cells[1].textContent.toLowerCase()) === null) ? "&#128994;" : "&#128308;"
                else {
                    console.log("The player: " + players.has(rows[i].cells[1].textContent) + " not exists")
                    rows[i].remove()
                    i--; // go back of one position
                }
            }

            rows = document.getElementById("friends_tb").querySelector("tbody").rows;
            for (let i = 0; i < rows.length; i++)
                rows[i].cells[1].innerHTML = (players.get(rows[i].cells[0].textContent.toLowerCase()) === null) ? "&#128994;" : "&#128308;"

        }
    }
}

function checkBoxPress(checkbox) {
    if (checkbox.checked)
        addToPlayersTable(checkbox.name);
    else
        removeFromPlayersTable(checkbox.name);
}

function fillGameSettings(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list]

            if (list == null)
                alert("No game settings available");
            else {
                // Get references to the div elements
                let goodRoles = document.getElementById("goodRoles");
                let evilRoles = document.getElementById("evilRoles");
                let neutralRoles = document.getElementById("neutralRoles");
                let victoryStealerRoles = document.getElementById("victoryStealerRoles");

                // Sorting the list in descending order based on the max_number property of the role object
                list.sort(function (a, b) {
                    return b.role.max_number - a.role.max_number;
                });

                for (let i = 0; i < list.length; i++) {

                    let role = list[i]['role'];

                    // Choose the div element based on the role type
                    let targetDiv;
                    // console.log(role.name + " " + role.type);
                    switch (role.type) {
                        case 0:
                            targetDiv = goodRoles;
                            break;
                        case 1:
                            targetDiv = evilRoles;
                            break;
                        case 2:
                            targetDiv = victoryStealerRoles;
                            break;
                        case 3:
                            targetDiv = neutralRoles;
                            break;
                        default:
                            continue;
                    }

                    // Populate the div element with role data
                    if (role.max_number === 1)
                        targetDiv.innerHTML += "<div class='role'>" + capitalizeFirstLetter(role.name) + HTML_switch(role.name) + "</div>";
                    else
                        targetDiv.innerHTML += "<div class='role'>" + capitalizeFirstLetter(role.name) + HTML_number_input(role.name, role.max_number) + "</div>";
                }
                let numberContainers = document.querySelectorAll('.number_container');
                // Loop through each container
                numberContainers.forEach(container => {
                    // Get buttons and input field within the container
                    const minusButton = container.querySelector('.minus');
                    const plusButton = container.querySelector('.add');
                    const numberInput = container.querySelector('.number');

                    // Get maximum and minimum values from HTML attribute
                    const max = parseInt(numberInput.getAttribute('max'));
                    const min = 0;

                    // Add event listeners for plus and minus buttons
                    minusButton.addEventListener('click', () => {
                        // Decrease value of input field if greater than minimum
                        if (parseInt(numberInput.value) > min)
                            numberInput.value = parseInt(numberInput.value) - 1;
                        enableButton()
                    });

                    plusButton.addEventListener('click', () => {
                        // Increase value of input field if less than maximum
                        if (parseInt(numberInput.value) < max)
                            numberInput.value = parseInt(numberInput.value) + 1;
                        enableButton()
                    });
                });

                $('[id*="_roleCard"]').click(function (event) {
                    enableButton()
                });
            }
        } else
            isLoggedUser(req);
    }
}

function enableButton() {
    const role_card = document.querySelectorAll('[id*="_roleCard"]');
    let totRoles = 0;

    let totPlayer = document.getElementById('players_tb').querySelectorAll('tr').length - 1;

    for (let i = 0; i < role_card.length; i++) {
        if (role_card[i].id.includes("_num"))
            totRoles += parseInt(role_card[i].value);
        else
            totRoles += role_card[i].checked ? 1 : 0;
    }

    document.getElementById("sendSettings").disabled = !(totPlayer >= 5 && totPlayer === totRoles);
}

function sendSettings() {
    const role_card = document.querySelectorAll('[id*="_roleCard"]');
    const roleCardinality = [];

    let role;
    let cardinality;
    for (let i = 0; i < role_card.length; i++) {
        if (role_card[i].id.includes("_num")) {
            role = role_card[i].id.replace('_roleCard_num', '');
            cardinality = parseInt(role_card[i].value);
        } else {
            role = role_card[i].id.replace('_roleCard_switch', '');
            cardinality = role_card[i].checked ? 1 : 0;
        }
        roleCardinality.push({role, cardinality});
    }

    // Recover usernames from players_tb
    const playersTable = document.getElementById('players_tb');
    const playerRows = playersTable.querySelectorAll('tr');
    const player = [];
    for (let i = 1; i < playerRows.length; i++) { // Start from index 1 to skip header row
        const username = playerRows[i].cells[1].textContent.trim();
        player.push({username});
    }

    const json = {roleCardinality, player};
    // console.log(JSON.stringify(json));
    genericPOSTRequest(contextPath + "game/settings", JSON.stringify(json), gameCreation)
}

function gameCreation(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_CREATED) {
            let game = JSON.parse(req.responseText)['game'];
            window.location.replace(contextPath + "village/" + game.public_ID);
        } else {
            let message = getMessage(req)
            if (message != null)
                populateErrorMessage(message.message, message.errorCode, message.errorDetails);
            else {
                let listMsg = JSON.parse(req.responseText)[JSON_resource_list];
                let msgs = ""
                let errorCodes = ""
                let errorDetails = ""
                if (listMsg != null) {
                    for (let i = 0; i < listMsg.length; i++) {
                        let message = listMsg[i]['message'];
                        console.log(listMsg[i])
                        msgs += message.message + "<br>";
                        if (!errorCodes.includes(message['error-code']))
                            errorCodes += ", " + message['error-code'];
                        if (!errorDetails.includes(message['error-details']))
                            errorDetails += "<br>" + message['error-details'];
                    }
                    // remove ", " from errorCodes and "<br>" form errorDetails
                    populateErrorMessage(msgs, errorCodes.substring(2), errorDetails.substring(4));
                }
            }
        }
    }
}

function addPlayer() {
    const username = document.getElementById("playerUsername").value;
    if (username !== "") {
        addToPlayersTable(username);
        document.getElementById("playerUsername").value = "";
    }

    let checkboxes = document.querySelectorAll('#friends_tb input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].parentElement.parentElement.childNodes[0].textContent === username)
            checkboxes[i].checked = true;
    }
}

// Function to add username to players_tb table
function addToPlayersTable(username) {
    // no duplicate
    let tbody = document.getElementById("players_tb").querySelector("tbody");
    let rows = tbody.rows;

    for (let i = 0; i < rows.length; i++)
        if (rows[i].cells[1].textContent.toLowerCase() === username.toLowerCase())
            return;

    // add to players to ignore
    playersToIgnore.push(username.toLowerCase())

    // Add new row
    let newRow = tbody.insertRow();
    let arrows = newRow.insertCell(0);
    let usernameCell = newRow.insertCell(1);
    newRow.insertCell(2);
    let removeCell = newRow.insertCell(3);

    arrows.innerHTML = "<div class='arrows-container'>" +
        "  <button class='arrow-up' onclick='moveUp(this)'>▲</button>" +
        "  <button class='arrow-down' onclick='moveDown(this)'>▼</button>" +
        "</div>\n"
    usernameCell.textContent = username;

    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "removePlayer");
    removeButton.innerHTML = HTML_remove_button;
    removeButton.addEventListener("click", function () {
        removeRow(this);
    });
    removeCell.appendChild(removeButton);

    let checkboxes = document.querySelectorAll('#friends_tb input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.parentElement.previousElementSibling.textContent === username) {
            checkbox.checked = true;
        }
    });

    sendAvailabilityRequest();
}

function moveUp(btn) {
    console.log("moveUp")
    const row = $(btn).parents('tr:first');
    row.insertBefore(row.prev());
}

function moveDown(btn) {
    console.log("moveDown")
    const row = $(btn).parents('tr:first');
    row.insertAfter(row.next());
}

// Function to remove username from players_tb table
function removeFromPlayersTable(username) {
    let rows = document.getElementById("players_tb").rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].textContent === username) {
            document.getElementById("players_tb").deleteRow(i);
            playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1))
            break;
        }
    }
}

// Function to remove row from players_tb table
function removeRow(button) {
    let row = button.parentNode.parentNode;
    let username = row.cells[1].textContent; // Get the username from the row
    row.parentNode.removeChild(row);

    // remove the player from the list
    playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1))

    // Uncheck the corresponding checkbox in the "friends" table
    let checkboxes = document.querySelectorAll('#friends_tb input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].parentElement.parentElement.childNodes[0].textContent === username)
            checkboxes[i].checked = false;
    }
}

// Select the table you want to observe
const table = document.getElementById('players_tb');

// Create a new instance of MutationObserver
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // Check if nodes are added or removed from the table
        if (mutation.type === 'childList')
            enableButton()
    });
});

// Configure the MutationObserver to observe changes in the table's child nodes
const config = {childList: true, subtree: true};

// Start observing the table
observer.observe(table, config);