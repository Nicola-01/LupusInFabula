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

rolesColors.set('farmer', 'var(--role-color-farmer)');
rolesColors.set('sheriff', 'var(--role-color-sheriff)');
rolesColors.set('seer', 'var(--role-color-seer)');
rolesColors.set('medium', 'var(--role-color-medium)');
rolesColors.set('knight', 'var(--role-color-knight)');
rolesColors.set('kamikaze', 'var(--role-color-kamikaze)');
rolesColors.set('sam', 'var(--role-color-sam)');
rolesColors.set('carpenter', 'var(--role-color-carpenter)');
rolesColors.set('hobbit', 'var(--role-color-hobbit)');

rolesColors.set('berserker', 'var(--role-color-berserker)');
rolesColors.set('dorky', 'var(--role-color-dorky)');
rolesColors.set('explorer', 'var(--role-color-explorer)');
rolesColors.set('wolf', 'var(--role-color-wolf)');
rolesColors.set('giuda', 'var(--role-color-giuda)');
rolesColors.set('puppy', 'var(--role-color-puppy)');

rolesColors.set('hamster', 'var(--role-color-hamster)');
rolesColors.set('jester', 'var(--role-color-jester)');

rolesColors.set('illusionist', 'var(--role-color-illusionist)');
rolesColors.set('plague spreader', 'var(--role-color-plagueSpreader)');

rolesColors.set('', 'var(--role-color-null)');

//logs
rolesColors.set('good', 'var(--role-color-good)');
rolesColors.set('evil', 'var(--role-color-evil)');
rolesColors.set('neutral', 'var(--role-color-neutral)');
rolesColors.set('vote', 'var(--vote-color)');


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
 * @param callback the function to invoke when the servlet answers.
 * @returns {boolean} false if the request was not created.
 */
function genericGETRequest(url, callback) {
    const httpRequest = new XMLHttpRequest();

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
    const httpRequest = new XMLHttpRequest();

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
    const httpRequest = new XMLHttpRequest();

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

function genericDELETERequest(url, json, callback){
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onload = function () {
        callback(httpRequest)
    };

    httpRequest.open('DELETE', url);
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
        if (jsonMSG.hasOwnProperty('error-code')) {
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

function setCookie(name, value, exdays=365) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";path=/;";
}