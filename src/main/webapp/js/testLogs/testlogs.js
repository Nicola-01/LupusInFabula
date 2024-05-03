document.addEventListener('DOMContentLoaded', function (event) {
    loadLogs();
});


/**
 * Get logs.
 */
function loadLogs() {
    genericGETRequest(contextPath + "user/log_player/logs", getlogs)
    // genericGETRequest(contextPath + "/temp/logs/", fillGameSettings)
    //genericGETRequest(contextPath + "/temp/logs/", f)
    // genericGETRequest(contextPath + "user/me/friend", fillFriends)
}

// function f(req){
//
// }

function getlogs(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            console.log("ajddoiaw")

            var list = JSON.parse(req.responseText)["resource-list"]; //[JSON_resource_list]

            if (list == null)
                alert("No logs available");
            var table = document.getElementById("logs_table")

            //var tableBody = table.createTBody();
            var tbody = table.querySelector("tbody");

            for (let i = 0; i < list.length; i++) {

                let log = list[i]['PlaysJoinGame'];
                var row = tbody.insertRow();

                row.classList.add("item");

                var cell0 = row.insertCell(0);
                cell0.innerHTML = log.game_id;

                var cell1 = row.insertCell(1);
                cell1.innerHTML = log.number_of_rounds;
            }
        }
    }

    //JSON DA' ERRORE:
    /*
    * Uncaught SyntaxError: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data
    getlogs http://localhost:8080/lupus/js/testLogs/testlogs.js:25
    onreadystatechange http://localhost:8080/lupus/js/utils.js:104
    genericGETRequest http://localhost:8080/lupus/js/utils.js:107
    loadLogs http://localhost:8080/lupus/js/testLogs/testlogs.js:10
    <anonymous> http://localhost:8080/lupus/js/testLogs/testlogs.js:2
    EventListener.handleEvent* http://localhost:8080/lupus/js/testLogs/testlogs.js:1
    * */


    //var json = '{"resource-list":[{"PlaysJoinGame":{"game_id":109,"start":"2024-04-29 23:13:21.0","game_duration":"00:45:37","number_of_rounds":1,"name":"master","has_won":false}},{"PlaysJoinGame":{"game_id":111,"start":"2024-04-29 23:13:21.0","game_duration":"00:17:12","number_of_rounds":1,"name":"farmer","has_won":true}},{"PlaysJoinGame":{"game_id":104,"start":"2024-04-29 23:13:21.0","game_duration":"00:09:00","number_of_rounds":9,"name":"farmer","has_won":false}},{"PlaysJoinGame":{"game_id":103,"start":"2024-04-29 23:13:21.0","game_duration":"00:15:08","number_of_rounds":7,"name":"farmer","has_won":true}},{"PlaysJoinGame":{"game_id":106,"start":"2024-04-29 23:13:21.0","game_duration":"00:10:45","number_of_rounds":1,"name":"knight","has_won":false}},{"PlaysJoinGame":{"game_id":105,"start":"2024-04-29 23:13:21.0","game_duration":"00:11:17","number_of_rounds":1,"name":"knight","has_won":true}},{"PlaysJoinGame":{"game_id":108,"start":"2024-04-29 23:13:21.0","game_duration":"00:21:17","number_of_rounds":12,"name":"seer","has_won":false}},{"PlaysJoinGame":{"game_id":110,"start":"2024-04-29 23:13:21.0","game_duration":"00:31:20","number_of_rounds":0,"name":"wolf","has_won":true}},{"PlaysJoinGame":{"game_id":107,"start":"2024-04-29 23:13:21.0","game_duration":"00:16:27","number_of_rounds":23,"name":"wolf","has_won":false}},{"PlaysJoinGame":{"game_id":102,"start":"2024-04-29 23:13:21.0","game_duration":"00:01:36","number_of_rounds":5,"name":"wolf","has_won":false}},{"PlaysJoinGame":{"game_id":101,"start":"2024-04-29 23:13:21.0","game_duration":"00:11:02","number_of_rounds":0,"name":"wolf","has_won":true}}]}';


}


// function f(req) {
//     // Analizza la risposta JSON ricevuta dalla richiesta
//     var response = JSON.parse(req.responseText);
//
//     // Ottieni il messaggio di accesso ai log
//     var message = response.message.message;
//     // Ottieni la lista dei log
//     return message
//
//     var logs = response["resource-list"];
//
//     // Crea una stringa per contenere il contenuto da aggiungere alla pagina HTML
//     var content = "<h2>" + message + "</h2>";
//
//     // Itera attraverso ogni log nella lista e aggiungi le informazioni alla stringa di contenuto
//     for (var i = 0; i < logs.length; i++) {
//         var log = logs[i].PlaysJoinGame;
//         content += "<p>Game ID: " + log.game_id + "</p>";
//         content += "<p>Start: " + log.start + "</p>";
//         content += "<p>Game Duration: " + log.game_duration + "</p>";
//         content += "<p>Number of Rounds: " + log.number_of_rounds + "</p>";
//         content += "<p>Name: " + log.name + "</p>";
//         content += "<p>Has Won: " + log.has_won + "</p>";
//         content += "<hr>"; // Aggiungi una linea orizzontale per separare ogni log
//     }
//
//     // Seleziona l'elemento HTML in cui vuoi inserire il contenuto e aggiungilo
//     document.getElementById("log-container").innerHTML = content;
// }
//
//
// function fillGameSettings(req) {
//     if (req.readyState === XMLHttpRequest.DONE) {
//         if (req.status === HTTP_STATUS_OK) {
//             var list = JSON.parse(req.responseText)[JSON_resource_list];
//
//             if (list == null)
//                 alert("No game settings available");
//             else {
//                 // Get references to the div elements
//                 var gameLogsContainer = document.getElementById("gameLogsContainer");
//
//                 // Clear previous content
//                 gameLogsContainer.innerHTML = "";
//
//                 // Iterate over each log entry
//                 list.forEach(function(log) {
//                     var playsJoinGame = log.PlaysJoinGame;
//                     var gameID = playsJoinGame.game_id;
//                     var start = playsJoinGame.start;
//                     var duration = playsJoinGame.game_duration;
//                     var rounds = playsJoinGame.number_of_rounds;
//                     var name = playsJoinGame.name;
//                     var hasWon = playsJoinGame.has_won;
//
//                     // Create a new log entry element
//                     var logEntry = document.createElement("div");
//                     logEntry.className = "log-entry";
//
//                     // Construct the log entry content
//                     var logContent = "<b>Game ID:</b> " + gameID + "<br>" +
//                         "<b>Start:</b> " + start + "<br>" +
//                         "<b>Duration:</b> " + duration + "<br>" +
//                         "<b>Number of Rounds:</b> " + rounds + "<br>" +
//                         "<b>Name:</b> " + name + "<br>" +
//                         "<b>Has Won:</b> " + hasWon;
//
//                     // Set the log entry content
//                     logEntry.innerHTML = logContent;
//
//                     // Append the log entry to the container
//                     gameLogsContainer.appendChild(logEntry);
//                 });
//             }
//         } else {
//             alert("Error: Unable to fetch game logs");
//         }
//     }
// }
