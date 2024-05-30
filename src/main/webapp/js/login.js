// SingUp
const singUsername = document.getElementById("sing_username");
const singEmail = document.getElementById("sing_email");
const singPassword = document.getElementById("sing_password");
const singPasswordRp = document.getElementById("sing_password_rp");
const singSubmit = document.getElementById("sing_submit");

singUsername.addEventListener('input', enableSignup);
singEmail.addEventListener('input', enableSignup);
singPassword.addEventListener('input', enableSignup);
singPasswordRp.addEventListener('input', enableSignup);

singSubmit.addEventListener('click', saveField)

// Login
const loginUser = document.getElementById("login_user");
const loginPassword = document.getElementById("login_password");
const loginSubmit = document.getElementById("login_submit");

loginUser.addEventListener('input', enableLogin);
loginPassword.addEventListener('input', enableLogin);

loginSubmit.addEventListener('click', saveField)

// Show password

const loginShowPasswordCB = document.getElementById("loginShowPassword");
const signupShowPasswordCB = document.getElementById("signupShowPassword");
loginShowPasswordCB.addEventListener('change', loginShowPassword);
signupShowPasswordCB.addEventListener('change', signupShowPassword);

function enableSignup() {
    singSubmit.disabled = !(singUsername.value.trim() !== '' && singEmail.value.trim() !== '' && singPassword.value.trim() !== '' && singPasswordRp.value.trim() !== '');
}

function enableLogin() {
    loginSubmit.disabled = !(loginUser.value.trim() !== '' && loginPassword.value.trim() !== '');
}

function loginShowPassword() {
    if (loginShowPasswordCB.checked)
        loginPassword.type = "text";
    else
        loginPassword.type = "password";
}

function signupShowPassword() {
    if (signupShowPasswordCB.checked) {
        singPassword.type = "text";
        singPasswordRp.type = "text";
    } else {
        singPassword.type = "password";
        singPasswordRp.type = "password";
    }
}

function saveField() {
    if (document.getElementById("loginCB").checked) { // is login
        const loginOBJ = {
            type: "login",
            user: loginUser.value,
            password: loginPassword.value
        };
        storeData('loginOBJ', loginOBJ, 20000); // Store data for 20 seconds

    } else { // is signup
        const loginOBJ = {
            type: "signup",
            username: singUsername.value,
            email: singEmail.value,
            password: singPassword.value,
            passwordRp: singPasswordRp.value
        };
        storeData('loginOBJ', loginOBJ, 15000); // Store data for 15 seconds
    }
}

function loadSavedValues() {
    const loginOBJ = retrieveData('loginOBJ');
    if (loginOBJ) {
        if (loginOBJ.type === "login") {
            document.getElementById("loginCB").checked = true;

            loginUser.value = loginOBJ.user;
            loginPassword.value = loginOBJ.user
        } else {
            document.getElementById("loginCB").checked = false;

            singUsername.value = loginOBJ.username;
            singEmail.value = loginOBJ.email;
            singPassword.value = loginOBJ.password;
            singPasswordRp.value = loginOBJ.passwordRp;
        }
    }
}

window.onload = function () {
    const currentURL = window.location.href;

    // Check if the URL ends with '/login' and set the checkbox state accordingly
    document.getElementById("loginCB").checked = currentURL.endsWith("/login");

    // call the functions to disable the button
    enableSignup();
    enableLogin();

    // load saved values
    loadSavedValues()
};