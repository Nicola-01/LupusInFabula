/**
 * User statistics file, provides methods for getting personal statistics and logs of the games played by a player.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

document.addEventListener('DOMContentLoaded', function (event) {
    var username = document.getElementById('username_requested').innerText;
    setHeading(username);
    loadLogs(username);
    loadStatics(username);

});

/**
* Manage the title (h1) of the page.
*
*/
function setHeading(username){
    var heading = document.getElementById("title");

    if (username === document.getElementById("username_logged").innerText){
        heading.innerHTML = 'Your statistics and history'
    }
    else{
        heading.innerHTML = 'Statistics and history of <b>' + username + '</b>';
    }

}


/**
 * Manage the search of a player redirecting to its statistics page if found.
 *
 */
function addPlayerToTable() {

    var username = document.getElementById("playerUsername").value;
    if (username.trim() !== "") {
        window.location.href = contextPath + "habitant/" + username;
    } else {
        console.error("Username cannot be empty");
    }

}


/**
 * Fetch and display logs for a user.
 *
 * @param {string} username - The username for which to load logs.
 */
function loadLogs(username) {
    genericGETRequest(contextPath + "user/" + username + "/logs", getLogs)
}

/**
 * Fetch and display statistics for a user.
 *
 * @param {string} username - The username for which to load statistics.
 */
function loadStatics(username) {
    genericGETRequest(contextPath + "user/" + username + "/statistic", getStatsRole)
    genericGETRequest(contextPath + "user/" + username + "/logs", getGeneralStats)
}

/**
 * Handle the response from the server for getting game logs for a user.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function getLogs(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        handleHttpStatus(req);
        if (req.status === HTTP_STATUS_OK) {

            var list = JSON.parse(req.responseText)["resource-list"];

            if (list == null)
                alert("User Not Existing");

            var table = document.getElementById("logs_table");
            var tbody = table.querySelector("tbody");

            var sizerounds = 0;

            for (let i = 0; i < list.length; i++) {
                let log = list[i]['PlaysJoinGame'];
                var roundsLength = log.number_of_rounds.toString().length;
                if (roundsLength > sizerounds) {
                    sizerounds = roundsLength;
                }
            }

            for (let i = 0; i < list.length; i++) {
                let log = list[i]['PlaysJoinGame'];
                var row = tbody.insertRow(0);
                row.classList.add("item");

                var cell0 = row.insertCell(0);
                cell0.innerHTML = log.start;

                var cell1 = row.insertCell(1);
                cell1.innerHTML = log.public_id;

                var cell2 = row.insertCell(2);
                cell2.innerHTML = log.game_duration;

                var cell3 = row.insertCell(3);
                cell3.innerHTML = String(log.number_of_rounds).padStart(sizerounds, '0');

                var cell4 = row.insertCell(4);
                if (log.is_game_finished) {
                    cell4.innerHTML = capitalizeFirstLetter(log.name);
                } else {
                    cell4.innerHTML = "*****";
                }

                var cell5 = row.insertCell(5);
                if (log.name !== "master" && log.is_game_finished) {
                    cell5.innerHTML = log.has_won ? "Victory" : "Defeat";
                } else {
                    cell5.innerHTML = "-";
                }

                var cell6 = row.insertCell(6);
                const link = contextPath + "village/" + log.public_id;
                cell6.innerHTML = '<a href="' + link + '" target="_blank">View match</a>';
            }

            if (list.length === 0) {
                var row = tbody.insertRow();
                row.classList.add("item");

                var user_logged = document.getElementById("username_logged").innerText;
                var user_requested = document.getElementById("username_requested").innerText;

                var cell = row.insertCell(0);
                cell.colSpan = 7;
                cell.innerHTML = user_requested === user_logged
                    ? 'You haven\'t taken part in any games yet, create a game now!'
                    : user_requested + ' haven\'t taken part in any games yet, invite him now!';
            }
        }
    }
}

/**
 * Handle the response from the server for getting user statistics for each role played.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function getStatsRole(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        handleHttpStatus(req);
        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)["resource-list"];

            if (list == null)
                alert("User Not Existing");

            var table = document.getElementById("roles_table");
            var tbody = table.querySelector("tbody");

            var sizeCountName = 0;
            var sizeCountWins = 0;
            var size = 0;
            var sizeGamesAsMaster = 0;

            for (let i = 0; i < list.length; i++) {
                let stats = list[i]['StatsRole'];
                if (stats.name !== "master") {
                    var countNameLength = stats.countName.toString().length;
                    if (countNameLength > sizeCountName) {
                        sizeCountName = countNameLength;
                    }

                    var countWinsLength = stats.countWins.toString().length;
                    if (countWinsLength > sizeCountWins) {
                        sizeCountWins = countWinsLength;
                    }

                    size += stats.countName;
                } else {
                    sizeGamesAsMaster++;
                }
            }

            const pairs = [];

            for (let i = 0; i < list.length; i++) {
                let stats = list[i]['StatsRole'];
                if (stats.name !== "master") {
                    var row = tbody.insertRow();
                    pairs.push([capitalizeFirstLetter(stats.name), stats.countName]);

                    row.classList.add("item");

                    var cell0 = row.insertCell(0);
                    cell0.innerHTML = capitalizeFirstLetter(stats.name);

                    var cell1 = row.insertCell(1);
                    cell1.innerHTML = String(stats.countName).padStart(sizeCountName, '0');

                    var cell2 = row.insertCell(2);
                    cell2.innerHTML = String(stats.countWins).padStart(sizeCountWins, '0');

                    var cell3 = row.insertCell(3);
                    cell3.innerHTML = String(stats.countName - stats.countWins).padStart(sizeCountName);

                    var cell4 = row.insertCell(4);
                    cell4.innerHTML = ((stats.countName / ((size === 0) ? 1 : size)).toFixed(3) * 100) + "%";
                }
            }

            if (list.length !== 0 && size !== 0) {
                completePieChart(pairs);
            } else {
                var row = tbody.insertRow();
                row.classList.add("item");
                var cell = row.insertCell(0);
                cell.colSpan = 5;

                var user_logged = (document.getElementById("username_logged").innerText).toLowerCase();
                var user_requested = (document.getElementById("username_requested").innerText).toLowerCase();

                if (sizeGamesAsMaster > 0) {
                    cell.innerHTML = user_requested === user_logged ? "You have played only as master, play a game now!" : user_requested + " has only played as master, invite him now!";
                } else if (!(document.getElementById("logs_table").innerText.endsWith("!"))) {
                    cell.innerHTML = user_requested === user_logged ? "The match is not finished yet" : user_requested + " is still in a match";
                } else {
                    cell.innerHTML = user_requested === user_logged
                        ? 'You haven\'t taken part in any games yet, create a game now!'
                        : user_requested + ' haven\'t taken part in any games yet, invite him now!';

                }
            }
        }
    }
}

/**
 * Handle the response from the server for getting general user statistics.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function getGeneralStats(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        handleHttpStatus(req);
        if (req.status === HTTP_STATUS_OK) {
            var table = document.getElementById("general_stats");

            var list = JSON.parse(req.responseText)["resource-list"];
            if (list == null)
                alert("User Not Existing");

            var totalPlayTime = "00:00:00";
            var totalGamesAsMaster = 0;
            var totalGamesWon = 0;
            var totalPendingGame = 0;

            for (let i = 0; i < list.length; i++) {
                let log = list[i]['PlaysJoinGame'];
                totalPendingGame += (log.is_game_finished) ? 0 : 1;
                if (log.name !== "master") {
                    totalPlayTime = sumTime(totalPlayTime, log.is_game_finished ? log.game_duration : "00:00:00");
                    totalGamesWon += (log.has_won && log.is_game_finished) ? 1 : 0;
                } else {
                    totalGamesAsMaster += (log.is_game_finished) ? 1 : 0;
                }
            }

            var totalGamesPlayed = list.length - totalGamesAsMaster - totalPendingGame;
            var ratio = ((totalGamesPlayed === 0) ? 0 : (totalGamesWon / totalGamesPlayed).toFixed(3) * 100) + "%";

            let couple = [["Total time played", totalPlayTime], ["Games Played", totalGamesPlayed + totalPendingGame],
                ["Games Won", totalGamesWon], ["Games Lost", totalGamesPlayed - totalGamesWon],
                ["Ratio", ratio],
                ["Games as master", totalGamesAsMaster]];

            for (let i = 0; i < couple.length; i++) {
                var row = table.insertRow();
                row.classList.add("item");

                var cell0 = row.insertCell(0);
                cell0.innerHTML = couple[i][0];

                if (couple[i][0] === "Ratio") {
                    cell0.innerHTML += ' <a id="info_ratio" title="The percentage of games won over the total played">&#9432</a>';
                }
                if (couple[i][0] === "Games Played") {
                    cell0.innerHTML += ' <a title="If the number is different from the sum of games won and loss it means that there are pending games">&#9432</a>';
                }

                var cell1 = row.insertCell(1);
                cell1.innerHTML = couple[i][1];
            }
        }
    }
}


//HELPER FUNCTIONS

/**
 * Handle the status of the request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function handleHttpStatus(req) {
    if (req.status === HTTP_STATUS_OK) {
        const back_con = document.getElementById('main_class');
        back_con.style.display = 'block';
    } else {
        handleError(req);
    }
}

/**
 * Handle the error situation.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function handleError(req) {

    const errorMessageContainer = document.getElementById('error_message');

    if (req.status === HTTP_STATUS_FORBIDDEN) {
        errorMessageContainer.innerHTML = '<h1 class="not_logged">Please login to check the statistics</h1>';
        //alert("Not logged");
    } else {
        errorMessageContainer.innerHTML = '<h1 class="unexpected_error">An unexpected error occurred. Please try again later.</h1>';
        alert("Unexpected error");
    }
    errorMessageContainer.style.display = 'block';
}

/**
 * Create and display a pie chart for roles and their counts.
 *
 * @param {Array} pairs - An array of role names and their counts.
 */
function completePieChart(pairs) {
    const ctx = document.getElementById('myChart');
    let names = pairs.map(pair => pair[0]);
    let rates = pairs.map(pair => pair[1]);
    let label_name = 'Times of games played as';

    if (pairs.length === 0) {
        names = ["Not played"];
        rates = [1];
        label_name = 'Any game played so far'
    }

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: names,
            datasets: [{
                label: label_name,
                data: rates,
                borderWidth: 1
            }]
        },
        options: {}
    });
}

/**
 * Sum two time strings in HH:MM:SS format.
 *
 * @param {string} times1 - The first time string.
 * @param {string} times2 - The second time string.
 * @returns {string} The summed time string in HH:MM:SS format.
 */
function sumTime(times1, times2) {
    const getSeconds = t => {
        const p = t.split(':');
        return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60 + parseInt(p[2], 10);
    };

    const format = seconds => {
        return [
            Math.floor(seconds / 3600),
            Math.floor(seconds % 3600 / 60),
            seconds % 60
        ].map(v => v < 10 ? '0' + v : v).join(':');
    };

    return format(getSeconds(times1) + getSeconds(times2));
}
