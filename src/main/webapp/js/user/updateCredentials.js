document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("updateButton").addEventListener("click", sendUpdate);
});

function sendUpdate() {

    genericPUTRequest(contextPath + "", JSON.stringify(json), updateStatus)

}

function updateStatus(req) {

}