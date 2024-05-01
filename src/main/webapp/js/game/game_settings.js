document.addEventListener('DOMContentLoaded', function (event) {
    // your page initialization code here
    // the DOM will be available here
    document.getElementById("sendSettings").addEventListener("click", sendSettings);
    loadGameSettings();
});


/**
 * Get the game settings.
 */
function loadGameSettings() {
    var url = contextPath + "game/settings"
    genericGETRequest(url, fillGameSettings)
}


function HTML_switch(name) {
    return "<label class='toggle-switch'>" +
        "  <input type='checkbox' id='" + name + "_switch'>" +
        "  <div class='toggle-switch-background'>" +
        "    <div class='toggle-switch-handle'></div>" +
        "  </div>\n" +
        "</label>\n";
}

function HTML_number_input(name, max) {
    return "<input type='number' class='roleNumber' id='" + name + "_num' min='0' max='" + max + "' value='0'/>"
}

function fillGameSettings(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
        // var select = document.getElementById("gameSettings");

        if (req.status === HTTP_STATUS_OK) {
            var list = JSON.parse(req.responseText)[JSON_resource_list]

            if (list == null)
                alert("No game settings available");
            else {
                // Get references to the div elements
                var goodRoles = document.getElementById("goodRoles");
                var evilRoles = document.getElementById("evilRoles");
                var neutralRoles = document.getElementById("neutralRoles");
                var victoryStealerRoles = document.getElementById("victoryStealerRoles");

                for (let i = 0; i < list.length; i++) {

                    var role = list[i]['role'];
                    if (role.max_number === 1)
                        continue;

                    // Choose the div element based on the role type
                    var targetDiv;
                    console.log(role.name + " " + role.type);
                    switch (role.type) {
                        case 0:
                            targetDiv = goodRoles;
                            break;
                        case 1:
                            targetDiv = evilRoles;
                            break;
                        case 2:
                            targetDiv = victoryStealerRoles;
                            break;
                        case 3:
                            targetDiv = neutralRoles;
                            break;
                        default:
                            continue;
                    }

                    // Populate the div element with role data
                    targetDiv.innerHTML += "<div id='role'>" + capitalizeFirstLetter(role.name) + HTML_number_input(role.name, role.max_number) + "</div><br>";
                }

                for (let i = 0; i < list.length; i++) {

                    var role = list[i]['role'];
                    if (role.max_number !== 1)
                        continue;

                    // Choose the div element based on the role type
                    var targetDiv;
                    console.log(role.name + " " + role.type);
                    switch (role.type) {
                        case 0:
                            targetDiv = goodRoles;
                            break;
                        case 1:
                            targetDiv = evilRoles;
                            break;
                        case 2:
                            targetDiv = victoryStealerRoles;
                            break;
                        case 3:
                            targetDiv = neutralRoles;
                            break;
                        default:
                            continue;
                    }

                    // Populate the div element with role data
                    targetDiv.innerHTML += "<div id='role'>" + capitalizeFirstLetter(role.name) + HTML_switch(role.name) + "</div><br>";
                }
            }
        } else
            alert("not logged in")
    }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sendSettings() {
    const num_elem = document.querySelectorAll('[id$="_num"]');
    const switch_elem = document.querySelectorAll('[id$="_switch"]');
    var roleCardinality = []

    for (let i = 0; i < switch_elem.length; i++) {
        const role = switch_elem[i].id.replace('_switch', '');
        const cardinality = switch_elem[i].checked ? 1 : 0;
        roleCardinality.push({ role, cardinality });
    }

    for (let i = 0; i < num_elem.length; i++) {
        const role = num_elem[i].id.replace('_num', '');
        const cardinality = parseInt(num_elem[i].value);
        roleCardinality.push({ role, cardinality });
    }
    var json_obj = new Object();
    json_obj.roleCardinality = roleCardinality

    console.log(roleCardinality);

    console.log(JSON.stringify(json_obj));

}

function writeToJSON() {

}