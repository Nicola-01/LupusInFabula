// this rest api returns the latest match of the logged in player
document.addEventListener('DOMContentLoaded', function (event) {
    genericGETRequest(contextPath + 'game/list', setHomeMessage)
});

/**
 * Sets the home message based on the response of the GET request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function setHomeMessage(req)
{
    if (req.readyState === XMLHttpRequest.DONE)
    {
        const messageDiv = document.getElementById("messageDiv");
        // If status == 200 then last game exists
        if (req.status === HTTP_STATUS_OK)
        {
            const game = JSON.parse(req.responseText)["game"];
            const isPlaying = (game.who_win !== -1) ? "Your latest match is:" : "You are currently playing a match:";
            const colorClass = (game.who_win !== -1) ? "alert-info" : "alert-success";

            messageDiv.classList.add("alert", colorClass);
            messageDiv.innerHTML = isPlaying + " <a href='/lupus/village/" + game.public_ID + "'>" + game.public_ID + "</a>";
        }
        // game doesn't exists
        else if (req.status === HTTP_STATUS_NOT_FOUND)
        {
            messageDiv.textContent = "You are not currently playing in any game";
            messageDiv.classList.add("alert", "alert-warning");
        }
    }
}