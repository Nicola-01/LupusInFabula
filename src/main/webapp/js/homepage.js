// this rest api returns the latest match of the logged in player
var apiUrl = 'game/list';

document.addEventListener('DOMContentLoaded', function (event) {
    genericGETRequest(contextPath + apiUrl, setHomeMessage)
});

function setHomeMessage(req)
{
    if (req.readyState === XMLHttpRequest.DONE)
    {
        var messageDiv = document.getElementById("messageDiv");
        // If status == 200 then last game exists
        if (req.status === HTTP_STATUS_OK)
        {
            var game = JSON.parse(req.responseText)["game"];
            var isPlaying = (game.who_win !== -1) ? "Your latest match is:" : "You are currently playing a match:";
            var colorClass = (game.who_win !== -1) ? "alert-info" : "alert-success";

            messageDiv.classList.add("alert", colorClass);
            messageDiv.innerHTML = isPlaying + " <a href='/lupus/village/" + game.public_ID + "'>" + game.public_ID + "</a>";
        }
        // game doesn't exists
        else
        {
            messageDiv.textContent = "You are not currently playing in any game";
            messageDiv.classList.add("alert", "alert-warning");
        }
    }
}