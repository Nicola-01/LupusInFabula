document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("sendSettings").addEventListener("click", sendSettings);
    document.getElementById("addPlayer").addEventListener("click", addPlayer);
    document.getElementById("playerUsername").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addPlayer();
        }
    });
    loadGameSettings();
});


/**
 * Get the game settings.
 */
function loadGameSettings() {
    genericGETRequest(contextPath + "game/settings", fillGameSettings)
    genericGETRequest(contextPath + "user/me/friend", fillFriends)
}

function HTML_switch(name) {
    return "<label class='toggle-switch'>" +
        "  <input type='checkbox' id='" + name + "_switch'>" +
        "  <div class='toggle-switch-background'>" +
        "    <div class='toggle-switch-handle'></div>" +
        "  </div>\n" +
        "</label>\n";
}

function HTML_number_input(name, max) {
    return "<input type='number' class='roleNumber' id='" + name + "_num' min='0' max='" + max + "' value='0'/>"
}

const HTML_remove_button =
    "  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' height='25' width='25'>\n" +
    "    <path fill='#6361D9' d='M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z' clip-rule='evenodd' fill-rule='evenodd'></path>\n" +
    "  </svg>\n" +
    "  <span class='removeText'>Remove</span>";

function HTML_add_button(username) {
    return "<input type='checkbox' id='addCheckbox' class='addCheckbox visually-hidden' name='" + username + "' onclick='checkBoxPress(this)'>\n" +
        "<label for='addCheckbox' class='checkbox-label'>\n" +
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
            var list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null) {
                alert("No game settings available");
            } else {
                var table = document.getElementById("friends_tb");

                // Clear existing rows
                table.innerHTML = "<tr><th>Username</th><th>Add</th></tr>";

                // Loop through the list of friends
                for (let i = 0; i < list.length; i++) {
                    let friend = list[i]['friend']; // Use let instead of var to create a new scope for friend

                    // Create a new row
                    var row = table.insertRow();

                    // Insert username into the first cell
                    var cell0 = row.insertCell(0);
                    cell0.innerHTML = friend.username;

                    // Insert checkbox into the second cell
                    var cell1 = row.insertCell(1);

                    cell1.innerHTML = HTML_add_button(friend.username);
                }
            }
        } else {
            alert("Not logged in");
        }
    }
}

function checkBoxPress(checkbox) {
    const username = checkbox.name;
    if (checkbox.checked)
        addToPlayersTable(username);
    else
        removeFromPlayersTable(username);
}

function fillGameSettings(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)[JSON_resource_list]

            if (list == null)
                alert("No game settings available");
            else {
                // Get references to the div elements
                var goodRoles = document.getElementById("goodRoles");
                var evilRoles = document.getElementById("evilRoles");
                var neutralRoles = document.getElementById("neutralRoles");
                var victoryStealerRoles = document.getElementById("victoryStealerRoles");

                for (let i = 0; i < list.length; i++) {

                    var role = list[i]['role'];
                    if (role.max_number === 1)
                        continue;

                    // Choose the div element based on the role type
                    var targetDiv;
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
                    targetDiv.innerHTML += "<div id='role'>" + capitalizeFirstLetter(role.name) + HTML_number_input(role.name, role.max_number) + "</div><br>";
                }

                for (let i = 0; i < list.length; i++) {

                    var role = list[i]['role'];
                    if (role.max_number !== 1)
                        continue;

                    // Choose the div element based on the role type
                    var targetDiv;
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
                    targetDiv.innerHTML += "<div id='role'>" + capitalizeFirstLetter(role.name) + HTML_switch(role.name) + "</div><br>";
                }
            }
        } else
            alert("not logged in")
    }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sendSettings() {
    const num_elem = document.querySelectorAll('[id$="_num"]');
    const switch_elem = document.querySelectorAll('[id$="_switch"]');
    var roleCardinality = []

    for (let i = 0; i < switch_elem.length; i++) {
        const role = switch_elem[i].id.replace('_switch', '');
        const cardinality = switch_elem[i].checked ? 1 : 0;
        roleCardinality.push({role, cardinality});
    }

    for (let i = 0; i < num_elem.length; i++) {
        const role = num_elem[i].id.replace('_num', '');
        const cardinality = parseInt(num_elem[i].value);
        roleCardinality.push({role, cardinality});
    }
    // var json_rc = new Object();
    // json_rc.roleCardinality = roleCardinality
    //
    // console.log(roleCardinality);
    // console.log(JSON.stringify(json_rc));

    // Recover usernames from players_tb
    const playersTable = document.getElementById('players_tb');
    const playerRows = playersTable.querySelectorAll('tr');
    const player = [];
    for (let i = 1; i < playerRows.length; i++) { // Start from index 1 to skip header row
        const username = playerRows[i].cells[0].textContent.trim();
        player.push({username});
    }

    // const json_pl = new Object();
    // json_pl.player = player;
    // console.log(JSON.stringify(json_pl));

    const json = {roleCardinality, player};
    // json.roleCardinality = roleCardinality;
    // json.player = player;
    console.log(JSON.stringify(json));

    genericPOSTRequest(contextPath + "game/settings", JSON.stringify(json), empty)
}

function empty(req) {

}

function addPlayer() {
    const username = document.getElementById("playerUsername").value;
    if (username !== "") {
        addToPlayersTable(username);
        document.getElementById("playerUsername").value = "";
    }

    var checkboxes = document.querySelectorAll('#friends_tb input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.parentElement.previousElementSibling.textContent === username) {
            checkbox.checked = true;
        }
    });
}

// Function to add username to players_tb table
function addToPlayersTable(username) {
    // no duplicate
    var rows = document.getElementById("players_tb").rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent === username) {
            return;
        }
    }
    var playersTable = document.getElementById("players_tb");
    var newRow = playersTable.insertRow();
    var usernameCell = newRow.insertCell(0);
    var removeCell = newRow.insertCell(1);
    usernameCell.textContent = username;
    var removeButton = document.createElement("button");
    removeButton.setAttribute("class", "removePlayer");
    removeButton.innerHTML = HTML_remove_button;
    removeButton.addEventListener("click", function () {
        removeRow(this);
    });
    removeCell.appendChild(removeButton);
}

// Function to remove username from players_tb table
function removeFromPlayersTable(username) {
    var rows = document.getElementById("players_tb").rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent === username) {
            document.getElementById("players_tb").deleteRow(i);
            break;
        }
    }
}

// Function to remove row from players_tb table
function removeRow(button) {
    var row = button.parentNode.parentNode;
    var username = row.cells[0].textContent; // Get the username from the row
    row.parentNode.removeChild(row);

    // Uncheck the corresponding checkbox in the "friends" table
    var checkboxes = document.querySelectorAll('#friends_tb input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.parentElement.previousElementSibling.textContent === username) {
            checkbox.checked = false;
        }
    });
}
