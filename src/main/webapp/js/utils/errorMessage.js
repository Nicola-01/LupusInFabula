function populateErrorMessage(messageDetails, errorCode, errorDetails){
    document.getElementById("message").style.display = "block";
    document.getElementById("messageDetails").innerHTML = messageDetails;
    document.getElementById("moreDetails").textContent = errorCode.toUpperCase() + " - " + errorDetails;
}

function showMoreDitails(){
    let moreDetails = document.getElementById("moreDetails")
    let showMoreText = document.getElementById("showMoreText")
    console.log(moreDetails.style.display)
    if(moreDetails.style.display === "none"){
        moreDetails.style.display = "block";
        showMoreText.innerText = "Show less";
    }
    else{
        moreDetails.style.display = "none";
        showMoreText.innerText = "Show more";
    }
}