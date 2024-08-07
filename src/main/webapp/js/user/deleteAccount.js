/**
 * Handle the delete account page
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

// Sets up event listeners for delete button, email, password input fields, and show password button.
document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById("deleteButton").addEventListener("click", sendDeleteUpdate);

    document.getElementById('email').addEventListener('input', checkFormCompletionDelete);
    document.getElementById('password').addEventListener('input', checkFormCompletionDelete);

    document.getElementById("password_ShowPassword").addEventListener('click', event => {
        event.preventDefault();
        showPassword("password");
    });

    document.getElementById("email").addEventListener('keypress', handleKeyPressDeleteAccount)
    document.getElementById("password").addEventListener('keypress', handleKeyPressDeleteAccount)
    document.getElementById("deleteButton").addEventListener('keypress', handleKeyPressDeleteAccount)
});

/**
 *  Handles the 'Enter' key press event for the delete account form.
 *  @param {KeyboardEvent} event - The key press event.
 */
function handleKeyPressDeleteAccount(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if(document.getElementById('deleteButton').disabled)
            return;
        sendDeleteUpdate();
    }
}

/**
 * Sends a DELETE request to update user information.
 */
function sendDeleteUpdate() {

    const form = document.getElementById('deleteForm');
    const formData = new FormData(form);
    // Create JSON object for the delete request
    const json = {
        "userUpdate": {
            "oldEmail": formData.get('email'),
            "newEmail": '',
            "oldPassword": formData.get('password'),
            "newPassword": '',
            "repeatNewPassword": ''
        }
    };

    // Send DELETE request
    genericDELETERequest(contextPath + "user/me", JSON.stringify(json), updateDeleteStatus);

}

/**
 * Updates the status of the delete request.
 *
 * @param {XMLHttpRequest} req - The XMLHttpRequest object.
 */
function updateDeleteStatus(req) {

    let message = getMessage(req);
    const form = document.getElementById('deleteForm');

    if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === HTTP_STATUS_OK) {
            // appendAlert("DELETE DONE: " + message.message, 'success', 'DELETE');
            populateSuccessMessage("#deleteAccountPage .successMessage", "DELETE DONE:", message.message);
            form.reset();
        } else {
            if (message != null)
                populateErrorMessage("#deleteAccountPage .errorMessage", message.message, message.errorCode, message.errorDetails)
                // appendAlert(message.message, 'danger', 'DELETE');
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
                    // appendAlert(msgs, 'danger', 'DELETE');
                    populateErrorMessage("#deleteAccountPage .errorMessage", msgs, errorCodes, errorDetails);
                }
            }
        }
        checkFormCompletionDelete();
    }
}

/**
 * Checks the form completion status and enables/disables the delete button accordingly.
 */
function checkFormCompletionDelete() {

    const deleteButton = document.getElementById('deleteButton');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Enable delete button only if both email and password fields are non-empty
    deleteButton.disabled = !(email.trim() !== '' && password.trim() !== '');

}