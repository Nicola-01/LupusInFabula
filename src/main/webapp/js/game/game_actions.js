document.addEventListener('DOMContentLoaded', function (event) {

    gameID = window.location.href;
    gameID = gameID.substring(gameID.lastIndexOf("/gameActions/") + 13);
    loadGameActions();
});
let gameID;

/**
 *
 */
function loadGameActions() {
    console.log(gameID)

    genericGETRequest(contextPath + "game/actions/" + gameID, fillGameActions)
    genericGETRequest(contextPath + "game/players/" + gameID, fillPlayersStatus)
}

function fillGameActions(req) {

}

function fillPlayersStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null) {
                alert("No game settings available");
            } else {
                // var table = document.getElementById("friends_tb");

                // Clear existing rows
                // table.innerHTML = "<tr><th>Username</th><th>Add</th></tr>";

                // Loop through the list of friends
                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend
                    console.log(playsAsIn)

                    // // Create a new row
                    // var row = table.insertRow();
                    //
                    // // Insert username into the first cell
                    // var cell0 = row.insertCell(0);
                    // cell0.innerHTML = friend.username;
                    //
                    // // Insert checkbox into the second cell
                    // var cell1 = row.insertCell(1);
                    //
                    // cell1.innerHTML = HTML_add_button(friend.username);
                }
            }
        } else {
            // alert("Not logged in");
        }
    }
    // createCircularButtons(8);
}

// Function to create buttons and position them in a circle around the square div
function createCircularButtons(numButtons) {
    var bts = document.getElementsByClassName("circular-button");
    while (bts.length > 0) {
        bts[0].parentNode.removeChild(bts[0]);
    }


    var circleDiv = document.getElementById('circle');
    var bt_width = 100;
    var bt_height = 60;

    var div_size = circleDiv.offsetWidth
    var center = div_size / 2;

    var vertical_distance = (numButtons / 2) / div_size;

    for (var i = 0; i < numButtons / 2; i++) {
        console.log(center - vertical_distance * i)
        var angle = Math.asin(center - vertical_distance * i);
        console.log(angle)
        var button = document.createElement('button');
        button.innerHTML = "Button " + (i + 1);
        button.className = "circular-button";
        button.style.position = 'absolute';
        button.style.width = bt_width + 'px'
        button.style.height = bt_height + 'px'
        button.style.left = (center + Math.cos(angle) * div_size - bt_width / 2) + 'px'; // X position of the button
        button.style.top = (center + Math.sin(angle) * div_size - bt_height / 2) + 'px'; // Y position of the button
        circleDiv.appendChild(button); // Append button to the circle div
    }
}

// Call the function with the desired number of buttons
// You can change the number of buttons as needed
