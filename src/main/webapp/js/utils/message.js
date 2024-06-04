const shoMoreButtons = document.querySelectorAll(".message .showMore");
for (let i = 0; i < shoMoreButtons.length; i++) {
    shoMoreButtons[i].addEventListener('click', function(event) {
        showMore(event.currentTarget);
    });
}

// ERROR MESSAGE POPUP
function populateErrorMessage(element, messageDetails, errorCode, errorDetails) {
    populateMessage(element, "Error!", messageDetails, errorCode.toUpperCase() + " - " + errorDetails);
}

// INFO MESSAGE POPUP
function populateInfoMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

// WARNING MESSAGE POPUP
function populateWarningMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

// SUCCESS POPUP
function populateSuccessMessage(element, infoTitle, messageDetails, moreDetails = "") {
    populateMessage(element, infoTitle, messageDetails, moreDetails)
}

function hideMessagePopup(element) {
    document.querySelector(element).style.display = "none"
}

// COMMON
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