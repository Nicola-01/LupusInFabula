// signUp
const signUsername = document.getElementById("sign_username");
const signEmail = document.getElementById("sign_email");
const signPassword = document.getElementById("sign_password");
const signPasswordRp = document.getElementById("sign_password_rp");
const signSubmit = document.getElementById("sign_submit");

const loginCB = document.getElementById("loginCB");

loginCB.addEventListener('change', disabledElements)

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

// Login
const loginUser = document.getElementById("login_user");
const loginPassword = document.getElementById("login_password");
const loginSubmit = document.getElementById("login_submit");

loginUser.addEventListener('input', enableLogin);
loginPassword.addEventListener('input', enableLogin);

loginUser.addEventListener('keypress', handleKeyPressLogin);
loginPassword.addEventListener('keypress', handleKeyPressLogin);

loginSubmit.addEventListener('click', saveField)

// Show password
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

function handleKeyPressSignup(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveField();
        document.forms["signup"].submit();
    }
}

function handleKeyPressLogin(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveField();
        document.forms["login"].submit();
    }
}

function enableSignup() {
    signSubmit.disabled = !(signUsername.value.trim() !== '' && signEmail.value.trim() !== '' && signPassword.value.trim() !== '' && signPasswordRp.value.trim() !== '');
}

function enableLogin() {
    loginSubmit.disabled = !(loginUser.value.trim() !== '' && loginPassword.value.trim() !== '');
}

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