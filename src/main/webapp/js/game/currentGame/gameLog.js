logs = []
divLogs = null

/*
* Add the event listener to the page
* */
document.addEventListener('DOMContentLoaded', function (event) {
    let url = window.location.href;

    // extract gameID
    var startIndex = url.lastIndexOf("/village/") + 9;
    var endIndex = url.indexOf("/", startIndex);
    // if url doesn't end with /
    if (endIndex === -1) endIndex = url.length;
    gameID = url.substring(startIndex, endIndex);

    // var lastSegment = url.substring(url.lastIndexOf("/") + 1);
    // endsWithMaster = lastSegment === "master" || lastSegment === "master/";


    logElementsReload();
});

/**
 * Permit to reload the log information
 * */
function logElementsReload() {
    // reset of variables and state
    logs = []
    divLogs = document.getElementById("gameLog")
    divLogs.innerHTML = ""

    var masterlog = endsWithMaster ? "/master" : "";
    genericGETRequest(contextPath + "game/logs/" + gameID + masterlog, fillGameLog);
}

/**
 * Permit to fill the log ul with the data from the request
 * @param req request make to the api
 */
function fillGameLog(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            logs = JSON.parse(req.responseText)[JSON_resource_list]
            createUl(logs)
        }
    }
}

/**
 * function to create the button for the round
 * @param round round that represent the log
 * @returns {string} html string that represent the button for the round
 */
function createButtonRound(round)
{
    return '<button class="nav-link px-4 text-start my-1 '+(round===1 ? 'active' : "")+'" id="round-' + round + '-tab" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
                '<span class="d-block fs-5 fw-bold">' +
                    'Round ' + round +
                '</span>' +
            '</button>'
}

/**
 * Function to create the button to expand a row day / night
 * @param round round that represent the log
 * @param text text to write inside the button
 * @param phase phase that represent the log
 * @returns {string} html string that represent the button
 */
function createButtonRoundExpand(round, text, phase)
{
    return  '<button class="btn btn-primary ms-2" id="round-' + round + '-expand-' + phase + '" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
                '<span class="d-block fs-5 fw-bold">' +
                    text +
                '</span>' +
            '</button>'
}

/**
 * function to create a string with text in color color
 * @param text text to insert in the span
 * @param color color for text
 * @returns {string} string with text in color color
 */
function colText(text, color) {
    return '<span style="color:' + color + '">' + text + '</span>'
}

/**
 * function to create the string that represent the text for log
 * @param gamePhase current game phase (night/day)
 * @param typeOfAction action that represent the log
 * @param user user that make the action on target
 * @param target target of action
 * @param color  color for log
 * @returns {string} string that represent the text for log
 */
function getStringLog(gamePhase, user, typeOfAction, target, color) {
    let s = '' + user

    if (typeOfAction === 'dead') {
        if (gamePhase === "night")
            return s + ' is ' + colText(typeOfAction, color)
        else
            return s + ' is at the ' + colText('stake', color)
    } else if (typeOfAction === "last chance")
        return s + ' use ' + colText(typeOfAction, color)
    else if (typeOfAction === "plague") {
        if (gamePhase === "night") {
            if (endsWithMaster)
                return s + ' ' + colText(typeOfAction + 's', color) + ' ' + target;
            else
                return target + ' is ' + colText('infected', color);
        } else
            return target + ' died of ' + colText('plague', color);
    } else
        return s + ' ' + colText(typeOfAction + 's', color) + ' ' + target
}

/**
 * function to create the row that represent a log
 * @param gamePhase current game phase (night/day)
 * @param phase phase that represent the log
 * @param subphase subphase that represent the log
 * @param typeOfAction action that represent the log
 * @param user user that make the action on target
 * @param target target of action
 * @param color  color for log
 * @returns {string} html string that represent the log row
 */
function createActionBlock(gamePhase, phase, subphase, typeOfAction, user, target, color)
{
    return  '<li class="d-flex flex-column flex-md-row py-2">' +
                '<span class="phase text-muted">' +
                    'ㅤ'+ phase + 'ㅤ'+
                '</span>' +
                '<div class="flex-grow-1 leftBorder">' +
                    ' <p class="mb-0 ms-2">'+
                       getStringLog(gamePhase, user, typeOfAction, target, color) +
                    '</p>'+
                '</div>'+
            '</li>'
}

/**
 * Function to create the row title day / night
 * @param round round that represent the log
 * @param text text to write inside the button expand
 * @param phase phase that represent the log
 * @returns {string} html string that represent the row for title day / night
 */
function createRowBlock(phase, round, text)
{
    return  '<li class="d-flex flex-column flex-md-row">' +
                '<div class="container p-0">' +
                    '<div class="d-flex align-items-center">' +
                        '<h3 class="m-0 me-2">' +
                        'ㅤ'+ capitalizeFirstLetter(phase) +
                        '</h3>' +
                        '<div class="flex-grow-1 border-top m-0"></div>ㅤ' +
                        createButtonRoundExpand(round, text, phase) +
                    '</div>'+
                '</div>'+
            '</li>'
}

/**
 * Function to create the container for button to show the action
 * @param round that represent the round for the button
 * @returns {string} html string that represent the container for button to show the action
 */
function createContActionButton(round)
{
    return  '<div>' +
                createButtonRound(round) +
                '<div class="tab-pane fade active show" id="round-'+round+'" role="tabpanel">' +
                    '<ul class="pt-1 list-unstyled mb-0" id="round-'+round+'-ul">' +
                        '<span id="round-'+round+'-night">' +
                        '</span>' +
                        '<span id="round-'+round+'-day">' +
                        '</span>' +
                    '</ul>' +
                '</div>' +
            '</div>'

}

/**
 * Function to create the container for the logs
 * @param ContAction container for all action
 * @returns {string} html string that represent the container for the logs
 */
function createCont(ContAction)
{
    return  ' <div class="container position-relative p-0">' +
                '<div class="nav nav-pills flex-column aos-init aos-animate" id="tab" role="tablist" data-aos="fade-up">' +
                    ContAction +
                '</div>' +
            '</div>'
}

/**
 * function to create the data to insert after in the logs space
 * @param data data that represent the request
 * @param firstDataKey key for the first identification for data
 * @param secondDataKeykey key for the second identification for data
 * @param r round
 * @param ret return value
 * @returns {*} dict that contain r*dict that have the key {dayExt, daySum, nightSum, nightExt} that represent the data for day expand, day summary, night expand, night summary
 */
function makeData(data, firstDataKey, secondDataKey, r, ret) {
    let phase = ""
    let action = ""
    let subphase = ""
    let nm = ""
    let i = 0
    let col = null
    let s = ""
    let gamePhase = "";
    ret.push({dayExt: "", daySum: "", nightSum: "", nightExt: ""})

    while (i < data.length && data[i][firstDataKey[0]][secondDataKey[1]] <= r) {
        if (data[i][firstDataKey[0]][secondDataKey[1]] === r) {
            phase = data[i][firstDataKey[0]][secondDataKey[2]]
            gamePhase = phase;
            action = data[i][firstDataKey[0]][secondDataKey[4]]
            subphase = data[i][firstDataKey[0]][secondDataKey[3]]
            nm = data[i][firstDataKey[0]][secondDataKey[0]]

            //choose the color for the log
            if (action === "vote")
                col = rolesColors.get("vote")
            else if (evilAction.includes(action))
                col = rolesColors.get("evil")
            else if (neutralAction.includes(action))
                col = rolesColors.get("neutral")
            else
                col = rolesColors.get("good")

            //modify the phase of log
            switch (subphase) {
                case 0:
                    phase = (phase === "day") ? "Vote" : "Action";
                    break;
                case 1:
                    phase = "1° ballot"
                    break;
                default:
                    if (action === "vote")
                        phase = "2° ballot";
                    else if (action === "dead" || action === "plague")
                        phase = "Dead";
                    else
                        phase = "Action";
                    break;
            }

            s = createActionBlock(gamePhase, phase, subphase, action, nm, data[i][firstDataKey[0]][secondDataKey[5]], col)

            //contro if the real phase is day or night
            if (data[i][firstDataKey[0]][secondDataKey[2]] === "day") {
                //action vote not go in summary
                if (action !== "vote")
                    ret[r - 1].daySum = ret[r - 1].daySum.concat(s)
                //total action
                ret[r - 1].dayExt = ret[r - 1].dayExt.concat(s)
            } else {
                //action plague e dead go in summary
                if (action === "plague" || action === "dead")
                    ret[r - 1].nightSum = ret[r - 1].nightSum.concat(s)
                //total action
                ret[r - 1].nightExt = ret[r - 1].nightExt.concat(s)
            }
        }
        i++
    }

    //load the data in the return value
    if (ret[r - 1].dayExt !== "") {
        ret[r - 1].daySum = createRowBlock("day", r, 'Expand').concat(ret[r - 1].daySum)
        ret[r - 1].dayExt = createRowBlock("day", r, 'Reduce').concat(ret[r - 1].dayExt)
    }
    if (ret[r - 1].nightExt !== "") {
        ret[r - 1].nightSum = createRowBlock("night", r, 'Expand').concat(ret[r - 1].nightSum)
        ret[r - 1].nightExt = createRowBlock("night", r, 'Reduce').concat(ret[r - 1].nightExt)
    }

    return ret
}

/**
 * Function that permit to create all container for the logs and add all the action lister to all the button
 * @param data data that represent the request
 */
function createUl(data) {
    let bs = ''
    let secondDataKey = ["player", "round", "phase", "subphase", "typeAction", "target"]
    let firstDataKey = data.length > 0 ? Object.keys(data[0]) : [0]
    let roundMax = data.length - 1 >= 0 ? data[data.length - 1][firstDataKey[0]][secondDataKey[1]] : 0
    let ulData = []
    let swRound = []
    let swExpDay = []
    let swExpNight = []


    for (let r = 1; r <= roundMax; r++) {
        //add button
        bs = bs.concat(createContActionButton(r))
        //make data r for logs
        ulData = makeData(data, firstDataKey, secondDataKey, r, ulData)
        swExpDay.push(true)
        swExpNight.push(true)
        swRound.push(true)
    }
    //fill the container for round buttons
    divLogs.innerHTML = createCont(bs)

    for (let r = 1; r <= roundMax; r++) {
        document.getElementById('round-' + r + '-tab')?.addEventListener("click", function () {
            let nightContent = document.getElementById('round-' + r + '-night')
            let dayContent = document.getElementById('round-' + r + '-day')
            let fDay = function () {
                //write on the switch for button day the inverse of it and after that i contro if add data summary or extend
                if (!(swExpDay[r - 1] = !swExpDay[r - 1])) dayContent.innerHTML = ulData[r - 1].dayExt
                else dayContent.innerHTML = ulData[r - 1].daySum
                //add the action listener to the expand button
                document.getElementById('round-' + r + '-expand-day')?.addEventListener("click", fDay)
            }
            let fNight = function () {
                //write on the switch for button day the inverse of it and after that i contro if add data summary or extend
                if (!(swExpNight[r - 1] = !swExpNight[r - 1])) nightContent.innerHTML = ulData[r - 1].nightExt
                else nightContent.innerHTML = ulData[r - 1].nightSum
                //add the action listener to the expand button
                document.getElementById('round-' + r + '-expand-night')?.addEventListener("click", fNight)
            }

            //true add the data after the round button false remove all
            nightContent.innerHTML = swRound[r - 1] ?
                (swExpNight[r - 1] ?
                    ulData[r - 1].nightSum :
                    ulData[r - 1].nightExt) :
                ""
            //true add the data after the round button false remove all
            dayContent.innerHTML = swRound[r - 1] ?
                (swExpDay[r - 1] ?
                    ulData[r - 1].daySum :
                    ulData[r - 1].dayExt) :
                ""
            //add the action listener to the 2 expands buttons with the
            document.getElementById('round-' + r + '-expand-day')?.addEventListener("click", fDay)
            document.getElementById('round-' + r + '-expand-night')?.addEventListener("click", fNight)

            //switch the var for the button round view
            swRound[r - 1] = !swRound[r - 1]
        })
    }
    //active the button for last round
    document.getElementById('round-' + roundMax + '-tab')?.click()
}
