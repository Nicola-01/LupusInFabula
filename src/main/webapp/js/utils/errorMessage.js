function populateErrorMessage(messageDetails, errorCode, errorDetails) {
    document.getElementById("message").style.display = "block";
    document.getElementById("messageDetails").innerHTML = messageDetails;
    document.getElementById("moreDetails").textContent = errorCode.toUpperCase() + " - " + errorDetails;
}

function showMoreDetails() {
    let moreDetails = document.getElementById("moreDetails");
    let showMoreText = document.getElementById("showMoreText");
    if (moreDetails.style.display === "none") {
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
        document.getElementById("showMore").classList.remove("mb-0");
    } else {
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
        document.getElementById("showMore").classList.add("mb-0")
    }
}