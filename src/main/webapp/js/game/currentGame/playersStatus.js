/**
 * Used for showing a grid or a circle containing all the users, their roles, and their status (i.e., dead or not).
 * Also, if the current player is one in the game, show his card.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * Array to store player roles.
 *
 * @type {[string]}
 */
let playerRole = [];

/**
 * Maximum number of players for displaying circular buttons.
 *
 * @type {number}
 */
const maxPlayersForCircularButtons = 12;

/**
 * Fills the player status based on the request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function fillPlayersStatus(req) {
    if (req.readyState === XMLHttpRequest.DONE)
    {
        if (req.status === HTTP_STATUS_OK)
        {
            const list = JSON.parse(req.responseText)[JSON_resource_list];

            if (list == null)
                alert("No game settings available");
            else
            {
                document.getElementById("playersStatus").innerHTML="";
                playerRole = [];
                const loggedUser = localStorage.getItem('playerName');
                let isPlayerInGame = false;

                for (let i = 0; i < list.length; i++)
                {
                    let playsAsIn = list[i]['playsAsIn']; // Use let instead of var to create a new scope for friend

                    // when receiving the logged-in users' role
                    if(playsAsIn.username === loggedUser)
                    {
                        let playerRoleElement = document.getElementById("playerRole");
                        if(playerRoleElement !== null)
                            playerRoleElement.innerHTML = "Your role is <b>" + playsAsIn.role + "</b>";

                        const frontCard = document.querySelector(".card-front");
                        if(frontCard !== null)
                            frontCard.style.backgroundImage = "url('../media/cards/"+ playsAsIn.role +".png')";

                        const selectedBack = getCookie("selectedCard");
                        const cardBack = document.querySelector(".card-back");
                        if(cardBack && selectedBack)
                            cardBack.style.backgroundImage = "url('../media/cards/card_back/"+selectedBack+"')";


                        const toggleButton = document.getElementById("toggleButton");
                        if(toggleButton !== null)
                            toggleButton.style.display = "inline-block";

                        isPlayerInGame = true;
                    }

                    playerRole.push(playsAsIn);
                }

                // if the player doesn't participate, and it's not the master
                if(!isPlayerInGame && !endsWithMaster)
                {
                    const cardContainer = document.getElementById("cardContainer");
                    if (cardContainer) {
                        cardContainer.style.display = "none";
                    }
                    const playerRoleElement = document.getElementById("playerRole");
                    if(playerRoleElement)
                        playerRoleElement.innerHTML = "You are <b>spectating</b>";
                }

                if (playerRole.length <= maxPlayersForCircularButtons)
                    circularPlayersStatus();
                else
                    gridPlayersStatus();

                // by default, the role is hidden
                if (document.getElementById("toggleButton")) {
                    const toggleElement = document.getElementById("toggleButton");

                    if (toggleElement.style.display !== "none") {
                        toggleCard();
                    }
                }
            }
        } else {
            // alert("Not logged in");
        }
    }
}

/**
 * Creates a player div based on the given player role.
 *
 * @param {Object} playerRole - The role of the player.
 * @param {string} className - The CSS class name for styling.
 * @returns {HTMLElement} The player div.
 */
function createUserDiv(playerRole, className){
    const player = document.createElement('div');

    player.innerHTML = playerRole.username + "<br><div id='playerRole_internalDiv'>" + capitalizeFirstLetter(playerRole.role)+"</div>";
    if (playerRole.isDead) {
        player.innerHTML += " (dead)";
        player.style.filter = `saturate(25%)`;
    }
    player.className = className;
    player.id = playerRole.username + "_status";
    player.style.backgroundColor = rolesColors.get(playerRole.role);
    if(className === "circular-player")
        player.style.position = 'absolute';
    // use only light theme
    player.setAttribute("data-bs-theme","light");

    return player
}

/**
 * Positions players in a circular layout.
 */
function circularPlayersStatus() {
    const epsilon = 0.05
    const numButtons = playerRole.length;

    let circleDiv = document.createElement("div");
    circleDiv.id = 'circle';
    circleDiv.classList.add("p-0")
    document.getElementById("playersStatus").appendChild(circleDiv);

    for (let i = 0; i < numButtons; i++) {
        const angle = (Math.PI * 2 / numButtons) * i;

        const player= createUserDiv(playerRole[i], "circular-player")
        circleDiv.appendChild(player); // Append player to the circle div

        let modX = Math.abs(Math.sin(angle));
        let modY = Math.abs(Math.cos(angle));

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

/**
 * Positions players in a grid layout.
 */
function gridPlayersStatus() {
    let playersStatusDiv = document.getElementById("playersStatus");

    for (let i = 0; i < playerRole.length; i++) {
        let playerRoleDiv = document.createElement("div");
        playerRoleDiv.classList.add("col-3", "col-md-4", "col-lg-3", "p-1", "m-auto"); // , "col-sm-2"

        const player= createUserDiv(playerRole[i], "grid-player")

        playerRoleDiv.appendChild(player);
        playersStatusDiv.appendChild(playerRoleDiv);
    }
}