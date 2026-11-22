/**
 * Utils module (ES-module port of js/utils/utils.js).
 * Provides the REST helpers, status constants, role data, and cookie/storage helpers.
 */

/** HTTP status code for OK (200). */
export const HTTP_STATUS_OK = 200;
/** HTTP status code for Created (201). */
export const HTTP_STATUS_CREATED = 201;
/** HTTP status code for Bad Request (400). */
export const HTTP_STATUS_BAD_REQUEST = 400;
/** HTTP status code for Forbidden (403). */
export const HTTP_STATUS_FORBIDDEN = 403;
/** HTTP status code for Not Found (404). */
export const HTTP_STATUS_NOT_FOUND = 404;
/** HTTP status code for Conflict (409). */
export const HTTP_STATUS_CONFLICT = 409;
/** HTTP status code for Internal Server Error (500). */
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

/** The context path of the server (origin + "/"). */
export const contextPath = window.location.origin + "/";

/** The key for JSON resource lists. */
export const JSON_resource_list = "resource-list";

export const ROLE_MASTER = "master";

/**
 * Map representing the colors associated with each role.
 * Values are Tailwind/CSS variables from index.css (e.g. 'var(--role-color-farmer)').
 */
export const rolesColors = new Map();

rolesColors.set('farmer', 'var(--role-color-farmer)');
rolesColors.set('sheriff', 'var(--role-color-sheriff)');
rolesColors.set('seer', 'var(--role-color-seer)');
rolesColors.set('medium', 'var(--role-color-medium)');
rolesColors.set('knight', 'var(--role-color-knight)');
rolesColors.set('kamikaze', 'var(--role-color-kamikaze)');
rolesColors.set('sam', 'var(--role-color-sam)');
rolesColors.set('carpenter', 'var(--role-color-carpenter)');
rolesColors.set('hobbit', 'var(--role-color-hobbit)');
rolesColors.set('mason', 'var(--role-color-mason)');

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

// game logs
rolesColors.set('good', 'var(--role-color-good)');
rolesColors.set('evil', 'var(--role-color-evil)');
rolesColors.set('neutral', 'var(--role-color-neutral)');
rolesColors.set('vote', 'var(--vote-color)');

/** Phases of the game. */
export const GamePhase = {
    NIGHT: 0,
    DAY: 1
};

/** Roles considered "good". */
export const goodRoles = ["carpenter", "farmer", "hobbit", "kamikaze", "knight", "medium", "sam", "seer", "sheriff"];

/** Evil roles. */
export const evilRoles = ["berserker", "dorky", "explorer", "giuda", "puppy", "wolf"];

/** Evil actions. */
export const evilAction = ["rage", "point", "explore", "maul", "dead"];

/** Steal-victory roles. */
export const victoryStealerRoles = ["hamster", "jester"];

/** Neutral roles. */
export const neutralRoles = ["illusionist", "plague spreader"];

/** Neutral actions. */
export const neutralAction = ["plague", "block"];

/**
 * A generic GET XMLHttpRequest.
 *
 * @param {string} url - The URL of the request.
 * @param {function} callback - Called with the XMLHttpRequest on every readystatechange.
 * @returns {boolean|undefined} false if the request was not created.
 */
export function genericGETRequest(url, callback) {
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

/**
 * A generic POST XMLHttpRequest.
 *
 * @param {string} url - The URL of the request.
 * @param {string} json - The JSON data to send in the request.
 * @param {function} callback - Called with the XMLHttpRequest when the response loads.
 * @returns {boolean|undefined} False if the request was not created.
 */
export function genericPOSTRequest(url, json, callback) {
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

/**
 * A generic PUT XMLHttpRequest.
 *
 * @param {string} url - The URL of the request.
 * @param {string} json - The JSON data to send in the request.
 * @param {function} callback - Called with the XMLHttpRequest when the response loads.
 * @returns {boolean|undefined} False if the request was not created.
 */
export function genericPUTRequest(url, json, callback) {
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

/**
 * A generic DELETE XMLHttpRequest.
 *
 * @param {string} url - The URL of the request.
 * @param {string} json - The JSON data to send in the request.
 * @param {function} callback - Called with the XMLHttpRequest when the response loads.
 * @returns {boolean|undefined} False if the request was not created.
 */
export function genericDELETERequest(url, json, callback) {
    const httpRequest = new XMLHttpRequest();

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

/**
 * Redirects to "page not found" if the request returned 404.
 * The old URL (jsp/pageNotFound.jsp) is kept on purpose: the Spring catch-all serves index.html
 * for unknown URLs and React renders PageNotFound.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
export function notFound(req) {
    if (req.status === HTTP_STATUS_NOT_FOUND)
        window.location.replace(contextPath + "jsp/pageNotFound.jsp")
}

/**
 * Returns the type of the role.
 *
 * @param {string} role - The role to check.
 * @returns {string|undefined} "good", "evil", "victory stealer", "neutral", or undefined.
 */
export function getRoleType(role) {
    if (goodRoles.includes(role))
        return "good"
    else if (evilRoles.includes(role))
        return "evil"
    else if (victoryStealerRoles.includes(role))
        return "victory stealer"
    else if (neutralRoles.includes(role))
        return "neutral"
}

/**
 * Parses the response text and returns the message if it exists.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 * @returns {object|null} {message, errorCode?, errorDetails?} if it exists, null otherwise.
 */
export function getMessage(req) {
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

/**
 * Returns the string with its first letter capitalized.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string}
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Returns a cookie value.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The cookie value if it exists, null otherwise.
 */
export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0)
            return cookie.substring(name.length + 1);
    }
    return null;
}

/**
 * Sets a cookie (path=/).
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [exdays=365] - Days until the cookie expires.
 */
export function setCookie(name, value, exdays = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/;";
}

/**
 * Stores JSON data (base64 encoded) in a cookie with an expiration time.
 *
 * @param {string} key - The name of the data.
 * @param {any} value - The data to store.
 * @param {number} seconds - Expiration time in seconds.
 */
export function storeData(key, value, seconds) {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    document.cookie = key + "=" + btoa(JSON.stringify(value)) + ";expires=" + date.toUTCString() + ";path=/";
}

/**
 * Retrieves JSON data stored with storeData.
 *
 * @param {string} key - The name of the data.
 * @returns {any|null} The data if found, otherwise null.
 */
export function retrieveData(key) {
    const nameEQ = key + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0)
            return JSON.parse(atob(c.substring(nameEQ.length, c.length)));
    }
    return null;
}
