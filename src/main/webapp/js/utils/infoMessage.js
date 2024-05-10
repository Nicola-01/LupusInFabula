function populateInfoMessage(infoTitle, messageDetails, infoDetails = "") {
    document.getElementById("infoTitle").innerHTML = infoTitle;
    document.getElementById("info").style.display = "block";
    document.getElementById("infoDetails").innerHTML = messageDetails;
    document.getElementById("infoMoreDetails").innerHTML = infoDetails;
}

function showMoreInfo() {
    let moreDetails = document.getElementById("infoMoreDetails")
    let showMoreText = document.getElementById("infoShowMoreText")
    console.log(moreDetails.style.display)
    if (moreDetails.style.display === "none") {
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
    } else {
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
    }
}