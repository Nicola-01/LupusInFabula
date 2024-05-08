/**
 * Utils file, provides some useful method and variables.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */


/**
 * HTTP status code for OK (200).
 */
const HTTP_STATUS_OK = 200;

/**
 * HTTP status code for Created (201).
 */
const HTTP_STATUS_CREATED = 201;

/**
 * HTTP status code for Bad Request (400).
 */
const HTTP_STATUS_BAD_REQUEST = 400;

/**
 * HTTP status code for Forbidden (403).
 */
const HTTP_STATUS_FORBIDDEN = 403;

/**
 * HTTP status code for Not Found (404).
 */
const HTTP_STATUS_NOT_FOUND = 404;

/**
 * HTTP status code for Conflict (409).
 */
const HTTP_STATUS_CONFLICT = 409;

/**
 * HTTP status code for Internal Server Error (500).
 */
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;


/**
 * The context path of the server.
 */
let contextPath;

/**
 * The key for JSON resource lists.
 */
const JSON_resource_list = "resource-list";

const ROLE_MASTER = "master";

/**
 * Map representing the colors associated with each role.
 */
const rolesColors = new Map();

rolesColors.set('farmer', '#005C00');
rolesColors.set('carpenter', '#3F9741');
rolesColors.set('hobbit', '#28AE59');
rolesColors.set('kamikaze', '#7DD181');
rolesColors.set('knight', '#96E8BC');
rolesColors.set('medium', '#7FCCBF');
rolesColors.set('sam', '#489FB5');
rolesColors.set('seer', '#16697A');
rolesColors.set('sheriff', '#173753');

rolesColors.set('berserker', '#37123C');
rolesColors.set('dorky', '#431035');
rolesColors.set('explorer', '#4F0E2D');
rolesColors.set('giuda', '#67091E');
rolesColors.set('puppy', '#7F050F');
rolesColors.set('wolf', '#970000');

rolesColors.set('hamster', '#FF9914');
rolesColors.set('jester', '#CA6700');

rolesColors.set('illusionist', '#595959');
rolesColors.set('plague spreader', '#3B3B3B');

rolesColors.set('', '#6E007B')

const GamePhase = {
    NIGHT: 0,
    DAY: 1
};

document.addEventListener('DOMContentLoaded', function (event) {
    contextPath = window.location.origin + "/lupus/";
    // console.log(contextPath);
});

/**
 * A generic GET XMLHTTPRequest.
 *
 * @param url the url of the request.
 * @param callback the function to invoke when the servlet answer.
 * @returns {boolean} false if the request did not created.
 */
function genericGETRequest(url, callback) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = function () {
        callback(httpRequest)
    };

    httpRequest.open('GET', url);
    httpRequest.send();
}

function genericPOSTRequest(url, json, callback) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onload = function () {
        callback(httpRequest)
    };

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(json);
}

function unLoggedUser(req) {
    if (req.status === HTTP_STATUS_FORBIDDEN)
        window.location.replace(contextPath + "login")
}

function notFound(req) {
    if (req.status === HTTP_STATUS_NOT_FOUND)
        window.location.replace(contextPath + "jsp/pageNotFound.jsp")
}

const goodRoles = ["carpenter", "farmer", "hobbit", "kamikaze", "knight", "medium", "sam", "seer", "sheriff"];
const evilRoles = ["berserker", "dorky", "explorer", "giuda", "puppy", "wolf"];
const victoryStealerRoles = ["hamster", "jester"];
const neutralRoles = ["illusionist", "plague spreader"];

function getRoleType(role) {
    if (goodRoles.includes(role))
        return "good"
    else if (evilRoles.includes(role))
        return "evil"
    else if (victoryStealerRoles.includes(role))
        return "victory stealer"
    else if (neutralRoles.includes(role))
        return "neutral"

}

function getMessage(req) {
    let jsonResponse = JSON.parse(req.responseText);
    if (jsonResponse.hasOwnProperty('message')) {
        let message = {}
        let jsonMSG = jsonResponse['message']
        message.message = jsonMSG.message;
        message.errorCode = jsonMSG['error-code'];
        message.errorDetails = jsonMSG['error-details'];
        return message;
    }
    return null;

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}