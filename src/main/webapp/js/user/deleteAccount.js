document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("deleteButton").addEventListener("click", sendDeleteUpdate);

    document.getElementById('email').addEventListener('input', checkFormCompletionDelete);
    document.getElementById('password').addEventListener('input', checkFormCompletionDelete);

    document.getElementById("password_ShowPassword").addEventListener('click', event => {
        event.preventDefault();
        showPassword("password");
    });
});

function sendDeleteUpdate() {

    const form = document.getElementById('deleteForm');
    const formData = new FormData(form);

    const json = {
        "userUpdate": {
            "oldEmail": formData.get('email'),
            "newEmail": '',
            "oldPassword": formData.get('password'),
            "newPassword": '',
            "repeatNewPassword": ''
        }
    };

    genericDELETERequest(contextPath + "user/me", JSON.stringify(json), updateDeleteStatus);
    form.reset();

}

function updateDeleteStatus(req) {

    let message = getMessage(req);
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            appendAlert("DELETE DONE: " + message.message, 'success', 'DELETE');
        } else {
            if (message != null)
                appendAlert(message.message, 'danger', 'DELETE');
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
                    appendAlert(msgs, 'danger', 'DELETE');
                }
            }
        }
    }
}

function checkFormCompletionDelete() {

    const deleteButton = document.getElementById('deleteButton');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    deleteButton.disabled = !(email.trim() !== '' && password.trim() !== '');

}