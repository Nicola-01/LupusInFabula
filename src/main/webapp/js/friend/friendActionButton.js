document.addEventListener('DOMContentLoaded', function (event) {
    loadFriendList();
});


function loadFriendList(){
    var url = contextPath + "user/me/friend";
    genericGETRequest(url, checkFriend);
}

function checkFriend(req){
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            console.log(list);

            let path = window.location.pathname;
            let targetUsername = path.split("/")[3];
            console.log("targetUsername: " + targetUsername);
            let isUserFound = list.some(friend => friend['friend'].username === targetUsername);
            console.log("isUserFound: " + isUserFound)
            let button = document.createElement('button');
            button.id = "friendActionButton";
            if (isUserFound){
                button.textContent = 'Remove from friends';
                button.addEventListener('click', function(){
                    removeFriend(targetUsername)
                });
            }else{
                button.textContent = 'Add to friends';
                button.addEventListener('click', function(){
                    addFriend(targetUsername)
                });
            }
            let container = document.getElementById('friendButtonContainer');
            container.appendChild(button);
        }
        }
}

function removeFriend(username){
    var url = contextPath + "user/me/friend"; // Endpoint for deleting friend
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_STATUS_OK) {
                // Friend successfully deleted
                var button = document.getElementById("friendActionButton");
                button.remove()
                loadFriendList()
            } else {
                // Handle error case
                console.error("Error deleting friend:", xhr.status);
            }
        }
    };

    var requestData = {
        friend: {
            username: username,
        }
    };

    // Send the username as JSON data in the request body
    xhr.send(JSON.stringify(requestData));
}

function addFriend(username){

    var url = contextPath + "user/me/friend"; // Endpoint for adding friend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_STATUS_CREATED) {
                //Successfully added
                var button = document.getElementById("friendActionButton");
                button.remove()
                loadFriendList()
            } else {
                // Handle error case
                var msg = getMessage(xhr);
                console.error("Error adding friend:", xhr.status);
                populateErrorMessage(msg.message, msg.errorCode, msg.errorDetails);
             }
        }
    };
    var requestData = {
        friend: {
            username: username,
        }
    };
    // Send the username as JSON data in the request body
    xhr.send(JSON.stringify(requestData));

}