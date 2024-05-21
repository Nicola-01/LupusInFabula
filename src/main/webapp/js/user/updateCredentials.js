document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("updateButton").addEventListener("click", sendUpdate);
});

function sendUpdate() {

    const form = document.getElementById('updateForm');
    const formData = new FormData(form);

    const json = {
        "userUpdate": {
            "oldEmail": formData.get('CurrentEmail'),
            "newEmail": formData.get('NewEmail'),
            "oldPassword": formData.get('CurrentPassword'),
            "newPassword": formData.get('NewPassword'),
            "repeatNewPassword": formData.get('ConfirmPassword')
        }
    };

    genericPUTRequest(contextPath + "user/me", JSON.stringify(json), updateStatus);
    form.reset();

}

function updateStatus(req) {

    let message = getMessage(req);
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            populateInfoMessage("UPDATE DONE", message.message);
        } else {
            if (message != null)
                populateErrorMessage(message.message, message.errorCode, message.errorDetails);
            else {
                let listMsg = JSON.parse(req.responseText)[JSON_resource_list];
                let msgs = ""
                let errorCodes = ""
                let errorDetails = ""
                if (listMsg != null) {
                    for (let i = 0; i < listMsg.length; i++) {
                        let message = listMsg[i]['message'];
                        console.log(listMsg[i])
                        msgs += message.message + "<br>";
                        if (!errorCodes.includes(message['error-code']))
                            errorCodes += ", " + message['error-code'];
                        if (!errorDetails.includes(message['error-details']))
                            errorDetails += "<br>" + message['error-details'];
                    }
                    // remove ", " from errorCodes and "<br>" form errorDetails
                    populateErrorMessage(msgs, errorCodes.substring(2), errorDetails.substring(4));
                }
            }
        }
    }

}