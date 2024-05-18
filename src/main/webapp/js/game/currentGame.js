// change max height
handleResize()

window.addEventListener('resize', handleResize);

function handleResize() {
    let maxHeight = document.getElementById("gameLog").getBoundingClientRect().width + "px"

    document.getElementById("playersStatus").style.height = maxHeight;
    document.getElementById("gameLog").style.maxHeight = maxHeight;

    // fix circle
    if (playerRole.length <= maxPlayersforSircularButtons)
        createCircularButtons()
}