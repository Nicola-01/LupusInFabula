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

    divLogs.disabled = true;
    var masterlog = endsWithMaster? "/master" : "";
    genericGETRequest(contextPath + "game/logs/" + gameID + masterlog, fillGameLog);
    document.getElementById("gameLog").disabled = false;
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

function createActionBlock(phase, subphase, typeOfAction, user, target)
{
    return  '<li class="d-flex flex-column flex-md-row py-4">' +
                '<span class="flex-shrink-0 width-13x me-md-4 d-block mb-3 mb-md-0 small text-muted">' +
                    phase + (phase==="day" ? "    " : "")+
                '</span>' +
                '<div class="flex-grow-1 ps-4 border-start border-3">' +
                    '<h4>'+typeOfAction+'</h4>'+// type action
                    ' <p class="mb-0">'+
                        (target === null ? 'the user '+user+' is dead' :
                        'the user '+user+' make the action '+typeOfAction+' on '+ target )+ //user , typeaction, target
                    '</p>'+
                '</div>'+
            '</li>'
}
function createRowBlock(phase)
{
    return  '<li class="d-flex flex-column flex-md-row py-4">' +
        '<span class="flex-shrink-0 width-13x me-md-4 d-block mb-3 mb-md-0 small text-muted">' +
            phase + (phase==="day" ? "    " : "")+
            '</span>' +
                '<div class="flex-grow-1 ps-4 border-start border-3">' +
                    '<h4></h4>'+// type action
                '</div>'+
            '</li>'
}



function createContActionButton(round)
{
    return  '<div>' +
                createButtonRound(round) +
                '<div class="tab-pane fade active show" id="round-'+round+'" role="tabpanel">' +
                    '<ul class="pt-1 list-unstyled mb-0" id="round-'+round+'-ul">' +
                    '</ul>' +
                '</div>' +
            '</div>'

}

function createCont(ContAction)
{
    return  ' <div class="container py-5 py-lg-5 position-relative z-index-1">' +
        '    <div class="row">' +
        '           <div class="row">' +
        '            <div class="nav nav-pills flex-column aos-init aos-animate" id="tab" role="tablist" data-aos="fade-up">' +
                        ContAction + ''+
        '            </div>' +
        '           </div>' +
        '           </div>' +
        '    </div>'
}


function createTable(data)
{
    let key = ["player", "round", "phase", "subphase", "typeAction", "target"]
    let i = data.length > 0 ? Object.keys(data[0]) : [0]
    let bs = ''
    let roundMax = data.length-1 >= 0 ? data[data.length-1][i[0]][key[1]] : 0


    for (let j = 1; j<=roundMax; j++)
        bs = bs.concat(createContActionButton(j, ""))

    divLogs.innerHTML = createCont(bs)

    for (let r = 1; r<=roundMax; r++)
    {
        let b = document.getElementById('round-' + r + '-tab')

        b.addEventListener("click", function ()
        {
            let ul = document.getElementById('round-'+r+'-ul')
            let dStmp = false
            let nStmp = dStmp
            let phase = ""

            if(ul.innerHTML==="")
            {
                let j = 0
                let as = ''

                while (j < data.length && data[j][i[0]][key[1]]<=r)
                {
                    if (data[j][i[0]][key[1]] === r) {
                        phase = data[j][i[0]][key[2]]
                        if (phase === "day" && !dStmp) {
                            as = as.concat(createRowBlock("Day"))
                            dStmp = true
                        } else if (phase === "night" && !nStmp) {
                            as = as.concat(createRowBlock("Night"))
                            nStmp = true
                        }
                        switch (data[j][i[0]][key[3]]) {
                            case 0:
                                phase = "Vote"
                                break;
                            case 1:
                                phase = "1° ballot"
                                break;
                            case 2:
                                phase = "2° ballot"
                                break;
                            case 3:
                                phase = "Special action"
                                break;
                        }

                        as = as.concat(createActionBlock(phase, data[j][i[0]][key[3]], data[j][i[0]][key[4]], data[j][i[0]][key[0]], data[j][i[0]][key[5]]))
                    }

                    j++
                }
                ul.innerHTML = as
            }
            else
                ul.innerHTML=""
        })
    }
}
