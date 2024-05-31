logs = []
divLogs = null

document.addEventListener('DOMContentLoaded', function (event)
{
    let url = window.location.href;

    // extract gameID
    var startIndex = url.lastIndexOf("/village/") + 9;
    var endIndex = url.indexOf("/", startIndex);
    // if url doesn't end with /
    if (endIndex === -1) endIndex = url.length;
    gameID = url.substring(startIndex, endIndex);

    var lastSegment = url.substring(url.lastIndexOf("/") + 1);
    endsWithMaster = lastSegment === "master" || lastSegment === "master/";

    logElementsReload();
});

function logElementsReload()
{
    // reset of variables and state
    logs = []
    divLogs = document.getElementById("gameLog")
    divLogs.innerHTML = ""

    var masterlog = endsWithMaster? "/master" : "";
    genericGETRequest(contextPath + "game/logs/" + gameID + masterlog, fillGameLog);
}

function fillGameLog(req)
{
    if (req.readyState === XMLHttpRequest.DONE)
    {
        if (req.status === HTTP_STATUS_OK)
        {
            logs = JSON.parse(req.responseText)[JSON_resource_list]
            createTable(logs)
        }
    }
}


function createButtonRound(round)
{
    return '<button class="nav-link px-4 text-start mb-3 '+(round===1 ? 'active' : "")+'" id="round-' + round + '-tab" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
                '<span class="d-block fs-5 fw-bold">' +
                    'Round ' + round +
                '</span>' +
            '</button>'
}
function createButtonRoundExpand(round, text)
{
    return  '<button class="btn btn-primary ml-2" id="round-' + round + '-expand" data-bs-toggle="tab" type="button" role="tab" aria-selected="true">' +
                '<span class="d-block fs-5 fw-bold">' +
                    text +
                '</span>' +
            '</button>'
}

function createActionBlock(phase, subphase, typeOfAction, user, target, color)
{
    return  '<div class="py-2"></div>' +
            '<li class="d-flex flex-column flex-md-row py-2"' +
                '<span class="flex-shrink-0 width-13x me-md-4 d-block mb-3 mb-md-0 small text-muted">' +
                    'ㅤ'+ phase + 'ㅤ'+
                '</span>' +
                '<div class="flex-grow-1 ps-4"' +
                    //'<h4>'+typeOfAction.charAt(0).toUpperCase() + typeOfAction.slice(1)+'</h4>'+// type action
                    ' <p class="mb-0">'+
                        (target === null ? 'the user '+user+' <span style="color:'+ color + '"> is dead</span>' :
                        'The user '+user+' <span style="color:'+ color + '">' +typeOfAction+'s </span> '+ target )+ //user , typeaction, target
                    '</p>'+
                '</div>'+
            '</li>'
}
function createRowBlock(phase, round, text)
{
    return  '<li class="d-flex flex-column flex-md-row py-4">' +
                '<div class="container mt-4">' +
                    '<div class="d-flex align-items-center">' +
                        '<h3 class="flex-shrink-0 width-13x me-md-4 d-block mb-3 mb-md-0 small text-muted">' +
                        'ㅤ'+phase.charAt(0).toUpperCase() + phase.slice(1)+
                        '</h3>' +
                        '<div class="flex-grow-1 border-top"></div>ㅤ' +
                        (phase==="day" ? createButtonRoundExpand(round, text):"")+
                    '</div>'+
                '</div>'+
            '</li>'
}


function createContActionButton(round)
{
    return  '<div>' +
                createButtonRound(round) +
                '<div class="tab-pane fade active show" id="round-'+round+'" role="tabpanel">' +
                    '<ul class="pt-1 list-unstyled mb-0" id="round-'+round+'-ul">' +
                        '<span id="round-'+round+'-day">' +
                        '</span>' +
                        '<span id="round-'+round+'-night">' +
                        '</span>' +
                    '</ul>' +
                '</div>' +
            '</div>'

}

function createCont(ContAction)
{
    return  ' <div class="container py-1 py-lg-5 position-relative z-index-1">' +
                '<div class="row">' +
                    '<div class="row">' +
                        '<div class="nav nav-pills flex-column aos-init aos-animate" id="tab" role="tablist" data-aos="fade-up">' +
                            ContAction +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
}

function getRole(nm)
{
    let i =0

    while(i< playerRole.length)
    {
        if(playerRole[i].username===nm)
            return playerRole[i].role
        i++
    }

    return ""
}

function makeData(data, firstDataKey, secondDataKey, r, ret)
{
    let phase = ""
    let j = 0
    let col = null
    let s = ""
    ret.push({dayExt:"", daySum:"", night:""})

    while (j < data.length && data[j][firstDataKey[0]][secondDataKey[1]]<=r)
    {
        if (data[j][firstDataKey[0]][secondDataKey[1]] === r)
        {
            phase = data[j][firstDataKey[0]][secondDataKey[2]]

            if(data[j][firstDataKey[0]][secondDataKey[4]]!=="vote" && (data[j][firstDataKey[0]][secondDataKey[4]]==="dead" || getRoleType(getRole(data[j][firstDataKey[0]][secondDataKey[0]]))==="evil"))
                col = rolesColors.get("evil")
            else if (data[j][firstDataKey[0]][secondDataKey[4]]==="vote")
                col = rolesColors.get("vote")
            else
                col = rolesColors.get("good")

            switch (data[j][firstDataKey[0]][secondDataKey[3]])
            {
                case 0:
                    phase = phase==="day" ? "Vote" : "Special action"
                break;
                case 1:
                    phase = "1° ballot"
                break;
                default:
                    phase =  data[j][firstDataKey[0]][secondDataKey[4]]==="vote" ?
                                "2° ballot" :
                                data[j][firstDataKey[0]][secondDataKey[4]]==="dead" ? "Dead" :
                                    "Special action break"
                break;
            }
            s = createActionBlock(phase, data[j][firstDataKey[0]][secondDataKey[3]], data[j][firstDataKey[0]][secondDataKey[4]], data[j][firstDataKey[0]][secondDataKey[0]], data[j][firstDataKey[0]][secondDataKey[5]], col)


            if (data[j][firstDataKey[0]][secondDataKey[2]] === "day")
            {
                if(data[j][firstDataKey[0]][secondDataKey[4]]!=="vote")
                    ret[r-1].daySum =  ret[r-1].daySum.concat(s)
                ret[r-1].dayExt = ret[r-1].dayExt.concat(s)
            }
            else
            {
                phase=""
                ret[r-1].night = ret[r-1].night.concat(s)
            }
        }
        j++
    }

    ret[r-1].daySum = createRowBlock("day", r, 'Expand').concat(ret[r-1].daySum)
    ret[r-1].dayExt = createRowBlock("day", r, 'Reduce').concat(ret[r-1].dayExt)
    ret[r-1].night  = createRowBlock("night", r, "").concat(ret[r-1].night)

    return ret
}


function createTable(data)
{
    let bs = ''
    let secondDataKey = ["player", "round", "phase", "subphase", "typeAction", "target"]
    let firstDataKey = data.length > 0 ? Object.keys(data[0]) : [0]
    let roundMax = data.length-1 >= 0 ? data[data.length-1][firstDataKey[0]][secondDataKey[1]] : 0
    let b
    let ulData = []


    for (let r = 1; r<=roundMax; r++)
    {
        bs = bs.concat(createContActionButton(r))
        ulData = makeData(data, firstDataKey, secondDataKey, r, ulData)
    }

    divLogs.innerHTML = createCont(bs)

    for (let r = 1; r<=roundMax; r++)
    {
        b = document.getElementById('round-' + r + '-tab')

        b.addEventListener("click", function ()
        {
            let d = document.getElementById('round-'+r+'-day')
            let n = document.getElementById('round-'+r+'-night')
            let b2
            let sw = true
            let f = function ()
                {
                    if (sw)
                    {
                        d.innerHTML = ulData[r-1].dayExt
                        sw = false
                    }
                    else
                    {
                        d.innerHTML = ulData[r-1].daySum
                        sw = true
                    }
                    b2 = document.getElementById('round-' + r + '-expand')
                    b2.addEventListener("click", f)
                }

            if(d.innerHTML==="" ||  n.innerHTML==="")
            {
                d.innerHTML=ulData[r-1].daySum
                n.innerHTML=ulData[r-1].night

                b2 = document.getElementById('round-' + r + '-expand')
                b2.addEventListener("click", f)
            }
            else
            {
                d.innerHTML = ""
                n.innerHTML = ""
            }
        })
    }
}
