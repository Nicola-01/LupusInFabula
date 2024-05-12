// this rest api returns the latest match of the logged in player
var apiUrl = '/lupus/game/list';

// GET request
fetch(apiUrl)
    .then(function(response)
    {
        if (response.status === 500)
        {
            // Game doesn't exist
            return null;
        }
        else if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Error during request: ' + response.statusText);
        }
    })
    .then(function(data)
    {
        var messageDiv = document.getElementById("messageDiv");
        if (data !== null) {
            var isPlaying = (data.game.who_win !== -1) ? "Your latest match is:" : "You are currently playing a match:";
            var colorClass = (data.game.who_win !== -1) ? "alert-info" : "alert-success";

            messageDiv.classList.add("alert", colorClass);
            messageDiv.innerHTML = isPlaying + " <a href='/lupus/gtmp/" + data.game.public_ID + "'>" + data.game.public_ID + "</a>";
        }
        else {
            messageDiv.textContent = "You are not currently playing in any game";
            messageDiv.classList.add("alert", "alert-warning");
        }
    })
    .catch(function(error) {
        // Other uncatched errors
        console.error('Generic error:', error);
    });
