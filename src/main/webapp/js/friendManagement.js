document.addEventListener('DOMContentLoaded', function (event) {
    //document.getElementById("deleteFriend").addEventListener("click", deleteFriend);
    //document.getElementById("addFriend").addEventListener("click", addFriend);
    //document.getElementById("playerUsername").addEventListener("keyup", function (event) {
    //    if (event.key === "Enter") {
    //        addFriend();
    //    }
    //});
    loadFriendList();
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
                    deleteButton.addEventListener("click", function() {
                        deleteFriend(friend.username);
                    });
                    deleteCell.appendChild(deleteButton);
                }
            }
        }
    }
}

function deleteFriend(){

}

//function addFriend(){

//}
