let playerRole = [];

const maxPlayersforSircularButtons = 12;

// used when a player wants to hide his/her role
function toggleCard()
{
    var card = document.getElementById("card");
    card.classList.toggle("is-flipped");
    var playerRole = document.getElementById("playerRole");
    playerRole.classList.toggle("blur-name");

    var eyeIcon = document.getElementById("eyeIcon");

    if (!eyeIcon.classList.contains("fa-eye"))
    {
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
    else
    {
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }

    // hide the color of all the circular listed players
    var players = document.querySelectorAll('.circular-player');
    players.forEach(function(element) {
        element.classList.toggle('hide-background');
    });

    // hide the color of all the grid listed players
    var players = document.querySelectorAll('.grid-player');
    players.forEach(function(element) {
        element.classList.toggle('hide-background');
    });

    // hide the written role of all the players
    var elements = document.querySelectorAll('#playerRole_internalDiv');
    elements.forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}


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
                var isPlayerinGame = false;

                for (let i = 0; i < list.length; i++)
                {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend

                    // when receiving the logged in users' role
                    if(playsAsIn.username === loggedUser)
                    {
                        var playerRoleElement = document.getElementById("playerRole");
                        playerRoleElement.innerHTML = "Your role is <b>" + playsAsIn.role + "</b>";

                        var frontCard = document.querySelector(".card-front");
                        frontCard.style.backgroundImage = "url('../media/cards/"+ playsAsIn.role +".png')";
                        //var playerImageElement = document.getElementById("playerImage");
                        //playerImageElement.src = "../media/cards/" + playsAsIn.role + ".png";
                        //playerImageElement.alt = playsAsIn.role + "'s card";

                        var toggleButton = document.getElementById("toggleButton");
                        toggleButton.style.display = "inline-block";

                        isPlayerinGame = true;
                    }

                    playerRole.push(playsAsIn);
                }

                // if the player doesn't participate and it's not the master
                if(!isPlayerinGame && !endsWithMaster)
                {
                    var cardContainer = document.getElementById("cardContainer");
                    if (cardContainer) {
                        cardContainer.style.display = "none";
                    }
                    var playerRoleElement = document.getElementById("playerRole");
                    playerRoleElement.innerHTML = "You are <b>spectating</b>";
                }

                if (playerRole.length <= maxPlayersforSircularButtons)
                    circularPlayersStatus()
                else
                    gridPlayersStatus()
            }
        } else {
            // alert("Not logged in");
        }
    }
}

// Function to create buttons and position them in a circle around the square div
function circularPlayersStatus() {
    const epsilon = 0.05
    const numButtons = playerRole.length;

    let circleDiv = document.createElement("div");
    circleDiv.id = 'circle';
    circleDiv.classList.add("p-0")
    document.getElementById("playersStatus").appendChild(circleDiv);

    for (let i = 0; i < numButtons; i++) {
        const angle = (Math.PI * 2 / numButtons) * i;
        const player = document.createElement('div');

        player.innerHTML = playerRole[i].username + "<br><div id='playerRole_internalDiv'>" + capitalizeFirstLetter(playerRole[i].role)+"</div>";
        if (playerRole[i].isDead) {
            player.innerHTML += " (dead)";
            player.style.filter = `saturate(25%)`;
        }
        player.className = "circular-player";
        player.id = playerRole[i].username + "_status"
        player.style.backgroundColor = rolesColors.get(playerRole[i].role);
        player.style.position = 'absolute';

        circleDiv.appendChild(player); // Append player to the circle div

        let modX = Math.abs(Math.sin(angle))
        let modY = Math.abs(Math.cos(angle))

        let epsilon_angle = 0;
        if (!(modX === 0 || modX === 1 || modY === 0 || modY === 1)) {
            if (angle < Math.PI / 2 || (angle > Math.PI && angle < (3 / 2) * Math.PI))
                epsilon_angle = (-Math.PI) * epsilon;
            else
                epsilon_angle = (Math.PI) * epsilon;
        }

        player.style.left = (Math.sin(angle - epsilon_angle) * 50 + 50) + '%'; // X position of the player
        player.style.top = (-Math.cos(angle - epsilon_angle) * 50 + 50) + '%'; // Y position of the player
    }
}
function gridPlayersStatus() {
    let playersStatusDiv = document.getElementById("playersStatus");

    for (let i = 0; i < playerRole.length; i++) {
        let playerRoleDiv = document.createElement("div");
        playerRoleDiv.classList.add("col-3", "col-sm-2", "col-md-4", "col-lg-3", "p-1")

        const player = document.createElement('div');
        player.innerHTML = playerRole[i].username + "<br><div id='playerRole_internalDiv'>" + capitalizeFirstLetter(playerRole[i].role)+"</div>";
        if (playerRole[i].isDead) {
            player.innerHTML += " (dead)";
            player.style.filter = `saturate(25%)`;
        }
        player.id = playerRole[i].username + "_status"
        player.className = "grid-player";
        player.style.backgroundColor = rolesColors.get(playerRole[i].role);

        playerRoleDiv.appendChild(player)
        playersStatusDiv.appendChild(playerRoleDiv);
    }
}