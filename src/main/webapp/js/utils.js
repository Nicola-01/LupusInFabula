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
 * Name of the current player
 */
let playerName;

/**
 * The key for JSON resource lists.
 */
const JSON_resource_list = "resource-list";

const ROLE_MASTER = "master";

/**
 * Map representing the colors associated with each role.
 */
const rolesColors = new Map();

rolesColors.set('farmer', '#014701');
rolesColors.set('carpenter', '#0F5A13');
rolesColors.set('hobbit', '#1D6D25');
rolesColors.set('kamikaze', '#2A8037');
rolesColors.set('knight', '#389449');
rolesColors.set('medium', '#46A75B');
rolesColors.set('sam', '#54BA6D');
rolesColors.set('seer', '#61CD7F');
rolesColors.set('sheriff', '#6FE091');

rolesColors.set('berserker', '#45002A');
rolesColors.set('dorky', '#5E0022');
rolesColors.set('explorer', '#780019');
rolesColors.set('giuda', '#910011');
rolesColors.set('wolf', '#970000');
rolesColors.set('puppy', '#C40000');

rolesColors.set('hamster', '#E08A19');
rolesColors.set('jester', '#CA6700');

rolesColors.set('illusionist', '#7A7A7A');
rolesColors.set('plague spreader', '#595959');

rolesColors.set('', '#9f9f9f')

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

function genericPUTRequest(url, json, callback) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onload = function () {
        callback(httpRequest)
    };

    httpRequest.open('PUT', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(json);
}

function isLoggedUser(req) {
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
        if (message.hasOwnProperty('error-code')) {
            message.errorCode = jsonMSG['error-code'];
            message.errorDetails = jsonMSG['error-details'];
        }
        return message;
    }
    return null;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0)
            return cookie.substring(name.length + 1);
    }
    return null;
}