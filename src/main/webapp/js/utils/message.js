/**
 * This object and its methods are used for managing message popups in a web application.
 * It includes functions for creating and displaying different types of message popups (error, info, warning, success),
 * as well as for showing or hiding additional details in a message popup.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

// Attaches a 'click' event listener to each element with the class "message .showMore".
/**
 * List of all message popups
 * @type {NodeListOf<Element>}
 */
const shoMoreButtons = document.querySelectorAll(".message .showMore");
for (let i = 0; i < shoMoreButtons.length; i++) {
    shoMoreButtons[i].addEventListener('click', function (event) {
        showMore(event.currentTarget);
    });
}

/**
 * Populates an error message popup with the provided details.
 *
 * @param {string} element - The selector of the element to populate.
 * @param {string} messageDetails - The main details of the message.
 * @param {string} errorCode - The error code.
 * @param {string} errorDetails - The detailed error message.
 */
function populateErrorMessage(element, messageDetails, errorCode, errorDetails) {
    populateMessage(element, "Error!", messageDetails, errorCode.toUpperCase() + " - " + errorDetails);
}

/**
 * Populates an info message popup with the provided details.
 *
 * @param {string} element - The selector of the element to populate.
 * @param {string} infoTitle - The title of the info message.
 * @param {string} messageDetails - The main details of the message.
 * @param {string} [moreDetails=""] - Additional details of the message.
 */
function populateInfoMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Populates a warning message popup with the provided details.
 *
 * @param {string} element - The selector of the element to populate.
 * @param {string} infoTitle - The title of the info message.
 * @param {string} messageDetails - The main details of the message.
 * @param {string} [moreDetails=""] - Additional details of the message.
 */
function populateWarningMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Populates a success message popup with the provided details.
 *
 * @param {string} element - The selector of the element to populate.
 * @param {string} infoTitle - The title of the info message.
 * @param {string} messageDetails - The main details of the message.
 * @param {string} [moreDetails=""] - Additional details of the message.
 */
function populateSuccessMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Hides the message popup.
 *
 * @param {string} element - The selector of the element to hide.
 */
function hideMessagePopup(element) {
    document.querySelector(element).style.display = "none"
}

/**
 * Populates a message popup with the provided details.
 *
 * @param {string} element - The selector of the element to populate.
 * @param {string} title - The title of the message.
 * @param {string} details - The main details of the message.
 * @param {string} [moreDetails=""] - Additional details of the message.
 */
function populateMessage(element, title, details, moreDetails = "") {
    document.querySelector(element).style.display = "block";
    document.querySelector(element + " .messageTitle").innerHTML = title;
    document.querySelector(element + " .messageDetails").innerHTML = details;
    document.querySelector(element + " .moreDetails").innerHTML = moreDetails;

    if (moreDetails === "") {
        document.querySelector(element + " .showMore").style.display = "none";
        document.querySelector(element + " .moreDetails").style.display = "none";
        document.querySelector(element + " .messageDetails").classList.add("mb-0");
    }
}

/**
 * Toggles the visibility of additional details in a message popup.
 *
 * @param {HTMLElement} element - The element that was clicked to toggle visibility.
 */
function showMore(element) {
    element = element.parentElement
    let moreDetails = element.querySelector(".moreDetails");
    let showMoreText = element.querySelector(".showMoreText");
    if (moreDetails.style.display === "none") {
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
        element.querySelector(".showMore").classList.remove("mb-0");
    } else {
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
        element.querySelector(".showMore").classList.add("mb-0")
    }
}