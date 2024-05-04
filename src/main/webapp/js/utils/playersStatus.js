document.addEventListener('DOMContentLoaded', function (event) {
    let gameID = window.location.href;
    gameID = gameID.substring(gameID.lastIndexOf("/gtmp/") + 6);
    genericGETRequest(contextPath + "game/players/" + gameID, fillPlayersStatus)
});

let playerRole = [];

function fillPlayersStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null) {
                alert("No game settings available");
            } else {
                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend
                    // console.log(playsAsIn)
                    if(playsAsIn.role !== ROLE_MASTER)
                        playerRole.push(playsAsIn)
                }
                createCircularButtons()
            }
        } else {
            // alert("Not logged in");
        }
    }
}

window.onresize = createCircularButtons;

// Function to create buttons and position them in a circle around the square div
function createCircularButtons() {
    var epsilon = 0;
    var numButtons = playerRole.length;
    var bts = document.getElementsByClassName("circular-button");
    while (bts.length > 0) {
        bts[0].parentNode.removeChild(bts[0]);
    }

    var circleDiv = document.getElementById('circle');
    var bt_width = 85;
    var bt_height = 50;

    var div_size = circleDiv.offsetWidth;
    var center = div_size / 2;

    // console.log(numButtons)

    for (var i = 0; i < numButtons; i++) {
        var angle = (Math.PI * 2 / numButtons) * i;
        var button = document.createElement('button');

        // console.log("angle: " + angle);

        // console.log(playerRole[i].username)

        button.innerHTML = playerRole[i].username + "<br>" + playerRole[i].role;
        if(playerRole[i].isDead){
            button.innerHTML += " (dead)";
            button.style.filter = `saturate(25%)`;
        }
        button.className = "circular-button";
        button.style.backgroundColor = rolesColors.get(playerRole[i].role);
        button.style.position = 'absolute';
        button.style.width = bt_width + 'px'
        button.style.height = bt_height + 'px'

        var epsilon_angle = (Math.PI / 2 + angle) * epsilon;

        // console.log("epsilon_angle: " + epsilon_angle)
        // console.log("setted angle: " + (angle - epsilon_angle))

        button.style.left = (center + Math.sin(angle - epsilon_angle) * center - bt_width / 2) + 'px'; // X position of the button
        button.style.top = (center + -Math.cos(angle - epsilon_angle) * center - bt_height / 2) + 'px'; // Y position of the button
        circleDiv.appendChild(button); // Append button to the circle div
    }
}