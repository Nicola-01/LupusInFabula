document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("addPlayer").addEventListener("click", addFriend);
    document.getElementById("playerUsername").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addFriend();
            hidePlayerListPopup();
        }
    });
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
                    let dateCell = row.insertCell(1);
                    let deleteCell = row.insertCell(2);

                    // Fill cells with data
                    usernameCell.textContent = friend.username;
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

function addFriend() {
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
                    addToFriendsTable(friend.username, friend.friendship_date);
                } else {
                    // Handle error case
                    console.error("Error adding friend:", xhr.status);
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

function addToFriendsTable(username, friendshipDate) {
    // Get reference to the table body
    let tbody = document.getElementById("my_friends").querySelector("tbody");

    // Create a new row
    let row = tbody.insertRow();
    let usernameCell = row.insertCell(0);
    let dateCell = row.insertCell(1);
    let deleteCell = row.insertCell(2);

    // Fill cells with data
    usernameCell.textContent = username;
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

    playersToIgnore.push(username.toLowerCase());
    clearSearchBar();
}