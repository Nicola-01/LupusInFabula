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
            alert("Not logged in");
        }
    }
    // createCircularButtons(8);
}

// Function to create buttons and position them in a circle around the square div
function createCircularButtons(numButtons) {
    var circleDiv = document.getElementById('circle');
    var radius = circleDiv.offsetWidth / 2; // Radius of the circle
    var centerX = circleDiv.offsetWidth / 2; // X coordinate of the center of the circle div
    var centerY = circleDiv.offsetHeight / 2; // Y coordinate of the center of the circle div

    for (var i = 0; i < numButtons; i++) {
        var angle = (Math.PI * 2 / numButtons) * i; // Calculate angle for each button
        var button = document.createElement('button');
        button.innerHTML = "Button " + (i + 1);
        button.className = "circular-button";
        button.style.position = 'absolute';
        button.style.left = (centerX + Math.cos(angle) * radius) + 'px'; // X position of the button
        button.style.top = (centerY + Math.sin(angle) * radius) + 'px'; // Y position of the button
        circleDiv.appendChild(button); // Append button to the circle div
    }
}

// Call the function with the desired number of buttons
 // You can change the number of buttons as needed
