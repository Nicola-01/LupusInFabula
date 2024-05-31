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

signSubmit.addEventListener('click', saveField)

// Login
const loginUser = document.getElementById("login_user");
const loginPassword = document.getElementById("login_password");
const loginSubmit = document.getElementById("login_submit");

loginUser.addEventListener('input', enableLogin);
loginPassword.addEventListener('input', enableLogin);

loginSubmit.addEventListener('click', saveField)

// Show password
document.getElementById("login_password_ShowPassword").addEventListener('click', loginShowPassword);
document.getElementById("sign_password_ShowPassword").addEventListener('click', signupShowPassword);
document.getElementById("sign_password_rp_ShowPassword").addEventListener('click', signupShowPasswordRp);

function enableSignup() {
    signSubmit.disabled = !(signUsername.value.trim() !== '' && signEmail.value.trim() !== '' && signPassword.value.trim() !== '' && signPasswordRp.value.trim() !== '');
}

function enableLogin() {
    loginSubmit.disabled = !(loginUser.value.trim() !== '' && loginPassword.value.trim() !== '');
}

function showPassword(idInput) {
    const input = document.getElementById(idInput)
    const eyeIcon = document.getElementById(idInput + "_eyeIcon");

    if (eyeIcon.classList.contains("fa-eye")) {
        input.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}


function loginShowPassword(event) {
    event.preventDefault(); // Prevent the default behavior of the button click event
    showPassword("login_password");
}

function signupShowPassword(event) {
    event.preventDefault(); // Prevent the default behavior of the button click event
    showPassword("sign_password");
}

function signupShowPasswordRp(event) {
    event.preventDefault(); // Prevent the default behavior of the button click event
    showPassword("sign_password_rp");
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
}

document.addEventListener('DOMContentLoaded', function () {

    const currentURL = window.location.href;

    // Check if the URL ends with '/login' and set the checkbox state accordingly
    document.getElementById("loginCB").checked = currentURL.endsWith("/login");

    // load saved values
    loadSavedValues()

    // call the functions to disable the button
    enableSignup();
    enableLogin();
    disabledElements();

    const focusableElements = document.querySelectorAll('input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function (event) {
            // Prevent the default scroll behavior when an element receives focus
            event.preventDefault();
            element.scrollIntoView({block: "nearest", inline: "nearest"});
        });
    });
});