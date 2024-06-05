/**
 * Handle the login and signup page
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

const loginCB = document.getElementById("loginCB");
loginCB.addEventListener('change', disabledElements)

// signUp elements
const signUsername = document.getElementById("sign_username");
const signEmail = document.getElementById("sign_email");
const signPassword = document.getElementById("sign_password");
const signPasswordRp = document.getElementById("sign_password_rp");
const signSubmit = document.getElementById("sign_submit");

signUsername.addEventListener('input', enableSignup);
signEmail.addEventListener('input', enableSignup);
signPassword.addEventListener('input', enableSignup);
signPassword.addEventListener('input', () => passwordComplexHint(signPassword.value));
signPassword.addEventListener('focus', () => showPasswordHint(true));
signPassword.addEventListener('blur', () => showPasswordHint(false));
signPasswordRp.addEventListener('input', enableSignup);

signUsername.addEventListener('keypress', handleKeyPressSignup);
signEmail.addEventListener('keypress', handleKeyPressSignup);
signPassword.addEventListener('keypress', handleKeyPressSignup);
signPasswordRp.addEventListener('keypress', handleKeyPressSignup);

signSubmit.addEventListener('click', saveField)

// Login elements
const loginUser = document.getElementById("login_user");
const loginPassword = document.getElementById("login_password");
const loginSubmit = document.getElementById("login_submit");

loginUser.addEventListener('input', enableLogin);
loginPassword.addEventListener('input', enableLogin);

loginUser.addEventListener('keypress', handleKeyPressLogin);
loginPassword.addEventListener('keypress', handleKeyPressLogin);

loginSubmit.addEventListener('click', saveField)

// Show password buttons
document.getElementById("login_password_ShowPassword").addEventListener('click', event => {
    event.preventDefault();
    showPassword("login_password");
});
document.getElementById("sign_password_ShowPassword").addEventListener('click', event => {
    event.preventDefault();
    showPassword("sign_password");
});
document.getElementById("sign_password_rp_ShowPassword").addEventListener('click', event => {
    event.preventDefault();
    showPassword("sign_password_rp");
});

/**
 * Handles 'Enter' key press on the sign up form.
 * - Prevents default form submission behavior.
 * - Calls saveField to handle data processing.
 * - Submits the "signup" form programmatically.
 *
 * @param {KeyboardEvent} event The keyboard event object.
 */
function handleKeyPressSignup(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveField();
        document.forms["signup"].submit();
    }
}

/**
 * Handles 'Enter' key press on the login form.
 * - Prevents default form submission behavior.
 * - Calls saveField to handle data processing.
 * - Submits the "login" form programmatically.
 *
 * @param {KeyboardEvent} event The keyboard event object.
 */
function handleKeyPressLogin(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveField();
        document.forms["login"].submit();
    }
}

/**
 * Enables or disables the sign up submit button based on whether all sign up form fields have non-empty trimmed values.
 */
function enableSignup() {
    signSubmit.disabled = !(signUsername.value.trim() !== '' && signEmail.value.trim() !== '' && signPassword.value.trim() !== '' && signPasswordRp.value.trim() !== '');
}

/**
 * Enables or disables the login submit button based on whether both login form fields have non-empty trimmed values.
 */
function enableLogin() {
    loginSubmit.disabled = !(loginUser.value.trim() !== '' && loginPassword.value.trim() !== '');
}

/**
 * Saves login or signup data based on the login checkbox state.
 * - Creates an object containing user data (type, user, password, etc.).
 * - Store the data in local storage.
 */
function saveField() {
    if (loginCB.checked) { // is login
        const loginOBJ = {
            type: "login",
            user: loginUser.value,
            password: loginPassword.value
        };
        storeData('loginOBJ', loginOBJ, 15); // Store data for 20 seconds

    } else { // is signup
        const loginOBJ = {
            type: "signup",
            username: signUsername.value,
            email: signEmail.value,
            password: signPassword.value,
            passwordRp: signPasswordRp.value
        };
        storeData('loginOBJ', loginOBJ, 15); // Store data for 15 seconds
    }
}

/**
 * Loads previously saved login data from local storage.
 * - Populates login or signup form fields and sets the login checkbox state based on the retrieved data's type ("login" or "signup").
 */
function loadSavedValues() {
    const loginOBJ = retrieveData('loginOBJ');
    if (loginOBJ) {
        if (loginOBJ.type === "login") {
            loginCB.checked = true;

            loginUser.value = loginOBJ.user;
            loginPassword.value = loginOBJ.password
        } else {
            loginCB.checked = false;

            signUsername.value = loginOBJ.username;
            signEmail.value = loginOBJ.email;
            signPassword.value = loginOBJ.password;
            signPasswordRp.value = loginOBJ.passwordRp;
        }
    }
}

/**
 * Manages the disabled state of signup and login form elements based on the login checkbox state.
 * - When the checkbox is checked, signup elements are disabled and login elements are enabled.
 * - Vice versa when the checkbox is unchecked.
 * - Also calls enableSignup and enableLogin functions to update submit button states.
 */
function disabledElements() {
    const signElements = document.querySelectorAll('[id*="sign_"]');
    const loginElements = document.querySelectorAll('[id*="login_"]');

    for (let i = 0; i < signElements.length; i++)
        signElements[i].disabled = loginCB.checked;

    for (let i = 0; i < loginElements.length; i++)
        loginElements[i].disabled = !loginCB.checked;

    // call the functions to disable the button
    enableSignup();
    enableLogin();
}

document.addEventListener('DOMContentLoaded', function () {

    const currentURL = window.location.href;

    // Check if the URL ends with '/login' and set the checkbox state accordingly
    document.getElementById("loginCB").checked = currentURL.endsWith("/login");

    // load saved values
    loadSavedValues()

    disabledElements();
});