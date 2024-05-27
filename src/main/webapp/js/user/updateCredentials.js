document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("updateButton").addEventListener("click", sendPutUpdate);

    document.getElementById('currentEmail').addEventListener('input', checkFormCompletionPut);
    document.getElementById('newEmail').addEventListener('input', checkFormCompletionPut);
    document.getElementById('oldPassword').addEventListener('input', checkFormCompletionPut);
    document.getElementById('newPassword').addEventListener('input', checkFormCompletionPut);
    document.getElementById('confirm-password').addEventListener('input', checkFormCompletionPut);

});

function sendPutUpdate() {

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

    genericPUTRequest(contextPath + "user/me", JSON.stringify(json), updatePutStatus);
    form.reset();

}

function updatePutStatus(req) {

    let message = getMessage(req);
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            appendAlert("UPDATE DONE: " + message.message, 'success', 'PUT');
        } else {
            if (message != null) {
                appendAlert(message.message, 'danger', 'PUT');
            } else {
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
                    appendAlert(msgs, 'danger', 'PUT');
                }
            }
        }
    }
}

function checkFormCompletionPut() {

    const updateButton = document.getElementById('updateButton');

    const currentEmail = document.getElementById('currentEmail').value;
    const newEmail = document.getElementById('newEmail').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // all email inputs are filled, while all password inputs are not
    if ((currentEmail.trim() !== '' && newEmail.trim() !== '')
        && (oldPassword.trim() === '' && newPassword.trim() === '' && confirmPassword.trim() === '')) {
        updateButton.disabled = false;
    }
    // all password inputs are filled, while all email inputs are not
    else if ((oldPassword.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '')
        && (currentEmail.trim() === '' && newEmail.trim() === '')) {
        updateButton.disabled = false;
    }
    // all inputs are filled
    else if (oldPassword.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== ''
        && currentEmail.trim() !== '' && newEmail.trim() !== '') {
        updateButton.disabled = false;
    }
    // the other cases
    else {
        updateButton.disabled = true;
    }

}