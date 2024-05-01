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
var contextPath = "http://localhost:8080/lupus/"


/**
 * The key for JSON resource lists.
 */
const JSON_resource_list = "resource-list"

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

/**
 * A generic GET XMLHTTPRequest.
 *
 * @param url the url of the request.
 * @param callback the function to invoke when the servlet answer.
 * @returns {boolean} false if the request did not created.
 */
function templateGETRequest(url, callback) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == XMLHttpRequest.DONE) {
            if (httpRequest.status == HTTP_STATUS_OK) {
                callback(httpRequest.responseText)
            } else {
                console.log(httpRequest.responseText);
                alert("problem processing the request");
            }
        }
    }

    httpRequest.open('GET', url, true);
    httpRequest.withCredentials = true;
    httpRequest.send();
}