document.addEventListener('DOMContentLoaded', function (event) {
    loadLogs();
    loadStatics();
});


/**
 * Get logs.
 */
function loadLogs() {
    genericGETRequest(contextPath + "user/log_player/logs", getLogs)
  //  genericGETRequest(contextPath + "user/log_player/logs", getGeneralStats)
}

function loadStatics(){
    genericGETRequest(contextPath + "user/log_player/statistic", getStatsRole)
}

function getLogs(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {

            var list = JSON.parse(req.responseText)["resource-list"]; //[JSON_resource_list]

            if (list == null)
                alert("User Not Authenticated");
            var table = document.getElementById("logs_table")

            //var tableBody = table.createTBody();
            var tbody = table.querySelector("tbody");

            var sizeid = 0;
            var sizerounds = 0;

            for (let i = 0; i < list.length; i++) {
                let log = list[i]['PlaysJoinGame'];
                var gameIdLength = log.game_id.toString().length;

                if (gameIdLength > sizeid) {
                    sizeid = gameIdLength;
                }

                var roundsLength = log.number_of_rounds.toString().length;
                if (roundsLength > sizerounds) {
                    sizerounds = roundsLength;
                }
            }

            for (let i = 0; i < list.length; i++) {

                let log = list[i]['PlaysJoinGame'];
                var row = tbody.insertRow();

                row.classList.add("item");

                var cell0 = row.insertCell(0);
                cell0.innerHTML = String(log.game_id).padStart(sizeid, '0');
                // cell0.innerHTML = Number(log.game_id);
                //cell0.classList.add("cell-with-zero");


                var cell1 = row.insertCell(1);
                cell1.innerHTML = log.start;

                var cell2 = row.insertCell(2);
                cell2.innerHTML = log.game_duration;

                var cell3 = row.insertCell(3);
                // cell3.innerHTML = Number(log.number_of_rounds);
                cell3.innerHTML = String(log.number_of_rounds).padStart(sizerounds, '0');
                //cell3.classList.add("cell-with-zero");

                var cell4 = row.insertCell(4);
                cell4.innerHTML = log.name;

                var cell5 = row.insertCell(5);
                if (log.has_won)
                    cell5.innerHTML = "Victory";
                else {
                    cell5.innerHTML = "Defeat";
                }

                var cell6 = row.insertCell(6);
                cell6.innerHTML = "Not working now";
            }
        }
    }
}


function getStatsRole(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)["resource-list"];

            if (list == null)
                alert("User Not Authenticated");
            var table = document.getElementById("roles_table");
            var tbody = table.querySelector("tbody");

            var sizeCountName = 0;
            var sizeCountWins = 0;

            for (let i = 0; i < list.length; i++) {
                let stats = list[i]['StatsRole'];

                var countNameLength = stats.countName.toString().length;
                if (countNameLength > sizeCountName) {
                    sizeCountName = countNameLength;
                }

                var countWinsLength = stats.countWins.toString().length;
                if (countWinsLength > sizeCountWins) {
                    sizeCountWins = countWinsLength;
                }
            }

            for (let i = 0; i < list.length; i++) {
                let stats = list[i]['StatsRole'];
                var row = tbody.insertRow();

                row.classList.add("item");

                var cell0 = row.insertCell(0);
                cell0.innerHTML = stats.name;

                var cell1 = row.insertCell(1);
                cell1.innerHTML = String(stats.countName).padStart(sizeCountName, '0');

                var cell2 = row.insertCell(2);
                cell2.innerHTML = String(stats.countWins).padStart(sizeCountWins, '0');

            }

        }
    }
}

function getGeneralStats(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
        }
    }
}