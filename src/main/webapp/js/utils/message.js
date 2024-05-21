// ERROR MESSAGE POPUP
function populateErrorMessage(messageDetails, errorCode, errorDetails) {
    populateMessage("errorMessage", "Error!", messageDetails, errorCode.toUpperCase() + " - " + errorDetails);
}

// INFO MESSAGE POPUP
function populateInfoMessage(infoTitle, messageDetails, moreDetails = "") {
    populateMessage("infoMessage", infoTitle, messageDetails, moreDetails)
}

// WARNING MESSAGE POPUP
function populateWarningMessage(infoTitle, messageDetails, moreDetails = "") {
    populateMessage("warningMessage", infoTitle, messageDetails, moreDetails)
}

// SUCCESS POPUP
function populateSuccessMessage(infoTitle, messageDetails, moreDetails = "") {
    populateMessage("warningMessage", infoTitle, messageDetails, moreDetails)
}

// COMMON
function populateMessage(messagePopup, title, details, moreDetails = "") {
    document.getElementById(messagePopup).style.display = "block";
    document.querySelector("#" + messagePopup + " .messageTitle").innerHTML = title;
    document.querySelector("#" + messagePopup + " .messageDetails").innerHTML = details;
    document.querySelector("#" + messagePopup + " .moreDetails").innerHTML = moreDetails;

    if (moreDetails === "") {
        document.querySelector("#" + messagePopup + " .showMore").style.display = "none";
        document.querySelector("#" + messagePopup + " .moreDetails").style.display = "none";
        document.querySelector("#" + messagePopup + " .messageDetails").classList.add("mb-0");
    }
}

function showMore(messagePopup) {
    let moreDetails = document.querySelector("#" + messagePopup + " .moreDetails");
    let showMoreText = document.querySelector("#" + messagePopup + " .showMoreText");
    if (moreDetails.style.display === "none") {
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
        document.querySelector("#" + messagePopup + " .showMore").classList.remove("mb-0");
    } else {
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
        document.querySelector("#" + messagePopup + " .showMore").classList.add("mb-0")
    }
}