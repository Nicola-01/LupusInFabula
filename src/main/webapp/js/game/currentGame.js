// change max height
handleResize()

window.addEventListener('resize', handleResize);

function handleResize() {
    let maxHeight = document.getElementById("gameLog").getBoundingClientRect().width + "px"

    document.getElementById("gameStatus").style.maxHeight = maxHeight;
    document.getElementById("gameLog").style.maxHeight = maxHeight;

    // fix circle
    if (playerRole.length <= maxPlayersforSircularButtons)
        createCircularButtons()
}