/**
 * This script handles the card toggle inside currentGame
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */


/**
 * Add event listener double click to hide or show the card
 *
 */
if(document.getElementById("card"))
    document.getElementById("card").addEventListener("dblclick",toggleCard)

/**
 * Add event listener single click to hide or show the card
 *
 */
if(document.getElementById("toggleButton"))
    document.getElementById("toggleButton").addEventListener("click",toggleCard)


/**
 * Function that hides the role of the logged in player
 *
 */
function toggleCard(skipAnimation = false) {
    const card = document.getElementById("card");

    if (skipAnimation === true)
        card.style.transition = "none";
    else
        card.style.transition = "";

    card.classList.toggle("is-flipped");
    const playerRole = document.getElementById("playerRole");
    playerRole.classList.toggle("blur-name");

    const roleBoldTag = document.querySelector("#playerRole b");

    if (roleBoldTag) {
        if (!roleBoldTag.dataset.originalRole) {
            roleBoldTag.dataset.originalRole = roleBoldTag.innerText;
        }

        if (roleBoldTag.innerText === "****") {
            roleBoldTag.innerText = roleBoldTag.dataset.originalRole;
        } else {
            roleBoldTag.innerText = "****";
        }
    }

    const eyeIcon = document.getElementById("eyeIcon");

    // change the eye icon
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
    let players = document.querySelectorAll('.circular-player');
    players.forEach(function(element) {
        element.classList.toggle('hide-background');
    });

    // hide the color of all the grid listed players
    players = document.querySelectorAll('.grid-player');
    players.forEach(function(element) {
        element.classList.toggle('hide-background');
    });

    // hide the written role of all the players
    const elements = document.querySelectorAll('#playerRole_internalDiv');
    elements.forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}
