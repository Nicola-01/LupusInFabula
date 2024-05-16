let playerRole = [];

const maxPlayersforSircularButtons = 12;

function fillPlayersStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null) {
                alert("No game settings available");
            } else {
                document.getElementById("playersStatus").innerHTML="";
                playerRole = [];
                var loggedUser = localStorage.getItem('playerName');

                for (let i = 0; i < list.length; i++) {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend
                    console.log(playsAsIn)

                    if(playsAsIn.username === loggedUser)
                        console.log("Role: "+playsAsIn.role);

                    playerRole.push(playsAsIn)
                }
                if (playerRole.length <= maxPlayersforSircularButtons)
                    createCircularButtons()
                else
                    createGridButtons()
            }
        } else {
            // alert("Not logged in");
        }
    }
}

// Function to create buttons and position them in a circle around the square div
function createCircularButtons() {
    const epsilon = 0;
    const numButtons = playerRole.length;

    // remove old buttons
    const bts = document.getElementsByClassName("circular-button");
    while (bts.length > 0) {
        bts[0].parentNode.removeChild(bts[0]);
    }

    let circleDiv = document.getElementById('circle');
    if (circleDiv == null) {
        circleDiv = document.createElement("div");
        circleDiv.id = 'circle';
        document.getElementById("playersStatus").appendChild(circleDiv);
    }

    const div_size = circleDiv.offsetWidth;
    const center = div_size / 2;

    // console.log(numButtons)

    for (let i = 0; i < numButtons; i++) {
        const angle = (Math.PI * 2 / numButtons) * i;
        const button = document.createElement('button');

        // console.log("angle: " + angle);

        // console.log(playerRole[i].username)

        button.innerHTML = playerRole[i].username + "<br>" + capitalizeFirstLetter(playerRole[i].role);
        if (playerRole[i].isDead) {
            button.innerHTML += " (dead)";
            button.style.filter = `saturate(25%)`;
        }
        button.className = "circular-button";
        button.style.backgroundColor = rolesColors.get(playerRole[i].role);
        button.style.position = 'absolute';

        circleDiv.appendChild(button); // Append button to the circle div

        let bt_width = button.getBoundingClientRect().width
        let bt_height = button.getBoundingClientRect().height

        const epsilon_angle = (Math.PI / 2 + angle) * epsilon;

        // console.log("epsilon_angle: " + epsilon_angle)
        // console.log("setted angle: " + (angle - epsilon_angle))

        button.style.left = (center + Math.sin(angle - epsilon_angle) * center - bt_width / 2) + 'px'; // X position of the button
        button.style.top = (center + -Math.cos(angle - epsilon_angle) * center - bt_height / 2) + 'px'; // Y position of the button
    }
}

function createGridButtons() {
    let playersStatusDiv = document.getElementById("playersStatus");

    for (let i = 0; i < playerRole.length; i++) {
        let playerRoleDiv = document.createElement("div");
        playerRoleDiv.classList.add("col-3", "col-sm-2", "col-md-4", "col-lg-3", "p-1")

        const button = document.createElement('button');
        button.innerHTML = playerRole[i].username + "<br>" + capitalizeFirstLetter(playerRole[i].role);
        if (playerRole[i].isDead) {
            button.innerHTML += " (dead)";
            button.style.filter = `saturate(25%)`;
        }
        button.className = "grid-button";
        button.style.backgroundColor = rolesColors.get(playerRole[i].role);

        playerRoleDiv.appendChild(button)
        playersStatusDiv.appendChild(playerRoleDiv);
    }
}