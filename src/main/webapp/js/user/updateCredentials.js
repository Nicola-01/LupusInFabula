/**
 * Handle the update credentials page
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

// Sets up event listeners for update button, email and password input fields, and show password buttons.
document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("updateButton").addEventListener("click", sendPutUpdate);

    document.getElementById('currentEmail').addEventListener('input', checkFormCompletionPut);
    document.getElementById('newEmail').addEventListener('input', checkFormCompletionPut);
    document.getElementById('oldPassword').addEventListener('input', checkFormCompletionPut);
    document.getElementById('newPassword').addEventListener('input', checkFormCompletionPut);
    document.getElementById('confirm-password').addEventListener('input', checkFormCompletionPut);

    const newPasswordHint= document.getElementById('newPassword');
    newPasswordHint.addEventListener('input', () => passwordComplexHint(newPasswordHint.value));
    newPasswordHint.addEventListener('focus', () => showPasswordHint(true));
    newPasswordHint.addEventListener('blur', () => showPasswordHint(false));

    // Add click event listeners to show password buttons
    document.getElementById("newPassword_ShowPassword").addEventListener('click', event => {
        event.preventDefault();
        showPassword("newPassword");
    });
    document.getElementById("oldPassword_ShowPassword").addEventListener('click', event => {
        event.preventDefault();
        showPassword("oldPassword");
    });
    document.getElementById("confirm-password_ShowPassword").addEventListener('click', event => {
        event.preventDefault();
        showPassword("confirm-password");
    });

    document.getElementById("currentEmail").addEventListener('keypress', handleKeyPressCredentialsUpdate)
    document.getElementById("newEmail").addEventListener('keypress', handleKeyPressCredentialsUpdate)
    document.getElementById("oldPassword").addEventListener('keypress', handleKeyPressCredentialsUpdate)
    document.getElementById("newPassword").addEventListener('keypress', handleKeyPressCredentialsUpdate)
    document.getElementById("confirm-password").addEventListener('keypress', handleKeyPressCredentialsUpdate)
});

/**
 *  Handles the 'Enter' key press event for the credential update form.
 *  @param {KeyboardEvent} event - The key press event.
 */
function handleKeyPressCredentialsUpdate(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if(document.getElementById('updateButton').disabled)
            return;
        sendPutUpdate();
    }
}


/**
 * Sends a PUT request to update user information.
 */
function sendPutUpdate() {

    const form = document.getElementById('updateForm');
    const formData = new FormData(form);
    // Create JSON object for the update request
    const json = {
        "userUpdate": {
            "oldEmail": formData.get('CurrentEmail'),
            "newEmail": formData.get('NewEmail'),
            "oldPassword": formData.get('CurrentPassword'),
            "newPassword": formData.get('NewPassword'),
            "repeatNewPassword": formData.get('ConfirmPassword')
        }
    };

    // Send PUT request
    genericPUTRequest(contextPath + "user/me", JSON.stringify(json), updatePutStatus);


}

/**
 * Updates the status of the put request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function updatePutStatus(req) {

    const form = document.getElementById('updateForm');
    let message = getMessage(req);
    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            // appendAlert("UPDATE DONE: " + message.message, 'success', 'PUT');
            populateSuccessMessage("#changeCredentialsPage .successMessage", "UPDATE DONE:", message.message);
            form.reset();
        } else {
            if (message != null) {
                // appendAlert(message.message, 'danger', 'PUT');
                populateErrorMessage("#changeCredentialsPage .errorMessage", message.message, message.errorCode, message.errorDetails)
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
                    // appendAlert(msgs, 'danger', 'PUT');
                    populateErrorMessage("#changeCredentialsPage .errorMessage", msgs, errorCodes, errorDetails)
                }
            }
        }
        checkFormCompletionPut();
    }
}

/**
 * Checks the form completion status and enables/disables the update button accordingly.
 */
function checkFormCompletionPut() {

    const updateButton = document.getElementById('updateButton');

    const currentEmail = document.getElementById('currentEmail').value;
    const newEmail = document.getElementById('newEmail').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Enable update button if all required fields are filled correctly accordingly with the following rules:
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