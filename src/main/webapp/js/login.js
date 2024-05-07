document.addEventListener("DOMContentLoaded", function() {

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

    // Login
    const loginUser = document.getElementById("login_user");
    const loginPassword = document.getElementById("login_password");
    const loginSubmit = document.getElementById("login_submit");

    loginUser.addEventListener('input', enableLogin);
    loginPassword.addEventListener('input', enableLogin);


    // call the functions to disable the button
    enableSignup();
    enableLogin();

    function enableSignup() {
        singSubmit.disabled = !(singUsername.value.trim() !== '' && singEmail.value.trim() !== '' && singPassword.value.trim() !== '' && singPasswordRp.value.trim() !== '' && singPassword.value === singPasswordRp.value);
    }

    function enableLogin() {
        loginSubmit.disabled = !(loginUser.value.trim() !== '' && loginPassword.value.trim() !== '');
    }
});