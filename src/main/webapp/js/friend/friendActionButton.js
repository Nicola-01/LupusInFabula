/**
 * Includes functionality for displaying and managing friend-related actions such as adding and removing friends.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */


/**
 * Event listener for the DOMContentLoaded event to load the friend list.
 */
document.addEventListener('DOMContentLoaded', function (event) {
    loadFriendList();
});

/**
 * Sends a GET request to load the friend list.
 */
function loadFriendList() {
    var url = contextPath + "user/me/friend";
    genericGETRequest(url, checkFriend);
}

/**
 * Callback function to handle the response of the friend list request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function checkFriend(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            let playerUsername = localStorage.getItem("playerName");
            let path = window.location.pathname;
            let targetUsername = path.split("/")[3];
            if (playerUsername !== targetUsername) {
                let isUserFound = list.some(friend => friend['friend'].username === targetUsername);
                let button = document.createElement('button');
                button.id = "friendActionButton";
                button.classList.add("ms-auto");
                if (isUserFound) {
                    button.textContent = 'Remove friend';
                    button.classList.add('remove');
                    button.addEventListener('click', function () {
                        removeFriend(targetUsername);
                    });
                } else {
                    button.textContent = 'Add friend';
                    button.classList.remove('remove');
                    button.addEventListener('click', function () {
                        addFriend(targetUsername);
                    });
                }
                let container = document.getElementById('friendButtonContainer');
                container.appendChild(button);
            }
        }
    }
}

/**
 * Sends a DELETE request to remove a friend.
 *
 * @param {string} username - The username of the friend to be deleted.
 */
function removeFriend(username) {
    var url = contextPath + "user/me/friend"; // Endpoint for deleting friend
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_STATUS_OK) {
                // Friend successfully deleted
                var button = document.getElementById("friendActionButton");
                button.remove();
                loadFriendList();
            } else {
                // Handle error case
                console.error("Error deleting friend:", xhr.status);
            }
        }
    };

    var requestData = {
        friend: {
            username: username
        }
    };

    // Send the username as JSON data in the request body
    xhr.send(JSON.stringify(requestData));
}

/**
 * Sends a POST request to add a friend.
 *
 * @param {string} username - The username of the friend to be added.
 */
function addFriend(username) {
    var url = contextPath + "user/me/friend"; // Endpoint for adding friend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_STATUS_CREATED) {
                // Successfully added
                var button = document.getElementById("friendActionButton");
                button.remove();
                loadFriendList();
            } else {
                // Handle error case
                var msg = getMessage(xhr);
                console.error("Error adding friend:", xhr.status);
                populateErrorMessage("#friendsPage .errorMessage", msg.message, msg.errorCode, msg.errorDetails);
            }
        }
    };

    var requestData = {
        friend: {
            username: username
        }
    };

    // Send the username as JSON data in the request body
    xhr.send(JSON.stringify(requestData));
}
