document.getElementById("card").addEventListener("dblclick",toggleCard)
document.getElementById("toggleButton").addEventListener("click",toggleCard)

// used when a player wants to hide his/her role
function toggleCard()
{
    const card = document.getElementById("card");
    card.classList.toggle("is-flipped");
    const playerRole = document.getElementById("playerRole");
    playerRole.classList.toggle("blur-name");

    const eyeIcon = document.getElementById("eyeIcon");

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
