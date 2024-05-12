let url = window.location.href;
gameID = ""
logs = []
divLogs = null
gameID = url.substring(url.lastIndexOf("/gtmp/") + 6);

elementsReload()


function elementsReload()
{
    // reset of variables and state
    logs = []
    divLogs = document.getElementById("gameLog")
    while (divLogs.lastElementChild)
        divLogs.removeChild(divLogs.lastElementChild);


    divLogs.disabled = true;
    console.log(gameID)
    genericGETRequest(contextPath + "game/logs/" + gameID, fillGameLog);
    document.getElementById("gameLog").disabled = false;
}

function fillGameLog(req)
{
    if (req.readyState === XMLHttpRequest.DONE)
    {
        if (req.status === HTTP_STATUS_OK)
        {
            let game = JSON.parse(req.responseText)[JSON_resource_list]
            creaTabella(game)
        }
    }
}

function creaTabella(data)
{
    let tableBody = document.createElement("table");
    let row = document.createElement('tr');
    let cell = document.createElement('th');
    let key = ["player", "round", "phase", "subphase", "target", "typeAction"]


    for (let k of key)
    {
        cell = document.createElement('th');
        cell.innerHTML = k
        row.appendChild(cell);
    }
    tableBody.appendChild(row);


    for (let r of data)
    {
        row = document.createElement('tr');
        for (let k in r)
        {
            for(let c of key)
            {
                cell = document.createElement('th');
                cell.innerText = r[k][c]
                row.appendChild(cell);
            }
        }
        tableBody.appendChild(row);
    }

    divLogs.appendChild(tableBody)
}