document.addEventListener('DOMContentLoaded', function (event) {
    // your page initialization code here
    // the DOM will be available here
    document.getElementById("sendSettings").addEventListener("click", sendSettings);
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
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.name = "addToGameCB";
                    checkbox.addEventListener('change', function () {
                        var username = friend.username;
                        if (this.checked) {
                            addToPlayersTable(username);
                        } else {
                            removeFromPlayersTable(username);
                        }
                    });
                    cell1.appendChild(checkbox);
                }
            }
        } else {
            alert("Not logged in");
        }
    }
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


// Function to add username to players_tb table
function addToPlayersTable(username) {
    var playersTable = document.getElementById("players_tb");
    var newRow = playersTable.insertRow();
    var usernameCell = newRow.insertCell(0);
    var removeCell = newRow.insertCell(1);
    usernameCell.textContent = username;
    var removeButton = document.createElement("button");
    removeButton.innerHTML = "❌";
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
