document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("addPlayer").addEventListener("click", addPlayerToTable);

    loadFriendList();
    playersToIgnore.push(localStorage.getItem("playerName").toLowerCase())
});


function loadFriendList(){
    var url = contextPath + "user/me/friend";
    genericGETRequest(url, fillFriendsList);
}


function fillFriendsList(req){
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            console.log(list);
            if (list == null){
                alert("No friends");
            }else{
                let tbody = document.getElementById("my_friends").querySelector("tbody");

                for(var i=0; i < list.length;i++) {
                    let friend = list[i]['friend'];

                    // Create a new row
                    let row = tbody.insertRow();
                    let usernameCell = row.insertCell(0);
                    row.insertCell(1);
                    let gameCell = row.insertCell((2))
                    let dateCell = row.insertCell(3);
                    let deleteCell = row.insertCell(4);

                    // Fill cells with data
                    let link = document.createElement("a");
                    link.href = contextPath + "habitant/" + friend.username;
                    link.textContent = friend.username;
                    link.classList.add("friend-link");
                    usernameCell.appendChild(link);
                    gameCell.textContent = friend.commonGame;
                    dateCell.textContent = friend.friendship_date;

                    let deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.classList.add("deleteFriendButton")
                    deleteButton.addEventListener("click", function() {
                        deleteFriend(friend.username);
                    });
                    deleteCell.appendChild(deleteButton);


                    playersToIgnore.push(friend.username.toLowerCase())
                }

                sendFriendAvailabilityRequest()
            }
        }
    }
}

function deleteFriend(username){

    var url = contextPath + "user/me/friend"; // Endpoint for deleting friend
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_STATUS_OK) {
                // Friend successfully deleted
                removeFromFriendsTable(username);
                var msg = username + " removed from your friends"
                populateInfoMessage("Friend deleted", msg)
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

// Function to remove username from players_tb table
function removeFromFriendsTable(username) {

    playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1))

    let rows = document.getElementById("my_friends").rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent === username) {
            document.getElementById("my_friends").deleteRow(i);
            break;
        }
    }
}

function addPlayerToTable() {

    var username = document.getElementById("playerUsername").value;
    if (username.trim() !== "") {
        var url = contextPath + "user/me/friend"; // Endpoint for adding friend
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json"); // Set content type to JSON
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === HTTP_STATUS_CREATED) {
                    let friend = JSON.parse(xhr.responseText)['friend'];
                    addToFriendsTable(friend.username, friend.commonGame, friend.friendship_date);
                    var msg = friend.username + " added to your friends";
                    populateSuccessMessage("Friend added", msg)
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
    } else {
        // Handle case where username is empty
        console.error("Username cannot be empty");
    }

}

function addToFriendsTable(username, commonGame, friendshipDate) {
    // Get reference to the table body
    let tbody = document.getElementById("my_friends").querySelector("tbody");

    // Create a new row
    let row = tbody.insertRow();
    let usernameCell = row.insertCell(0);
    row.insertCell(1);
    let gameCell = row.insertCell(2)
    let dateCell = row.insertCell(3);
    let deleteCell = row.insertCell(4);

    // Fill cells with data
    let link = document.createElement("a");
    link.href = contextPath + "habitant/" + username;
    link.textContent = username;
    link.classList.add("friend-link");
    usernameCell.appendChild(link);
    gameCell.textContent = commonGame;
    dateCell.textContent = friendshipDate;

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("deleteFriendButton")
    deleteButton.addEventListener("click", function() {
        deleteFriend(username);
    });

    // Append delete button to delete cell
    deleteCell.appendChild(deleteButton);

    sendFriendAvailabilityRequest();
    playersToIgnore.push(username.toLowerCase());
    clearSearchBar();
}

// Set interval to send request every 30 seconds
setInterval(sendFriendAvailabilityRequest, 30000);

function sendFriendAvailabilityRequest() {
    genericGETRequest(contextPath + "user/search/", updateFriendAvailability)
}

function updateFriendAvailability(req) {

    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {

            let players = new Map();
            let list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null) {
                for (let i = 0; i < list.length; i++) {
                    players.set(list[i]['player']['username'].toLowerCase(), list[i]['player']['gameId']);
                }
            }

            let rows = document.getElementById("my_friends").querySelector("tbody").rows;
            for (let i = 0; i < rows.length; i++) {
                if (players.get(rows[i].cells[0].textContent.toLowerCase()) === null) {
                    rows[i].cells[1].innerHTML = "";
                    let link = document.createElement("a");
                    link.href = contextPath + "newVillage";
                    link.innerHTML = "&#128994; free";
                    link.classList.add("newGame-link");
                    rows[i].cells[1].appendChild(link);
                }else{
                    rows[i].cells[1].innerHTML = "";
                    let link = document.createElement("a");
                    link.href = contextPath + "village/" + players.get(rows[i].cells[0].textContent.toLowerCase());
                    link.innerHTML = "&#128308; in game";
                    link.classList.add("game-link");
                    rows[i].cells[1].appendChild(link);
                }
            }
        }
    }
}
