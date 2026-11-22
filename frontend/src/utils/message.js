/**
 * Message popups (ES-module port of js/utils/message.js).
 * The popups are rendered by components/Messages.jsx; these functions fill them by CSS selector,
 * exactly like the old code (selector examples: ".errorMessage", "#friendsPage .successMessage").
 * The "show more" click handler is attached by the component (onClick={e => showMore(e.currentTarget)}).
 */

/**
 * Populates an error message popup.
 *
 * @param {string} element - Selector of the popup.
 * @param {string} messageDetails - Main details of the message.
 * @param {string} errorCode - The error code.
 * @param {string} errorDetails - The detailed error message.
 */
export function populateErrorMessage(element, messageDetails, errorCode, errorDetails) {
    populateMessage(element, "Error!", messageDetails, errorCode.toUpperCase() + " - " + errorDetails);
}

/**
 * Populates an info message popup.
 *
 * @param {string} element - Selector of the popup.
 * @param {string} infoTitle - Title.
 * @param {string} messageDetails - Main details.
 * @param {string} [moreDetails=""] - Additional details.
 */
export function populateInfoMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Populates a warning message popup.
 *
 * @param {string} element - Selector of the popup.
 * @param {string} infoTitle - Title.
 * @param {string} messageDetails - Main details.
 * @param {string} [moreDetails=""] - Additional details.
 */
export function populateWarningMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Populates a success message popup.
 *
 * @param {string} element - Selector of the popup.
 * @param {string} infoTitle - Title.
 * @param {string} messageDetails - Main details.
 * @param {string} [moreDetails=""] - Additional details.
 */
export function populateSuccessMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

/**
 * Hides a message popup.
 *
 * @param {string} element - Selector of the popup.
 */
export function hideMessagePopup(element) {
    document.querySelector(element).style.display = "none"
}

/**
 * Populates and shows a message popup.
 *
 * @param {string} element - Selector of the popup.
 * @param {string} title - Title (set as innerHTML, as before).
 * @param {string} details - Main details (set as innerHTML, as before).
 * @param {string} [moreDetails=""] - Additional details (set as innerHTML, as before).
 */
export function populateMessage(element, title, details, moreDetails = "") {
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
 * Toggles the additional details of a message popup.
 *
 * @param {HTMLElement} element - The "show more" button that was clicked.
 */
export function showMore(element) {
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
