function populateInfoMessage(infoTitle, messageDetails, infoDetails = "") {
    document.getElementById("infoTitle").innerHTML = infoTitle;
    document.getElementById("info").style.display = "block";
    document.getElementById("infoDetails").innerHTML = messageDetails;
    document.getElementById("infoMoreDetails").innerHTML = infoDetails;
    if (infoDetails === ""){
        document.getElementById("infoShowMore").remove();
        document.getElementById("infoMoreDetails").remove();
    document.getElementById("infoDetails").classList.add("mb-0");
    }
}

function showMoreInfo() {
    let moreDetails = document.getElementById("infoMoreDetails")
    let showMoreText = document.getElementById("infoShowMoreText")
    if (moreDetails.style.display === "none") {
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
        document.getElementById("infoShowMore").classList.remove("mb-0");
    } else {
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
        document.getElementById("infoShowMore").classList.add("mb-0");
    }
}