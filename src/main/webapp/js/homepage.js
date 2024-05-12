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
            messageDiv.innerHTML = "You are currently playing a match: <a href='/lupus/gtmp/" + data.game.public_ID + "'>" + data.game.public_ID + "</a>";
        } else {
            messageDiv.textContent = "You are not currently playing in any game";
        }
    })
    .catch(function(error) {
        // Other uncatched errors
        console.error('Generic error:', error);
    });
